import { BaseSyntheticEvent, ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useForm } from 'react-hook-form';
import { ajvResolver } from '@hookform/resolvers/ajv';
import Link from 'next/link';
import { Session } from 'next-auth';
import { AdminLayout } from '@/components/admin';
import { useDeleteProductMutation, useGetProductByIdQuery } from '@/rtk';
import {
  Button,
  Input,
  ProtectedRouteLayout,
  DetailedProductListItem,
  RootLayout,
} from '@/components';
import {
  DeleteProductViewModel,
  deleteProductViewModelSchema,
  UserRolesEnum,
} from '@/models';

function DeleteProductPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string>('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [deleteProduct, deleteProductResult] = useDeleteProductMutation();
  const id = router.query.id as string;
  const deleteSchema = deleteProductViewModelSchema;

  const { data, error, isLoading } = useGetProductByIdQuery(id as string);
  useEffect(() => {
    if (error) {
      setSubmitError(JSON.stringify((error as FetchBaseQueryError)?.data));
    }
  }, [error, setSubmitError]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteProductViewModel>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: ajvResolver(deleteSchema, { $data: true }),
  });

  function onSubmitHandler(
    data: DeleteProductViewModel,
    event: BaseSyntheticEvent<object, any, any> | undefined,
  ) {
    setSendingRequest(true);
    event!.preventDefault();
    deleteProduct(id as string)
      .then((result) => {
        router.push('/admin/products');
      })
      .catch((error) => {
        setSubmitError(error.toString());
        setSendingRequest(false);
      });
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h1 className="text-xl mb-4">
        <Link
          className="hover:text-tachPurple underline underline-offset-4 duration-300"
          href="/admin/products"
        >
          Products
        </Link>{' '}
        &gt; Delete
      </h1>
      {data && <DetailedProductListItem product={data} />}
      <form>
        <Input
          name="confirmationMessage"
          label='Type "permanently delete" to confirm:'
          placeholder="permanently delete"
          type="text"
          className="mb-6"
          required
          register={register}
          errorMessage={
            errors.confirmationMessage && errors.confirmationMessage.message
          }
        />
        <Button
          className="bg-red-600"
          onClick={handleSubmit(onSubmitHandler)}
          isLoading={sendingRequest}
        >
          Delete
        </Button>
        <div className="text-red-600">{submitError}</div>
        <div className="text-red-600">
          {(error as FetchBaseQueryError)?.status}{' '}
          {JSON.stringify((error as FetchBaseQueryError)?.data)}
        </div>
        <div className="text-red-600">{errors.root && errors.root.message}</div>
      </form>
    </div>
  );
}

DeleteProductPage.getLayout = function getLayout(
  page: ReactElement,
  session: Session,
) {
  return (
    <RootLayout session={session}>
      <ProtectedRouteLayout allowedRole={UserRolesEnum.Admin}>
        <AdminLayout>{page}</AdminLayout>
      </ProtectedRouteLayout>
    </RootLayout>
  );
};

export default DeleteProductPage;
