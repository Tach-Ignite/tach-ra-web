import { IProductService } from '@/abstractions';
import { CenterContainer, ProductGrid } from '@/components';
import { ProductViewModel, IProduct } from '@/models';
import { IMapper, IProvider } from '@/lib/abstractions';
import '@/mappingProfiles/pages/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { ProductsModule } from '@/modules/pages/p/products.module';

type HomePageProps = {
  products: ProductViewModel[];
};

function Home({ products }: HomePageProps) {
  return (
    <main>
      <div className="min-h-[540px]">
        <div className="w-full">
          <div className="my-8">
            <CenterContainer>
              <ProductGrid products={products} />
            </CenterContainer>
          </div>
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  try {
    const m = new ModuleResolver().resolve(ProductsModule);
    const productService = m.resolve<IProductService>('productService');
    const products = await productService.getAllProducts();

    const mapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
    const mapper = mapperProvider.provide();
    const viewModels = mapper.mapArray<IProduct, ProductViewModel>(
      products,
      'IProduct',
      'ProductViewModel',
    );

    const scrubbedViewModels = JSON.parse(JSON.stringify(viewModels));
    return { props: { products: scrubbedViewModels } };
  } catch (e) {
    console.log(`\nUnable to load products: ${e}`);
    return { props: { products: [] } };
  }
  }
}

// export async function getStaticProps() {
//   try {
//     const m = new ModuleResolver().resolve(ProductsModule);
//     const productService = m.resolve<IProductService>('productService');
//     const products = await productService.getAllProducts();

//     const mapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
//     const mapper = mapperProvider.provide();
//     const viewModels = mapper.mapArray<IProduct, ProductViewModel>(
//       products,
//       'IProduct',
//       'ProductViewModel',
//     );

//     const scrubbedViewModels = JSON.parse(JSON.stringify(viewModels));
//     return { props: { products: scrubbedViewModels }, revalidate: 60 };
//   } catch (e) {
//     console.log(`\nSkipping static page generation: ${e}`);
//     return { props: { products: [] }, revalidate: 60 };
//   }
// }

export default Home;
