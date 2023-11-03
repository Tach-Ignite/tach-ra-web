# Automapper

This RA utilizes a fork of the [Automapper Typescript library](https://automapperts.netlify.app/). This library allows for syntax similar to the C# [Automapper](https://docs.automapper.org/en/stable/Getting-started.html).

It allows for separation of concerns and automaps fields with similar names, including support for translation between naming conventions like camel-case to snake-case.

## Structure

Our automapper implementation implements a number of different elements with the following goals in mind:

- Follow best practices by having only one automapper implementation shared throughout the application
- Keep the mapper as lightweight as possible in terms of package size, extensibility, configuration, and boilerplate required.
- Keep mappings as close to their source material as possible. For models, the required metadata definiton (more on that later) is in the same file. For mappings, mapping definitions are kept in the same directory as the modules that use them.

## Usage

To successfully map one object to another, a few things need to be done:

1. Define the metadata for both your source and destination interfaces. This is necessary because this RA follows SOLID principles, utilizing interfaces over concretes, and javascript has no concept of types or interfaces.
2. Ensure the metadata is loaded _before_ createMap is called. In the models directory, each file has its own createMetadata() function that creates the metadata for all models exported from that file. These functions are called in rollup functions like createModelMetadata(). As long as your metadatafunction is called within these rollup functions, your metadata will be properly loaded without further modification.
3. Create a mappingProfile.ts file in the mappingProfiles directory. All mapping profiles should be centralized here utilizing the exact same folder structure as the app.
4. import '@/mappingProfiles/.../mappingProfile' in the files that will utilize it. _This is necessary to ensure the profile isn't shaken off the dependency tree and the map is found._
5. use the app server or client bootstrapper to retrieve the mapper provider, and call provide().

### Defining Metadata

As stated above, defining metadata is required because we are relying on interfaces and javascript has no concept of interfaces. Here is an example function that defines the metadata (and will be called at the appropriate time in the automapper lifecycle):

```typescript
// src/models/dtos/myEntityDtos.ts
import { PojosMetadataMap } from '@jersmart/automapper-core';

export function createSomeMetadata() {
  PojosMetadataMap.create<SomeOtherInterfaceOrType>(
    'SomeOtherInterfaceOrType',
    {
      myOtherObject: Object,
      myOtherString: String,
    },
  );
  PojosMetadataMap.create<IMyInterface>('IMyInterface', {
    myString: String,
    myNumber: Number,
    myArrayOfStrings: [String],
    myEntity: 'SomeOtherInterfaceOrType',
    myArrayOfEntities: ['SomeOtherInterfaceOrType'],
  });
}
```

_IMPORTANT:_ The order these create functions are called matters. Because `IMyInterface` relies on `SomeOtherInterfaceOrType`, we must create the metadata for `ISomeOtherInterface` first.

For more information on creating Plain Old Javascript Object (pojos) metadata, see the [docs](https://automapperts.netlify.app/docs/strategies/pojos#metadata).

### Loading Metadata

Call your `createSomeMetadata` function from within the `createModelMetadata` function:

```typescript
// src/models/createModelMetadata.ts
export function createModelMetadata() {
    ...
    createSomeMetadata();
}
```

_IMPORTANT:_ The order in which you create your metadata matters. These create functions are in a very specific order so that any dependency metadata is called before it is used.

### Creating a Mapping Profile

The mapping profile will contain the mapping definitions to convert one object to another. These profiles serve two purposes:

1. They keep the package lightweight. Only the mappings used for that particular operation need to be loaded.
2. They simplify management and creation of mapping definitions.

```typescript
// src/mappingProfiles/pages/api/myEntities/[id]/mappingProfile.ts
import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@jersmart/automapper-core';
import { IMyInterface, ISomeOtherInterface } from '@/models';
import {
  ITachMappingProfile,
  TachMappingProfileClass,
} from '@/lib/abstractions';

@TachMappingProfileClass(
  'pages/api/myEntities/[id]/mappingProfile',
  namingConventions({
    source: new SnakeCaseNamingConvention(),
    destination: new CamelCaseNamingConvention(),
  }),
)
export class MyEntityApiIdMappingProfile implements ITachMappingProfile {
  getMappingProfile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap<ISomeNestedSourceInterface, ISomeOtherInterface>(
        mapper,
        'ISomeNestedSourceInterface',
        'ISomeOtherInterface',
        forMember(
          (d) => d.myOtherObject,
          mapFrom((s) => ({ prop1: s.something, prop2: s.other.thing })),
        ),
      );
      createMap<ISomeSourceInterface, IMyInterface>(
        mapper,
        'ISomeSourceInterface',
        'IMyInterface',
        forMember(
          (d) => d.myArrayOfStrings,
          (s) => s.comma_separated.split(','),
        ),
      );
    };
  }
}
```

The example above will use naming conventions to convert snake case properties in the source automatically to camel case properties in the destination. For properties that require more massaging, we can use forMember.

For more information on creating maps, see the [docs](https://automapperts.netlify.app/docs/mapping-configuration/for-member/overview).

#### TachMappingProfileClass

This decorator allows decoupling between all of your Mapping Profile definitions scattered across your application and proper loading of these profiles in the automapper creation lifecycle. The docorator will automatically register your mappingProfile so you don't have to. The decorator takes N arguments:

1: _Unique mapping symbol string._ This string ensures the same mapping profile is loaded at most once.

2...N: _Mapping configurations._ Pass any number of `MappingConfiguration` objects, for example a `NamingConvention` configuration.

### Using the Mapping Profile

In order to ensure the mapping profile is loaded, you must import the mappingProfile file in the fiel that utilizes it. Then, use the app bootstrapper to retrieve the mapper. finally, map something.

```typescript
// src/pages/api/myEntities/[id]/index.ts
...
import { AutomapperModule } from '@/modules/mapping/automapper.module';
import '@/mappingProfiles/pages/api/myEntities/[id]/mappingProfile';

const m = new ModuleResolver().resolve(AutomapperModule);
const provider = m.resolve<IProvider<IMapper>>('automapperProvider');
const mapper = provider.provide();

...

router.post(async (req, res) => {
    const myThing = req.body;

    const myOtherThing = mapper.map<ISomeSourceInterfacce, IMyInterface>(myThing, 'ISomeSourceInterface', 'IMyInterface');

    someOtherService.doSomething(myOtherThing);
    ...
});

```

## Under the Hood

This RA adds unique features on top of the automapper library, namely the lifecycle features already mentioned.

### Automapper Factory

The main lifecycle gatekeeper is the AutomapperFactory. This factory calls the main metadata creation functions, first one that creates all metadata for the lib folder, then one that creates all metadata for the app models.

_Note: If you have other models that don't fit within these two buckets, or need to include other steps, you can modify this object. It's located in `src/models/automapper`._

Next it calls createMap using the `pojos` strategy and a `CamelCaseNamingConvention`.

Finally, it utilizes the `MappingProfileRegistry` to get all registered mapping profiles, and adding those profiles to the mapper.

### Automapper Provider

This provider provides the mapper. To do so, it utilizes the `AutomapperFactory` to create the mapper. It also utilizes the `isDirty` flag from the `MappingProfileRegistry` to determine whether a new `MappingProfile` has been registered since last providing the mapper. If so, the factory will create an updated mapper that includes the new MappingProfile.
