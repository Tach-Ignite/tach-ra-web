import { IContactService } from '@/abstractions';
import { Command } from '@/lib/commands';
import { Injectable } from '@/lib/ioc/injectable';
import { CreateContactRequestCommandPayload } from '@/models';

@Injectable('createContactRequestCommand', 'contactService', 'payload')
export class CreateContactRequestCommand extends Command<
  CreateContactRequestCommandPayload,
  void
> {
  private _contactService: IContactService;

  constructor(
    contactService: IContactService,
    payload: CreateContactRequestCommandPayload,
  ) {
    super(payload);
    this._contactService = contactService;
  }

  async execute(): Promise<void> {
    await this._contactService.createContactRequest(
      this._payload.contactRequest,
    );
  }
}
