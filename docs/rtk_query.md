# RTK Query

RTK Query is a data fetching and caching library built on top of Redux Toolkit. To learn more, see the [official documentation](https://redux-toolkit.js.org/rtk-query/overview). The RA utilizes RTK Query to handle all data fetching and caching _on the client_. This section will walk through how to use RTK Query in your application.

## API Design

Each application will need to create its own RTK Query API implementation. The patterns provided in the sample application should be followed. Most notably, the API should be split into multiple files: The core empty app api utilizing `createApi` (in our sample application, `emptyAppApi.ts`) and a file for each set of related endpoints utilizing `injectEndpoints`.

```typescript
// emptyAppApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const emptyAppApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/`,
    fetchFn: (...args) => fetch(...args),
  }),
  tagTypes: ['Products'],
  endpoints: () => ({}),
});

// productsApi.ts
...
import { emptyAppApi } from './emptyAppApi';

const baseUrl = 'products';

const productsApi = emptyAppApi.injectEndpoints({
  endpoints: (build) => ({
    getAllProducts: build.query<ProductViewModel[], void>({
      query: () => {
        return `${baseUrl}`;
      },
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
    ...
  });

  export const {
  useGetAllProductsQuery,
  ...
} = productsApi;
```

## Query Utils

The RA provides a few utilities to assist in parsing and properly forming requests to the api. You will see the following import in `productsApi.ts`:

```typescript
import { QueryReturnValue, getFileProperties, getFormData } from '@/lib/utils';
```

These utilities are especially useful when creating custom queryFn implementations, as is the case in the mutation endpoints of `productsApi.ts`:

```typescript
const productsApi = emptyAppApi.injectEndpoints({
  endpoints: (build) => ({
    ...
    createProduct: build.mutation<
        CreateProductApiResponse,
        CreateProductForm
        >({
        queryFn: async (arg, baseQueryApi, extraOptions, baseQuery) => {
            const fileProperties = getFileProperties(arg);
            let body: FormData = getFormData(arg, fileProperties);

            // Send the request using the appropriate format
            const response = await baseQuery({
            url: `${baseUrl}`,
            method: 'POST',
            body,
            });

            // Parse and return the response
            return response as QueryReturnValue<MutateProductViewModel>;
        },
        invalidatesTags: (result) => ['Products'],
        }),
    ...
  });
```

The `getFileProperties` function will extract file properties. The `getFormData` function will create a FormData object from the args, including proper formation of any files included in the args. Finally, the `QueryReturnValue` type is used to properly type the response from the api.

## Tagging

Note in the examples above the pattern used to manage tagging. Tagging is used to identify cached requests as well as invalidate the cache when data is mutated. In queries, we utilize the `providesTags` property to manage tags. In mutations, we utilize the `invalidatesTags` property to manage tags. In `emptyAppApi.ts`, we've defined `tagTypes` with an array including `Products`. For more information on tagging, see the [official documentation](https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#cache-tags).

## Client-Side Data Fetching

To utilize these API endpoints within a client component is straight-forward utilizing the hooks created by RTK Query:

```typescript
import { useCreateProductMutation } from '@/rtk';

export function Page() {
  const [createProduct, createProductResult] = useCreateProductMutation();
  const SubmitHandler(data: MutateProductViewModel) {
    createProduct(data).then((result) => {
      // Handle result
    });
  }
  ...
}
```

## Server-Side Data Fetching - APP ROUTER ONLY

Unfortunately, RTK Query is not mature enough to be used with the app router. Managing the cache on the server side is particularly tricky. As such, for server-side data fetching, we utilize the out-of-the-box `fetch` function provided by Nextjs.

```typescript
async function Page() {
  let products: ProductViewModel[];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      next: { tags: ['Products'] },
    });
    products = await response.json();
  } catch (error) {
    notFound();
    return <></>;
  }

  ...
}
```

The `fetch` call has been wrapped in a try/catch because otherwise it will fail at build time (This also allows the page to fail gracefully if the api is unavailable). This failure is due to local apis being unavailable at build time. The unfortunate side-effect of this is that pre-rendered pages will always be rendered as 404s.
