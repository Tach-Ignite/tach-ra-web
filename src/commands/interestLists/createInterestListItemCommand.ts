import { IInterestListService } from '@/abstractions/services/iInterestListService';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc/injectable';
import { CreateInterestListItemCommandPayload } from '@/models/commands/payloads/interestLists/createInterestListItemCommandPayload';
import { IInterestListItem } from '@/models/domain/interestList';

@Injectable('createInterestListItemCommand', 'interestListService', 'payload')
export class CreateInterestListItemCommand extends Command<
  CreateInterestListItemCommandPayload,
  IInterestListItem
> {
  private _interestListService: IInterestListService;

  constructor(
    interestListService: IInterestListService,
    payload: CreateInterestListItemCommandPayload,
  ) {
    super(payload);
    this._interestListService = interestListService;
  }

  async execute(): Promise<void> {
    this.result = await this._interestListService.createInterestListItem(
      this._payload.interestListItem,
    );
  }
}
