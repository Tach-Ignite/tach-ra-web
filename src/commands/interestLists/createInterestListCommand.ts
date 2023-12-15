import { IInterestListService } from '@/abstractions/services/iInterestListService';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc/injectable';
import { CreateInterestListCommandPayload } from '@/models/commands/payloads/interestLists/createInterestListCommandPayload';
import { IInterestList } from '@/models/domain/interestList';

@Injectable('createInterestListCommand', 'interestListService', 'payload')
export class CreateInterestListCommand extends Command<
  CreateInterestListCommandPayload,
  IInterestList
> {
  private _interestListService: IInterestListService;

  constructor(
    interestListService: IInterestListService,
    payload: CreateInterestListCommandPayload,
  ) {
    super(payload);
    this._interestListService = interestListService;
  }

  async execute(): Promise<void> {
    this.result = await this._interestListService.createInterestList(
      this._payload.interestList,
    );
  }
}
