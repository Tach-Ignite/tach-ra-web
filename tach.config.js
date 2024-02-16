module.exports = {
  storage: {
    data: {
      provider: 'mongodb', //mongodb, mongodb-atlas-data-api
    },
    files: {
      provider: 's3', //mongodb, s3
    },
    seed: {
      data: {
        provider: 'mongodb', //mongodb,
        dataFiles: [
          '~/tach_extra/colorStoreSeeder/seedData.js',
          '~/tach_extra/demoUserSeedData.js',
        ],
        indexFiles: ['~/tach_extra/colorStoreSeeder/indexes.js'],
      },
      files: {
        provider: 's3', //mongodb,
        files: ['~/tach_extra/colorStoreSeeder/fileData.js'],
      },
    },
  },
  auth: {
    providers: ['credentials', 'github'], //credentials, github, google, linkedin, azuread
  },
  logging: {
    provider: 'winston', //winston, pino
  },
  payment: {
    provider: 'stripe', //stripe, paypal
  },
  darkMode: {
    default: 'light', //light, dark
  },
  secrets: {
    provider: 'ssm', //env, ssm
  },
  notifications: {
    email: {
      provider: 'ses', //ses, console
    },
    sms: {
      provider: 'sns', //sns, twilio, console
    },
  },
  recaptcha: {
    provider: 'google', //google, fake
  },
};
