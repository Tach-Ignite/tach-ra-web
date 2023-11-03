import { ProductViewModel } from '@/models';

export type ProductItemProps = {
  product: ProductViewModel;
};

export function DetailedProductListItem({ product }: ProductItemProps) {
  const {
    _id,
    friendlyId,
    brand,
    name,
    description,
    categories,
    categoryPropertyValues,
    isNew,
    oldPrice,
    price,
    quantity,
    imageUrls,
  } = product;
  const labelClassname = 'text-tachGrey text-sm';
  const fieldGroupClassname = 'mb-3';
  return (
    <div
      key={product.friendlyId}
      className="flex flex-col lg:flex-row lg:gap-8"
    >
      <div className="basis-2/3">
        <div className={fieldGroupClassname}>
          <p className={labelClassname}>Id</p>
          <div>{_id}</div>
        </div>
        <div className={fieldGroupClassname}>
          <p className={labelClassname}>Name</p>
          <div>{name}</div>
        </div>
        <div className={fieldGroupClassname}>
          <p className={labelClassname}>Friendly Id</p>
          <div>{friendlyId}</div>
        </div>
        <div className={fieldGroupClassname}>
          <p className={labelClassname}>Description</p>
          <div>{description}</div>
        </div>
        <div className={fieldGroupClassname}>
          <p className={labelClassname}>Brand</p>
          <div>{brand}</div>
        </div>
        <div className={fieldGroupClassname}>
          <p className={labelClassname}>Categories</p>
          {categories.map((category) => (
            <div key={category._id}>{category.name}</div>
          ))}
        </div>
        <div className={fieldGroupClassname}>
          <p className={labelClassname}>Category Property Values</p>
          {categoryPropertyValues &&
            Object.keys(categoryPropertyValues).map((key) => (
              <div key={categoryPropertyValues[key].value}>
                <div>
                  {key}: {categoryPropertyValues[key].value}
                </div>
              </div>
            ))}
        </div>
        <div className={fieldGroupClassname}>
          <p className={labelClassname}>Is New</p>
          <input
            type="checkbox"
            className="ml-2 w-4 h-4"
            disabled
            checked={isNew}
          />
        </div>
      </div>
      <div className="basis-1/3">
        <p className={labelClassname}>Sale Price</p>
        <div>{oldPrice}</div>
        <p className={labelClassname}>Price</p>
        <div>{price}</div>
        <p className={labelClassname}>Quantity</p>
        <div>{quantity}</div>
        {product.imageUrls && (
          <div className={fieldGroupClassname}>
            <p className={labelClassname}>Image</p>
            <div className="border p-3 rounded w-[256px] h-[256px] mt-1">
              <img
                alt="Product Preview"
                width={256}
                height={256}
                src={imageUrls[0] ?? ''}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
