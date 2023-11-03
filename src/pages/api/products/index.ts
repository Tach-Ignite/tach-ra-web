import type { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import {
  IMapper,
  IProvider,
  IFormParser,
  MultipartFormParserResult,
  ICommandFactory,
  IInvoker,
  IServerIdentity,
  QueryOptions,
} from '@/lib/abstractions';
import { IProductService } from '@/abstractions';
import {
  CreateProductCommandPayload,
  IProduct,
  ProductViewModel,
  UserRolesEnum,
} from '@/models';
import { ErrorWithStatusCode } from '@/lib/errors';
import { defaultHandler } from '@/lib/api';
import '@/mappingProfiles/pages/api/products/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { ProductsApiModule } from '@/modules/pages/api/products/productsApi.module';

export const revalidate = 10;
export const config = {
  api: {
    bodyParser: false,
  },
};

const m = new ModuleResolver().resolve(ProductsApiModule);
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
const formParser = m.resolve<IFormParser>('formParser');
const commandFactory = m.resolve<ICommandFactory>('commandFactory');
const invoker = m.resolve<IInvoker>('invoker');
const productService = m.resolve<IProductService>('productService');
const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
const mapper = automapperProvider.provide();

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.post(
  async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const userIsAdmin = await serverIdentity.userHasRole(
      req,
      res,
      UserRolesEnum.Admin,
    );
    if (!userIsAdmin) {
      return res
        .status(403)
        .json({ error: 'You do not have permission to create products.' });
    }

    const formParserResult = await formParser.parseMultipartForm(req);
    const payload = mapper.map<
      MultipartFormParserResult,
      CreateProductCommandPayload
    >(
      formParserResult,
      'MultipartFormParserResult',
      'CreateProductCommandPayload',
    );

    const command = commandFactory.create<
      CreateProductCommandPayload,
      IProduct
    >('createProductCommand', payload);
    const commandResult = await invoker.invoke<IProduct>(command);

    if (!commandResult) {
      throw new ErrorWithStatusCode(
        'Create product command did not return a result.',
        500,
        'Could not retrieve product after creating it.',
      );
    }

    const viewModel = mapper.map<IProduct, ProductViewModel>(
      commandResult,
      'IProduct',
      'ProductViewModel',
    );

    return res.status(200).json(viewModel);
  },
);

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;

  let products: IProduct[] = [];
  const queryString = query && query.q ? (query.q as string) : undefined;
  const queryOptions = mapper.map<
    Partial<{
      [key: string]: string | string[];
    }>,
    QueryOptions | undefined
  >(query, 'query', 'QueryOptions');

  if (query && query.q) {
    products = await productService.searchProducts(
      query.q as string,
      queryOptions,
    );
  } else {
    products = await productService.getAllProducts(queryOptions);
  }

  const viewModels = mapper.mapArray<IProduct, ProductViewModel>(
    products,
    'IProduct',
    'ProductViewModel',
  );

  return res.status(200).json(viewModels);
});

export default router.handler(defaultHandler);
