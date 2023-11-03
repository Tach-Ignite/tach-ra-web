import { IMapper, IProvider, IValidator } from '@/lib/abstractions';
import { ErrorWithStatusCode } from '@/lib/errors';
import { ICategory, categorySchema, CategoryDto } from '@/models';
import {
  ICategoryCommandRepository,
  ICategoryQueryRepository,
  IProductCommandRepository,
  ICategoryService,
} from '@/abstractions';
import '@/mappingProfiles/services/categories/mappingProfile';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable(
  'categoryService',
  'categoryQueryRepository',
  'categoryCommandRepository',
  'productCommandRepository',
  'automapperProvider',
  'validator',
)
export class CategoryService implements ICategoryService {
  private _categoryQueryRepository: ICategoryQueryRepository;

  private _categoryCommandRepository: ICategoryCommandRepository;

  private _productCommandRepository: IProductCommandRepository;

  private _autoMapperProvider: IProvider<IMapper>;

  private _validator: IValidator;

  constructor(
    categoryQueryRepository: ICategoryQueryRepository,
    categoryCommandRepository: ICategoryCommandRepository,
    productCommandRepository: IProductCommandRepository,
    automapperProvider: IProvider<IMapper>,
    validator: IValidator,
  ) {
    this._categoryQueryRepository = categoryQueryRepository;
    this._categoryCommandRepository = categoryCommandRepository;
    this._productCommandRepository = productCommandRepository;
    this._autoMapperProvider = automapperProvider;
    this._validator = validator;
  }

  async getAllCategories(): Promise<ICategory[]> {
    const allCategories = await this._categoryQueryRepository.list();
    if (allCategories.length === 0) {
      return [];
    }

    const mapper = this._autoMapperProvider.provide();
    const allDomainCategories: ICategory[] = mapper.mapArray<
      CategoryDto,
      ICategory
    >(allCategories, 'CategoryDto', 'ICategory');

    for (let i = 0; i < allDomainCategories.length; i++) {
      const categoryDto = allCategories[i];
      const domainCategory = allDomainCategories[i];
      if (categoryDto.parentId) {
        domainCategory.parent = allDomainCategories.find(
          (c) => c._id === categoryDto.parentId,
        );
        if (domainCategory.parent) {
          if (!domainCategory.parent.children) {
            domainCategory.parent.children = [];
          }
          domainCategory.parent.children.push(domainCategory);
        }
      }
    }

    return allDomainCategories;
  }

  async getCategoryById(categoryId: string): Promise<ICategory | null> {
    const category = await this._categoryQueryRepository.getById(categoryId);
    if (!category) {
      return null;
    }

    const mapper = this._autoMapperProvider.provide();
    const domainCategory = mapper.map<CategoryDto, ICategory>(
      category,
      'CategoryDto',
      'ICategory',
    );

    let cr = category;
    let cdr = domainCategory;
    while (cr.parentId) {
      // eslint-disable-next-line no-await-in-loop
      const parent = await this._categoryQueryRepository.getById(cr.parentId);

      if (parent) {
        const domainParent = mapper.map<CategoryDto, ICategory>(
          parent,
          'CategoryDto',
          'ICategory',
        );
        cdr.parent = domainParent;
        cr = parent;
        cdr = domainParent;
      } else {
        break;
      }
    }

    if (category.childIds && category.childIds.length > 0) {
      const children = await this._categoryQueryRepository.find({
        _id: { $in: category.childIds },
      });

      const domainChildren = mapper.mapArray<CategoryDto, ICategory>(
        children,
        'CategoryDto',
        'ICategory',
      );

      domainCategory.children = domainChildren;
    }

    return domainCategory;
  }

