import {
  ICommandRepository,
  IEmailService,
  IMapper,
  IProvider,
} from '@/lib/abstractions';
import { ContactRequestDto, IContactRequest } from '@/models';
import { ContactService } from '@/services/contact';

describe('contactService', () => {
  let service: ContactService;
  let contactRequestCommandRepository: jest.Mocked<
    ICommandRepository<ContactRequestDto>
  >;
  let emailService: jest.Mocked<IEmailService>;
  let automapperProvider: IProvider<IMapper>;
  const tachEmailSource: string = 'source@test.com';
  const nextPublicBaseUrl: string = 'https://test.com';
  const mapMock = jest.fn();
  const mapArrayMock = jest.fn();

  beforeEach(() => {
    contactRequestCommandRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      generateId: jest.fn(),
    };
    emailService = {
      sendEmail: jest.fn(),
    };
    automapperProvider = {
      provide: () => ({ map: mapMock, mapArray: mapArrayMock }),
    };

    service = new ContactService(
      contactRequestCommandRepository,
      emailService,
      automapperProvider,
      tachEmailSource,
      nextPublicBaseUrl,
    );
  });

  describe('createContactRequest', () => {
    it('should create a contact request', async () => {
      const contactRequest: IContactRequest = {
        name: 'John Doe',
        email: 'test@test.com',
        message: 'This is a test message',
        optedInToEmailAlerts: false,
        agreedToPrivacyPolicy: true,
      };
      const contactRequestDto: ContactRequestDto = {
        name: 'John Doe',
        email: 'test@test.com',
        message: 'This is a test message',
        optedInToEmailAlerts: false,
        agreedToPrivacyPolicy: true,
      };

      mapMock.mockReturnValueOnce(contactRequestDto);
      contactRequestCommandRepository.create.mockResolvedValueOnce('123');

      await service.createContactRequest(contactRequest);

      expect(mapMock).toBeCalledTimes(1);
      expect(contactRequestCommandRepository.create).toBeCalledTimes(1);
      expect(contactRequestCommandRepository.create).toBeCalledWith(
        contactRequestDto,
      );
      expect(emailService.sendEmail).toBeCalledTimes(1);
      expect(emailService.sendEmail).toBeCalledWith(
        contactRequest.email,
        tachEmailSource,
        `[Contact Us] message from ${contactRequest.email} on ${nextPublicBaseUrl}`,
        `<p>Sender Name: ${contactRequest.name}</p><p>Sender Email: ${contactRequest.email}</p><p>Message:<br />${contactRequest.message}</p>`,
      );
    });
  });
});
