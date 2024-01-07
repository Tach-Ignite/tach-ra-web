import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { CenterContainer, ProductList, RootLayout } from '@/components';
import { ProductViewModel, IProduct } from '@/models';
import { IProductService } from '@/abstractions';
import { IMapper, IProvider } from '@/lib/abstractions';
import '@/mappingProfiles/pages/s/mappingProfile';
import { useSearchAllProductsQuery } from '@/rtk';
import { ModuleResolver } from '@/lib/ioc/';
import { SearchProductsModule } from '@/modules/pages/s/searchProducts.module';

const dynamic = 'force-dynamic';
const pageSize = 20;

export type ProductsPageProps = {
  query: string;
  products: ProductViewModel[];
};

function MyFavoritesPage({
  query,
  products: initialProducts,
}: ProductsPageProps) {
  const [skip, setSkip] = useState(pageSize);
  const [products, setProducts] = useState(initialProducts);
  const { data, error, isLoading } = useSearchAllProductsQuery({
    queryString: query,
    queryOptions: {
      skip,
      limit: pageSize,
    },
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
      <h1 className="text-xl mb-4">{`${products.length} products found for "${query}"`}</h1>
      <ProductList
        products={products}
        onLastItemInViewport={onLastItemInViewport}
      />
    </>
  );
}

MyFavoritesPage.getLayout = function getLayout(
  page: ReactElement,
  session: Session,
) {
  return (
    <RootLayout session={session}>
      <CenterContainer>{page}</CenterContainer>
    </RootLayout>
  );
};

export async function getServerSideProps({ query, res }: any) {
  try {
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=60',
    );

    if (!query) {
      return { props: { query: '', products: [] } };
    }
    const { q } = query;
    if (!q) {
      return { props: { query: '', products: [] } };
    }

    const m = new ModuleResolver().resolve(SearchProductsModule);
    const productService = m.resolve<IProductService>('productService');
    const products = await productService.searchProducts(q, {
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
    return { props: { query: q, products: scrubbedViewModels } };
  } catch (error) {
    console.log(error);
    return { props: { query: '', products: [] } };
  }
}

export default MyFavoritesPage;
