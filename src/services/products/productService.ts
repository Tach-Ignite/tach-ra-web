import fs from 'fs';
import { randomUUID } from 'crypto';
import {
  FileLike,
  IFactory,
  IFileStorageService,
  IImageStorageService,
  ILoggerFactory,
  IMapper,
  INpmLogger,
  IProvider,
  IQueryRepository,
  IValidator,
  QueryOptions,
  queryOptionsSchema,
} from '@/lib/abstractions';
import { ErrorWithStatusCode } from '@/lib/errors';
import { ICategory, ProductDto, IProduct } from '@/models';
import {
  ICategoryService,
  IProductService,
  IProductCommandRepository,
} from '@/abstractions';
import '@/mappingProfiles/services/products/mappingProfile';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable(
  'productService',
  'productQueryRepository',
  'productCommandRepository',
  'categoryService',
  'imageStorageService',
  'fileStorageServiceFactory',
  'automapperProvider',
  'loggerFactory',
  'validator',
)
export class ProductService implements IProductService {
  private _productQueryRepository: IQueryRepository<ProductDto>;

  private _productCommandRepository: IProductCommandRepository;

  private _categoryService: ICategoryService;

  private _fileStorageServiceFactory: IFactory<IFileStorageService>;

  private _imageStorageService: IImageStorageService;

  private _automapperProvider: IProvider<IMapper>;

  private _loggerFactory: ILoggerFactory<INpmLogger>;

  private _validator: IValidator;

  constructor(
    productQueryRepository: IQueryRepository<ProductDto>,
    productCommandRepository: IProductCommandRepository,
    categoryService: ICategoryService,
    imageStorageService: IImageStorageService,
    fileStorageServiceFactory: IFactory<IFileStorageService>,
    automapperProvider: IProvider<IMapper>,
    loggerFactory: ILoggerFactory<INpmLogger>,
    validator: IValidator,
  ) {
    this._productQueryRepository = productQueryRepository;
    this._productCommandRepository = productCommandRepository;
    this._categoryService = categoryService;
    this._imageStorageService = imageStorageService;
    this._fileStorageServiceFactory = fileStorageServiceFactory;
    this._automapperProvider = automapperProvider;
    this._loggerFactory = loggerFactory;
    this._validator = validator;
  }

  async getAllProducts(queryOptions?: QueryOptions): Promise<IProduct[]> {
    const validationResult = this._validator.validate(
      queryOptions,
      queryOptionsSchema,
      true,
    );

    if (!validationResult.valid) {
      throw new ErrorWithStatusCode(
        `query options are invalid: ${JSON.stringify(validationResult.errors)}`,
        400,
        'query options were invalid.',
      );
    }

    const promises: Promise<any>[] = [];
    promises.push(this._productQueryRepository.list(queryOptions));
    promises.push(this._categoryService.getAllCategories());

    const [productDtos, categories] = await Promise.all(promises);
    const imageUrlPromises: Promise<string[]>[] = [];

    const fileStorageService = this._fileStorageServiceFactory.create();
    for (let i = 0; i < productDtos.length; i++) {
      if (!productDtos[i].imageStorageKeys) {
        imageUrlPromises.push(Promise.resolve([]));
      } else {
        const innerPromiseArray: Promise<string>[] = [];
        for (let j = 0; j < productDtos[i].imageStorageKeys.length; j++) {
          innerPromiseArray.push(
            fileStorageService.getSignedUrl(productDtos[i].imageStorageKeys[j]),
          );
        }
        imageUrlPromises.push(Promise.all(innerPromiseArray));
      }
    }

    const urlResults: string[][] = await Promise.all(imageUrlPromises);

    const mapper = this._automapperProvider.provide();
    const products: IProduct[] = [];
    for (let i = 0; i < productDtos.length; i++) {
      const product = mapper.map<ProductDto, IProduct>(
        productDtos[i],
        'ProductDto',
        'IProduct',
        {
          extraArgs: () => ({
            categories: productDtos[i].categoryIds
              ? categories.filter((c: ICategory) =>
                  productDtos[i].categoryIds.includes(c._id),
                )
              : [],
            imageUrls: urlResults[i],
          }),
        },
      );
      products.push(product);
    }

    return products;
  }

  async getProductById(productId: string): Promise<IProduct> {
    const product = await this._productQueryRepository.getById(productId);

    if (!product) {
      throw new ErrorWithStatusCode(
        `Product with id '${productId}' not found`,
        404,
        'Product not found',
      );
    }

    const categoryPromises: Promise<ICategory | null>[] = [];
    if (product.categoryIds) {
      for (let i = 0; i < product?.categoryIds.length; i++) {
        categoryPromises.push(
          this._categoryService.getCategoryById(product.categoryIds[i]),
        );
      }
    }
    const imageUrlPromises: Promise<string>[] = [];
    if (product.imageStorageKeys) {
      const fileStorageService = this._fileStorageServiceFactory.create();
      for (let i = 0; i < product.imageStorageKeys.length; i++) {
        imageUrlPromises.push(
          fileStorageService.getSignedUrl(product.imageStorageKeys[i]),
        );
      }
    }

    const [categories, imageUrls] = await Promise.all([
      Promise.all(categoryPromises),
      Promise.all(imageUrlPromises),
    ]);

    const mapper = this._automapperProvider.provide();
    return mapper.map<ProductDto, IProduct>(product, 'ProductDto', 'IProduct', {
      extraArgs: () => ({
        categories: categories.filter((c) => c !== null),
        imageUrls,
      }),
    });
  }

