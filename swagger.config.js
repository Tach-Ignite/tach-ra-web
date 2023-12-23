module.exports = {
  failOnErrors: false,
  apiFolder: 'src/pages/api', // define api folder under app folder
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Next Swagger API Example',
      version: '1.0',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'https',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [],
  },
};
