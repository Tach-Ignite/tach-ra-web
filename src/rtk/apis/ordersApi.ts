import { QueryReturnValue } from '@/lib/utils';
import { OrderViewModel, UpdateOrderStatusViewModel } from '@/models';
import { emptyAppApi } from './emptyAppApi';

const baseUrl = 'orders';

const ordersApi = emptyAppApi.injectEndpoints({
  endpoints: (build) => ({
    getAllOrders: build.query<Array<OrderViewModel>, void>({
      query: () => `${baseUrl}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: 'Orders' as const,
                id: _id,
              })),
              'Orders',
            ]
          : ['Orders'],
    }),
    getOrderById: build.query<OrderViewModel, string>({
      query: (id) => `${baseUrl}/${id}`,
      providesTags: (result) => [{ type: 'Orders', id: result?._id }],
    }),
    editOrder: build.mutation<
      OrderViewModel,
      {
        orderId: string;
        updateOrderStatusViewModel: UpdateOrderStatusViewModel;
      }
    >({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const { orderId, updateOrderStatusViewModel } = arg;
        const body = updateOrderStatusViewModel;

        const response = await baseQuery({
          url: `${baseUrl}/${orderId}`,
          method: 'PATCH',
          body,
        });

        return response as QueryReturnValue<OrderViewModel>;
      },
      invalidatesTags: (result) => [
        { type: 'Orders', id: result?._id },
        'Orders',
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useEditOrderMutation, util: ordersApiUtil } = ordersApi;
