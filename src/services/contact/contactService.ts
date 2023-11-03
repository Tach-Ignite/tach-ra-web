import { IContactService } from '@/abstractions';
import {
  ICommandRepository,
  IEmailService,
  IMapper,
  IProvider,
} from '@/lib/abstractions';
import { ContactRequestDto, IContactRequest } from '@/models';
import '@/mappingProfiles/services/contact/mappingProfile';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable(
  'contactService',
  'contactRequestCommandRepository',
  'emailService',
  'automapperProvider',
  'tachEmailSource',
  'nextPublicBaseUrl',
)
export class ContactService implements IContactService {
  private _contactRequestCommandRepository: ICommandRepository<ContactRequestDto>;

  private _emailService: IEmailService;

  private _automapperProvider: IProvider<IMapper>;

  private _tachEmailSource: string;

  private _nextPublicBaseUrl: string;

  constructor(
    contactRequestCommandRepository: ICommandRepository<ContactRequestDto>,
    emailService: IEmailService,
    automapperProvider: IProvider<IMapper>,
    tachEmailSource: string,
    nextPublicBaseUrl: string,
  ) {
    this._contactRequestCommandRepository = contactRequestCommandRepository;
    this._emailService = emailService;
    this._automapperProvider = automapperProvider;
    this._tachEmailSource = tachEmailSource;
    this._nextPublicBaseUrl = nextPublicBaseUrl;
  }

  public async createContactRequest(
    contactRequest: IContactRequest,
  ): Promise<void> {
    const mapper = this._automapperProvider.provide();
    const contactRequestDto = mapper.map<IContactRequest, ContactRequestDto>(
      contactRequest,
      'IContactRequest',
      'ContactRequestDto',
    );

    const contactRequestId = await this._contactRequestCommandRepository.create(
      contactRequestDto,
    );

    await this._emailService.sendEmail(
      contactRequest.email,
      this._tachEmailSource,
      `[Contact Us] message from ${contactRequest.email} on ${this._nextPublicBaseUrl}`,
      `<p>Sender Name: ${contactRequest.name}</p><p>Sender Email: ${contactRequest.email}</p><p>Message:<br />${contactRequest.message}</p>`,
    );
  }
}
