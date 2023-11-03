import { ProductViewModel } from '@/models';
import { useCallback } from 'react';
import { ProductListItem } from './productListItem';

export type ProductsListProps = {
  products: ProductViewModel[];
  onLastItemInViewport?: () => void;
};

export function ProductsList({
  products,
  onLastItemInViewport,
}: ProductsListProps) {
  const onItemInViewport = useCallback(() => {
    if (onLastItemInViewport) {
      onLastItemInViewport();
    }
  }, [onLastItemInViewport]);

  const labelClassname = 'text-tachGrey text-sm';
  const fieldGroupClassname = 'flex flex-col';
  const linkClassname =
    'flex hover:text-tachPurple transition-colors duration-300 underline underline-offset-4 xl:mt-10';
  const dataClassName = 'xl:h-6 truncate';
  return (
    <div className="md:grid sm:grid-cols-2 xl:block md:gap-3">
      {products.map((product, index) => (
        <ProductListItem
          key={product._id}
          product={product}
          isLast={index === products.length - 1}
          onItemInViewport={onItemInViewport}
        />
      ))}
    </div>
  );
}
