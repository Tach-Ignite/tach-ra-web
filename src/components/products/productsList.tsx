import { useCallback } from 'react';
import { ProductViewModel } from '@/models';
import { ProductListItem } from './productListItem';

export type ProductListProps = {
  products: ProductViewModel[];
  onLastItemInViewport?: () => void;
};

export function ProductList({
  products,
  onLastItemInViewport,
}: ProductListProps) {
  const onItemInViewport = useCallback(() => {
    if (onLastItemInViewport) {
      onLastItemInViewport();
    }
  }, [onLastItemInViewport]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {products.map((product: ProductViewModel, index) => (
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
