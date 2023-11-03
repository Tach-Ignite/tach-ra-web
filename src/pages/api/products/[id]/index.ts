import type { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import {
  IProvider,
  IMapper,
  IFormParser,
  ICommandFactory,
  IInvoker,
  MultipartFormParserResult,
  IServerIdentity,
} from '@/lib/abstractions';
import { IProductService } from '@/abstractions';
import {
  DeleteProductCommandPayload,
  EditProductCommandPayload,
  IProduct,
  MutateProductViewModel,
  ProductViewModel,
  UserRolesEnum,
} from '@/models';
import { ErrorWithStatusCode } from '@/lib/errors';
import { defaultHandler } from '@/lib/api';
import '@/mappingProfiles/pages/api/products/[id]/mappingProfile';
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

router.patch(async (req: NextApiRequest, res: NextApiResponse) => {
  const userIsAdmin = await serverIdentity.userHasRole(
    req,
    res,
    UserRolesEnum.Admin,
  );
  if (!userIsAdmin) {
    return res
      .status(403)
      .json({ error: 'You do not have permission to edit products.' });
  }
  const productId = req.query.id as string;

  let payload: EditProductCommandPayload;
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    const formParserResult = await formParser.parseMultipartForm(req);
    payload = mapper.map<MultipartFormParserResult, EditProductCommandPayload>(
      formParserResult,
      'MultipartFormParserResult',
      'EditProductCommandPayload',
      { extraArgs: () => ({ productId }) },
    );
  } else {
    const mutateProductViewModel =
      await formParser.parseJsonForm<MutateProductViewModel>(req);
    payload = mapper.map<MutateProductViewModel, EditProductCommandPayload>(
      mutateProductViewModel,
      'MutateProductViewModel',
      'EditProductCommandPayload',
      { extraArgs: () => ({ productId }) },
    );
  }

  const command = commandFactory.create<EditProductCommandPayload, IProduct>(
    'editProductCommand',
    payload,
  );
  const commandResult = await invoker.invoke<IProduct>(command);

  if (!commandResult) {
    throw new ErrorWithStatusCode(
      `Edit product command with id ${productId} did not return a result.`,
      500,
      'Could not retrieve product after editing it.',
    );
  }

  const viewModel = mapper.map<IProduct, ProductViewModel>(
    commandResult,
    'IProduct',
    'ProductViewModel',
  );

  return res.status(200).json(viewModel);
});

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const productId = req.query.id as string;

  const product = await productService.getProductById(productId);

  const viewModel = mapper.map<IProduct, ProductViewModel>(
    product,
    'IProduct',
    'ProductViewModel',
  );

  return res.status(200).json(viewModel);
});

router.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  const userIsAdmin = await serverIdentity.userHasRole(
    req,
    res,
    UserRolesEnum.Admin,
  );
  if (!userIsAdmin) {
    res
      .status(403)
      .json({ error: 'You do not have permission to delete products.' });
  }

  const productId = req.query.id as string;
  const payload = mapper.map<string, DeleteProductCommandPayload>(
    productId,
    'string',
    'DeleteProductCommandPayload',
  );

  const command = commandFactory.create<DeleteProductCommandPayload, void>(
    'deleteProductCommand',
    payload,
  );
  const commandResult = invoker.invoke<void>(command);

  return res.status(204).end();
});

export default router.handler(defaultHandler);
