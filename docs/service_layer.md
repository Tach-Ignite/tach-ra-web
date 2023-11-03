# Service Layer

The service layer architecture is designed with the following principles in mind:

1. Provide a pattern that can be applied to any new business functionality quickly and predictably
2. Provide a highly decoupled architecture that is easy to maintain and extend
3. Minimize regressions
4. Utilize patterns that will scale as the application scales beyond nextjs

## Patterns

The patterns utilized in the service layer are:

- [Command Pattern](https://refactoring.guru/design-patterns/command)
- [Command Query Responsibility Segregation (CQRS)](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)
- [Repository Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/repository)

## Layers

The layers from top to bottom are:

1. Api endpoint
2. Command
3. Service
4. Repository
5. Data Access Layer

### Command Pattern

The command pattern adds a bit of boilerplate, but it makes intent clear and consistent. It also flows extremely well into the CQRS pattern, making scaling the application easier later.

#### Command Usage

To use the command pattern, you must first create a command. Commands are created in the `commands` directory. They are named with the following convention: `[entity][action]Command.ts`. For example, `createUserCommand.ts` or `updateUserCommand.ts`.

Each command is given a payload of data that it needs to execute. Commands conceptually exist in the domain layer, and therefore should have no knowledge of ViewModels, Dtos, or Repositories. Therefore, conversion from ViewModels to Domain Models should happen before creating the command.

```typescript
// models/commands/payloads/createUserCommandPayload.ts

export type CreateUserCommandPayload = {
  user: IUser; //<-- IUser is a domain model
};
```

The command should be created with the payload and any services it needs to execute. The command may also have a result property that will be set after the command is executed.

```typescript
// commands/createUserCommand.ts
import { Command } from '@/lib/commands';

export class CreateUserCommand extends Command<
  CreateUserCommandPayload,
  IUser
> {
  private _userService: IUserService;

  constructor(userService: IUserService, payload: CreateUserCommandPayload) {
    super(payload);
    this._userService = userService;
  }

  async execute(): Promise<void> {
    this.result = await this._userService.createUser(this.payload.user);
  }
}
```

The command should be registered in the bootstrapper so that the command factory can resolve it:

```typescript
// ioc/server/appBootstrapper.ts
...
container.bind<CreateUserCommand>('createUserCommand', CreateUserCommand);
```

The command can then be created via the command factory:

```typescript
// api/users/index.ts
...
const createUserCommand = commandFactory.create<CreateUserCommandPayload, IUser>('createUserCommand', createUserCommandPayload);
...
```

Finally, the command can be invoked using an IInvoker and the result can be read:

    ```typescript
    // api/users/index.ts
    ...
    const createdUser = await invoker.invoke(createUserCommand);
    ...
    ```

Putting it all together in the api endpoint looks something like this:

```typescript
// api/users/index.ts

import { AppBootstrapper } from '@/ioc/server/appBootstrapper';

const serviceResolver = new AppBootstrapper().bootstrap();
const commandFactory = serviceResolver.resolve<ICommandFactory>('commandFactory');
const invoker = serviceResolver.resolve<IInvoker>('invoker');
const automapperProvider = serviceResolver.resolve<IProvider<IMapper>>('automapperProvider');

...

router.post(async (req, res) => {
    ...
    const createUserViewModel = req.body;

    const createUserCommandPayload = mapper.map<CreateUserViewModel, CreateUserCommandPayload>(
        createUserViewModel,
        'CreateUserViewModel',
        'CreateUserCommandPayload',
    );

    const createUserCommand = commandFactory.create<CreateUserCommandPayload, IUser>('createUserCommand', createUserCommandPayload);

    const createdUser = await invoker.invoke(createUserCommand);
    ...
});
```

#### Command Chaining

In the future we may extend the invoker to allow more advanced scenarios like command chaining, running multiple commands in parallel, etc. For now, the invoker is a simple abstraction that allows us to decouple the api endpoint from the command. When multiple command execution for a single operation is needed, you will need to manage the flow yourself.

### Service Layer

The service layer is where all business logic lives. It should validate business entities passed into it and utilize repositories to retrieve and persist data. The service layer should only know about domain models and dtos.

```typescript
export class UserService implements IUserService {
  private _userQueryRepository: IUserQueryRepository;
  private _userCommandRepository: IUserCommandRepository;
  private _validator: IValidator;
  private _automapperProvider: IProvider<IMapper>;

  constructor(
    userQueryRepository: IUserQueryRepository,
    userCommandRepository: IUserCommandRepository,
    validator: IValidator,
    automapperProvider: IProvider<IMapper>,
  ) {
    this._userQueryRepository = userQueryRepository;
    this._userCommandRepository = userCommandRepository;
    this._validator = validator;
    this._automapperProvider = automapperProvider;
  }

  async getUserById(userId: string): Promise<IUser> {
    ...
  }

  async createUser(user: IUser): Promise<IUser> {
    const validationResult = await this._validator.validate(user);

    if (!validationResult.isValid) {
      throw new ErrorWithErrorCode(
        validationResult.message,
        400,
        'The user is invalid',
      );
    }

    //this business logic says that a user cannot be created if one already exists with the same email
    const existingUser = await this._userQueryRepository.getUserByEmail(
      user.email,
    );
    if (existingUser) {
      throw new ErrorWithStatusCode(`User with email '${user.email}' already exists`, 400, 'User email is already in use.');
    }

    //before passing to the repository layer, convert to dto
    const mapper = this._automapperProvider.get();
    const userDto = mapper.map<IUser, IUserDto>(user, 'IUser', 'IUserDto');

    const createdUserId = await this._userCommandRepository.createUser(userDto);

    //utilize already existing get to retrieve the created user so we dont reinvent the wheel
    const createUser = await this.getUserById(createdUserId);

    // return the user
    return createdUser;
  }
}
```

### Repository Layer

As noted above, the service layer utilizes query repositories and command repositories to retrieve and persist data. The repository layer should only know about dtos and the data access layer. The RA provides generic database query and command repositories that can be extended to provide custom functionality. Out of the box, these generic repositories provide basic CRUD operations.

```typescript

export class UserDatabaseQueryRepository extends DatabaseQueryRepository<UserDto> implements IUserQueryRepository {
    ...

    async getUsersNamedJon(): Promise<IUserDto[]> {
        const databaseClient = this._databaseClientFactory.create();
        const users = await databaseClient.find({ name: 'Jon'});
        return users;
    }
    ...
}
```

### Data Access Layer

As you can see above, the repositories will utilize the database client factory to retrieve a database client. This allows for obfuscation of the actual implementation of the client from its usage.

### Queries

Queries are used to retrieve data from the database. For now, we are just resolving the service into the api layer to execute queries. However, ideally we would either have a query pattern similar to the command pattern, or we should make the query repository layer a bit more robust to handle joining logic, error handling, etc that is happening in the service layer.

```typescript
// api/users/index.ts

router.get(async (req, res) => {
    ...
    const userId = req.query.id;

    const user = await userService.getUserById(userId);

    const mapper = automapperProvider.get();
    const userViewModel = mapper.map<IUser, UserViewModel>(
        user,
        'IUser',
        'UserViewModel',
    );

    return res.status(200).json(userViewModel);
    ...
});
```
