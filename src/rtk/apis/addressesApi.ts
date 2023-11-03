import { QueryReturnValue } from '@/lib/utils';
import {
  AddressViewModel,
  AllUserAddressesViewModel,
  MutateUserAddressViewModel,
  UserAddressViewModel,
} from '@/models';
import { emptyAppApi } from './emptyAppApi';

const baseUrl = 'addresses';
const currentUserBaseUrl = `${baseUrl}/currentUser`;

const addressesApi = emptyAppApi.injectEndpoints({
  endpoints: (build) => ({
    getAllAddressesForCurrentUser: build.query<AllUserAddressesViewModel, void>(
      {
        query: () => `${currentUserBaseUrl}`,
        providesTags: (result) =>
          result
            ? [
                ...result.userAddresses.map(({ address }) => ({
                  type: 'Addresses' as const,
                  id: address._id,
                })),
                'Addresses',
              ]
            : ['Addresses'],
      },
    ),
    getAddressById: build.query<AddressViewModel, string>({
      query: (id) => `${baseUrl}/${id}`,
      providesTags: (result) => [{ type: 'Addresses', id: result?._id }],
    }),
    createAddressForCurrentUser: build.mutation<
      UserAddressViewModel,
      MutateUserAddressViewModel
    >({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const body = arg;

        const response = await baseQuery({
          url: `${currentUserBaseUrl}`,
          method: 'POST',
          body,
        });

        return response as QueryReturnValue<UserAddressViewModel>;
      },
      invalidatesTags: (result) => ['Addresses'],
    }),
    editAddressForCurrentUser: build.mutation<
      UserAddressViewModel,
      MutateUserAddressViewModel
    >({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const { _id, ...argsWithoutId } = arg;

        const body: MutateUserAddressViewModel = argsWithoutId;

        const response = await baseQuery({
          url: `${currentUserBaseUrl}/${_id}`,
          method: 'PUT',
          body,
        });

        return response as QueryReturnValue<UserAddressViewModel>;
      },
      invalidatesTags: (result, error, sent) => [
        { type: 'Addresses', id: sent?.address._id },
        { type: 'Addresses', id: result?.address._id ?? '' },
        'Addresses',
        // TODO: Include user Id in payload and invalidate
      ],
    }),
    deleteAddressForCurrentUser: build.mutation<void, { _id: string }>({
      query: (deleteRequest) => ({
        url: `${currentUserBaseUrl}/${deleteRequest._id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, request) => [
        { type: 'Addresses', id: request._id },
        'Addresses',
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllAddressesForCurrentUserQuery,
  useGetAddressByIdQuery,
  useCreateAddressForCurrentUserMutation,
  useEditAddressForCurrentUserMutation,
  useDeleteAddressForCurrentUserMutation,
  util: addressesApiUtil,
} = addressesApi;
