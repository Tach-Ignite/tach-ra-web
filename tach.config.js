module.exports = {
  "storage": {
    "data": {
      "provider": "mongodb-atlas-data-api"
    },
    "files": {
      "provider": "s3"
    },
    "seed": {
      "data": {
        "provider": "mongodb",
        "dataFiles": [
          "~/tach_extra/colorStoreSeeder/seedData.js",
          "~/tach_extra/demoUserSeedData.js"
        ],
        "indexFiles": [
          "~/tach_extra/colorStoreSeeder/indexes.js"
        ]
      },
      "files": {
        "provider": "mongodb",
        "files": [
          "~/tach_extra/colorStoreSeeder/fileData.js"
        ]
      }
    }
  },
  "auth": {
    "providers": [
      "credentials",
      "github"
    ]
  },
  "logging": {
    "provider": "winston"
  },
  "payment": {
    "provider": "stripe"
  },
  "darkMode": {
    "default": "light"
  },
  "secrets": {
    "provider": "ssm"
  },
  "notifications": {
    "email": {
      "provider": "console"
    },
    "sms": {
      "provider": "sns"
    }
  },
  "recaptcha": {
    "provider": "google"
  }
};