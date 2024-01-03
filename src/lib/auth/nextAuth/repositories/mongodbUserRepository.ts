import { User } from 'next-auth';
import { ObjectId } from 'mongodb';
import {
  IMongoDbNextAuthCollections,
  ICommandRepository,
  IFactory,
} from '@/lib/abstractions';

/**
 * @deprecated
 */
export class MongoDbUserRepository implements ICommandRepository<User> {
  private _collectionsFactory: IFactory<Promise<IMongoDbNextAuthCollections>>;

  constructor(
    mongoDbNextAuthCollectionsFactory: IFactory<
      Promise<IMongoDbNextAuthCollections>
    >,
  ) {
    this._collectionsFactory = mongoDbNextAuthCollectionsFactory;
  }

  async generateId(): Promise<string> {
    return new ObjectId().toString();
  }

  async create(user: User): Promise<string> {
    const collections = await this._collectionsFactory.create();
    const response = await collections.Users.insertOne(user);
    return response.insertedId.toString();
  }

  async update(id: string, user: Partial<User>): Promise<void> {
    const collections = await this._collectionsFactory.create();
    const response = await collections.Users.findOneAndUpdate(
      { id: user.id },
      user,
    );
  }

  async delete(id: string): Promise<void> {
    const collections = await this._collectionsFactory.create();
    const response = await collections.Users.findOneAndDelete({ id });
  }

  async deleteMany(filter: any): Promise<void> {
    const collections = await this._collectionsFactory.create();
    const response = await collections.Users.deleteMany(filter);
  }

  async getById(id: string): Promise<User | null> {
    const collections = await this._collectionsFactory.create();
    const response = await collections.Users.findOne({ id });
    return response;
  }

  async list(): Promise<User[]> {
    return this.find({});
  }

  async find(filter: any): Promise<User[]> {
    const collections = await this._collectionsFactory.create();
    const response = await collections.Users.find(filter).toArray();
    return response;
  }
}
