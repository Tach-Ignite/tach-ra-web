import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ProductViewModel } from '@/models';
import { Price } from '../price';

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

  return (
    <div key={_id} className="border border-tachGrey rounded p-2" ref={selfRef}>
      <div className="flex flex-col gap-3">
        <Link href={`/p/${friendlyId}/i/${_id}`}>
          {imageUrls && imageUrls.length > 0 ? (
            <img
              src={imageUrls[0]}
              alt={name ?? 'Product Image'}
              width={512}
              height={512}
              className="object-cover self-center flex-none rounded"
            />
          ) : (
            <div className="w-[100px] h-[100px] flex justify-center items-center text-xl text-tachGrey rounded">
              No Image
            </div>
          )}
        </Link>
        <Link
          href={`/p/${friendlyId}/i/${_id}`}
          className="hover:text-tachPurple hover:underline underline-offset-4 duration-300"
        >
          <p className="text-semibold text-base">{name}</p>
        </Link>
        <div className="flex gap-3">
          {categoryPropertyValues &&
            Object.keys(categoryPropertyValues).map((key) => (
              <div
                key={key}
                className="text-xs text-tachGrey border rounded border-tachGrey px-2 py-1 rounded"
              >
                {categoryPropertyValues[key].value}
              </div>
            ))}
        </div>
        <div className="flex gap-3 items-center">
          <div className="text-lg">
            <Price amount={price} />
          </div>
          <div className="text-gray-400 text-sm line-through">
            <Price amount={oldPrice} />
          </div>
        </div>
      </div>
    </div>
  );
}
