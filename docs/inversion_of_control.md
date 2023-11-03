# Inversion of Control (IOC)

Our IOC implementation is based roughly off [NestJs](https://docs.nestjs.com) [Providers](https://docs.nestjs.com/providers) and [Modules](https://docs.nestjs.com/modules).

Because of the nature of typescript transpilation, javascript, the web, and nextjs, there are often many entry points (or [composition roots](https://freecontent.manning.com/dependency-injection-in-net-2nd-edition-understanding-the-composition-root/)). For example, api handlers and getServerSideProps functions are composition roots. The dependencies for a given operation can vary widely, and as a result it would be wasteful to load the entire dependency graph for each operation.

## Basic implementation

There are three key tasks that need to be done in order to resolve dependencies:

1. Tell the IOC system that a class is injectable, along with its expected dependencies
2. Define a logical grouping (module) that contains all dependencies (providers) for an application area
3. Resolve the module, including all its providers, for use in a composition root.

### 1. @Injectable

The IOC system includes a decorator that you should add to any class that you'd like to be injectable as a provider. It accepts any number of strings as arguments. The first string defines the token that represents the provider, and the rest are tokens that represent providers that should be injected into the class constructor:

```typescript
// /src/services/fruits
@Injectable('fruitService', 'fruitQualityChecker', 'fruitStorage')
export class MySpecialFruitService implements IFruitService {
  ...
  constructor(fruitQualityChecker: IQualityChecker<IFruit>, fruitStorage: IStorage<IFruit>) {
    ...
  }
  ...
}
```

_NOTE: The dependency tokens do NOT need to match the parameter names. This system allows minification of parameter names without breaking the IOC functionality. However, the order of dependencies must match._

### 2. @Module and ModuleClass

To define module that will contain the logical grouping of providers, utilize the `@Module` decorator on a class that extends `ModuleClass`:

```typescript
// /src/modules/pages/api/fruits
@Module
export class FruitsApiModule extends ModuleClass {
  constructor() {
    super({
      imports: [],
      provides: [
        {
          provide: 'fruitQualityChecker',
          useClass: FruitQualityChecker,
        },
        {
          provide: 'fruitStorage',
          useClass: RefrigeratedStorageService,
        },
        {
          provide: 'fruitService',
          useClass: MySpecialFruitService,
        },
      ],
    });
  }
}
```

_NOTE: It's important that the `provides` string in the `Module` definition matches the tokens listed in `@Injectable`. Otherwise, your dependencies will not be resolved properly._

### 3. Module and Provider resolution

Finally, you will need to resolve the module and its providers for use in the composition root, whether its an api endpoint or server-side component:

```typescript
// /src/pages/api/fruits/index.ts

const m = new ModuleResolver().resolve(FruitsApiModule);
const fruitService = m.resolve<IFruitService>('fruitService');
fruitService.doSomeCoolFruitStuff();
```

## Modules

Modules allow us to limit the dependencies loaded to logical areas of the application. for example, the `ProductsApiModule` loads only the dependencies needed for the operations within that api.

Example module definition and resolution:

```typescript
@Module
export class MyModule extends ModuleClass {
  constructor() {
    super({
      provides: [
        {
          provide: 'fruitService',
          useClass: MyFruitService,
        },
      ],
    });
  }
}

const m = new ModuleResolver().resolve(MyModule);
const fruitService = m.resolve<IFruitService>('fruitService');
```

Modules also allow us to logically group dependencies together. A simple example is the `EmailServiceModule`. utilizing the email service requires not only the service itself, but a few configuration variables as well, including base application url and the from email. The `EmailServiceModule` provides all these dependencies; we can avoid repeating ourselves by importing this module in modules that utilize the email service:

```typescript
import { EmailServiceModule } from '@/lib/modules/services/server/notifications/emailService.module.ts'
...
@Module
export class UserServiceModule extends ModuleClass {
  constructor() {
    super({
      imports: [EmailServiceModule]
      provides: [
        ...
      ]
    });
  }
}
```

### Module Options

The `ModuleClass` constructor requires an `IModuleConfig` object. This object has two properties:

- imports: an optional array of `IModule`s that the module relies on.
- providers: a required array of `IModuleProvider`s that the module relies on.

### Module Providers

Module Providers support three different modes:

- useClass: accepts a concrete class. dependencies will be automatically resolved:

```typescript
@Module
export class MyModule extends ModuleClass {
  constructor() {
    super({
      providers: [
        {
          provides: 'productService',
          useClass: ProductService,
        },
      ],
    });
  }
}
```

- useValue: accepts a value to be injected. This value can be any type and is useful for passing a specific implementations, perhaps for third party objects or instances that require a little more initialization:

```typescript
@Module
export class MyModule extends ModuleClass {
  constructor() {
    super({
      providers: [
        {
          provides: 'ajv',
          useValue: new ajv({...}),
        }
      ]
    });
  }
}
```

- useFactory: accepts a function with the signature:

```typescript
(serviceResolver: IServiceResolver) => T;
```

where T is the returned provider. This is useful when utilizing generics that require unique values to be passed as parameters. For example, our library provides generic database repositories. However, because @Injectable ties these implementations to generic strings (like `'queryRepository'`), they will not resolved properly if a `productQueryRepository` token is expected. This generic implementation also expects a collectionName string specific to the collection its querying:

```typescript
@Injectable('queryRepository', 'databaseClientFactory', 'collectionName')
export class DatabaseQueryRepository<T> implements IQueryRepository<T> {
  ...
  constructor(databaseClientFactory: IFactory<IPromise<IDatabaseClient>>, collectionName: string) {
    ...
  }
  ...
}

@Module
export class MyModule extends ModuleClass {
  constructor() {
    super({
      providers: [
        {
          provides: 'productQueryRepository',
          useFactory: (serviceResolver: IServiceResolver) => {
            const databaseClientFactory = serviceResolver.resolve<IFactory<IPromise<IDatabaseClient>>>('databaseClientFactory');
            return new DatabaseQueryRepository<ProductDto>(databaseClientFactory, 'products');
          }
        }
      ]
    });
  }
}
```

## Extra Arguments at provider definition

It is possible to supply extra arguments specific to that provider. This is particularly useful where its not appropriate for that argument to be a provider. For example, if you have a generic class that is utilized multiple times, you may need to provide specific parameter values based on that utilization. In that case, you can use the extraArgs option:

```typescript
@Module
export class MyModule extends ModuleClass {
  constructor() {
    super({
      providers: [
        {
          provides: 'myGenericService',
          useClass: GenericService<Fruit>,
          extraArgs: { category: 'food' },
        },
      ],
    });
  }
}
```

This extraArgs parameter will override any provider that may be defined for `category`.

## Extra Arguments at resolution

Sometimes you need to inject values you only know about at runtime. in this case, you can include extra args during resolution:

```typescript
const m = new ModuleResolver().resolve(MyModule);
const myService = m.resolve<IService>('service', {
  somethingElse: someRuntimeVariable,
});
```

These extra arguments will override any associated providers.
