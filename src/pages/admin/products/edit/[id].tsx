import { BaseSyntheticEvent, ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { ajvResolver } from '@hookform/resolvers/ajv';
import Link from 'next/link';
import { Session } from 'next-auth';
import { AdminLayout } from '@/components/admin';
import {
  useEditProductMutation,
  useGetProductByIdQuery,
  useGetAllCategoriesQuery,
} from '@/rtk';
import {
  Input,
  Button,
  ChipSelector,
  ProtectedRouteLayout,
  RootLayout,
} from '@/components';
import { IEnum, IEnumFactory } from '@/lib/abstractions';
import {
  CategoryPropertyValueViewModel,
  CategoryPropertyViewModel,
  CategoryViewModel,
  MutateProductViewModel,
  mutateProductViewModelSchema,
  UserRolesEnum,
  fileLikeArrayToFileList,
} from '@/models';
import { ModuleResolver } from '@/lib/ioc/';
import { EnumsModule } from '@/lib/modules/enums/enums.module';

const m = new ModuleResolver().resolve(EnumsModule);
const enumFactory = m.resolve<IEnumFactory>('enumFactory');

function EditProductPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const [submitError, setSubmitError] = useState<string>('');
  const [selectedImageFileList, setSelectedImageFileList] =
    useState<FileList>();
  const [imageHasChanged, setImageHasChanged] = useState(false);
  const { data: product, error, isLoading } = useGetProductByIdQuery(id);
  if (error) {
    setSubmitError(error.toString());
  }
  const [editProduct, editProductResult] = useEditProductMutation();
  const [sendingRequest, setSendingRequest] = useState(false);
  const [categoriesEnum, setCategoriesEnum] = useState<IEnum>();
  const { data: categories, isLoading: categoryIsLoading } =
    useGetAllCategoriesQuery();
  if (error) {
    setSubmitError(error.toString());
  }
  const [productCategoryProperties, setProductCategoryProperties] =
    useState<any>({});
  const [propertiesToFill, setPropertiesToFill] = useState<any[]>([]);
  const [productId, setProductId] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useForm<MutateProductViewModel>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: ajvResolver(mutateProductViewModelSchema, { $data: true }),
  });

  useEffect(() => {
    if (!categoryIsLoading && categories) {
      const categoriesObject: any = {};
      for (let i = 0; i < categories.length; i++) {
        categoriesObject[categories[i]._id] = categories[i].name;
      }
      const cEnum = enumFactory.create(categoriesObject);
      setCategoriesEnum(cEnum);
    }
  }, [categoryIsLoading, categories, setCategoriesEnum]);

  useEffect(() => {
    if (product && categoriesEnum) {
      setProductId(product._id);
      const formData: MutateProductViewModel = {
        description: product.description,
        friendlyId: product.friendlyId,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        brand: product.brand,
        oldPrice: product.oldPrice,
        categoryPropertyValues: product.categoryPropertyValues,
        categoryIds: product.categories.map((c) => c._id),
        isNew: product.isNew,
        imageFiles: fileLikeArrayToFileList([]),
      };
      if (product.imageUrls) {
        for (let i = 0; i < product.imageUrls.length; i++) {
          fetch(product.imageUrls[i])
            .then((image) => {
              image.blob().then((imageBlob: any) => {
                const fileList: FileList = {
                  0: imageBlob,
                  length: 1,
                  item: (index: number) => imageBlob,
                  [Symbol.iterator](): IterableIterator<File> {
                    return imageBlob;
                  },
                };
                setSelectedImageFileList(fileList);
                if (!formData.imageFiles) {
                  formData.imageFiles = fileLikeArrayToFileList([]);
                }
                if (formData.imageFiles && formData.imageFiles.length > 0) {
                  [formData.imageFiles[formData.imageFiles.length]] = fileList;
                }
              });
            })
            .catch((error) => {
              setSubmitError(error.toString());
            });
        }

        reset(formData);
        setProductCategoryProperties(product.categoryPropertyValues);
      }
    }
  }, [
    product,
    id,
    reset,
    categoriesEnum,
    setProductCategoryProperties,
    setPropertiesToFill,
  ]);

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
      let currentCat;
      let depth;
      const maxDepth = 10;
      for (let i = 0; i < selCatInfo.length; i++) {
        depth = 0;
        currentCat = selCatInfo[i];
        while (currentCat.parent && depth < maxDepth) {
          const parentId: string = currentCat.parent._id;
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
  }, [categories, watchCategoryIds, getValues, productCategoryProperties]);

  const imageChangeHandler = (e: any) => {
    setSelectedImageFileList(e.target.files);
    setImageHasChanged(true);
  };

  const removeImageHandler = (e: any) => {
    const imageFiles: any = getValues('imageFiles');
    const fileList = fileLikeArrayToFileList(imageFiles);

    setValue('imageFiles', fileList);
    setSelectedImageFileList(fileList);
    setImageHasChanged(true);
  };

  function onSubmitHandler(
    data: MutateProductViewModel,
    event: BaseSyntheticEvent<object, any, any> | undefined,
  ) {
    event!.preventDefault();
    setSendingRequest(true);
    if (imageHasChanged && selectedImageFileList !== undefined) {
      data.imageFiles = selectedImageFileList;
    } else {
      data.imageFiles = undefined;
    }
    editProduct({ productId, mutateProductViewModel: data })
      .then((result) => {
        router.push('/admin/products');
      })
      .catch((error) => {
        setSubmitError(error.toString());
        setSendingRequest(false);
      });
  }

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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1 className="text-xl mb-4">
        <Link
          className="hover:text-tachPurple duration-300 underline underline-offset-4"
          href="/admin/products"
        >
          Products
        </Link>{' '}
        &gt; Edit
      </h1>
      <form>
        <div className="flex flex-col lg:flex-row gap-8 mb-6">
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
                    onChange={(e) => {
                      onChange(e);
                    }}
                    $enum={categoriesEnum}
                    label="Categories"
                    deletable
                    required
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
                  {cat.categoryProperties?.map(
                    (cp: CategoryPropertyViewModel) => (
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
                    ),
                  )}
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
            <label htmlFor="imageInput" className="text-sm text-tachGrey">
              Image
            </label>
            <div className="flex flex-col xl:flex-row gap-3">
              <div
                className={`flex-none ${
                  errors.imageFiles ? 'border-red-600' : 'border-tachGrey'
                } border p-3 rounded w-[256px] h-[256px]`}
              >
                {selectedImageFileList && selectedImageFileList.length > 0 ? (
                  <img
                    alt="Product Preview"
                    width="256"
                    height="256"
                    className="object-cover w-full h-full"
                    src={
                      selectedImageFileList[0].size > 0
                        ? URL.createObjectURL(selectedImageFileList[0])
                        : ''
                    }
                  />
                ) : (
                  <div className="w-full h-full flex justify-center items-center text-xl text-tachGrey">
                    No Image Chosen
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Input
                  id="imageInput"
                  label="Product Image"
                  name="imageFiles"
                  type="file"
                  placeholder=""
                  helpText="Supported types: jpeg, gif. Maximum size: 1MB"
                  register={register}
                  registerOptions={{
                    onChange: imageChangeHandler,
                  }}
                  errorMessage={
                    errors.imageFiles &&
                    (Object.prototype.hasOwnProperty.call(
                      errors.imageFiles,
                      '0',
                    )
                      ? (errors.imageFiles as any)[0].type?.message ||
                        (errors.imageFiles as any)[0].size?.message
                      : 'Image is required')
                  }
                />
                <Button onClick={removeImageHandler}>Remove Image</Button>
              </div>
            </div>
          </div>
        </div>

        <Button
          className="bg-orange-600"
          onClick={handleSubmit(onSubmitHandler)}
          isLoading={sendingRequest}
        >
          Save Changes
        </Button>
        <div className="text-red-600">{submitError}</div>
        <div className="text-red-600">{errors.root?.message}</div>
      </form>
    </>
  );
}

EditProductPage.getLayout = function getLayout(
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

export default EditProductPage;
