module.exports = {
  failOnErrors: false,
  apiFolder: 'src/pages/api',
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tach Color Store API',
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
