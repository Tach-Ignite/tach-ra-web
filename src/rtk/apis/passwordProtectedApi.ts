import { QueryReturnValue } from '@/lib/utils';
import { emptyAppApi } from './emptyAppApi';

const baseUrl = 'passwordProtected';

const passwordProtectedApi = emptyAppApi.injectEndpoints({
  endpoints: (build) => ({
    authenticate: build.mutation<void, { username: string; password: string }>({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const body = arg;

        const response = await baseQuery({
          url: `${baseUrl}`,
          method: 'POST',
          body,
        });

        return response as QueryReturnValue<void>;
      },
      invalidatesTags: ['PasswordProtected'],
    }),
    validateToken: build.query<{ valid: boolean }, void>({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const response = await baseQuery({
          url: `${baseUrl}/validateToken`,
          method: 'GET',
        });

        return response as QueryReturnValue<{ valid: boolean }>;
      },
      providesTags: ['PasswordProtected'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAuthenticateMutation,
  useValidateTokenQuery,
  util: passwordProtectedApiUtil,
} = passwordProtectedApi;
