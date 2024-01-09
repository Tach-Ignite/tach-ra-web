import { IUserAddressQueryRepository } from '@/abstractions';
import { IDatabaseClient, IFactory } from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';
import { DatabaseQueryRepository } from '@/lib/repositories/databaseQueryRepository';
import { UserDto } from '@/models';

@Injectable('userAddressQueryRepository', 'databaseClientFactory')
export class UserAddressDatabaseQueryRepository
  extends DatabaseQueryRepository<UserDto>
  implements IUserAddressQueryRepository
{
  constructor(databaseClientFactory: IFactory<Promise<IDatabaseClient>>) {
    super(databaseClientFactory, 'users');
  }

  public async userHasAddressAndRecipient(
    userId: string,
    addressId: string,
    recipientName: string,
  ): Promise<boolean> {
    const user = await this.getById(userId);

    const userAddress = user?.addresses?.find(
      (a) => a.addressId === addressId && a.recipientName === recipientName,
    );

    return userAddress !== undefined;
  }
}
