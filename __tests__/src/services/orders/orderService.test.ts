import { IUserAddressService } from '@/abstractions';
import {
  ICommandRepository,
  ILineItem,
  IMapper,
  IPriceData,
  IProductData,
  IProvider,
  IQueryRepository,
  IdModel,
} from '@/lib/abstractions';
import { PaymentStatusEnum } from '@/lib/enums';
import {
  IAddress,
  IOrder,
  IUser,
  IUserAddress,
  OrderDto,
  OrderStatusEnum,
  UserDto,
} from '@/models';
import { OrderService } from '@/services/orders';

describe('OrderService', () => {
  let orderQueryRepository: jest.Mocked<IQueryRepository<OrderDto>>;
  let orderCommandRepository: jest.Mocked<ICommandRepository<OrderDto>>;
  let userQueryRepository: jest.Mocked<IQueryRepository<UserDto>>;
  let userAddressService: jest.Mocked<IUserAddressService>;
  let automapperProvider: IProvider<IMapper>;
  let mapMock = jest.fn();
  let mapArrayMock = jest.fn();
  let service: OrderService;

  const productData1: IProductData = {
    _id: '1',
    name: 'product1',
    description: 'desc1',
    imageUrls: ['key1', 'key2'],
  };
  const priceData1: IPriceData = {
    currency: 'USD',
    unitAmount: 100,
    productData: productData1,
  };
  const lineItem1: ILineItem = {
    quantity: 2,
    priceData: priceData1,
  };
  const productData2: IProductData = {
    _id: '2',
    name: 'product2',
    description: 'desc2',
    imageUrls: ['key3', 'key4'],
  };
  const priceData2: IPriceData = {
    currency: 'USD',
    unitAmount: 200,
    productData: productData1,
  };
  const lineItem2: ILineItem = {
    quantity: 3,
    priceData: priceData1,
  };
  const orderDto: OrderDto = {
    userId: '2',
    userAddressId: '3',
    lineItems: [lineItem1, lineItem2],
    paymentProvider: 'stripe',
    paymentStatus: PaymentStatusEnum.reverseLookup(PaymentStatusEnum.Paid),
    orderStatus: OrderStatusEnum.reverseLookup(OrderStatusEnum.Created),
  };
  const orderDtoWithId: OrderDto & IdModel = {
    ...orderDto,
    _id: '1',
  };

  const userDtoWithId: UserDto & IdModel = {
    _id: '2',
    email: '',
    name: '',
    password: '',
    image: '',
    emailVerified: new Date(),
    roles: [],
    defaultUserAddressId: '',
    addresses: [],
  };

  const user: IUser = {
    ...userDtoWithId,
    addresses: [],
  };

  const address: IAddress = {
    _id: '3',
    lineOne: 'lineOne',
    lineTwo: 'lineTwo',
    city: 'city',
    state: 'state',
    postalCode: 'postalCode',
    country: 'country',
  };
  const userAddress: IUserAddress = {
    _id: '3',
    address,
    recipientName: 'name',
  };

  const order: IOrder = {
    _id: '1',
    user,
    userAddress,
    lineItems: [lineItem1, lineItem2],
    paymentStatus: PaymentStatusEnum.Paid,
    orderStatus: OrderStatusEnum.Created,
  };

  const productData3: IProductData = {
    _id: '3',
    name: 'product3',
    description: 'desc3',
    imageUrls: ['key5', 'key6'],
  };
  const priceData3: IPriceData = {
    currency: 'USD',
    unitAmount: 300,
    productData: productData3,
  };
  const lineItem3: ILineItem = {
    quantity: 4,
    priceData: priceData3,
  };
  const productData4: IProductData = {
    _id: '4',
    name: 'product4',
    description: 'desc4',
    imageUrls: ['key7', 'key8'],
  };
  const priceData4: IPriceData = {
    currency: 'USD',
    unitAmount: 400,
    productData: productData4,
  };
  const lineItem4: ILineItem = {
    quantity: 5,
    priceData: priceData4,
  };
  const orderDto2: OrderDto = {
    _id: '2',
    userId: '3',
    userAddressId: '4',
    lineItems: [lineItem3, lineItem4],
    paymentProvider: 'paypal',
    paymentStatus: PaymentStatusEnum.reverseLookup(PaymentStatusEnum.Pending),
    orderStatus: OrderStatusEnum.reverseLookup(OrderStatusEnum.Processing),
  };
  const orderDtoWithId2: OrderDto & IdModel = {
    ...orderDto2,
    _id: '2',
  };

  const userDtoWithId2: UserDto & IdModel = {
    _id: '3',
    email: '',
    name: '',
    password: '',
    image: '',
    emailVerified: new Date(),
    roles: [],
    defaultUserAddressId: '',
    addresses: [],
  };

  const user2: IUser = {
    ...userDtoWithId2,
    addresses: [],
  };

  const address2: IAddress = {
    _id: '4',
    lineOne: 'lineThree',
    lineTwo: 'lineFour',
    city: 'cityTwo',
    state: 'stateTwo',
    postalCode: 'postalCodeTwo',
    country: 'countryTwo',
  };
  const userAddress2: IUserAddress = {
    _id: '4',
    address: address2,
    recipientName: 'nameTwo',
  };

  const order2: IOrder = {
    _id: '2',
    user: user2,
    userAddress: userAddress2,
    lineItems: [lineItem3, lineItem4],
    paymentStatus: PaymentStatusEnum.Pending,
    orderStatus: OrderStatusEnum.Processing,
  };

  beforeEach(() => {
    mapMock = jest.fn();
    mapArrayMock = jest.fn();
    orderQueryRepository = {
      getById: jest.fn(),
      list: jest.fn(),
      find: jest.fn(),
    };
    orderCommandRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      generateId: jest.fn(),
    };
    userQueryRepository = {
      getById: jest.fn(),
      list: jest.fn(),
      find: jest.fn(),
    };
    userAddressService = {
      getUserAddress: jest.fn(),
      getUserAddressByUserAddressId: jest.fn(),
      getAllUserAddresses: jest.fn(),
      addUserAddress: jest.fn(),
      editUserAddress: jest.fn(),
      deleteUserAddress: jest.fn(),
    };
    automapperProvider = {
      provide: () => ({ map: mapMock, mapArray: mapArrayMock }),
    };

    service = new OrderService(
      orderQueryRepository,
      orderCommandRepository,
      userQueryRepository,
      userAddressService,
      automapperProvider,
    );
  });

  describe('getOrderById', () => {
    it('should return an order', async () => {
      orderQueryRepository.getById.mockResolvedValue(orderDtoWithId);
      userQueryRepository.getById.mockResolvedValue(userDtoWithId);
      userAddressService.getUserAddressByUserAddressId.mockResolvedValue(
        userAddress,
      );
      mapMock.mockReturnValue(order);

      const result = await service.getOrderById('1');

      expect(result).toEqual(order);
      expect(orderQueryRepository.getById).toHaveBeenCalledWith('1');
      expect(userQueryRepository.getById).toHaveBeenCalledWith('2');
      expect(
        userAddressService.getUserAddressByUserAddressId,
      ).toHaveBeenCalledWith('2', '3');
      expect(mapMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      orderQueryRepository.list.mockResolvedValue([
        orderDtoWithId,
        orderDtoWithId2,
      ]);
      userQueryRepository.list.mockResolvedValue([
        userDtoWithId,
        userDtoWithId2,
      ]);
      userAddressService.getUserAddressByUserAddressId.mockResolvedValueOnce(
        userAddress,
      );
      userAddressService.getUserAddressByUserAddressId.mockResolvedValueOnce(
        userAddress2,
      );
      mapMock.mockReturnValueOnce(order);
      mapMock.mockReturnValueOnce(order2);

      const result = await service.getAllOrders();

      expect(result).toEqual([order, order2]);
      expect(orderQueryRepository.list).toHaveBeenCalledTimes(1);
      expect(userQueryRepository.list).toHaveBeenCalledTimes(1);
      expect(
        userAddressService.getUserAddressByUserAddressId,
      ).toHaveBeenCalledTimes(2);
      expect(mapMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('getAllOrdersByUserId', () => {
    it('should return all orders by user id', async () => {
      orderQueryRepository.find.mockResolvedValueOnce([
        orderDtoWithId,
        orderDtoWithId2,
      ]);
      userQueryRepository.getById.mockResolvedValue(userDtoWithId);
      userAddressService.getUserAddressByUserAddressId.mockResolvedValueOnce(
        userAddress,
      );
      userAddressService.getUserAddressByUserAddressId.mockResolvedValueOnce(
        userAddress2,
      );
      mapMock.mockReturnValueOnce(order);
      mapMock.mockReturnValueOnce(order2);

      const result = await service.getAllOrdersByUserId('123');

      expect(result).toEqual([order, order2]);
      expect(orderQueryRepository.find).toHaveBeenCalledTimes(1);
      expect(orderQueryRepository.find).toHaveBeenCalledWith({ userId: '123' });
      expect(userQueryRepository.getById).toHaveBeenCalledTimes(1);
      expect(userQueryRepository.getById).toHaveBeenCalledWith('123');
      expect(
        userAddressService.getUserAddressByUserAddressId,
      ).toHaveBeenCalledTimes(2);
      expect(mapMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('createOrder', () => {
    it('should create an order', async () => {
      const orderId = '234';
      mapMock.mockReturnValueOnce(orderDto);
      orderCommandRepository.create.mockResolvedValueOnce(orderId);
      service.getOrderById = jest.fn().mockResolvedValueOnce(order);

      const result = await service.createOrder(order);

      expect(result).toEqual(order);
      expect(mapMock).toHaveBeenCalledTimes(1);
      expect(mapMock).toHaveBeenCalledWith(order, 'IOrder', 'OrderDto');
      expect(orderCommandRepository.create).toHaveBeenCalledTimes(1);
      expect(orderCommandRepository.create).toHaveBeenCalledWith(orderDto);
      expect(service.getOrderById).toHaveBeenCalledTimes(1);
      expect(service.getOrderById).toHaveBeenCalledWith(orderId);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update an order status', async () => {
      const orderId = '234';
      const orderStatus = OrderStatusEnum.reverseLookup(
        OrderStatusEnum.Processing,
      );
      service.getOrderById = jest.fn().mockResolvedValueOnce(order);

      const result = await service.updateOrderStatus(orderId, orderStatus);

      expect(result).toEqual(order);
      expect(orderCommandRepository.update).toHaveBeenCalledTimes(1);
      expect(orderCommandRepository.update).toHaveBeenCalledWith(orderId, {
        orderStatus,
      });
      expect(service.getOrderById).toHaveBeenCalledTimes(1);
      expect(service.getOrderById).toHaveBeenCalledWith(orderId);
    });
  });

  describe('updatePaymentStatus', () => {
    it('should update a payment status', async () => {
      const orderId = '234';
      const checkoutSessionId = '345';
      const paymentStatus = PaymentStatusEnum.reverseLookup(
        PaymentStatusEnum.Paid,
      );
      const paymentProvider = 'stripe';
      service.getOrderById = jest.fn().mockResolvedValueOnce(order);

      const result = await service.updatePaymentStatus(
        orderId,
        checkoutSessionId,
        paymentStatus,
        paymentProvider,
      );

      expect(result).toEqual(order);
      expect(orderCommandRepository.update).toHaveBeenCalledTimes(1);
      expect(orderCommandRepository.update).toHaveBeenCalledWith(
        orderId,
        expect.objectContaining({
          checkoutSessionId,
          paymentStatus,
          paymentProvider,
        }),
      );
      expect(service.getOrderById).toHaveBeenCalledTimes(1);
      expect(service.getOrderById).toHaveBeenCalledWith(orderId);
    });
  });
});
