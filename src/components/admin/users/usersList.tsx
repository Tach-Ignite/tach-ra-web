import Link from 'next/link';
import { HiOutlinePencil } from 'react-icons/hi2';
import { UserViewModel } from '@/models';

export type UsersListProps = {
  users: UserViewModel[];
};

export function UsersList({ users }: UsersListProps) {
  const labelClassname = 'text-tachGrey text-xs ';
  const fieldGroupClassname = 'flex flex-col justify-center flex-wrap';
  const linkClassname =
    'flex hover:text-tachPurple duration-300 underline underline-offset-4 xl:mt-10';
  const dataClassName = 'xl:h-6 text-sm';
  return (
    <div className="md:grid sm:grid-cols-2 xl:block md:gap-3">
      {users.map((user) => {
        const { _id, name, email, emailVerified, image, roles } = user;
        return (
          <div
            key={_id}
            className="border border-tachGrey rounded px-4 py-3 mt-4 shadow-md"
          >
            <div className="grid grid-cols-1 xl:grid-cols-6 gap-3 text-base">
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
                <p className={dataClassName}>
                  {emailVerified?.toLocaleString()}
                </p>
              </div>
              <div className={fieldGroupClassname}>
                <p className={labelClassname}>Roles</p>
                <p className={dataClassName}>{roles?.join(', ')}</p>
              </div>
              <Link className={linkClassname} href={`/admin/users/edit/${_id}`}>
                <HiOutlinePencil className="w-5 h-5 mr-1" />
                Edit
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
