import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapWithArguments,
} from '@jersmart/automapper-core';
import {
  ILineItem,
  IPriceData,
  IProductData,
  ITachMappingProfile,
} from '@/lib/abstractions';
import {
  IOrder,
  LineItemViewModel,
  OrderViewModel,
  PriceDataViewModel,
  ProductDataViewModel,
  UpdateOrderStatusCommandPayload,
  UpdateOrderStatusViewModel,
} from '@/models';
import { TachMappingProfileClass, forMemberId } from '@/lib/mapping';
import '../addresses/currentUser/mappingProfile';
import '../users/mappingProfile';

@TachMappingProfileClass('pages/api/orders/[id]/mappingProfile')
export class OrderApiIdMappingProfile implements ITachMappingProfile {
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<IProductData, ProductDataViewModel>(
        mapper,
        'IProductData',
        'ProductDataViewModel',
      );
      createMap<IPriceData, PriceDataViewModel>(
        mapper,
        'IPriceData',
        'PriceDataViewModel',
      );
      createMap<ILineItem, LineItemViewModel>(
        mapper,
        'ILineItem',
        'LineItemViewModel',
      );
      createMap<UpdateOrderStatusViewModel, UpdateOrderStatusCommandPayload>(
        mapper,
        'UpdateOrderStatusViewModel',
        'UpdateOrderStatusCommandPayload',
        forMember(
          (d) => d.orderId,
          mapWithArguments((s, { orderId }) => orderId),
        ),
      );
      createMap<IOrder, OrderViewModel>(
        mapper,
        'IOrder',
        'OrderViewModel',
        forMemberId,
      );
    };
  }
}
