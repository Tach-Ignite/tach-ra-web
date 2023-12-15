import { IContactService } from '@/abstractions';
import {
  ICommandRepository,
  IEmailService,
  IFactory,
  IMapper,
  IProvider,
} from '@/lib/abstractions';
import { ContactRequestDto, IContactRequest } from '@/models';
import '@/mappingProfiles/services/contact/mappingProfile';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable(
  'contactService',
  'contactRequestCommandRepository',
  'emailServiceFactory',
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

  private _tachEmailContactAddress: string;

  constructor(
    contactRequestCommandRepository: ICommandRepository<ContactRequestDto>,
    emailServiceFactory: IFactory<IEmailService>,
    automapperProvider: IProvider<IMapper>,
    tachEmailSource: string,
    tachEmailContactAddress: string,
    nextPublicBaseUrl: string,
  ) {
    this._contactRequestCommandRepository = contactRequestCommandRepository;
    this._emailService = emailServiceFactory.create();
    this._automapperProvider = automapperProvider;
    this._tachEmailSource = tachEmailSource;
    this._tachEmailContactAddress = tachEmailContactAddress;
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
      this._tachEmailSource,
      this._tachEmailContactAddress,
      `[Contact Us] message from ${contactRequest.email} on ${this._nextPublicBaseUrl}`,
      `<p>Sender Name: ${contactRequest.name}</p><p>Sender Email: ${contactRequest.email}</p><p>Message:<br />${contactRequest.message}</p>`,
      contactRequest.email,
    );
  }
}
