import { QueryReturnValue } from '@/lib/utils';
import { CategoryViewModel, MutateCategoryViewModel } from '@/models';
import { emptyAppApi } from './emptyAppApi';

const baseUrl = 'categories';

const categoriesApi = emptyAppApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCategories: build.query<Array<CategoryViewModel>, void>({
      query: () => `${baseUrl}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: 'Categories' as const,
                id: _id,
              })),
              'Categories',
            ]
          : ['Categories'],
    }),
    getCategoryById: build.query<CategoryViewModel, string>({
      query: (id) => `${baseUrl}/${id}`,
      providesTags: (result) => [{ type: 'Categories', id: result?._id }],
    }),
    createCategory: build.mutation<CategoryViewModel, MutateCategoryViewModel>({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const body = arg;

        const response = await baseQuery({
          url: `${baseUrl}`,
          method: 'POST',
          body,
        });

        return response as QueryReturnValue<CategoryViewModel>;
      },
      invalidatesTags: (result) => ['Categories'],
    }),
    editCategory: build.mutation<
      CategoryViewModel,
      { categoryId: string; mutateCategoryViewModel: MutateCategoryViewModel }
    >({
      queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
        const { categoryId, mutateCategoryViewModel } = arg;
        const headers = {
          'Content-Type': 'application/json',
        };

        const body = mutateCategoryViewModel;

        const response = await baseQuery({
          url: `${baseUrl}/${categoryId}`,
          method: 'PATCH',
          body,
          headers,
        });

        return response as QueryReturnValue<CategoryViewModel>;
      },
      invalidatesTags: (result) => [
        { type: 'Categories', id: result?._id },
        'Categories',
      ],
    }),
    deleteCategory: build.mutation<void, string>({
      query: (id) => ({
        url: `${baseUrl}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, deletedId) => [
        { type: 'Categories', id: deletedId },
        'Categories',
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
  util: categoriesApiUtil,
} = categoriesApi;
