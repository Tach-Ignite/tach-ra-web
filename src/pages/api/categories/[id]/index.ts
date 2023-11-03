import type { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import {
  IMapper,
  IProvider,
  ICommandFactory,
  IInvoker,
  IServerIdentity,
} from '@/lib/abstractions';
import { defaultHandler } from '@/lib/api';
import '@/mappingProfiles/pages/api/categories/[id]/mappingProfile';
import {
  CategoryViewModel,
  DeleteCategoryCommandPayload,
  EditCategoryCommandPayload,
  ICategory,
  MutateCategoryViewModel,
  UserRolesEnum,
} from '@/models';
import { ErrorWithStatusCode } from '@/lib/errors';
import { ICategoryService } from '@/abstractions';
import { ModuleResolver } from '@/lib/ioc/';
import { CategoriesApiModule } from '@/modules/pages/api/categories/categoriesApi.module';

export const revalidate = 10;

const m = new ModuleResolver().resolve(CategoriesApiModule);
const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
const commandFactory = m.resolve<ICommandFactory>('commandFactory');
const invoker = m.resolve<IInvoker>('invoker');
const categoryService = m.resolve<ICategoryService>('categoryService');
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
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
      .json({ error: 'You do not have permission to edit categories.' });
  }
  const categoryId = req.query.id as string;

  const mutateCategoryViewModel = req.body as MutateCategoryViewModel;
  const payload = mapper.map<
    MutateCategoryViewModel,
    EditCategoryCommandPayload
  >(
    mutateCategoryViewModel,
    'MutateCategoryViewModel',
    'EditCategoryCommandPayload',
    { extraArgs: () => ({ categoryId }) },
  );

  const command = commandFactory.create<EditCategoryCommandPayload, ICategory>(
    'editCategoryCommand',
    payload,
  );
  const editedCategory = await invoker.invoke<ICategory>(command);

  if (!editedCategory) {
    throw new ErrorWithStatusCode(
      `No category with id ${categoryId} was returned as a result of the edit command.`,
      500,
      'Edit category did not return a result.',
    );
  }

  const viewModel = mapper.map<ICategory, CategoryViewModel>(
    editedCategory,
    'ICategory',
    'CategoryViewModel',
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
    throw new ErrorWithStatusCode(
      'You do not have permission to delete categories.',
      403,
      'You do not have permission to delete categories.',
    );
  }

  const categoryId = req.query.id as string;

  const deleteCategoryCommandPayload = mapper.map<
    string,
    DeleteCategoryCommandPayload
  >(categoryId, 'string', 'DeleteCategoryCommandPayload');

  const command = commandFactory.create<DeleteCategoryCommandPayload, void>(
    'deleteCategoryCommand',
    deleteCategoryCommandPayload,
  );

  await invoker.invoke<void>(command);

  return res.status(204).end();
});

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const userIsAdmin = await serverIdentity.userHasRole(
    req,
    res,
    UserRolesEnum.Admin,
  );

  if (!userIsAdmin) {
    throw new ErrorWithStatusCode(
      'You do not have permission to query categories.',
      403,
      'You do not have permission to query categories.',
    );
  }

  const categoryId = req.query.id as string;

  const category = await categoryService.getCategoryById(categoryId);

  if (!category) {
    throw new ErrorWithStatusCode(
      `Category with id '${categoryId}' not found.`,
      404,
      'Category not found.',
    );
  }

  const categoryViewModel = mapper.map<ICategory, CategoryViewModel>(
    category,
    'ICategory',
    'CategoryViewModel',
  );

  return res.status(200).json(categoryViewModel);
});

export default router.handler(defaultHandler);
