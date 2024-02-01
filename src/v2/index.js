const swaggerJSDoc = require('swagger-jsdoc');

const swaggerUi = require('swagger-ui-express');

const { Config, Database } = require('../../config');

const { setRecordsToCacheInternally } = require('./modules/permissionMatrix/middleware');

const { DEFINITION, APIS } = Config.SWAGGER;

const { DB_NAME_V1 } = Config.APPLICATION;

// const options = {
//   swaggerDefinition: DEFINITION('v2'),
//   apis: [
//     ...APIS.map(api => `./src/v2/modules/${api}/routes.js`),
//     './src/v2/router.yaml'
//   ]
// };

const options = {
  swaggerDefinition: DEFINITION('V2'),
  apis: [...APIS['V2'].map(api => `./src/v2/modules/${api}/swagger/*.yaml`), './src/v2/swagger/*.yaml']
};

const swaggerSpec = swaggerJSDoc(options);

const getAPIJson = (req, res) => {

  res.setHeader('Content-Type', 'application/json');

  res.send(swaggerSpec);
};
const swaggerHtml = swaggerUi.generateHTML(swaggerSpec, options);
module.exports = (app) => {

  app.get('/v2/swagger.json', getAPIJson);

  // app.use('/v2/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/v2/api-docs', swaggerUi.serveFiles(swaggerSpec, options));
  app.get('/v2/api-docs', (req, res) => { res.send(swaggerHtml); });

  Database.Mongo.connect(DB_NAME_V1);

  setRecordsToCacheInternally();
};