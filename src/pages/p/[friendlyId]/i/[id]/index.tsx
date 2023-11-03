import { ReactElement } from 'react';
import { Session } from 'next-auth';
import { ProductDetails, CenterContainer, RootLayout } from '@/components';
import { IProductService } from '@/abstractions';
import { ProductViewModel, IProduct } from '@/models';
import { IMapper, IProvider } from '@/lib/abstractions';
import '@/mappingProfiles/pages/p/[friendlyId]/i/[id]/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { ProductsModule } from '@/modules/pages/p/products.module';

const revalidate = 60;
const dynamic = 'force-dynamic';

type PageProps = {
  product: ProductViewModel;
};

function ProductDetailsPage({ product }: PageProps) {
  if (product) {
    return <ProductDetails product={product} />;
  }

  return <div>No Product Found.</div>;
}

export async function getStaticProps({ params }: any) {
  try {
    const m = new ModuleResolver().resolve(ProductsModule);
    const productService = m.resolve<IProductService>('productService');
    const product = await productService.getProductById(params.id);

    const automapperProvider =
      m.resolve<IProvider<IMapper>>('automapperProvider');
    const mapper = automapperProvider.provide();

    const viewModel = mapper.map<IProduct, ProductViewModel>(
      product,
      'IProduct',
      'ProductViewModel',
    );

    const scrubbedViewModel = JSON.parse(JSON.stringify(viewModel));
    return { props: { product: scrubbedViewModel }, revalidate: 60 };
  } catch (error) {
    return { props: { product: {} }, revalidate: 60 };
  }
}

ProductDetailsPage.getLayout = function getLayout(
  page: ReactElement,
  session: Session,
) {
  return (
    <RootLayout session={session}>
      <CenterContainer>{page}</CenterContainer>
    </RootLayout>
  );
};

export async function getStaticPaths() {
  const m = new ModuleResolver().resolve(ProductsModule);
  const productService = m.resolve<IProductService>('productService');
  const products = await productService.getAllProducts();

  const paths = products.map((product) => ({
    params: { id: product._id, friendlyId: product.friendlyId },
  }));
  return { paths, fallback: 'blocking' };
}

export default ProductDetailsPage;
