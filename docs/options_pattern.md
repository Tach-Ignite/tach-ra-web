# Options

The RA implements its own lightweight version of the [Options Pattern](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/options?view=aspnetcore-7.0) for decoupled consumption of configuration values. These have been implemented for `tach.config.js`. However, you can use this pattern for any configuration you'd like to manage.

## Custom Configuration Example

```javascript
// vegetables.config.js
module.exports = {
    ...
  vegetables: {
    favorite: 'carrot',
    fruits: ['apple', 'banana'],
    other: ['carrot'],
  },
  ...
};

// IVegetableConfiguration.ts
export interface IVegetableConfiguration extends IConfigurationSection {
  favorite: string;
  fruits: Array<string>,
  other: Array<string>,
}

// VegetableManager.ts
export class VegetableManager {
    private readonly _config: IVegetableConfiguration;

    constructor(vegetableConfigurationOptions: IOptions<IVegetableConfiguration>) {
        this._config = vegetableConfigurationOptions.value;
    }
}

// MyAppBootstrapper.ts
import {
  ConfigurationFactory,
  Options,
  IOptions,
  IAuthConfiguration,
} from '@/lib/config';
import vegetableConfigFile from '~/vegetables.config.js';
export class MyAppBootstrapper implements IBootstrapper {
  bootstrap(): IServiceResolver {
    const container = new Container();
    const config = new ConfigurationFactory().create(vegetableConfigFile);
    container.bind<IVegetableConfiguration>(
      'vegetableConfiguration',
      config.getSection('vegetables')
    );
    container.bind<IOptions<IVegetableConfiguration>>(
      'vegetableConfigurationOptions',
      new Options<IVegetableConfiguration>(container.resolve('vegetableConfiguration'))
    );

    container.bind<VegetableManager>(
      'vegetableManager',
      VegetableManager,
    );

    return container;
  }
}
```
