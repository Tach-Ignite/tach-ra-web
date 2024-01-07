import { ajvResolver } from '@hookform/resolvers/ajv';
import { BaseSyntheticEvent, ReactElement, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import { Session } from 'next-auth';
import { AdminLayout } from '@/components/admin';
import {
  Button,
  ChipSelector,
  ProtectedRouteLayout,
  RootLayout,
} from '@/components';
import { useSetUserRolesMutation } from '@/rtk';
import { IMapper, IProvider, IServerIdentity } from '@/lib/abstractions';
import { IUserService } from '@/abstractions';
import {
  IUser,
  SetUserRolesViewModel,
  UserViewModel,
  setUserRolesViewModelSchema,
  UserRolesEnum,
} from '@/models';
import '@/mappingProfiles/pages/admin/users/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { AdminUsersModule } from '@/modules/pages/admin/users/adminUsers.module';

type SetUserRolesAdminPageProps = {
  user: UserViewModel;
};

function SetUserRolesAdminPage({ user }: SetUserRolesAdminPageProps) {
  const { _id, name, email, emailVerified, image } = user;

  const [submitError, setSubmitError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [setUserRoles, setUserRolesResult] = useSetUserRolesMutation();

  const labelClassname = 'text-tachGrey text-sm mb-1';
  const fieldGroupClassname = 'flex flex-col justify-center flex-wrap';
  const dataClassName = 'xl:h-16 text-sm';

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SetUserRolesViewModel>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: ajvResolver(setUserRolesViewModelSchema, { $data: true }),
    defaultValues: {
      roles: user.roles,
    },
  });

  function onSubmitHandler(
    data: SetUserRolesViewModel,
    event: BaseSyntheticEvent<object, any, any> | undefined,
  ) {
    event!.preventDefault();
    setSendingRequest(true);
    setUserRoles({ userId: _id, setUserRolesViewModel: data })
      .then((result: any) => {
        if (result.error) {
          setSubmitError(result.data.message);
          setSendingRequest(false);
          return;
        }
        setSuccessMessage(
          `User roles updated at ${new Date().toLocaleString()}`,
        );
        setSendingRequest(false);
      })
      .catch((error: any) => {
        setSubmitError(error.toString());
        setSendingRequest(false);
      });
  }

  return (
    <>
      <h1 className="text-xl mb-4">
        <Link
          href="/admin/users"
          className="hover:text-tachPurple duration-300 underline underline-offset-4"
        >
          Users
        </Link>{' '}
        &gt; Edit
      </h1>
      <div>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-3 text-base">
          {image ? (
            <img
              src={image ?? ''}
              alt={name ?? 'User Image'}
              width={100}
              height={100}
              className="object-cover self-center w-[100px] h-[100px] flex-none  rounded"
            />
          ) : (
            <div className="w-[100px] h-[100px] flex justify-center items-center text-xl text-tachGrey  rounded">
              No Image
            </div>
          )}
          <div className={`${fieldGroupClassname}`}>
            <p className={labelClassname}>Name</p>
            <p className={dataClassName}>{name}</p>
          </div>
          <div className={fieldGroupClassname}>
            <p className={labelClassname}>Email</p>
            <p className={dataClassName}>{email}</p>
          </div>
          <div className={fieldGroupClassname}>
            <p className={labelClassname}>Email Verified Date</p>
            <p className={dataClassName}>{emailVerified?.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <form>
          <div className={fieldGroupClassname}>
            <Controller
              control={control}
              name="roles"
              render={({ field: { value, onChange } }) => (
                <ChipSelector
                  value={value}
                  initValue={value}
                  onChange={onChange}
                  $enum={UserRolesEnum}
                  label="User Roles"
                  required
                  deletable
                  errorMessage={errors.roles && errors.roles.message}
                />
              )}
            />
          </div>
          <Button
            className="bg-orange-600 mt-4"
            onClick={handleSubmit(onSubmitHandler)}
            isLoading={sendingRequest}
          >
            Save Changes
          </Button>
          <div className="text-green-600">{successMessage}</div>
          <div className="text-red-600">{submitError}</div>
          <div className="text-red-600">{errors.root?.message}</div>
        </form>
      </div>
    </>
  );
}

SetUserRolesAdminPage.getLayout = function getLayout(
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

export async function getServerSideProps({ query, req, res }: any) {
  try {
    const m = new ModuleResolver().resolve(AdminUsersModule);
    const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');

    const userIsAdmin = await serverIdentity.userHasRole(
      req,
      res,
      UserRolesEnum.reverseLookup(UserRolesEnum.Admin),
    );

    if (!userIsAdmin) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const userService = m.resolve<IUserService>('userService');
    const automapperProvider =
      m.resolve<IProvider<IMapper>>('automapperProvider');

    const user = await userService.getUserById(query.id);

    const mapper = automapperProvider.provide();

    const userViewModel = mapper.map<IUser, UserViewModel>(
      user,
      'IUser',
      'UserViewModel',
    );

    const cleansedUserViewModel = JSON.parse(
      JSON.stringify(userViewModel),
    ) as UserViewModel[];

    return {
      props: { user: cleansedUserViewModel },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
}

export default SetUserRolesAdminPage;
