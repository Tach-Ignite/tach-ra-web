import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ProductViewModel } from '@/models';
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi2';

export type ProductListItemProps = {
  product: ProductViewModel;
  isLast: boolean;
  onItemInViewport: () => void;
};

export function ProductListItem({
  product,
  isLast,
  onItemInViewport,
}: ProductListItemProps) {
  const {
    _id,
    name,
    friendlyId,
    imageUrls,
    oldPrice,
    price,
    categoryPropertyValues,
    quantity,
  } = product;

  const selfRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const [observer, setOberserver] = useState<
    IntersectionObserver | undefined
  >();

  useEffect(() => {
    if (!selfRef?.current || observer !== undefined || !isLast) return;

    setOberserver((prev) => {
      if (prev !== undefined) {
        return prev;
      }
      const observer = new IntersectionObserver(([entry]) => {
        if (isLast && entry.isIntersecting) {
          observer!.unobserve(entry.target);
          onItemInViewport();
        }
      });
      observer.observe(selfRef.current);

      return observer;
    });
  }, [isLast, onItemInViewport, selfRef, observer, setOberserver]);

  const labelClassname = 'text-tachGrey text-sm';
  const fieldGroupClassname = 'flex flex-col';
  const linkClassname =
    'flex hover:text-tachPurple transition-colors duration-300 underline underline-offset-4 xl:mt-10';
  const dataClassName = 'xl:h-6 truncate';
  return (
    <div
      key={_id}
      className="border border-tachGrey rounded px-4 py-3 mt-4 shadow-md shadow-tachDark/10 dark:shadow-white/10"
      ref={selfRef}
    >
      <div className="grid grid-cols-2 xl:grid-cols-12 gap-3 text-base">
        {imageUrls && imageUrls.length > 0 && (
          <img
            src={imageUrls[0]}
            alt={name}
            width={100}
            height={100}
            className="object-cover self-center col-span-2 xl:col-span-1 rounded"
          />
        )}
        <div className={`${fieldGroupClassname} col-span-1 xl:col-span-4`}>
          <p className={labelClassname}>Name</p>
          <p className={dataClassName}>{name}</p>
        </div>
        <div className={fieldGroupClassname}>
          <p className={labelClassname}>Stock</p>
          <p className={dataClassName}>{quantity}</p>
        </div>
        <div className={fieldGroupClassname}>
          <p className={labelClassname}>Sold</p>
          <p className={dataClassName}>TODO</p>
        </div>
        <div className={fieldGroupClassname}>
          <p className={labelClassname}>Sale Price</p>
          <p className={dataClassName}>{oldPrice}</p>
        </div>
        <div className={fieldGroupClassname}>
          <p className={labelClassname}>Price</p>
          <p className={dataClassName}>{price}</p>
        </div>
        <div className={fieldGroupClassname}>
          <p className={labelClassname}>Lead Time</p>
          <p className={dataClassName}>TODO</p>
        </div>
        <Link className={linkClassname} href={`/admin/products/edit/${_id}`}>
          <HiOutlinePencil className="w-5 h-5 mr-1" />
          Edit
        </Link>
        <Link className={linkClassname} href={`/admin/products/delete/${_id}`}>
          <HiOutlineTrash className="w-5 h-5 mr-1" />
          Delete
        </Link>
      </div>
    </div>
  );
}
