module.exports = {
  storage: {
    data: {
      provider: 'mongodb', //mongodb
    },
    files: {
      provider: 's3', //mongodb, s3
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
};
