import { QueryReturnValue, getFileProperties, getFormData } from '@/lib/utils';
import { MutateProductViewModel, ProductViewModel } from '@/models';
import { QueryOptions } from '@/lib/abstractions';
import { emptyAppApi } from './emptyAppApi';

const baseUrl = 'products';

const productsApi = emptyAppApi.injectEndpoints({
  endpoints: (build) => ({
    getAllProducts: build.query<
      Array<ProductViewModel>,
      QueryOptions | undefined
    >({
      query: (queryOptions) =>
        `${baseUrl}${
          queryOptions ? `?s=${queryOptions.skip}&l=${queryOptions.limit}` : ''
        }`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: 'Products' as const,
                id: _id,
              })),
              'Products',
            ]
          : ['Products'],
    }),
    searchAllProducts: build.query<
      Array<ProductViewModel>,
      { queryString: string; queryOptions: QueryOptions | undefined }
    >({
      query: (queryStringAndQueryOptions) =>
        `${baseUrl}?q=${queryStringAndQueryOptions.queryString}${
          queryStringAndQueryOptions.queryOptions
            ? `&s=${queryStringAndQueryOptions.queryOptions.skip}&l=${queryStringAndQueryOptions.queryOptions.limit}`
            : ''
        }`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: 'Products' as const,
                id: _id,
              })),
              'Products',
            ]
          : ['Products'],
    }),
    getProductById: build.query<ProductViewModel, string>({
      query: (id) => `${baseUrl}/${id}`,
      providesTags: (result) => [{ type: 'Products', id: result?._id }],
    }),
    createProduct: build.mutation<ProductViewModel, MutateProductViewModel>({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const fileProperties = getFileProperties(arg);
        const body: FormData = getFormData(arg, fileProperties);

        const response = await baseQuery({
          url: `${baseUrl}`,
          method: 'POST',
          body,
        });

        return response as QueryReturnValue<ProductViewModel>;
      },
      invalidatesTags: (result) => ['Products'],
    }),
    editProduct: build.mutation<
      ProductViewModel,
      { productId: string; mutateProductViewModel: MutateProductViewModel }
    >({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const { productId, mutateProductViewModel } = arg;
        const fileProperties = getFileProperties(mutateProductViewModel);

        let body: FormData | any;
        const headers: any = {};
        if (
          fileProperties !== undefined &&
          fileProperties !== null &&
          fileProperties.length > 0
        ) {
          body = getFormData(mutateProductViewModel, fileProperties);
        } else {
          body = mutateProductViewModel;
        }

        const response = await baseQuery({
          url: `${baseUrl}/${productId}`,
          method: 'PATCH',
          headers,
          body,
        });

        return response as QueryReturnValue<ProductViewModel>;
      },
      invalidatesTags: (result) => [
        { type: 'Products', id: result?._id },
        'Products',
      ],
    }),
    deleteProduct: build.mutation<void, string>({
      query: (id) => ({
        url: `${baseUrl}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, originalId) => [
        { type: 'Products', id: originalId },
        'Products',
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllProductsQuery,
  useSearchAllProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useEditProductMutation,
  useDeleteProductMutation,
  util: productsApiUtil,
} = productsApi;
