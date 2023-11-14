import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const emptyAppApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/`,
    fetchFn: (...args) => fetch(...args),
  }),
  tagTypes: [
    'Products',
    'Categories',
    'Orders',
    'Users',
    'Addresses',
    'PasswordProtected',
  ],
  endpoints: () => ({}),
});
