import {
  ICommandRepository,
  IMapper,
  IProvider,
  IQueryRepository,
} from '@/lib/abstractions';
import '@/mappingProfiles/services/interestLists/mappingProfile';
import { Injectable } from '@/lib/ioc/injectable';
import {
  InterestListDto,
  InterestListItemDto,
} from '@/models/dtos/interestList';
import { IInterestListService } from '@/abstractions/services/iInterestListService';
import { IInterestList, IInterestListItem } from '@/models/domain/interestList';
import { ErrorWithStatusCode } from '@/lib/errors';

@Injectable(
  'interestListService',
  'interestListCommandRepository',
  'interestListQueryRepository',
  'interestListItemCommandRepository',
  'interestListItemQueryRepository',
  'automapperProvider',
)
export class InterestListService implements IInterestListService {
  private _interestListCommandRepository: ICommandRepository<InterestListDto>;

  private _interestListQueryRepository: IQueryRepository<InterestListDto>;

  private _interestListItemCommandRepository: ICommandRepository<InterestListItemDto>;

  private _interestListItemQueryRepository: IQueryRepository<InterestListItemDto>;

  private _automapperProvider: IProvider<IMapper>;

  constructor(
    interestListCommandRepository: ICommandRepository<InterestListDto>,
    interestListQueryRepository: IQueryRepository<InterestListDto>,
    interestListItemCommandRepository: ICommandRepository<InterestListItemDto>,
    interestListItemQueryRepository: IQueryRepository<InterestListItemDto>,
    automapperProvider: IProvider<IMapper>,
  ) {
    this._interestListCommandRepository = interestListCommandRepository;
    this._interestListQueryRepository = interestListQueryRepository;
    this._automapperProvider = automapperProvider;
    this._interestListItemCommandRepository = interestListItemCommandRepository;
    this._interestListItemQueryRepository = interestListItemQueryRepository;
    this._automapperProvider = automapperProvider;
  }

  public async createInterestList(
    interestList: IInterestList,
  ): Promise<IInterestList> {
    const automapper = this._automapperProvider.provide();
    const interestListDto = automapper.map<IInterestList, InterestListDto>(
      interestList,
      'IInterestList',
      'InterestListDto',
    );

    const interestListId = await this._interestListCommandRepository.create(
      interestListDto,
    );

    const createdInterestListDto =
      await this._interestListQueryRepository.getById(interestListId);

    if (!createdInterestListDto) {
      throw new ErrorWithStatusCode('Failed to create interest list', 500);
    }

    const createdInterestList = automapper.map<InterestListDto, IInterestList>(
      createdInterestListDto,
      'InterestListDto',
      'IInterestList',
    );

    return createdInterestList;
  }

  public async createInterestListItem(
    interestListItem: IInterestListItem,
  ): Promise<IInterestListItem> {
    const automapper = this._automapperProvider.provide();

    const existingInterestListItemDto =
      await this._interestListItemQueryRepository.find({
        interestListId: interestListItem.interestList._id,
        email: interestListItem.email,
      });

    if (existingInterestListItemDto.length > 0) {
      throw new ErrorWithStatusCode('Interest list item already exists', 400);
    }

    const interestListItemDto = automapper.map<
      IInterestListItem,
      InterestListItemDto
    >(interestListItem, 'IInterestListItem', 'InterestListItemDto');

    const interestListItemId =
      await this._interestListItemCommandRepository.create(interestListItemDto);

    const createdInterestListItemDto =
      await this._interestListItemQueryRepository.getById(interestListItemId);

    if (!createdInterestListItemDto) {
      throw new ErrorWithStatusCode('Failed to create interest list item', 500);
    }

    const createdInterestListItem = automapper.map<
      InterestListItemDto,
      IInterestListItem
    >(createdInterestListItemDto, 'InterestListItemDto', 'IInterestListItem');

    return createdInterestListItem;
  }

  public async getInterestList(
    friendlyId: string,
  ): Promise<IInterestList | null> {
    const automapper = this._automapperProvider.provide();

    const interestListDto = await this._interestListQueryRepository.find({
      friendlyId,
    });

    if (interestListDto.length === 0) {
      return null;
    }

    const interestList = await automapper.map<InterestListDto, IInterestList>(
      interestListDto[0],
      'InterestListDto',
      'IInterestList',
    );

    return interestList;
  }

  public async getInterestListItem(
    interestListFriendlyId: string,
    email: string,
  ): Promise<IInterestListItem | null> {
    const automapper = this._automapperProvider.provide();

    const interestListItemDto =
      await this._interestListItemQueryRepository.find({
        friendlyId: interestListFriendlyId,
        email,
      });

    if (interestListItemDto.length === 0) {
      return null;
    }

    const interestListItem = await automapper.map<
      InterestListItemDto,
      IInterestListItem
    >(interestListItemDto[0], 'InterestListItemDto', 'IInterestListItem');

    return interestListItem;
  }
}
