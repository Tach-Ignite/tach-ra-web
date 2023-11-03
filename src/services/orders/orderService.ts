import { IOrderService, IUserAddressService } from '@/abstractions';
import {
  ICommandRepository,
  IMapper,
  IPaymentStatusEnum,
  IProvider,
  IQueryRepository,
} from '@/lib/abstractions';
import { ErrorWithStatusCode } from '@/lib/errors';
import {
  IOrder,
  IOrderStatusEnum,
  IUserAddress,
  OrderDto,
  UserDto,
} from '@/models';
import '@/mappingProfiles/services/orders/mappingProfile';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable(
  'orderService',
  'orderQueryRepository',
  'orderCommandRepository',
  'userQueryRepository',
  'userAddressService',
  'automapperProvider',
)
export class OrderService implements IOrderService {
  private _orderQueryRepository: IQueryRepository<OrderDto>;

  private _orderCommandRepository: ICommandRepository<OrderDto>;

  private _userQueryRepository: IQueryRepository<UserDto>;

  private _automapperProvider: IProvider<IMapper>;

  private _userAddressService: IUserAddressService;

  constructor(
    orderQueryRepository: IQueryRepository<OrderDto>,
    orderCommandRepository: ICommandRepository<OrderDto>,
    userQueryRepository: IQueryRepository<UserDto>,
    userAddressService: IUserAddressService,
    automapperProvider: IProvider<IMapper>,
  ) {
    this._orderQueryRepository = orderQueryRepository;
    this._orderCommandRepository = orderCommandRepository;
    this._userQueryRepository = userQueryRepository;
    this._userAddressService = userAddressService;
    this._automapperProvider = automapperProvider;
  }

  async getOrderById(orderId: string): Promise<IOrder> {
    const orderDto = await this._orderQueryRepository.getById(orderId);

    if (!orderDto) {
      throw new ErrorWithStatusCode(
        `Order with id '${orderId}' not found`,
        404,
        'Order not found.',
      );
    }

    const userDto = orderDto.userId
      ? await this._userQueryRepository.getById(orderDto.userId)
      : null;

    const userAddress =
      await this._userAddressService.getUserAddressByUserAddressId(
        orderDto.userId,
        orderDto.userAddressId,
      );

    const mapper = this._automapperProvider.provide();
    const order = mapper.map<OrderDto, IOrder>(orderDto, 'OrderDto', 'IOrder', {
      extraArgs: () => ({ userDto, userAddress }),
    });

    return order;
  }

  async getAllOrders(): Promise<IOrder[]> {
    const orderDtos = await this._orderQueryRepository.list();
    const userDtos = await this._userQueryRepository.list();

    const userAddressPromises: Promise<IUserAddress>[] = [];

    for (let i = 0; i < orderDtos.length; i++) {
      userAddressPromises.push(
        this._userAddressService.getUserAddressByUserAddressId(
          orderDtos[i].userId,
          orderDtos[i].userAddressId,
        ),
      );
    }

    const userAddresses = await Promise.all(userAddressPromises);

    const orders: IOrder[] = [];
    const mapper = this._automapperProvider.provide();
    for (let i = 0; i < orderDtos.length; i++) {
      const orderDto = orderDtos[i];
      const userAddress = userAddresses[i];
      const userDto = orderDto.userId
        ? userDtos.find((u) => u._id === orderDtos[i].userId)
        : null;

      const order = mapper.map<OrderDto, IOrder>(
        orderDto,
        'OrderDto',
        'IOrder',
        {
          extraArgs: () => ({ userDto, userAddress }),
        },
      );

      orders.push(order);
    }

    return orders;
  }

  async getAllOrdersByUserId(userId: string): Promise<IOrder[]> {
    const orderDtos = await this._orderQueryRepository.find({ userId });

    if (orderDtos.length === 0) {
      return [];
    }

    const userDto = await this._userQueryRepository.getById(userId);

    if (!userDto) {
      throw new ErrorWithStatusCode(
        `User with id '${userId}' not found`,
        404,
        'User not found.',
      );
    }

    const userAddressPromises: Promise<IUserAddress>[] = [];

    for (let i = 0; i < orderDtos.length; i++) {
      userAddressPromises.push(
        this._userAddressService.getUserAddressByUserAddressId(
          orderDtos[i].userId,
          orderDtos[i].userAddressId,
        ),
      );
    }

    const userAddresses = await Promise.all(userAddressPromises);

    const orders: IOrder[] = [];
    const mapper = this._automapperProvider.provide();
    for (let i = 0; i < orderDtos.length; i++) {
      const orderDto = orderDtos[i];
      const userAddress = userAddresses[i];

      const order = mapper.map<OrderDto, IOrder>(
        orderDto,
        'OrderDto',
        'IOrder',
        {
          extraArgs: () => ({ userDto, userAddress }),
        },
      );

      orders.push(order);
    }

    return orders;
  }

  async createOrder(order: IOrder): Promise<IOrder> {
    const mapper = this._automapperProvider.provide();
    const orderDto = mapper.map<IOrder, OrderDto>(order, 'IOrder', 'OrderDto');

    const newOrderId = await this._orderCommandRepository.create(orderDto);

    const createdOrder = await this.getOrderById(newOrderId);

    if (!createdOrder) {
      throw new ErrorWithStatusCode(
        `Could not locate order with id '${newOrderId}' after creation.`,
        500,
        'Order not found after creation.',
      );
    }

    return createdOrder;
  }

  async updateOrderStatus(
    orderId: string,
    orderStatus: Extract<keyof IOrderStatusEnum, string>,
  ): Promise<IOrder> {
    await this._orderCommandRepository.update(orderId, { orderStatus });

    const updatedOrder = this.getOrderById(orderId);

    if (!updatedOrder) {
      throw new ErrorWithStatusCode(
        `Could not locate order with id '${orderId}' after update.`,
        500,
        'Order not found after update.',
      );
    }

    return updatedOrder;
  }

  async updatePaymentStatus(
    orderId: string,
    checkoutSessionId: string,
    paymentStatus: Extract<keyof IPaymentStatusEnum, string>,
    paymentProvider: string,
  ): Promise<IOrder> {
    await this._orderCommandRepository.update(orderId, {
      checkoutSessionId,
      paymentStatus,
      paymentProvider,
    });

    const updatedOrder = this.getOrderById(orderId);

    if (!updatedOrder) {
      throw new ErrorWithStatusCode(
        `Could not locate order with id '${orderId}' after update.`,
        500,
        'Order not found after update.',
      );
    }

    return updatedOrder;
  }
}
