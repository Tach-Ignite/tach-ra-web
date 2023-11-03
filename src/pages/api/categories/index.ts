import type { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import {
  IProvider,
  IMapper,
  ICommandFactory,
  IInvoker,
  IServerIdentity,
} from '@/lib/abstractions';
import {
  AddCategoryCommandPayload,
  CategoryViewModel,
  ICategory,
  MutateCategoryViewModel,
  UserRolesEnum,
} from '@/models';
import { ErrorWithStatusCode } from '@/lib/errors';
import { ICategoryService } from '@/abstractions';
import { defaultHandler } from '@/lib/api';
import '@/mappingProfiles/pages/api/categories/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { CategoriesApiModule } from '@/modules/pages/api/categories/categoriesApi.module';

const m = new ModuleResolver().resolve(CategoriesApiModule);
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
const commandFactory = m.resolve<ICommandFactory>('commandFactory');
const invoker = m.resolve<IInvoker>('invoker');
const categoryService = m.resolve<ICategoryService>('categoryService');
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
        .json({ error: 'You do not have permission to create categories.' });
    }

    const mutateCategoryViewModel = req.body as MutateCategoryViewModel;
    const payload = mapper.map<
      MutateCategoryViewModel,
      AddCategoryCommandPayload
    >(
      mutateCategoryViewModel,
      'MutateCategoryViewModel',
      'AddCategoryCommandPayload',
    );

    const command = commandFactory.create<AddCategoryCommandPayload, ICategory>(
      'addCategoryCommand',
      payload,
    );

    const commandResult = await invoker.invoke(command);

    if (!commandResult) {
      throw new ErrorWithStatusCode(
        'The AddCategoryCommand invocation did not return a result.',
        500,
        'Add category did not return a result.',
      );
    }

    const viewModel = mapper.map<ICategory, CategoryViewModel>(
      commandResult,
      'ICategory',
      'CategoryViewModel',
    );

    return res.status(200).json(viewModel);
  },
);

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const userIsAdmin = await serverIdentity.userHasRole(
    req,
    res,
    UserRolesEnum.Admin,
  );

  if (!userIsAdmin) {
    throw new ErrorWithStatusCode(
      'You do not have permission to view categories.',
      403,
      'You do not have permission to view categories.',
    );
  }

  const categories = await categoryService.getAllCategories();

  const categoryViewModels = categories.map((c) =>
    mapper.map<ICategory, CategoryViewModel>(
      c,
      'ICategory',
      'CategoryViewModel',
    ),
  );

  return res.status(200).json(categoryViewModels);
});

export default router.handler(defaultHandler);
