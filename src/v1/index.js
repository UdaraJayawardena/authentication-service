const swaggerJSDoc = require('swagger-jsdoc');

const swaggerUi = require('swagger-ui-express');

const { Config, Database } = require('../../config');

const { DEFINITION, APIS } = Config.SWAGGER;

const { DB_NAME_V1 } = Config.APPLICATION;

// const options = {
//   swaggerDefinition: DEFINITION('v1'),
//   apis: [
//     ...APIS.map(api => `./src/v1/modules/${api}/routes.js`),
//     './src/v1/router.yaml'
//   ]
// };

const options = {
  swaggerDefinition: DEFINITION('V1'),
  apis: [...APIS['V1'].map(api => `./src/v1/modules/${api}/swagger/*.yaml`), './src/v1/swagger/*.yaml']
};

const swaggerSpec = swaggerJSDoc(options);

const getAPIJson = (req, res) => {

  res.setHeader('Content-Type', 'application/json');

  res.send(swaggerSpec);
};

const swaggerHtml = swaggerUi.generateHTML(swaggerSpec, options);

module.exports = (app) => {

  app.get('/v1/swagger.json', getAPIJson);

  // app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/v1/api-docs', swaggerUi.serveFiles(swaggerSpec, options));
  app.get('/v1/api-docs', (req, res) => { res.send(swaggerHtml); });

  Database.Mongo.connect(DB_NAME_V1);
};