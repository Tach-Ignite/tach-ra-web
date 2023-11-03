import { ReactElement, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi2';
import { Session } from 'next-auth';
import { ProtectedRouteLayout, RootLayout } from '@/components';
import { AdminLayout, ProductsList } from '@/components/admin';
import { UserRolesEnum, IProduct, ProductViewModel } from '@/models';
import { IProductService } from '@/abstractions';
import { IMapper, IProvider } from '@/lib/abstractions';
import '@/mappingProfiles/pages/admin/products/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { AdminProductsModule } from '@/modules/pages/admin/products/adminProducts.module';
import { useGetAllProductsQuery } from '@/rtk';

const pageSize = 20;

type AdminProductsPageProps = {
  products: ProductViewModel[];
};

function AdminProductsPage({
  products: initialProducts,
}: AdminProductsPageProps) {
  const [skip, setSkip] = useState(initialProducts.length);
  const [products, setProducts] = useState<ProductViewModel[]>(initialProducts);
  const { data, isLoading } = useGetAllProductsQuery({
    skip,
    limit: pageSize,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setProducts((prev) => [...prev, ...data]);
    }
  }, [data]);

  const onLastItemInViewport = useCallback(() => {
    setSkip((prev) => prev + pageSize);
  }, []);

  return (
    <>
      <h1 className="text-xl mb-4">Products</h1>
      <Link href="/admin/products/create">
        <button
          type="button"
          className="font-medium bg-tachGrey hover:bg-tachPurple text-white rounded duration-300 flex gap-3 justify-center items-center px-4 py-3"
        >
          <span>
            <HiPlus className="h-6 w-6" />
          </span>
          Add Product
        </button>
      </Link>
      <ProductsList
        products={products}
        onLastItemInViewport={onLastItemInViewport}
      />
    </>
  );
}

AdminProductsPage.getLayout = function getLayout(
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

export async function getServerSideProps({ res }: any) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=60',
  );

  const m = new ModuleResolver().resolve(AdminProductsModule);
  const productService = m.resolve<IProductService>('productService');
  const products = await productService.getAllProducts({ limit: 20, skip: 0 });

  const mapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
  const mapper = mapperProvider.provide();
  const viewModels = mapper.mapArray<IProduct, ProductViewModel>(
    products,
    'IProduct',
    'ProductViewModel',
  );

  const scrubbedViewModels = JSON.parse(JSON.stringify(viewModels));
  return { props: { products: scrubbedViewModels } };
}

export default AdminProductsPage;
