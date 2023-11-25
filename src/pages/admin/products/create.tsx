import { Controller, useForm } from 'react-hook-form';
import { ajvResolver } from '@hookform/resolvers/ajv';
import { useRouter } from 'next/navigation';
import { ReactElement, useEffect, useState } from 'react';
import { Session } from 'next-auth';
import Link from 'next/link';
import {
  Button,
  ChipSelector,
  Input,
  ProtectedRouteLayout,
  RootLayout,
} from '@/components/';
import { useCreateProductMutation, useGetAllCategoriesQuery } from '@/rtk';
import { AdminLayout } from '@/components/admin';
import { IEnum, IEnumFactory } from '@/lib/abstractions';
import {
  CategoryPropertyValueViewModel,
  CategoryViewModel,
  MutateProductViewModel,
  mutateProductViewModelSchema,
  UserRolesEnum,
} from '@/models';
import { ModuleResolver } from '@/lib/ioc/';
import { EnumsModule } from '@/lib/modules/enums/enums.module';

const m = new ModuleResolver().resolve(EnumsModule);
const enumFactory = m.resolve<IEnumFactory>('enumFactory');

function AdminCreateProduct() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string>('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [selectedImage, setSelectedImage] = useState(new Blob());
  const [createProduct, createProductResult] = useCreateProductMutation();
  const [categoriesEnum, setCategoriesEnum] = useState<IEnum>();
  const [propertiesToFill, setPropertiesToFill] = useState<CategoryViewModel[]>(
    [],
  );
  const { data: categories, error, isLoading } = useGetAllCategoriesQuery();
  if (error) {
    setSubmitError(error.toString());
  }
  const [productCategoryProperties, setProductCategoryProperties] =
    useState<any>({});

  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<MutateProductViewModel>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: ajvResolver(mutateProductViewModelSchema, { $data: true }),
  });

  useEffect(() => {
    if (!isLoading && categories) {
      const categoriesObject: any = {};
      for (let i = 0; i < categories.length; i++) {
        categoriesObject[categories[i]._id] = categories[i].name;
      }
      const cEnum = enumFactory.create(categoriesObject);
      setCategoriesEnum(cEnum);
    }
  }, [isLoading, categories, setCategoriesEnum]);

  const watchCategoryIds = watch('categoryIds');
  useEffect(() => {
    if (
      categories &&
      categories.length > 0 &&
      getValues('categoryIds') &&
      getValues.length > 0
    ) {
      const cats: CategoryViewModel[] = [];
      const selCatInfo = categories?.filter((cat) =>
        getValues('categoryIds').includes(cat._id),
      );
      cats.push(...selCatInfo);
      let currentCat: CategoryViewModel;
      let depth;
      const maxDepth = 10;
      for (let i = 0; i < selCatInfo.length; i++) {
        depth = 0;
        currentCat = selCatInfo[i];
        while (currentCat.parent && depth < maxDepth) {
          const parentId = currentCat.parent?._id;
          const parent = categories?.find((c) => c._id === parentId);
          if (!parent) {
            break;
          }
          cats.push(parent);
          currentCat = parent;
          depth++;
        }
      }
      const propsToSet: ({ name: string } & CategoryPropertyValueViewModel)[] =
        [];
      for (let i = 0; i < cats.length; i++) {
        const { categoryProperties } = cats[i];
        if (categoryProperties) {
          for (let j = 0; j < categoryProperties.length; j++) {
            if (
              typeof categoryProperties[j].name === 'string' &&
              productCategoryProperties[categoryProperties[j].name] ===
                undefined &&
              categoryProperties[j].values?.length > 0
            ) {
              propsToSet.push({
                name: categoryProperties[j].name,
                categoryId: cats[i]._id,
                categoryPropertyId: categoryProperties[j]._id,
                value: categoryProperties[j].values[0],
              });
            }
          }
        }
      }

      if (propsToSet.length > 0) {
        setProductCategoryProperties((prev: any) => {
          const newProductProps = { ...prev };
          for (let i = 0; i < propsToSet.length; i++) {
            newProductProps[propsToSet[i].name] = {
              name: propsToSet[i].name,
              categoryId: propsToSet[i].categoryId,
              categoryPropertyId: propsToSet[i].categoryPropertyId,
              value: propsToSet[i].value,
            };
          }
          return newProductProps;
        });
      }
      setPropertiesToFill(cats);
    }
  }, [
    categories,
    watchCategoryIds,
    getValues,
    setProductCategoryProperties,
    productCategoryProperties,
  ]);

  const imageChangeHandler = (e: any) => {
    setSelectedImage(e.target.files[0]);
  };

  function onSubmitHandler(form: MutateProductViewModel, event: any) {
    setSendingRequest(true);
    event.preventDefault();
    createProduct({
      ...form,
      categoryPropertyValues: productCategoryProperties,
    })
      .then((result) => {
        router.push('/admin/products');
      })
      .catch((error) => {
        setSubmitError(error.message);
        setSendingRequest(false);
      });
  }

  // function setProductProp(
  //   name: string,
  //   categoryId: string,
  //   categoryPropertyId: string,
  //   value: string,
  // ) {
  //   setProductCategoryProperties((prev: any) => {
  //     const newProductProps = { ...prev };
  //     newProductProps[name] = { categoryId, categoryPropertyId, value };
  //     return newProductProps;
  //   });
  // }

  function setProductProp(
    name: string,
    categoryId: string,
    categoryPropertyId: string,
    value: string,
  ) {
    setProductCategoryProperties((prev: any) => {
      const newProductProps = { ...prev };
      newProductProps[name] = {
        categoryId,
        categoryPropertyId,
        value,
      };
      setValue('categoryPropertyValues', newProductProps);
      return newProductProps;
    });
  }

  return (
    <>
      <h1 className="text-xl mb-4">
        <Link
          href="/admin/products"
          className="hover:text-tachPurple underline underline-offset-4 duration-300"
        >
          Products
        </Link>{' '}
        &gt; Create
      </h1>
      <form>
        <div className="flex flex-row gap-8 mb-6">
          <div className="basis-1/2">
            <Input
              name="friendlyId"
              label="Friendly Id"
              type="text"
              required
              register={register}
              errorMessage={errors.friendlyId && errors.friendlyId.message}
            />
            <Input
              name="brand"
              label="Brand"
              type="text"
              required
              register={register}
              errorMessage={errors.brand && errors.brand.message}
            />
            <Input
              name="name"
              label="Name"
              type="text"
              required
              register={register}
              errorMessage={errors.name && errors.name.message}
            />
            <Input
              name="description"
              label="Description"
              type="textarea"
              required
              rows={4}
              maxLength={500}
              register={register}
              errorMessage={errors.description && errors.description.message}
            />
            {categoriesEnum && (
              <Controller
                control={control}
                name="categoryIds"
                render={({ field: { value, onChange } }) => (
                  <ChipSelector
                    value={value}
                    initValue={value}
                    onChange={onChange}
                    $enum={categoriesEnum}
                    label="Categories"
                    required
                    deletable
                    errorMessage={
                      errors.categoryIds && errors.categoryIds.message
                    }
                  />
                )}
              />
            )}
            {propertiesToFill &&
              propertiesToFill.length > 0 &&
              propertiesToFill.map((cat) => (
                <div key={cat._id}>
                  {cat.categoryProperties?.map((cp) => (
                    <div key={cp._id} className="w-full flex gap-3 mb-2">
                      <div className="basis-1/2">{cp.name}</div>
                      <select
                        className="border-tachGrey outline-none focus-visible:border-tachGreen border basis-1/2 rounded py-1 px-1.5 transition duration-300"
                        value={
                          productCategoryProperties
                            ? productCategoryProperties[cp.name].value
                            : ''
                        }
                        onChange={(e) =>
                          setProductProp(
                            cp.name,
                            cat._id,
                            cp._id,
                            e.target.value,
                          )
                        }
                      >
                        {cp.values.map((v) => (
                          <option value={v} key={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              ))}
            <Input
              name="isNew"
              label="Is New"
              type="checkbox"
              required
              register={register}
              errorMessage={errors.name && errors.name.message}
            />
          </div>
          <div className="basis-1/2">
            <Input
              label="Old Price"
              name="oldPrice"
              type="number"
              step={0.01}
              required
              placeholder="3.50"
              register={register}
              registerOptions={{ valueAsNumber: true }}
              errorMessage={errors.price && errors.price.message}
            />
            <Input
              label="Price"
              name="price"
              type="number"
              step={0.01}
              required
              placeholder="3.50"
              register={register}
              registerOptions={{ valueAsNumber: true }}
              errorMessage={errors.price && errors.price.message}
            />
            <Input
              label="Quantity"
              name="quantity"
              type="number"
              step={1}
              required
              placeholder="25"
              register={register}
              registerOptions={{ valueAsNumber: true }}
              errorMessage={errors.quantity && errors.quantity.message}
            />
            <div className="flex flex-row gap-3">
              <div
                className={`${
                  errors.imageFiles ? 'border-red-600' : 'border-tachGrey'
                } border p-3 rounded w-[256px] h-[256px]`}
              >
                {selectedImage?.size > 0 ? (
                  <img
                    alt="Product Preview"
                    className="object-fill"
                    width={256}
                    height={256}
                    src={
                      selectedImage?.size > 0
                        ? URL.createObjectURL(selectedImage)
                        : ''
                    }
                  />
                ) : (
                  <div className="w-full h-full flex justify-center items-center text-xl text-tachGrey">
                    No Image Chosen
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <Input
                  label="Product Image"
                  name="imageFiles"
                  type="file"
                  required
                  placeholder=""
                  helpText="Supported types: jpeg, gif. Maximum size: 1MB"
                  register={register}
                  registerOptions={{
                    onChange: imageChangeHandler,
                  }}
                  errorMessage={
                    errors.imageFiles &&
                    ((errors.imageFiles as any)[0].type?.message ||
                      (errors.imageFiles as any)[0].size?.message)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          onClick={handleSubmit(onSubmitHandler)}
          isLoading={sendingRequest}
          className="bg-tachGrey hover:bg-tachPurple text-white"
        >
          Add
        </Button>
        <div className="text-red-600">{submitError}</div>
      </form>
    </>
  );
}

AdminCreateProduct.getLayout = function getLayout(
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

export default AdminCreateProduct;
