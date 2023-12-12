import { QueryReturnValue } from '@/lib/utils';
import { emptyAppApi } from './emptyAppApi';
import { AddUserToInterestListViewModel } from '@/models/viewModels/interestLists';

const baseUrl = 'interestLists';

const interestListsApi = emptyAppApi.injectEndpoints({
  endpoints: (build) => ({
    addUserToInterestList: build.mutation<void, AddUserToInterestListViewModel>(
      {
        queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
          const body = arg;

          // Send the request using the appropriate format
          const response = await baseQuery({
            url: `${baseUrl}/items`,
            method: 'POST',
            body,
          });

          // Parse and return the response
          return response as QueryReturnValue<void>;
        },
      },
    ),
  }),
  overrideExisting: false,
});

export const { useAddUserToInterestListMutation, util: interestListsApiUtil } =
  interestListsApi;