  async addCategory(category: ICategory): Promise<ICategory> {
    if (category.parent?._id) {
      const parent = await this._categoryQueryRepository.getById(
        category.parent._id,
      );

      if (!parent) {
        throw new ErrorWithStatusCode(
          `Could not find parent category with id '${category.parent._id}'.`,
          404,
          'Could not find the parent category specified.',
        );
      }
    }

    if (category.categoryProperties) {
      const categoryPropertyGenerateIdPromises: Promise<string>[] = [];
      for (let i = 0; i < category.categoryProperties.length; i++) {
        categoryPropertyGenerateIdPromises.push(
          this._categoryCommandRepository.generateId(),
        );
      }
      const categoryPropertyIds = await Promise.all(
        categoryPropertyGenerateIdPromises,
      );
      for (let i = 0; i < category.categoryProperties.length; i++) {
        category.categoryProperties[i]._id = categoryPropertyIds[i];
      }
    }

    const mapper = this._autoMapperProvider.provide();
    const dto = mapper.map<ICategory, CategoryDto>(
      category,
      'ICategory',
      'CategoryDto',
    );
    const newCategoryId = await this._categoryCommandRepository.create(dto);
    if (category.parent?._id) {
      await this._categoryCommandRepository.addChildIdToParent(
        category.parent._id,
        newCategoryId,
      );
    }

    const newCategory = await this.getCategoryById(newCategoryId);

    if (!newCategory) {
      throw new ErrorWithStatusCode(
        `Could not retrieve category with id ${newCategoryId} after it was created.`,
        500,
        'Could not retrieve category after it was created.',
      );
    }

    return newCategory!;
  }

  async editCategory(
    categoryId: string,
    category: ICategory,
  ): Promise<ICategory> {
    const validationResult = this._validator.validate(category, categorySchema);

    if (!validationResult.valid) {
      throw new ErrorWithStatusCode(
        `The category is invalid: ${JSON.stringify(validationResult.errors)}`,
        400,
        'The category is invalid.',
      );
    }

    const existingCategory = await this._categoryQueryRepository.getById(
      categoryId,
    );

    if (!existingCategory) {
      throw new ErrorWithStatusCode(
        `Could not find category with id '${categoryId}'.`,
        404,
        'Could not find the category specified.',
      );
    }

    if (category!.parent?._id) {
      const parent = await this._categoryQueryRepository.getById(
        category.parent._id,
      );

      if (!parent) {
        throw new ErrorWithStatusCode(
          `Could not find parent category with id '${category.parent._id}'.`,
          404,
          'Could not find the parent category specified.',
        );
      }

      if (category.parent?._id !== existingCategory.parentId) {
        await this._categoryCommandRepository.addChildIdToParent(
          category.parent._id,
          categoryId,
        );
      }
    }

    if (
      existingCategory?.parentId !== category!.parent?._id &&
      existingCategory.parentId
    ) {
      await this._categoryCommandRepository.removeChildIdFromParent(
        existingCategory.parentId,
        categoryId,
      );
    }

    const generateIdPromises: Promise<string>[] = [];
    if (category.categoryProperties) {
      for (let i = 0; i < category.categoryProperties.length; i++) {
        if (category.categoryProperties[i]._id === undefined) {
          generateIdPromises.push(this._categoryCommandRepository.generateId());
        } else {
          generateIdPromises.push(
            Promise.resolve(category.categoryProperties[i]._id!),
          );
        }
      }
      const ids = await Promise.all(generateIdPromises);
      for (let i = 0; i < category.categoryProperties.length; i++) {
        category.categoryProperties[i]._id = ids[i];
      }
    }

    const mapper = this._autoMapperProvider.provide();
    const dto = mapper.map<ICategory, CategoryDto>(
      category,
      'ICategory',
      'CategoryDto',
    );

    await this._categoryCommandRepository.update(categoryId, dto);

    const updatedCategory = await this.getCategoryById(categoryId);

    if (!updatedCategory) {
      throw new ErrorWithStatusCode(
        `Could not retrieve category with id '${categoryId}' after it was updated.`,
        500,
        'Could not retrieve category after it was updated.',
      );
    }

    return updatedCategory;
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const category = await this.getCategoryById(categoryId);

    if (!category) {
      throw new ErrorWithStatusCode(
        `Could not find category with id '${categoryId}'.`,
        404,
        'Could not find the category specified.',
      );
    }

    const mutationPromises: Promise<void>[] = [];
    if (category.parent && category.parent._id) {
      mutationPromises.push(
        this._categoryCommandRepository.removeChildIdFromParent(
          category.parent._id,
          categoryId,
        ),
      );
    }

    const children = category.children || [];
    for (let i = 0; i < children.length; i++) {
      const childId = children[i]._id;
      if (childId !== undefined) {
        mutationPromises.push(
          this._categoryCommandRepository.update(childId, {
            parentId: undefined,
          }),
        );
      }
    }

    mutationPromises.push(
      this._productCommandRepository.removeCategoryFromAllProducts(categoryId),
    );

    mutationPromises.push(this._categoryCommandRepository.delete(categoryId));

    await Promise.all(mutationPromises);
  }
}
