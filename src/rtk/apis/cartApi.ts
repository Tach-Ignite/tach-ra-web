import { QueryReturnValue } from '@/lib/utils';
import {
  AddItemToCartViewModel,
  CartViewModel,
  DecreaseCartItemQuantityViewModel,
  IncreaseCartItemQuantityViewModel,
  RemoveItemFromCartViewModel,
  SetCartItemQuantityViewModel,
} from '@/models';
import { emptyAppApi } from './emptyAppApi';

const baseUrl = 'myAccount/cart';

const cartsApi = emptyAppApi.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query<CartViewModel, void>({
      query: (queryOptions) => `${baseUrl}`,
      providesTags: (result) => ['Cart'],
    }),
    addItemToCart: build.mutation<CartViewModel, AddItemToCartViewModel>({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const response = await baseQuery({
          url: `${baseUrl}/items`,
          method: 'POST',
          body: arg,
        });

        return response as QueryReturnValue<CartViewModel>;
      },
      invalidatesTags: (result) => ['Cart'],
    }),
    removeItemFromCart: build.mutation<
      CartViewModel,
      RemoveItemFromCartViewModel
    >({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const response = await baseQuery({
          url: `${baseUrl}/items/${arg.productId}`,
          method: 'DELETE',
          body: arg,
        });

        return response as QueryReturnValue<CartViewModel>;
      },
      invalidatesTags: (result) => ['Cart'],
    }),
    increaseCartItemQuantity: build.mutation<
      CartViewModel,
      IncreaseCartItemQuantityViewModel
    >({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const response = await baseQuery({
          url: `${baseUrl}/items/${arg.productId}/increaseQuantity`,
          method: 'PUT',
          body: arg,
        });

        return response as QueryReturnValue<CartViewModel>;
      },
      invalidatesTags: (result) => ['Cart'],
    }),
    decreaseCartItemQuantity: build.mutation<
      CartViewModel,
      DecreaseCartItemQuantityViewModel
    >({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const response = await baseQuery({
          url: `${baseUrl}/items/${arg.productId}/decreaseQuantity`,
          method: 'PUT',
          body: arg,
        });

        return response as QueryReturnValue<CartViewModel>;
      },
      invalidatesTags: (result) => ['Cart'],
    }),
    setCartItemQuantity: build.mutation<
      CartViewModel,
      SetCartItemQuantityViewModel
    >({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const response = await baseQuery({
          url: `${baseUrl}/items/${arg.productId}/setQuantity`,
          method: 'PUT',
          body: arg,
        });

        return response as QueryReturnValue<CartViewModel>;
      },
      invalidatesTags: (result) => ['Cart'],
    }),
    clearCart: build.mutation<CartViewModel, void>({
      query: (id) => ({
        url: `${baseUrl}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, originalId) => ['Cart'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCartQuery,
  useAddItemToCartMutation,
  useRemoveItemFromCartMutation,
  useIncreaseCartItemQuantityMutation,
  useDecreaseCartItemQuantityMutation,
  useSetCartItemQuantityMutation,
  useClearCartMutation,
  util: cartsApiUtil,
} = cartsApi;
