import { ajvResolver } from '@hookform/resolvers/ajv';
import { useRouter } from 'next/router';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiOutlineTrash } from 'react-icons/hi2';
import { Session } from 'next-auth';
import { AdminLayout } from '@/components/admin';
import {
  Button,
  ChipContainer,
  Input,
  ProtectedRouteLayout,
  RootLayout,
} from '@/components';
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
} from '@/rtk';
import {
  MutateCategoryPropertyViewModel,
  MutateCategoryViewModel,
  mutateCategoryViewModelSchema,
  UserRolesEnum,
} from '@/models';

function CategoriesPage() {
  const NO_PARENT_CONST = '-1';
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [chips, setChips] = useState<string[]>([]);
  const { data: categories, error, isLoading } = useGetAllCategoriesQuery();
  if (error) {
    setSubmitError(error.toString());
  }
  const [createCategory, createCategoryResult] = useCreateCategoryMutation();
  const [deleteCategory, deleteCategoryResult] = useDeleteCategoryMutation();
  const [categoryProperties, setCategoryProperties] = useState<
    MutateCategoryPropertyViewModel[] | undefined
  >([]);

  const setChipsInternal = useCallback(() => {
    setChips(
      categories?.map(
        (category) =>
          `${category.parent ? `${category.parent!.name} > ` : ''}${
            category.name
          }`,
      ) || [],
    );
  }, [setChips, categories]);

  useEffect(() => {
    if (!isLoading && chips.length === 0) {
      setChipsInternal();
    }
  }, [categories, isLoading, chips, setChipsInternal]);

  const setChipsCallback = useCallback(() => {
    setChipsInternal();
  }, [setChipsInternal]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<MutateCategoryViewModel>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: ajvResolver(mutateCategoryViewModelSchema, { $data: true }),
  });

  useEffect(() => {
    register('categoryProperties');
  }, [register]);

  function onSubmitHandler(form: MutateCategoryViewModel, event: any) {
    setSendingRequest(true);
    event.preventDefault();
    if (form.parentId === NO_PARENT_CONST) {
      form.parentId = undefined;
    }
    createCategory(form)
      .then((result) => {
        if ((result as any).error) {
          setChipsCallback();
          setSuccessMessage('');
          setSubmitError((result as any).error.data.errors[0]);
        } else {
          setSubmitError('');
          reset();
          setCategoryProperties(undefined);
          setSuccessMessage(`Category ${form.name} created!`);
        }
        setSendingRequest(false);
      })
      .catch((error) => {
        setChipsCallback();
        setSuccessMessage('');
        setSubmitError(error.message);
        setSendingRequest(false);
      });
  }

  const onDeletedHandler = useCallback(
    (value: string) => {
      let name = value;
      let parent: string;
      if (value.includes('>')) {
        [parent, name] = value.split(' > ');
      }

      const id = categories?.find((category) => category.name === name)?._id;

      if (!id) {
        setSuccessMessage('');
        setSubmitError(`Category '${value}' was not found.`);
        return;
      }

      deleteCategory(id!)
        .then((result) => {
          if ((result as any).error) {
            setSuccessMessage('');
            setSubmitError((result as any).error.data.errors[0]);
          } else {
            setSubmitError('');
            setValue('name', '');
            setSuccessMessage(`Category ${value} deleted!`);
          }
          setSendingRequest(false);
        })
        .catch((error) => {
          setSuccessMessage('');
          setSubmitError(error.message);
          setSendingRequest(false);
        });
    },
    [
      categories,
      setSuccessMessage,
      setSubmitError,
      setSendingRequest,
      setValue,
      deleteCategory,
    ],
  );

  const onEditClickedHandler = useCallback(
    (value: string) => {
      let name = value;
      let parent: string;
      if (value.includes('>')) {
        [parent, name] = value.split(' > ');
      }

      const id = categories?.find((category) => category.name === name)?._id;
      if (!id) {
        setSuccessMessage('');
        setSubmitError(`Category '${value}' was not found.`);
        return;
      }
      router.push(`/admin/categories/${id}`);
    },
    [categories, setSubmitError, setSuccessMessage, router],
  );

  const addCategoryPropertyHandler = useCallback(() => {
    const tempId = Date.now().toString();
    setCategoryProperties((prev: any) => {
      if (!prev) {
        return [{ _id: tempId, name: '', values: '' }];
      }
      return [...prev, { _id: tempId, name: '', values: '' }];
    });
  }, [setCategoryProperties]);
  function categoryPropertyNameChangeHandler(newName: string, index: number) {
    setCategoryProperties((prev: any) => {
      const properties = [...prev];
      properties[index].name = newName;
      setValue('categoryProperties', properties);
      return properties;
    });
  }
  function categoryPropertyValuesChangeHandler(
    newValues: string,
    index: number,
  ) {
    setCategoryProperties((prev: any) => {
      const properties = [...prev];
      properties[index].values = newValues;
      setValue('categoryProperties', properties);
      return properties;
    });
  }
  function removeCategoryPropertyHandler(indexToRemove: number) {
    setCategoryProperties((prev: any) => {
      const properties = [...prev].filter(
        (p, pIndex) => pIndex !== indexToRemove,
      );
      setValue('categoryProperties', properties);
      return properties;
    });
  }

  return (
    <>
      <h1 className="text-xl mb-4">Categories</h1>
      <div className="mb-4">
        <form>
          <div className="flex gap-3 items-center">
            <Input
              name="name"
              label="Name"
              type="text"
              className="basis-1/3"
              required
              register={register}
              errorMessage={errors.name && errors.name.message}
            />
            <select
              className="border-tachGrey outline-none focus-visible:border-tachLime border basis-1/3 rounded py-1 px-1.5 transition duration-300"
              {...register('parentId')}
            >
              <option value={NO_PARENT_CONST}>No parent category</option>
              {categories &&
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
            <Button
              onClick={addCategoryPropertyHandler}
              type="button"
              className="h-10 text-sm bg-tachGrey font-normal hover:bg-tachPurple text-white"
            >
              Add Property
            </Button>
          </div>
          <div>
            {categoryProperties &&
              categoryProperties.map((property, index) => (
                <div
                  className="flex gap-3 mt-3 items-center justify-center"
                  key={property._id}
                >
                  <div className="">
                    <Input
                      type="text"
                      register={() => {}}
                      value={property.name}
                      onChange={(e: any) =>
                        categoryPropertyNameChangeHandler(e.target.value, index)
                      }
                      placeholder="Colors"
                    />
                  </div>
                  <div className="flex-grow">
                    <Input
                      type="text"
                      register={() => {}}
                      value={property.values}
                      onChange={(e) =>
                        categoryPropertyValuesChangeHandler(
                          e.target.value,
                          index,
                        )
                      }
                      placeholder="Red,Green,Blue"
                    />
                  </div>
                  <div className="mb-5">
                    <Button
                      type="button"
                      className="py-1 text-sm bg-red-600 font-normal"
                      beforeIcon={<HiOutlineTrash className="w-5 h-5" />}
                      onClick={() => removeCategoryPropertyHandler(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3 my-3">
            <Button
              type="submit"
              onClick={handleSubmit(onSubmitHandler)}
              isLoading={sendingRequest}
            >
              Create Category
            </Button>

            <div className="text-green-600">{successMessage}</div>
            <div className="text-red-600">{submitError}</div>
          </div>
        </form>
      </div>
      <ChipContainer
        deletable
        editable
        editType="button"
        onDeleted={onDeletedHandler}
        onEditClicked={onEditClickedHandler}
        chips={chips}
      />
    </>
  );
}

CategoriesPage.getLayout = function getLayout(
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

export default CategoriesPage;
