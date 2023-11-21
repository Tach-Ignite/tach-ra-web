import fs from 'fs';
import crypto from 'crypto';
import { ProductService } from '@/services/products';
import { ICategoryService, IProductCommandRepository } from '@/abstractions';
import { IProduct, ProductDto } from '@/models';
import {
  FileLike,
  IFactory,
  IPublicFileStorageService,
  IImageStorageService,
  ILoggerFactory,
  IMapper,
  INpmLogger,
  IProvider,
  IQueryRepository,
  IValidator,
  ValidationResult,
  queryOptionsSchema,
} from '@/lib/abstractions';

describe('ProductService', () => {
  let productService: ProductService;
  let imageStorageService: jest.Mocked<IImageStorageService>;
  let automapperProvider: jest.Mocked<IProvider<IMapper>>;
  let productQueryRepository: jest.Mocked<IQueryRepository<ProductDto>>;
  let productCommandRepository: jest.Mocked<IProductCommandRepository>;
  let categoryService: jest.Mocked<ICategoryService>;
  let fileStorageServiceFactory: jest.Mocked<
    IFactory<IPublicFileStorageService>
  >;
  let loggerFactory: ILoggerFactory<INpmLogger>;
  let validator: jest.Mocked<IValidator>;
  let testProduct: IProduct;
  let testProductDto: ProductDto;
  let testProductImages: FileLike[];
  let mockBuffer: Buffer;
  let testBlob1: {};
  let testBlob2: {};
  let fileStorageService: jest.Mocked<IPublicFileStorageService>;
  let mockLogger: jest.Mocked<INpmLogger>;

  beforeEach(() => {
    fileStorageService = {
      uploadFile: jest.fn(),
      deleteFile: jest.fn(),
      getPublicUrl: jest.fn(),
      getDownloadStream: jest.fn(),
      getFileMetadata: jest.fn(),
    };
    imageStorageService = {
      uploadImage: jest.fn(),
    };
    automapperProvider = {
      provide: jest.fn(),
    };
    productQueryRepository = {
      getById: jest.fn(),
      list: jest.fn(),
      find: jest.fn(),
    };
    productCommandRepository = {
      removeCategoryFromAllProducts: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      generateId: jest.fn(),
    };
    fileStorageServiceFactory = {
      create: jest.fn(() => fileStorageService),
    };
    categoryService = {
      getAllCategories: jest.fn(),
      getCategoryById: jest.fn(),
      addCategory: jest.fn(),
      editCategory: jest.fn(),
      deleteCategory: jest.fn(),
    };
    mockLogger = {
      log: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      silly: jest.fn(),
      http: jest.fn(),
      verbose: jest.fn(),
    };
    loggerFactory = {
      create: () => Promise.resolve(mockLogger),
    };
    validator = {
      validate: jest.fn(),
    };
    productService = new ProductService(
      productQueryRepository,
      productCommandRepository,
      categoryService,
      imageStorageService,
      fileStorageServiceFactory,
      automapperProvider,
      loggerFactory,
      validator,
    );

    testProduct = {
      name: 'Test Product',
      description: 'This is a test product',
      friendlyId: 'test-product',
      brand: 'Test Brand',
      isNew: false,
      price: 9.99,
      oldPrice: 19.99,
      categories: [
        {
          _id: 'category1',
          name: 'Test Category',
        },
      ],
      categoryPropertyValues: {
        category1Property: {
          categoryId: 'category1',
          categoryPropertyId: 'category1Property',
          value: 'Test Value',
        },
      },
      quantity: 10,
      imageUrls: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
      ],
    };
    testProductDto = {
      name: testProduct.name,
      description: testProduct.description,
      friendlyId: testProduct.friendlyId,
      brand: testProduct.brand,
      isNew: testProduct.isNew,
      price: testProduct.price,
      oldPrice: testProduct.oldPrice,
      quantity: testProduct.quantity,
      categoryPropertyValues: testProduct.categoryPropertyValues,
      imageStorageKeys: ['image1.jpg', 'image2.jpg'],
      categoryIds: ['category1'],
    };
    testProductImages = [
      {
        filepath: '/path/to/image1.jpg',
        type: 'image/jpeg',
        name: 'image1.jpg',
        size: 123,
      },
      {
        filepath: '/path/to/image2.png',
        type: 'image/png',
        name: 'image2.png',
        size: 456,
      },
    ];

    jest.mock('fs');
    mockBuffer = Buffer.from('test');
    fs.readFileSync = jest.fn().mockReturnValue(mockBuffer);
    jest.mock('crypto');
    crypto.randomUUID = jest.fn().mockReturnValue('123');
    testBlob1 = {};
    testBlob2 = {};
    global.Blob = jest
      .fn()
      .mockReturnValueOnce(testBlob1)
      .mockReturnValueOnce(testBlob2);
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const testProductDtos = [
        {
          ...testProductDto,
          _id: 'test-id-1',
          name: 'Test Product 1',
          description: 'This is a test product 1',
          price: 9.99,
          imageUrls: [
            'https://example.com/image1.jpg',
            'https://example.com/image2.jpg',
          ],
        },
        {
          ...testProductDto,
          _id: 'test-id-2',
          name: 'Test Product 2',
          description: 'This is a test product 2',
          price: 19.99,
          imageUrls: [
            'https://example.com/image3.jpg',
            'https://example.com/image4.jpg',
          ],
        },
      ];
      const validationResult: ValidationResult = { valid: true, errors: [] };

      validator.validate.mockReturnValueOnce(validationResult);
      productQueryRepository.list.mockResolvedValueOnce(testProductDtos);
      const mapMock = jest.fn().mockReturnValueOnce(testProductDtos);
      automapperProvider.provide.mockReturnValue({
        map: jest.fn(),
        mapArray: mapMock,
      });

      const products = await productService.getAllProducts();

      expect(products).toBeDefined();
      expect(products).toHaveLength(testProductDtos.length);
      expect(validator.validate).toBeCalledWith(
        undefined,
        queryOptionsSchema,
        true,
      );
      expect(automapperProvider.provide).toHaveBeenCalled();
      expect(productQueryRepository.list).toHaveBeenCalled();
      expect(categoryService.getAllCategories).toHaveBeenCalled();
      expect(fileStorageService.getPublicUrl).toHaveBeenCalledTimes(4);
    });

    it('should return an empty array if no products exist', async () => {
      const validationResult: ValidationResult = { valid: true, errors: [] };

      productQueryRepository.list.mockResolvedValueOnce([]);
      const mapMock = jest.fn().mockReturnValueOnce([]);
      automapperProvider.provide.mockReturnValue({
        map: jest.fn(),
        mapArray: mapMock,
      });
      validator.validate.mockReturnValueOnce(validationResult);

      const products = await productService.getAllProducts();

      expect(products).toBeDefined();
      expect(products).toHaveLength(0);
      expect(validator.validate).toBeCalledWith(
        undefined,
        queryOptionsSchema,
        true,
      );
      expect(automapperProvider.provide).toHaveBeenCalled();
      expect(productQueryRepository.list).toHaveBeenCalled();
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const testProductId = 'test-id';
      const mappedProduct = { _id: testProductId, ...testProduct };

      productQueryRepository.getById.mockResolvedValueOnce({
        _id: testProductId,
        ...testProductDto,
      });
      const mapMock = jest.fn().mockReturnValueOnce(mappedProduct);
      automapperProvider.provide.mockReturnValue({
        map: mapMock,
        mapArray: jest.fn(),
      });

      const product = await productService.getProductById(testProductId);

      expect(product).toBeDefined();
      expect(product._id).toBe(testProductId);
      expect(product.name).toBe(testProductDto.name);
      expect(product.description).toBe(testProductDto.description);
      expect(product.price).toBe(testProductDto.price);
      expect(product.imageUrls).toHaveLength(
        testProductDto.imageStorageKeys.length,
      );
      expect(automapperProvider.provide).toHaveBeenCalled();
      expect(productQueryRepository.getById).toHaveBeenCalledWith(
        testProductId,
      );
    });

    it('should return null if product does not exist', async () => {
      const testProductId = 'test-id';

      productQueryRepository.getById.mockResolvedValueOnce(null);

      const promise = productService.getProductById(testProductId);

      await expect(promise).rejects.toThrow(
        "Product with id 'test-id' not found",
      );
    });
  });

  describe('searchProducts', () => {
    it('should return matched products', async () => {
      const testProductDtos = [
        {
          ...testProductDto,
          _id: 'test-id-1',
          name: 'Test Product 1',
          description: 'This is a test product 1',
          price: 9.99,
          imageStorageKeys: ['image1.jpg', 'image2.jpg'],
        },
        {
          ...testProductDto,
          _id: 'test-id-2',
          name: 'Test Product 2',
          description: 'This is a test product 2',
          price: 19.99,
          imageStorageKeys: ['image3.jpg', 'image4.jpg'],
        },
      ];

      const testProducts = [
        {
          ...testProduct,
          _id: 'test-id-1',
          name: 'Test Product 1',
          description: 'This is a test product 1',
          price: 9.99,
          imageUrls: [
            'https://example.com/image1.jpg',
            'https://example.com/image2.jpg',
          ],
        },
        {
          ...testProduct,
          _id: 'test-id-2',
          name: 'Test Product 2',
          description: 'This is a test product 2',
          price: 19.99,
          imageUrls: [
            'https://example.com/image3.jpg',
            'https://example.com/image4.jpg',
          ],
        },
      ];
      const validationResult: ValidationResult = { valid: true, errors: [] };
      validator.validate.mockReturnValueOnce(validationResult);
      productQueryRepository.find.mockResolvedValueOnce(testProductDtos);
      const mapMock = jest
        .fn()
        .mockReturnValueOnce(testProducts[0])
        .mockReturnValueOnce(testProducts[1]);
      automapperProvider.provide.mockReturnValue({
        map: mapMock,
        mapArray: mapMock,
      });

      const products = await productService.searchProducts('test');

      expect(products).toBeDefined();
      expect(products).toMatchObject(testProducts);
      expect(automapperProvider.provide).toHaveBeenCalled();
      expect(productQueryRepository.find).toHaveBeenCalled();
      expect(categoryService.getAllCategories).toHaveBeenCalled();
      expect(fileStorageService.getPublicUrl).toHaveBeenCalledTimes(4);
    });

    it('should return an empty array if no products exist', async () => {
      const validationResult: ValidationResult = { valid: true, errors: [] };
      productQueryRepository.find.mockResolvedValueOnce([]);
      const mapMock = jest.fn().mockReturnValueOnce([]);
      automapperProvider.provide.mockReturnValue({
        map: mapMock,
        mapArray: mapMock,
      });
      validator.validate.mockReturnValueOnce(validationResult);

      const products = await productService.searchProducts('test');

      expect(products).toBeDefined();
      expect(products).toHaveLength(0);
      expect(validator.validate).toBeCalledWith(
        undefined,
        queryOptionsSchema,
        true,
      );
      expect(productQueryRepository.find).toHaveBeenCalled();
    });
  });

  describe('createProduct', () => {
    it('should create a product with images', async () => {
      const testImageStorageResults = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
      ];
      imageStorageService.uploadImage
        .mockResolvedValueOnce(testImageStorageResults[0])
        .mockResolvedValueOnce(testImageStorageResults[1]);

      const mapMock = jest.fn().mockReturnValueOnce(testProductDto);
      productService.getProductById = jest
        .fn()
        .mockResolvedValueOnce({ _id: 'test-id', ...testProduct });

      automapperProvider.provide.mockReturnValue({
        map: mapMock,
        mapArray: jest.fn(),
      });

      const createdProduct = await productService.createProduct(
        testProduct,
        testProductImages,
      );

      expect(createdProduct).toBeDefined();
      expect(createdProduct._id).toBe('test-id');
      expect(createdProduct.name).toBe(testProduct.name);
      expect(fs.readFileSync).toHaveBeenNthCalledWith(
        1,
        testProductImages[0].filepath,
      );
      expect(fs.readFileSync).toHaveBeenNthCalledWith(
        2,
        testProductImages[1].filepath,
      );
      expect(imageStorageService.uploadImage).toHaveBeenNthCalledWith(
        1,
        '123',
        testBlob1,
        'image/jpeg',
      );
      expect(imageStorageService.uploadImage).toHaveBeenNthCalledWith(
        2,
        '123',
        testBlob2,
        'image/png',
      );
      expect(automapperProvider.provide).toHaveBeenCalled();
      expect(mapMock).toHaveBeenCalledWith(
        testProduct,
        'IProduct',
        'ProductDto',
        expect.objectContaining({
          extraArgs: expect.anything(),
        }),
      );
      expect(productCommandRepository.create).toHaveBeenCalledWith(
        testProductDto,
      );
      expect(createdProduct).toMatchObject({ _id: 'test-id', ...testProduct });
    });
  });

  describe('editProduct', () => {
    it('should edit a product with new images', async () => {
      const updatedProduct = {
        _id: 'test-id',
        ...testProduct,
        name: 'Updated Product',
        description: 'This is an updated product',
        price: 199.99,
      };
      const updatedProductImages: FileLike[] = [
        {
          filepath: '/path/to/new-image1.jpg',
          type: 'image/jpeg',
          size: 234,
          name: 'new-image1.jpg',
        },
        {
          filepath: '/path/to/new-image2.jpg',
          type: 'image/jpeg',
          size: 345,
          name: 'new-image2.jpg',
        },
      ];
      const updatedProductDto = {
        _id: 'test-id',
        ...testProductDto,
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        imageUrls: [
          'https://example.com/new-image1.jpg',
          'https://example.com/new-image2.jpg',
        ],
      };

      productQueryRepository.getById.mockResolvedValueOnce({
        _id: 'test-id',
        ...testProductDto,
      });
      productService.getProductById = jest
        .fn()
        .mockResolvedValueOnce(updatedProduct);
      imageStorageService.uploadImage
        .mockResolvedValueOnce('new-image1.jpg')
        .mockResolvedValueOnce('new-image2.jpg');
      imageStorageService.uploadImage
        .mockResolvedValueOnce('https://example.com/new-image1.jpg')
        .mockResolvedValueOnce('https://example.com/new-image2.jpg');
      const mapMock = jest.fn().mockReturnValueOnce(updatedProductDto);
      automapperProvider.provide.mockReturnValue({
        map: mapMock,
        mapArray: jest.fn(),
      });

      const editedProduct = await productService.editProduct(
        'test-id',
        updatedProduct,
        updatedProductImages,
      );

      expect(editedProduct).toBeDefined();
      expect(editedProduct._id).toBe('test-id');
      expect(editedProduct.name).toBe(updatedProduct.name);
      expect(editedProduct.description).toBe(updatedProduct.description);
      expect(editedProduct.price).toBe(updatedProduct.price);
      expect(editedProduct.imageUrls).toHaveLength(updatedProductImages.length);
      expect(imageStorageService.uploadImage).toHaveBeenNthCalledWith(
        1,
        '123',
        testBlob1,
        'image/jpeg',
      );
      expect(imageStorageService.uploadImage).toHaveBeenNthCalledWith(
        2,
        '123',
        testBlob2,
        'image/jpeg',
      );
      expect(productService.getProductById).toHaveBeenCalledWith('test-id');
      expect(automapperProvider.provide).toHaveBeenCalled();
    });

    it('should edit a product without new images', async () => {
      const updatedProduct = {
        _id: 'test-id',
        ...testProduct,
        name: 'Updated Product',
        description: 'This is an updated product',
        price: 1999.99,
      };
      const updatedProductDto = {
        _id: 'test-id',
        ...testProductDto,
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
      };

      productService.getProductById = jest
        .fn()
        .mockResolvedValueOnce(updatedProduct);
      productQueryRepository.getById.mockResolvedValueOnce({
        _id: 'test-id',
        ...testProductDto,
      });
      const mapMock = jest.fn().mockReturnValueOnce(updatedProductDto);
      automapperProvider.provide.mockReturnValue({
        map: mapMock,
        mapArray: jest.fn(),
      });

      const editedProduct = await productService.editProduct(
        'test-id',
        updatedProduct,
        [],
      );

      expect(editedProduct).toBeDefined();
      expect(editedProduct._id).toBe('test-id');
      expect(editedProduct.name).toBe(updatedProduct.name);
      expect(editedProduct.description).toBe(updatedProduct.description);
      expect(editedProduct.price).toBe(updatedProduct.price);
      expect(editedProduct.imageUrls).toHaveLength(
        testProductDto.imageStorageKeys.length,
      );
      expect(productService.getProductById).toHaveBeenCalledWith('test-id');
      expect(automapperProvider.provide).toHaveBeenCalled();
    });

    it('should throw an error if product ID is missing', async () => {
      const promise = productService.editProduct(
        '',
        testProduct,
        testProductImages,
      );

      productQueryRepository.getById.mockResolvedValueOnce(null);

      await expect(promise).rejects.toThrow("Product with id '' not found");
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      productQueryRepository.getById.mockResolvedValueOnce({
        _id: 'test-id',
        ...testProductDto,
      });

      await productService.deleteProduct('test-id');

      expect(productQueryRepository.getById).toHaveBeenCalledWith('test-id');
      expect(fileStorageService.deleteFile).toHaveBeenNthCalledWith(
        1,
        testProductDto.imageStorageKeys[0],
      );
      expect(fileStorageService.deleteFile).toHaveBeenNthCalledWith(
        2,
        testProductDto.imageStorageKeys[1],
      );
      expect(productCommandRepository.delete).toHaveBeenCalledWith('test-id');
    });

    it('should throw an error if product does not exist', async () => {
      productQueryRepository.getById.mockResolvedValueOnce(null);

      const promise = productService.deleteProduct('test-id');

      await expect(promise).rejects.toThrow(
        "Product with id 'test-id' not found",
      );
    });
  });
});
