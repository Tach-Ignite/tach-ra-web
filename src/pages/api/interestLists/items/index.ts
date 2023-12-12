import type { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { createRouter, expressWrapper } from 'next-connect';
import {
  ICommandFactory,
  IInvoker,
  IMapper,
  IProvider,
  IServerIdentity,
  RecaptchaValidationResponse,
  ValidateRecaptchaTokenCommandPayload,
} from '@/lib/abstractions';
import { defaultHandler } from '@/lib/api';
import { ErrorWithStatusCode } from '@/lib/errors';
import '@/mappingProfiles/pages/api/interestLists/mappingProfile';
import { ModuleResolver } from '@/lib/ioc/';
import { InterestListsApiModule } from '@/modules/pages/api/interestLists/interestListsApi.module';
import { AddUserToInterestListViewModel } from '@/models/viewModels/interestLists';
import { IInterestListService } from '@/abstractions/services/iInterestListService';
import { CreateInterestListCommandPayload } from '@/models/commands/payloads/interestLists/createInterestListCommandPayload';
import { IInterestList, IInterestListItem } from '@/models/domain/interestList';
import { CreateInterestListItemCommandPayload } from '@/models/commands/payloads/interestLists/createInterestListItemCommandPayload';

const m = new ModuleResolver().resolve(InterestListsApiModule);
const serverIdentity = m.resolve<IServerIdentity>('serverIdentity');
const interestListService = m.resolve<IInterestListService>(
  'interestListService',
);
const automapperProvider = m.resolve<IProvider<IMapper>>('automapperProvider');
const commandFactory = m.resolve<ICommandFactory>('commandFactory');
const invoker = m.resolve<IInvoker>('invoker');
const mapper = automapperProvider.provide();

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(expressWrapper(cors()));

router.post(
  async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const addUserToInterestListViewModel =
      req.body as AddUserToInterestListViewModel;

    const validateRecaptchaTokenCommandPayload = mapper.map<
      AddUserToInterestListViewModel,
      ValidateRecaptchaTokenCommandPayload
    >(
      addUserToInterestListViewModel,
      'AddUserToInterestListViewModel',
      'ValidateRecaptchaTokenCommandPayload',
    );

    const validateRecaptchaTokenCommand = commandFactory.create<
      ValidateRecaptchaTokenCommandPayload,
      RecaptchaValidationResponse
    >('validateRecaptchaTokenCommand', validateRecaptchaTokenCommandPayload);
    const validateRecaptchaResponse =
      await invoker.invoke<RecaptchaValidationResponse>(
        validateRecaptchaTokenCommand,
      );

    if (!validateRecaptchaResponse) {
      throw new ErrorWithStatusCode(
        'The validateRecaptchaTokenCommand invocation did not return a result.',
        500,
        'There was a server error. Please try again later.',
      );
    }

    if (!validateRecaptchaResponse.success) {
      throw new ErrorWithStatusCode(
        `The validateRecaptchaTokenCommand invocation did not return a successful result: ${JSON.stringify(
          validateRecaptchaResponse,
        )}`,
        400,
        'Invalid Captcha',
      );
    }

    let interestList: IInterestList | undefined | null =
      await interestListService.getInterestList(
        addUserToInterestListViewModel.interestListFriendlyId,
      );

    if (!interestList) {
      const createInterestListCommandPayload = mapper.map<
        AddUserToInterestListViewModel,
        CreateInterestListCommandPayload
      >(
        addUserToInterestListViewModel,
        'AddUserToInterestListViewModel',
        'CreateInterestListCommandPayload',
      );

      const createInterestListCommand = commandFactory.create<
        CreateInterestListCommandPayload,
        IInterestList
      >('createInterestListCommand', createInterestListCommandPayload);

      interestList = await invoker.invoke<IInterestList>(
        createInterestListCommand,
      );

      if (!interestList) {
        throw new ErrorWithStatusCode(
          'The create interest list command did not return a result.',
          500,
          'There was an error creating the interest list. Please try again later.',
        );
      }
    }

    const createInterestListItemCommandPayload = mapper.map<
      AddUserToInterestListViewModel,
      CreateInterestListItemCommandPayload
    >(
      addUserToInterestListViewModel,
      'AddUserToInterestListViewModel',
      'CreateInterestListItemCommandPayload',
      { extraArgs: () => ({ interestList }) },
    );

    const createInterestListItemCommand = commandFactory.create<
      CreateInterestListItemCommandPayload,
      IInterestListItem
    >('createInterestListItemCommand', createInterestListItemCommandPayload);

    const interestListItem = await invoker.invoke<IInterestListItem>(
      createInterestListItemCommand,
    );

    if (!interestListItem) {
      throw new ErrorWithStatusCode(
        'The create interest list item command did not return a result.',
        500,
        'There was an error creating the interest list item. Please try again later.',
      );
    }

    return res.status(200).json(interestListItem);
  },
);

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  throw new Error('Not implemented');
});

export default router.handler(defaultHandler);

// if (addUserToInterestListViewModel.optedInToGenericNotifications) {
//   let globalInterestList: IInterestList | undefined | null =
//     await interestListService.getInterestList(
//       addUserToInterestListViewModel.interestListFriendlyId,
//     );

//   if (!globalInterestList) {
//     const createInterestListCommandPayload = mapper.map<
//       AddUserToInterestListViewModel,
//       CreateInterestListCommandPayload
//     >(
//       {
//         ...addUserToInterestListViewModel,
//         interestListFriendlyId: 'global',
//       },
//       'AddUserToInterestListViewModel',
//       'CreateInterestListCommandPayload',
//     );

//     const createInterestListCommand = commandFactory.create<
//       CreateInterestListCommandPayload,
//       IInterestList
//     >('createInterestListCommand', createInterestListCommandPayload);

//     globalInterestList = await invoker.invoke<IInterestList>(
//       createInterestListCommand,
//     );

//     if (!globalInterestList) {
//       throw new ErrorWithStatusCode(
//         'The create interest list command did not return a result.',
//         500,
//         'There was an error creating the interest list. Please try again later.',
//       );
//     }
//   }

//   const createInterestListItemCommandPayload = mapper.map<
//     AddUserToInterestListViewModel,
//     CreateInterestListItemCommandPayload
//   >(
//     addUserToInterestListViewModel,
//     'AddUserToInterestListViewModel',
//     'CreateInterestListItemCommandPayload',
//     { extraArgs: () => ({ globalInterestList }) },
//   );

//   const createInterestListItemCommand = commandFactory.create<
//     CreateInterestListItemCommandPayload,
//     IInterestListItem
//   >('createInterestListItemCommand', createInterestListItemCommandPayload);

//   const interestListItem = await invoker.invoke<IInterestListItem>(
//     createInterestListItemCommand,
//   );

//   if (!interestListItem) {
//     throw new ErrorWithStatusCode(
//       'The create interest list item command did not return a result.',
//       500,
//       'There was an error creating the interest list item. Please try again later.',
//     );
//   }
// }
