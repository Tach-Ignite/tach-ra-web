import { ajvResolver } from '@hookform/resolvers/ajv';
import { useRouter } from 'next/router';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { useForm } from 'react-hook-form';
import { HiOutlineTrash } from 'react-icons/hi2';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin';
import { Button, Input, ProtectedRouteLayout, RootLayout } from '@/components';
import {
  useEditCategoryMutation,
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
} from '@/rtk/apis/categoriesApi';
import {
  MutateCategoryPropertyViewModel,
  MutateCategoryViewModel,
  mutateCategoryViewModelSchema,
  UserRolesEnum,
} from '@/models';

function EditCategoryPage() {
  const NO_PARENT_CONST = '-1';
  const router = useRouter();
  const id = router.query.id as string;
  const [submitError, setSubmitError] = useState<string>('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const {
    data: categories,
    error: getAllError,
    isLoading: getAllIsLoading,
  } = useGetAllCategoriesQuery();
  if (getAllError) {
    setSubmitError(getAllError.toString());
  }
  const { data: category, error, isLoading } = useGetCategoryByIdQuery(id);
  if (error) {
    setSubmitError(error.toString());
  }
  const [editCategory, editCategoryResult] = useEditCategoryMutation();
  const [categoryProperties, setCategoryProperties] = useState<
    MutateCategoryPropertyViewModel[] | undefined
  >([]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [tempIdsToClear, setTempIdsToClear] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<MutateCategoryViewModel>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: ajvResolver(mutateCategoryViewModelSchema, { $data: true }),
  });

  useEffect(() => {
    if (!isLoading && category) {
      setCategoryId(category._id);
      setValue('name', category.name);
      setValue('parentId', category.parent?._id || NO_PARENT_CONST);
      const cp =
        category.categoryProperties &&
        category.categoryProperties.map(
          (p) =>
            ({
              _id: p._id,
              name: p.name,
              values: p.values.join(','),
            }) as MutateCategoryPropertyViewModel,
        );

      setValue('categoryProperties', cp);
      setCategoryProperties(
        cp as MutateCategoryPropertyViewModel[] | undefined,
      );
    }
  }, [isLoading, category, setValue]);

  function onSubmitHandler(form: MutateCategoryViewModel, event: any) {
    setSendingRequest(true);
    event.preventDefault();
    if (form.parentId === NO_PARENT_CONST) {
      form.parentId = undefined;
    }
    if (form.parentId === category!._id) {
      setSuccessMessage('');
      setSubmitError('Category cannot be its own parent.');
      setSendingRequest(false);
      return;
    }
    const parent = categories?.find((c) => c._id === form.parentId);
    if (parent && parent.parent && parent.parent._id === categoryId) {
      setSuccessMessage('');
      setSubmitError(
        `Setting ${parent.name} as parent would cause a circular reference.`,
      );
      setSendingRequest(false);
      return;
    }

    if (form.categoryProperties) {
      for (let i = 0; i < form.categoryProperties.length; i++) {
        const id = form.categoryProperties[i]?._id;
        if (id && tempIdsToClear.includes(id)) {
          form.categoryProperties[i]._id = undefined;
        }
      }
    }

    editCategory({ categoryId, mutateCategoryViewModel: form })
      .then((result) => {
        if ((result as any).error) {
          setSuccessMessage('');
          setSubmitError((result as any).error.data.errors[0]);
        } else {
          setSubmitError('');
          setSuccessMessage(`Category ${form.name} edited!`);
        }
        setSendingRequest(false);
      })
      .catch((error) => {
        setSuccessMessage('');
        setSubmitError(error.message);
        setSendingRequest(false);
      });
  }

  const addCategoryPropertyHandler = useCallback(() => {
    setCategoryProperties((prev: any) => {
      const tempId = Date.now().toString();
      setTempIdsToClear((prev) => [...prev, tempId]);
      if (!prev) {
        return [{ _id: tempId, name: '', values: '' }];
      }
      return [...prev, { _id: tempId, name: '', values: '' }];
    });
  }, [setCategoryProperties, setTempIdsToClear]);

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
      <h1 className="text-xl mb-4">
        <Link
          href="/admin/categories"
          className="hover:text-tachPurple duration-300 underline underline-offset-4"
        >
          Categories
        </Link>{' '}
        &gt; Edit
      </h1>
      <div className="mb-4">
        <form>
          <div className="flex gap-3  items-center">
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
              className="border-tachGrey outline-none focus-visible:border-tachGreen border basis-1/3 rounded py-1 px-1.5 transition duration-300"
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
              className="h-10 text-sm font-normal hover:bg-tachPurple text-white"
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
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              onClick={handleSubmit(onSubmitHandler)}
              isLoading={sendingRequest}
            >
              Save Changes
            </Button>

            <div className="text-green-600">{successMessage}</div>
            <div className="text-red-600">{submitError}</div>
          </div>
        </form>
      </div>
    </>
  );
}

EditCategoryPage.getLayout = function getLayout(
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

export default EditCategoryPage;
