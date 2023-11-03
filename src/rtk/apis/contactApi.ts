import { QueryReturnValue } from '@/lib/utils';
import { ContactRequestViewModel } from '@/models';
import { emptyAppApi } from './emptyAppApi';

const baseUrl = 'contact';

const contactApi = emptyAppApi.injectEndpoints({
  endpoints: (build) => ({
    contactUs: build.mutation<void, ContactRequestViewModel>({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const body = arg;

        // Send the request using the appropriate format
        const response = await baseQuery({
          url: `${baseUrl}`,
          method: 'POST',
          body,
        });

        // Parse and return the response
        return response as QueryReturnValue<void>;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useContactUsMutation, util: contactUsApiUtil } = contactApi;
