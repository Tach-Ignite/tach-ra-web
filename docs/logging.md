# Logging

The RA allows for configuration-based logger injection. We've chosen to utilize a static set of log levels matching those of `npm`:

- error
- warn
- info
- http
- verbose
- debug
- silly

## Supported Loggers

- winston
- pino

## Configuration

To change the logging provider, modify the `provider` value in the `logging` section of `tach.config.js`:

```javascript
module.exports = {
    ...
  logging: {
    provider: 'pino',
  },
  ...
};
```

Your chosen logger can be configured in any way you see fit. To do so, modify the `logger.config.js` file in the root of the project. The configuration object that gets exported as the default will be utilized by the logger. This configuration has all the features of whichever logger you choose.

### Pino Configuration

One caveat with the `pino` provider is that it does not support all of the `npm` log levels out of the box. In order to match the `npm` log levels, we need to provide a few custom log levels. To prevent having to reinvent the wheel, you can simply import `npmLevels`:

```javascript
// logger.config.ts
import npmLevels from '@/lib/logging/pino/npmLevels';
...
const transports = pino.transports({
    targets: [
        ...
    ],
    levels: npmLevels,
});
const pinoConfig = [{
  customLevels: npmLevels,
  //other config options
}, transports];
```

## Usage

To use the logger, resolve an `ILoggerFactory<INpmLogger>` from the server container, then call `create`. This method takes a namespace string as a parameter. This namespace will be include in the json of all log messages for more granular filtering.

```typescript
const loggerFactory =
  container.resolve<ILoggerFactory<INpmLogger>>('loggerFactory');

const logger = loggerFactory.create('my.current.namespace');
logger.info('Hello World!');
logger.log('error', 'An Error Occured', { errorCode: 500 });
logger.debug('Debugging Info'), { myVar });
```
