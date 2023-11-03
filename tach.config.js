module.exports = {
  storage: {
    data: {
      provider: 'mongodb',
    },
    files: {
      provider: 'mongodb',
    },
    seed: {
      data: [
        '~/tach_extra/colorStoreSeeder/seedData.js',
        '~/tach_extra/demoUserSeedData.js',
      ],
      files: ['~/tach_extra/colorStoreSeeder/fileData.js'],
      indexes: ['~/tach_extra/colorStoreSeeder/indexes.js'],
    },
  },
  auth: {
    providers: ['credentials', 'github'],
  },
  logging: {
    provider: 'winston',
  },
  payment: {
    provider: 'stripe',
  },
  darkMode: {
    default: 'light',
  },
  secrets: {
    provider: 'env',
  },
};
