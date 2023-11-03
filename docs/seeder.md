# Data Seeder

The data seeder can populate your data source using the data files provided in the [tach config](/docs/tach_configuration.md).

## Usage

To run the seeder, run the following command:

```shell
pnpm data:seed
```

To run the seeder against the dev environment: run the following command:

```shell
pnpm data:seed:dev
```

## Seed Tach Configuration

The tach config file allows you to list any number of data files from which to seed the database. The seed files are executed in the order they are provided; however, if files target the same collection, for example two files define a list of `fruits`, these collections will be coalesced. These collections can also be indexed via index files.

The seeder also allows you to load local files into your file storage using the `storage.seed.files` list.

```javascript
// tach.config.ts
storage: {
    ...
    seed: {
      data: ['~/seedData.js', '~/customData.js'],
      files: ['~/seedFiles.js'],
      indexes: ['~/indexes.js'],
    },
}
```

## Data Definition Files

Data definition files are javascript files that define the data to be inserted in the database. The data you wish you seed should be exported as the default.

```javascript
// customData.js
const data = {
  fruits: [
    {
      name: 'Banana',
    },
    {
      name: 'Apple',
    },
  ],
  animals: [
    {
      name: 'Iguana',
      color: 'green',
    },
    {
      name: 'Pig',
      color: 'pink',
    },
  ],
};
```

## File Definition Files

File definition files are javascript files that define the files to be inserted into the configured file storage provider. The data you wish you seed should be exported as the default.

```javascript
// seedFiles.js
const files = [
  {
    key: 'monkey.png',
    filepath: 'path/to/monkey.png',
    metadata: {
      contentType: 'image/png',
      someOtherCustomData: 'This is a picture of a monkey!',
    },
  },
  {
    key: 'projections.xls',
    filepath: 'path/to/projections.xls',
    metadata: {
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      someOtherCustomData:
        "Confidential financial projections that I probably shouldn't be sharing!",
      validUntil: '2021-12-31T23:59:59.999Z',
    },
  },
];

export default files;
```

## Index Definition Files

Index definition files are javascript files that define the indexes created in the database. The indexes you wish you seed should be exported as the default. These indices follow the [mongodb index format](https://www.mongodb.com/docs/drivers/node/current/fundamentals/indexes/).

```javascript
// indexes.js
const indexes = {
  products: [{ '$**': 'text' }], // text search against all string fields
  categories: [{ name: 1 }],
};

export default indexes;
```