  async searchProducts(
    searchTerm: string,
    queryOptions?: QueryOptions,
  ): Promise<IProduct[]> {
    const validationResult = this._validator.validate(
      queryOptions,
      queryOptionsSchema,
      true,
    );

    if (!validationResult.valid) {
      throw new ErrorWithStatusCode(
        `query options are invalid: ${JSON.stringify(validationResult.errors)}`,
        400,
        'query options were invalid.',
      );
    }

    const promises: Promise<any>[] = [];
    promises.push(
      this._productQueryRepository.find(
        {
          $text: { $search: searchTerm },
        },
        queryOptions,
      ),
    );
    promises.push(this._categoryService.getAllCategories());

    const [productDtos, categories] = await Promise.all(promises);
    const imageUrlPromises: Promise<string[]>[] = [];

    const fileStorageService = this._fileStorageServiceFactory.create();
    for (let i = 0; i < productDtos.length; i++) {
      if (!productDtos[i].imageStorageKeys) {
        imageUrlPromises.push(Promise.resolve([]));
      } else {
        const innerPromiseArray: Promise<string>[] = [];
        for (let j = 0; j < productDtos[i].imageStorageKeys.length; j++) {
          innerPromiseArray.push(
            fileStorageService.getSignedUrl(productDtos[i].imageStorageKeys[j]),
          );
        }
        imageUrlPromises.push(Promise.all(innerPromiseArray));
      }
    }

    const urlResults: string[][] = await Promise.all(imageUrlPromises);

    const mapper = this._automapperProvider.provide();
    const products: IProduct[] = [];
    for (let i = 0; i < productDtos.length; i++) {
      const product = mapper.map<ProductDto, IProduct>(
        productDtos[i],
        'ProductDto',
        'IProduct',
        {
          extraArgs: () => ({
            categories: productDtos[i].categoryIds
              ? categories.filter((c: ICategory) =>
                  productDtos[i].categoryIds.includes(c._id),
                )
              : [],
            imageUrls: urlResults[i],
          }),
        },
      );
      products.push(product);
    }

    return products;
  }

  async createProduct(
    product: IProduct,
    productImages: FileLike[],
  ): Promise<IProduct> {
    const imageStoragePromises: Promise<string>[] = [];
    for (let i = 0; i < productImages.length; i++) {
      if (productImages[i].filepath) {
        const file = fs.readFileSync(productImages[i].filepath!);
        const imageBlob = new Blob([file]);
        imageStoragePromises.push(
          this._imageStorageService.uploadImage(
            randomUUID().replaceAll('-', ''),
            imageBlob,
            productImages[i].type,
          ),
        );
      }
    }

    const imageStorageKeys = await Promise.all(imageStoragePromises);

    const mapper = this._automapperProvider.provide();
    const productDto = mapper.map<IProduct, ProductDto>(
      product,
      'IProduct',
      'ProductDto',
      { extraArgs: () => ({ imageStorageKeys }) },
    );

    const newID = await this._productCommandRepository.create(productDto);
    return this.getProductById(newID);
  }

  async editProduct(
    productId: string,
    product: IProduct,
    productImages?: FileLike[],
  ): Promise<IProduct> {
    const existingProduct = await this._productQueryRepository.getById(
      productId,
    );

    if (!existingProduct) {
      throw new ErrorWithStatusCode(
        `Product with id '${productId}' not found`,
        404,
        'Product not found',
      );
    }

    let newImageStorageKeys: string[] = existingProduct?.imageStorageKeys || [];
    if (productImages) {
      if (existingProduct.imageStorageKeys) {
        const fileStorageService = this._fileStorageServiceFactory.create();
        const fileStoragePromises: Promise<void>[] = [];
        for (let i = 0; i < existingProduct.imageStorageKeys.length; i++) {
          fileStoragePromises.push(
            fileStorageService.deleteFile(existingProduct.imageStorageKeys[i]),
          );
        }
        try {
          await Promise.all(fileStoragePromises);
        } catch (e: any) {
          const logger = await this._loggerFactory.create(
            'services/products/productService',
          );
          logger.error(e);
        }
      }

      const imageStoragePromises: Promise<string>[] = [];
      for (let i = 0; i < productImages.length; i++) {
        if (productImages[i].filepath) {
          const file = fs.readFileSync(productImages[i].filepath!);
          const imageBlob = new Blob([file]);
          imageStoragePromises.push(
            this._imageStorageService.uploadImage(
              randomUUID().replaceAll('-', ''),
              imageBlob,
              productImages[i].type,
            ),
          );
        }
      }

      newImageStorageKeys = await Promise.all(imageStoragePromises);
    }

    const mapper = this._automapperProvider.provide();
    const productDto = mapper.map<IProduct, ProductDto>(
      product,
      'IProduct',
      'ProductDto',
      { extraArgs: () => ({ imageStorageKeys: newImageStorageKeys }) },
    );

    await this._productCommandRepository.update(productId, productDto);
    return this.getProductById(productId);
  }

  async deleteProduct(productId: string): Promise<void> {
    const promises: Promise<void>[] = [];
    promises.push(this.deleteAllImagesForProduct(productId));
    promises.push(this._productCommandRepository.delete(productId));
    await Promise.all(promises);
  }

  private async deleteAllImagesForProduct(productId: string): Promise<void> {
    const product = await this._productQueryRepository.getById(productId);

    if (!product) {
      throw new ErrorWithStatusCode(
        `Product with id '${productId}' not found`,
        404,
        'Product not found',
      );
    }

    if (product.imageStorageKeys) {
      const fileStoragePromises: Promise<void>[] = [];
      const fileStorageService = this._fileStorageServiceFactory.create();
      for (let i = 0; i < product.imageStorageKeys.length; i++) {
        fileStoragePromises.push(
          fileStorageService.deleteFile(product.imageStorageKeys[i]),
        );
      }
      await Promise.all(fileStoragePromises);
    }
  }
}
