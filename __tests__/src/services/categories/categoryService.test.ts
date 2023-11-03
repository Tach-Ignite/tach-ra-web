import {
  ICategoryCommandRepository,
  ICategoryQueryRepository,
  IProductCommandRepository,
} from '@/abstractions';
import { IMapper, IProvider, IValidator } from '@/lib/abstractions';
import {
  CategoryDto,
  CategoryPropertyDto,
  ICategory,
  ICategoryProperty,
  categorySchema,
} from '@/models';
import { CategoryService } from '@/services/categories';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryQueryRepository: jest.Mocked<ICategoryQueryRepository>;
  let categoryCommandRepository: jest.Mocked<ICategoryCommandRepository>;
  let productCommandRepository: jest.Mocked<IProductCommandRepository>;
  let automapperProvider: jest.Mocked<IProvider<IMapper>>;
  let mapper: IMapper;
  let validator: jest.Mocked<IValidator>;
  let testCategory: ICategory;
  let testCategoryDto: CategoryDto;
  let testCategoryParent: ICategory;
  let testCategoryChild: ICategory;
  let testCategoryParentDto: CategoryDto;
  let testCategoryChildDto: CategoryDto;
  let testCategoryPropertyOne: CategoryPropertyDto;
  let testCategoryPropertyTwo: CategoryPropertyDto;
  let testCategoryPropertyThree: CategoryPropertyDto;

  beforeEach(() => {
    categoryQueryRepository = {
      getById: jest.fn(),
      list: jest.fn(),
      getAllCategoriesWithParentId: jest.fn(),
      find: jest.fn(),
    };
    categoryCommandRepository = {
      create: jest.fn(),
      delete: jest.fn(),
      generateId: jest.fn(),
      update: jest.fn(),
      addChildIdToParent: jest.fn(),
      removeChildIdFromParent: jest.fn(),
    };

    productCommandRepository = {
      create: jest.fn(),
      delete: jest.fn(),
      generateId: jest.fn(),
      update: jest.fn(),
      removeCategoryFromAllProducts: jest.fn(),
    };

    mapper = {
      map: jest.fn(),
      mapArray: jest.fn(),
    };
    automapperProvider = {
      provide: jest.fn().mockReturnValue(mapper),
    };
    validator = {
      validate: jest.fn(),
    };

    testCategoryPropertyOne = {
      _id: 'test-category-property-one-id',
      name: 'Test Category Property One',
      values: [
        'Test Category Property One Value One',
        'Test Category Property One Value Two',
      ],
    };

    testCategoryPropertyTwo = {
      _id: 'test-category-property-two-id',
      name: 'Test Category Property Two',
      values: [
        'Test Category Property Two Value One',
        'Test Category Property Two Value Two',
      ],
    };

    testCategoryPropertyThree = {
      _id: 'test-category-property-three-id',
      name: 'Test Category Property Three',
      values: [
        'Test Category Property Three Value One',
        'Test Category Property Three Value Two',
      ],
    };

    categoryService = new CategoryService(
      categoryQueryRepository,
      categoryCommandRepository,
      productCommandRepository,
      automapperProvider,
      validator,
    );
    testCategoryParent = {
      _id: 'test-parent-id',
      name: 'Test Parent Category',
      categoryProperties: [testCategoryPropertyOne],
      children: [],
      parent: undefined,
    };

    testCategory = {
      _id: 'test-id',
      name: 'Test Category',
      categoryProperties: [testCategoryPropertyTwo],
      children: [],
      parent: testCategoryParent,
    };

    testCategoryChild = {
      _id: 'test-child-id',
      name: 'Test Child Category',
      categoryProperties: [testCategoryPropertyThree],
      children: [],
      parent: testCategory,
    };

    testCategoryParent.children!.push(testCategory);
    testCategory.children!.push(testCategoryChild);

    testCategoryParentDto = {
      _id: testCategoryParent._id!,
      name: testCategoryParent.name,
      categoryProperties: [testCategoryPropertyOne],
      childIds: [],
      parentId: undefined,
      createdAt: '2021-09-17T10:20:30Z',
      updatedAt: '2023-04-11T05:12:30Z',
    };

    testCategoryDto = {
      _id: testCategory._id!,
      name: testCategory.name,
      categoryProperties: [testCategoryPropertyTwo],
      childIds: [],
      parentId: testCategoryParentDto._id!,
      createdAt: '2021-09-17T10:20:30Z',
      updatedAt: '2023-04-11T05:12:30Z',
    };

    testCategoryChildDto = {
      _id: testCategoryChild._id!,
      name: testCategoryChild.name,
      categoryProperties: [testCategoryPropertyThree],
      childIds: [],
      parentId: testCategoryDto._id!,
      createdAt: '2021-09-17T10:20:30Z',
      updatedAt: '2023-04-11T05:12:30Z',
    };

    testCategoryParentDto.childIds.push(testCategoryDto._id!);
    testCategoryDto.childIds.push(testCategoryChildDto._id!);
  });

  describe('getAllCategories', () => {
    it('should return all categories with parents and children populated', async () => {
      const testCategoryDtoWithId = {
        _id: testCategoryDto._id!,
        ...testCategoryDto,
      };
      const testCategoryParentDtoWithId = {
        _id: testCategoryParentDto._id!,
        ...testCategoryParentDto,
      };
      const testCategoryChildDtoWithId = {
        _id: testCategoryChildDto._id!,
        ...testCategoryChildDto,
      };
      const testCategoryUnpopulated = {
        _id: testCategory._id!,
        ...testCategory,
        parent: undefined,
        children: [],
      };
      const testCategoryParentUnpopulated = {
        _id: testCategoryParent._id!,
        ...testCategoryParent,
        parent: undefined,
        children: [],
      };
      const testCategoryChildUnpopulated = {
        _id: testCategoryChild._id!,
        ...testCategoryChild,
        parent: undefined,
        children: [],
      };

      categoryQueryRepository.list.mockResolvedValueOnce([
        testCategoryDtoWithId,
        testCategoryParentDtoWithId,
        testCategoryChildDtoWithId,
      ]);
      const mapArrayMock = jest
        .fn()
        .mockReturnValueOnce([
          testCategoryUnpopulated,
          testCategoryParentUnpopulated,
          testCategoryChildUnpopulated,
        ]);
      mapper.mapArray = mapArrayMock;

      const allCategories = await categoryService.getAllCategories();

      expect(allCategories).toBeDefined();
      expect(allCategories).toHaveLength(3);
      expect(allCategories).toContain(testCategoryUnpopulated);
      expect(allCategories[0].parent).toBe(testCategoryParentUnpopulated);
      expect(allCategories[0].children).toHaveLength(1);
      expect(allCategories[0].children).toContain(testCategoryChildUnpopulated);
      expect(allCategories[1].parent).toBeUndefined();
      expect(allCategories[1].children).toHaveLength(1);
      expect(allCategories[1].children).toContain(testCategoryUnpopulated);
      expect(allCategories[2].parent).toBe(testCategoryUnpopulated);
      expect(allCategories[2].children).toHaveLength(0);
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by ID', async () => {
      const testId = 'test-id';
      categoryQueryRepository.getById
        .mockResolvedValueOnce({
          _id: testId,
          ...testCategoryDto,
        })
        .mockResolvedValueOnce({
          _id: testCategoryParentDto._id!,
          ...testCategoryParentDto,
        });
      categoryQueryRepository.find.mockResolvedValueOnce([
        { _id: testCategoryChildDto._id!, ...testCategoryChildDto },
      ]);
      const mapMock = jest
        .fn()
        .mockReturnValueOnce(testCategoryDto)
        .mockReturnValueOnce(testCategoryParent);
      const mapArrayMock = jest.fn().mockReturnValueOnce([
        {
          _id: testCategoryChild._id!,
          ...testCategoryChild,
        },
      ]);
      automapperProvider.provide.mockReturnValue({
        map: mapMock,
        mapArray: mapArrayMock,
      });

      const category = await categoryService.getCategoryById(testId);

      expect(category).toBeDefined();
      expect(category!._id).toBe(testId);
      expect(category!.name).toBe(testCategoryDto.name);
      expect(category!.parent).toBe(testCategoryParent);
      expect(category!.children).toHaveLength(1);
      expect(category!.children![0]._id).toBe(testCategoryChild._id);
      expect(category!.children![0].name).toBe(testCategoryChild.name);
      expect(category!.children![0].parent?._id).toBe(
        testCategoryChild.parent?._id,
      );
      expect(category!.categoryProperties).toHaveLength(1);
      expect(category!.categoryProperties![0]).toBe(testCategoryPropertyTwo);
      expect(mapMock).toHaveBeenCalled();
      expect(mapArrayMock).toHaveBeenCalled();
      expect(categoryQueryRepository.getById).toHaveBeenCalledWith(testId);
    });

    it('should return null if category does not exist', async () => {
      const testCategoryId = 'test-id';

      categoryQueryRepository.getById.mockResolvedValueOnce(null);

      const result = await categoryService.getCategoryById(testCategoryId);

      expect(result).toBeNull();
      expect(categoryQueryRepository.getById).toHaveBeenCalledWith(
        testCategoryId,
      );
    });
  });

  describe('addCategory', () => {
    it('should add a category', async () => {
      testCategoryDto = { ...testCategoryDto, _id: undefined };
      categoryQueryRepository.getById.mockResolvedValueOnce({
        _id: testCategoryParentDto._id!,
        ...testCategoryParentDto,
      });
      categoryCommandRepository.create.mockResolvedValueOnce('test-create-id');
      categoryCommandRepository.generateId.mockResolvedValueOnce('test-gen-id');
      const mapMock = jest.fn().mockReturnValueOnce(testCategoryDto);
      const mapArrayMock = jest.fn().mockReturnValueOnce([
        {
          _id: testCategoryChild._id!,
          ...testCategoryChild,
        },
      ]);
      automapperProvider.provide.mockReturnValue({
        map: mapMock,
        mapArray: mapArrayMock,
      });
      categoryService.getCategoryById = jest
        .fn()
        .mockResolvedValueOnce(testCategory);

      const category = await categoryService.addCategory(testCategory);

      expect(category).toBeDefined();
      expect(category._id).toBe('test-id');
      expect(category.name).toBe(testCategory.name);
      expect(category.parent).toBe(testCategoryParent);
      expect(category.children).toHaveLength(1);
      expect(category.children![0]).toBe(testCategoryChild);
      expect(category.categoryProperties).toHaveLength(1);
      expect(category.categoryProperties![0]).toBe(testCategoryPropertyTwo);
      expect(category.categoryProperties![0]._id).toBe('test-gen-id');
      expect(categoryCommandRepository.generateId).toHaveBeenCalled();
      expect(categoryCommandRepository.create).toHaveBeenCalledWith(
        testCategoryDto,
      );
      expect(categoryCommandRepository.addChildIdToParent).toHaveBeenCalledWith(
        'test-parent-id',
        'test-create-id',
      );
      expect(mapMock).toHaveBeenCalled();
    });

    it('should throw an error if parent category does not exist', async () => {
      categoryQueryRepository.getById.mockResolvedValueOnce(null);

      const promise = categoryService.addCategory(testCategory);

      await expect(promise).rejects.toThrow(
        "Could not find parent category with id 'test-parent-id'",
      );
      expect(categoryQueryRepository.getById).toHaveBeenCalledWith(
        'test-parent-id',
      );
    });
  });

  describe('editCategory', () => {
    it('should edit the given category', async () => {
      const categoryProperty: ICategoryProperty = {
        _id: undefined,
        name: 'Fruits',
        values: ['Apple, Banana, Pear'],
      };
      const editedCategory = {
        _id: undefined,
        ...testCategory,
        name: 'Food',
        parent: undefined,
        categoryProperties: [categoryProperty],
      };
      const editCategoryDto = {
        ...editedCategory,
        parent: undefined,
        children: undefined,
        parentId: undefined,
        childIds: testCategory.children!.map((c) => c._id!),
      };
      const editCategoryDtoWithId = {
        ...editCategoryDto,
        _id: testCategoryDto._id!,
      };
      const testCategoryDtoWithId = {
        ...editCategoryDto,
        _id: testCategoryDto._id!,
      };
      const editedCategoryWithId = {
        ...editCategoryDto,
        _id: testCategory._id!,
      };

      validator.validate.mockReturnValueOnce({
        valid: true,
        errors: {},
      });
      categoryQueryRepository.getById.mockResolvedValueOnce(
        testCategoryDtoWithId,
      );
      categoryCommandRepository.generateId.mockResolvedValueOnce('test-gen-id');
      const mapMock = jest.fn().mockReturnValueOnce(editCategoryDto);
      mapper.map = mapMock;
      categoryService.getCategoryById = jest
        .fn()
        .mockResolvedValueOnce(editedCategoryWithId);

      const result = await categoryService.editCategory(
        testCategory._id!,
        editedCategory,
      );

      expect(result).toBeDefined();
      expect(result).toBe(editedCategoryWithId);
      expect(validator.validate).toBeCalledWith(editedCategory, categorySchema);
      expect(categoryQueryRepository.getById).toBeCalledTimes(1);
      expect(categoryQueryRepository.getById).toBeCalledWith(testCategory._id!);
    });

    it('should throw an error if the category is invalid', async () => {
      const testErrors = { test: 'test' };
      validator.validate.mockReturnValueOnce({
        valid: false,
        errors: testErrors,
      });

      const promise = categoryService.editCategory('test-id', testCategory);

      expect(promise).rejects.toThrowError(
        `The category is invalid: ${JSON.stringify(testErrors)}`,
      );
    });

    it('should throw an error with the category does not exist', async () => {
      validator.validate.mockReturnValueOnce({
        valid: true,
        errors: {},
      });
      categoryQueryRepository.getById.mockResolvedValueOnce(null);

      const promise = categoryService.editCategory('test-id', testCategory);

      await expect(promise).rejects.toThrow(
        "Could not find category with id 'test-id'.",
      );
    });

    it('should throw an error if there is a parent and the parent does not exist', async () => {
      validator.validate.mockReturnValueOnce({
        valid: true,
        errors: {},
      });
      categoryQueryRepository.getById.mockResolvedValueOnce({
        _id: testCategoryDto._id!,
        ...testCategoryDto,
        parentId: 'test-parent-id',
      });
      categoryQueryRepository.getById.mockResolvedValueOnce(null);

      const promise = categoryService.editCategory('test-id', testCategory);

      await expect(promise).rejects.toThrow(
        "Could not find parent category with id 'test-parent-id'.",
      );
    });

    it('should throw an error if the updated category cant be found.', async () => {
      validator.validate.mockReturnValueOnce({
        valid: true,
        errors: {},
      });
      categoryQueryRepository.getById.mockResolvedValueOnce({
        _id: testCategoryDto._id!,
        ...testCategoryDto,
        parentId: 'test-parent-id',
      });
      categoryQueryRepository.getById.mockResolvedValueOnce({
        _id: testCategoryParentDto._id!,
        ...testCategoryParentDto,
      });

      const promise = categoryService.editCategory('test-id', testCategory);

      await expect(promise).rejects.toThrow(
        "Could not retrieve category with id 'test-id' after it was updated.",
      );
    });
  });

  describe('deleteCategory', () => {
    it('should delete the given category', async () => {
      const testId = 'test-id';
      categoryService.getCategoryById = jest
        .fn()
        .mockResolvedValueOnce(testCategory);
      categoryQueryRepository.find.mockResolvedValueOnce([
        { _id: testCategoryChildDto._id!, ...testCategoryChildDto },
      ]);
      const mapMock = jest.fn().mockReturnValueOnce(testCategoryDto);
      const mapArrayMock = jest.fn().mockReturnValueOnce([
        {
          _id: testCategoryChild._id!,
          ...testCategoryChild,
        },
      ]);
      automapperProvider.provide.mockReturnValue({
        map: mapMock,
        mapArray: mapArrayMock,
      });

      await categoryService.deleteCategory(testId);

      expect(categoryService.getCategoryById).toHaveBeenCalledWith(testId);
      expect(categoryCommandRepository.delete).toHaveBeenCalledWith(testId);
      expect(
        categoryCommandRepository.removeChildIdFromParent,
      ).toHaveBeenCalledWith(testCategoryParentDto._id!, testId);
      expect(
        productCommandRepository.removeCategoryFromAllProducts,
      ).toHaveBeenCalledWith(testId);
    });

    it('should throw an error if the category does not exist', async () => {
      const testId = 'test-id';
      categoryService.getCategoryById = jest.fn().mockResolvedValueOnce(null);

      const promise = categoryService.deleteCategory(testId);

      await expect(promise).rejects.toThrow(
        "Could not find category with id 'test-id'.",
      );
    });
  });
});
