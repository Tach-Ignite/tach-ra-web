import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { CenterContainer, ProductList, RootLayout } from '@/components';
import { ProductViewModel, IProduct } from '@/models';
import { IProductService } from '@/abstractions';
import { IMapper, IProvider } from '@/lib/abstractions';
import '@/mappingProfiles/pages/p/mappingProfile';
import { useGetAllProductsQuery } from '@/rtk';
import { ModuleResolver } from '@/lib/ioc/';
import { ProductsModule } from '@/modules/pages/p/products.module';

const revalidate = 60;
const dynamic = 'force-dynamic';

const pageSize = 20;

export type ProductsPageProps = {
  products: ProductViewModel[];
};

function Page({ products: initialProducts }: ProductsPageProps) {
  const [skip, setSkip] = useState(pageSize);
  const [products, setProducts] = useState(initialProducts);
  const { data, error, isLoading } = useGetAllProductsQuery({
    skip,
    limit: pageSize,
  });

  const onLastItemInViewport = useCallback(() => {
    setSkip((prev) => prev + pageSize);
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      setProducts((prev) => [...prev, ...data]);
    }
  }, [data]);

  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts);
    }
  }, [initialProducts]);

  return (
    <>
      <h1 className="text-xl mb-4">Browse All Products</h1>
      <ProductList
        products={products}
        onLastItemInViewport={onLastItemInViewport}
      />
    </>
  );
}

Page.getLayout = function getLayout(page: ReactElement, session: Session) {
  return (
    <RootLayout session={session}>
      <CenterContainer>{page}</CenterContainer>
    </RootLayout>
  );
};

export async function getStaticProps() {
  try {
    const m = new ModuleResolver().resolve(ProductsModule);
    const productService = m.resolve<IProductService>('productService');
    const products = await productService.getAllProducts({
      skip: 0,
      limit: pageSize,
    });

    const mapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
    const mapper = mapperProvider.provide();
    const viewModels = mapper.mapArray<IProduct, ProductViewModel>(
      products,
      'IProduct',
      'ProductViewModel',
    );

    const scrubbedViewModels = JSON.parse(JSON.stringify(viewModels));
    return { props: { products: scrubbedViewModels }, revalidate: 60 };
  } catch (e) {
    console.log(`\nSkipping static page generation: ${e}`);
    return { props: { products: [] }, revalidate: 60 };
  }
}

export default Page;
