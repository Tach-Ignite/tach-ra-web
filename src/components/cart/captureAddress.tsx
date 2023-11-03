import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ajvResolver } from '@hookform/resolvers/ajv';
import { HiOutlinePencil, HiOutlineTrash, HiPlus } from 'react-icons/hi';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useCreateAddressForCurrentUserMutation,
  useDeleteAddressForCurrentUserMutation,
  useEditAddressForCurrentUserMutation,
  useGetAllAddressesForCurrentUserQuery,
  RootState,
  setUserAddress,
} from '@/rtk';
import { CountryCodeEnum } from '@/lib/enums';
import {
  MutateUserAddressViewModel,
  UserAddressViewModel,
  mutateUserAddressViewModelSchema,
} from '@/models';
import { Button, Input } from '../ui';

export function CaptureAddress() {
  const { data: session, status } = useSession();
  const { data, isLoading, refetch } = useGetAllAddressesForCurrentUserQuery(
    undefined,
    {
      skip: status !== 'authenticated',
    },
  );
  const [saveAddress, saveAddressResult] =
    useCreateAddressForCurrentUserMutation();
  const [editAddress, editAddressResult] =
    useEditAddressForCurrentUserMutation();
  const [deleteAddress, deleteAddressResult] =
    useDeleteAddressForCurrentUserMutation();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { userAddress } = useSelector((state: RootState) => state.userAddress);
  const [submitError, setSubmitError] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (session && status === 'authenticated') {
      refetch();
    }
  }, [session, status, refetch]);

  useEffect(() => {
    if (data) {
      let sa = data.userAddresses?.find(
        (address) => address._id === data.defaultUserAddressId,
      );
      if (!sa && data.userAddresses?.length > 0) {
        [sa] = data.userAddresses;
      }
      if (sa) {
        dispatch(setUserAddress(sa));
      }
    }
  }, [data, dispatch]);

  const { register, handleSubmit, reset } = useForm<MutateUserAddressViewModel>(
    {
      mode: 'onChange',
      reValidateMode: 'onChange',
      resolver: ajvResolver(mutateUserAddressViewModelSchema, { $data: true }),
      defaultValues: {
        setAsDefault: false,
      },
    },
  );

  function addressToString(userAddress: UserAddressViewModel) {
    return `${userAddress.recipientName}, ${userAddress.address.lineOne}, ${
      userAddress.address.lineTwo ? `${userAddress.address.lineTwo},` : ''
    } ${userAddress.address.city}, ${userAddress.address.state}, ${
      userAddress.address.postalCode
    } ${userAddress.address.country}`;
  }

  function changeHandler(event: React.ChangeEvent<HTMLSelectElement>) {
    if (!data) {
      return;
    }
    const sa = data.userAddresses[event.target.selectedIndex];

    if (sa) {
      dispatch(setUserAddress(sa));
    }
  }

  const handleAddAddressClick = useCallback(() => {
    reset({}, { keepValues: false });
    if (!showAddressForm) {
      setShowAddressForm(true);
    }
  }, [reset, showAddressForm, setShowAddressForm]);

  const handleEditAddressClick = useCallback(() => {
    if (!userAddress) return;
    reset(
      {
        ...userAddress,
        setAsDefault: userAddress._id === data?.defaultUserAddressId,
      },
      { keepValues: false },
    );
    setShowAddressForm(true);
    setIsEditing(true);
  }, [userAddress, setShowAddressForm, setIsEditing, data, reset]);

  const handleDeleteAddressClick = useCallback(() => {
    if (!userAddress) return;
    const response = confirm('Are you sure you want to delete this address?');
    if (response) {
      deleteAddress({
        _id: userAddress._id!,
      })
        .then((result) => {
          if (!(result as any).error) {
            if (data?.defaultUserAddressId === userAddress._id) {
              dispatch(setUserAddress(undefined));
            }
          } else throw new Error((result as any).error.message);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userAddress, deleteAddress, dispatch, data]);

  const handleCancelClick = useCallback(() => {
    reset({}, { keepValues: false });
    setShowAddressForm(false);
    setIsEditing(false);
    setSubmitError('');
  }, [reset, setShowAddressForm, setIsEditing, setSubmitError]);

  const handleSaveAddressClick = useCallback(
    (data: MutateUserAddressViewModel, event: any) => {
      event.preventDefault();
      setSendingRequest(true);
      if (isEditing) {
        editAddress({
          _id: userAddress!._id,
          ...data,
        } as MutateUserAddressViewModel)
          .then((result) => {
            if (!(result as any).error) {
              reset();
              setShowAddressForm(false);
              setIsEditing(false);
              setSendingRequest(false);
              setSubmitError('');
            } else {
              setSendingRequest(false);
              setSubmitError((result as any).error.data);
            }
          })
          .catch((error) => {
            console.log(error);
            setSendingRequest(false);
            setSubmitError(error);
          });
      } else {
        saveAddress(data)
          .then((result) => {
            if (!(result as any).error) {
              reset();
              setShowAddressForm(false);
              setIsEditing(false);
              setSendingRequest(false);
              setSubmitError('');
            } else {
              setSendingRequest(false);
              setSubmitError((result as any).error.data);
            }
          })
          .catch((error) => {
            console.log(error);
            setSendingRequest(false);
            setSubmitError(error);
          });
      }
    },
    [
      setSendingRequest,
      reset,
      setShowAddressForm,
      setIsEditing,
      isEditing,
      saveAddress,
      editAddress,
      userAddress,
      setSubmitError,
    ],
  );

  return (
    <>
      <h1 className="text-lg font-semibold">Ship To: </h1>
      {isLoading && <p>Loading...</p>}
      {data && (
        <>
          {!showAddressForm && (
            <>
              {userAddress && (
                <div className="text-sm text-tachGrey">
                  <p>{userAddress.recipientName}</p>
                  <p>{userAddress.address.lineOne}</p>
                  {userAddress.address.lineTwo &&
                    userAddress.address.lineTwo !== '' && (
                      <p>{userAddress.address.lineTwo}</p>
                    )}
                  <p>
                    {userAddress.address.city}, {userAddress.address.state}{' '}
                    {userAddress.address.postalCode}
                  </p>
                  <p>{CountryCodeEnum[userAddress.address.country]}</p>
                </div>
              )}

              <select
                className="w-full h-10 border border-gray-300 rounded px-2"
                onChange={changeHandler}
                value={userAddress?._id}
              >
                {data.userAddresses?.map((address) => (
                  <option key={address._id} value={address._id}>
                    {addressToString(address)}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <Button
                  type="button"
                  className=" basis-1/2"
                  onClick={handleAddAddressClick}
                  beforeIcon={<HiPlus />}
                />
                <Button
                  type="submit"
                  className="flex gap-3 basis-1/2"
                  onClick={handleEditAddressClick}
                  beforeIcon={<HiOutlinePencil />}
                  disabled={userAddress === undefined}
                />
                <Button
                  type="button"
                  className=" basis-1/2"
                  onClick={handleDeleteAddressClick}
                  beforeIcon={<HiOutlineTrash />}
                  disabled={userAddress === undefined}
                />
              </div>
            </>
          )}
          {showAddressForm && (
            <form>
              <Input
                required
                label="Recipient Name"
                name="recipientName"
                placeholder="Thomas Edison"
                register={register}
              />
              <Input
                required
                label="Line One"
                name="address.lineOne"
                placeholder="123 Main Street"
                register={register}
              />
              <Input
                label="Line Two"
                name="address.lineTwo"
                placeholder="Suite 404"
                register={register}
              />
              <Input
                required
                label="City"
                name="address.city"
                placeholder="Chicago"
                register={register}
              />
              <div className="flex gap-3">
                <Input
                  required
                  className="basis-3/5"
                  label="State"
                  name="address.state"
                  placeholder="Illinois"
                  register={register}
                />
                <Input
                  required
                  className="basis-2/5"
                  label="Postal Code"
                  name="address.postalCode"
                  placeholder="60613"
                  register={register}
                />
              </div>
              <label
                className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm text-gray-600 dark:text-gray-400"
                htmlFor="country"
              >
                Country
              </label>
              <select
                required
                {...register('address.country')}
                className="max-w-xs border-gray-300 outline-none focus-visible:border-tachLime border rounded py-1 px-1.5 transition duration-300 w-full mb-4"
              >
                {CountryCodeEnum._keys.map((key) => (
                  <option key={key} value={key}>
                    {CountryCodeEnum[key]}
                  </option>
                ))}
              </select>
              <Input
                type="checkbox"
                name="setAsDefault"
                register={register}
                label="Set as Default Address"
              />
              <Button
                className="bg-tachGreen mt-4 w-full h-10"
                onClick={handleSubmit(handleSaveAddressClick)}
                isLoading={sendingRequest}
              >
                Save Address
              </Button>
              <Button
                className="mt-4 w-full h-10"
                onClick={handleCancelClick}
                isLoading={sendingRequest}
              >
                Cancel
              </Button>
              <div className="text-red-500 mt-2">{submitError}</div>
            </form>
          )}
        </>
      )}
    </>
  );
}
