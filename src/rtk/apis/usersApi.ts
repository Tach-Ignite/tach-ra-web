import { QueryReturnValue } from '@/lib/utils';
import {
  CreateUserViewModel,
  RequestPasswordResetViewModel,
  ResetPasswordViewModel,
  SetUserRolesViewModel,
  UserViewModel,
} from '@/models';
import { emptyAppApi } from './emptyAppApi';

const baseUrl = 'users';

const usersApi = emptyAppApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query<Array<UserViewModel>, void>({
      query: () => `${baseUrl}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: 'Users' as const,
                id: _id,
              })),
              'Users',
            ]
          : ['Users'],
    }),
    getUserById: build.query<UserViewModel, string>({
      query: (id) => `${baseUrl}/${id}`,
      providesTags: (result) => [{ type: 'Users', id: result?._id }],
    }),
    createUser: build.mutation<UserViewModel, CreateUserViewModel>({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const body = arg;

        const response = await baseQuery({
          url: `${baseUrl}`,
          method: 'POST',
          body,
        });

        return response as QueryReturnValue<UserViewModel>;
      },
      invalidatesTags: (result) => ['Users'],
    }),
    setUserRoles: build.mutation<
      UserViewModel,
      { userId: string; setUserRolesViewModel: SetUserRolesViewModel }
    >({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const { userId, setUserRolesViewModel } = arg;

        const body = setUserRolesViewModel;

        const response = await baseQuery({
          url: `${baseUrl}/${userId}`,
          method: 'PATCH',
          body,
        });

        return response as QueryReturnValue<UserViewModel>;
      },
      invalidatesTags: (result) => [
        { type: 'Users', id: result?._id },
        'Users',
      ],
    }),
    editUser: build.mutation<
      UserViewModel,
      { userId: string; setUserRolesViewModel: SetUserRolesViewModel }
    >({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const { userId, setUserRolesViewModel } = arg;
        const body = setUserRolesViewModel;

        const response = await baseQuery({
          url: `${baseUrl}/${userId}`,
          method: 'PATCH',
          body,
        });

        return response as QueryReturnValue<UserViewModel>;
      },
      invalidatesTags: (result) => [
        { type: 'Users', id: result?._id },
        'Users',
      ],
    }),
    requestPasswordReset: build.mutation<void, RequestPasswordResetViewModel>({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const headers = {
          'Content-Type': 'application/json',
        };

        const response = await baseQuery({
          url: `${baseUrl}/resetPassword`,
          method: 'POST',
          body: arg,
          headers,
        });

        return response as QueryReturnValue<void>;
      },
    }),
    resetPassword: build.mutation<void, ResetPasswordViewModel>({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const headers = {
          'Content-Type': 'application/json',
        };

        const response = await baseQuery({
          url: `${baseUrl}/resetPassword/verify`,
          method: 'POST',
          body: arg,
          headers,
        });

        return response as QueryReturnValue<void>;
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useEditUserMutation,
  useResetPasswordMutation,
  useRequestPasswordResetMutation,
  useSetUserRolesMutation,
  util: usersApiUtil,
} = usersApi;
