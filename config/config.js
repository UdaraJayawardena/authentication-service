const dotEnv = require('dotenv');

const chalk = require('chalk');

const termination = chalk.bold.magenta;

dotEnv.config();

const terminateServer = () => {

  console.log(termination('Application terminate due to mismatch environment\n'));

  process.exit(0);
};

const ENV_CONFIGURATION = () => {

  try {

    const path = `${APPLICATION.ENV_FILE_PATH}/${APPLICATION.ENV}.json`;

    return require(path);

  } catch (err) {

    console.log(err);

    console.log(`\n********** ENVIRONMENT NOT FOUND **********
      \nPlease follow below step
      \n01. Create development.json, production,json and test.json in /config/env/ 
      \n02. Copy sample content below created all files.
      \n03. Change content
      \n\nNote:- Do you want to run/build development environment, only create development.json\n`);

    terminateServer();
  }
};

const IS_TEST = process.env.NODE_ENV === 'test';

const API_VERSIONS = process.env.API_VERSIONS.split(' ');

const getDBObject = () => {
  const dbObject = {
    DB_URI: process.env.DB_URI
  };

  API_VERSIONS.map(k => {
    const dbKey = `DB_NAME_${k}`;
    const dbValue = process.env[dbKey];
    dbObject[dbKey] = IS_TEST ? `test_${dbValue}` : dbValue;
  });

  return dbObject;
};

const MYSQL_KEY_LIST = [

  'MYSQL_DB_HOST',

  'MYSQL_DB_PORT',

  'MYSQL_DB_USER',

  'MYSQL_DB_PASSWORD',

  ...API_VERSIONS.map(
    v => `MYSQL_DB_NAME_${v}`
  )
];

const getMYSQLDBObject = () => {

  const dbObject = {};

  MYSQL_KEY_LIST.forEach(k => {

    dbObject[k] = IS_TEST ? process.env[`TEST_${k}`] : process.env[k];
  });

  return dbObject;
};

const APPLICATION = {

  VERSION: process.env.VERSION,
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  HOST: process.env.HOST,

  APP_NAME: process.env.APP_NAME,
  APP_HOST: process.env.HOST,
  APP_KEY: process.env.APP_KEY,
  APP_ENV: process.env.APP_KEY,
  APP_URL: process.env.APP_URL,
  API_VERSIONS: API_VERSIONS,

  INTEGRATION: process.env.INTEGRATION,
  ENV_FILE_PATH: process.env.ENV_FILE_PATH,

  CLIENT_APP_URL: process.env.CLIENT_APP_URL,

  IS_TEST: IS_TEST,

  IS_NOT_PROD: process.env.NODE_ENV !== 'production',

  REDIS_PORT: process.env.REDIS_PORT,

  SENTRY_DSN: process.env.SENTRY_DSN,
  SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
  SENTRY_SAMPLERATE: process.env.SENTRY_SAMPLERATE,

  ...getDBObject(),
  ...getMYSQLDBObject()
};

const SWAGGER = {

  DEFINITION: (version) => ({
    swagger: '2.0',
    info: {
      title: `Authorization API ${version}`,
      version: '1.0.0',
      description: 'Endpoints to test the Authoization routes',
    },
    host: APPLICATION.APP_URL,
    basePath: `/${version}`,
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        scheme: 'bearer',
        in: 'header',
      },
    },
    security: [{ bearerAuth: [] }],
  }),

  APIS: {
    V1: ['authorization'],
    V2: ['authorization', 'anonymousUser', 'accessRights', 'cluster', 'functionality', 'permissionMatrix', 'roles', 'users'],
    V3: ['authorization', 'anonymousUser', 'accessRights', 'cluster', 'functionality', 'permissionMatrix', 'roles', 'users',
      'dashboard', 'dashboardItem', 'myDashboard', 'myDashboardItem', 'wireframe', 'functionalityWireframe', 'frontEndPortal', 'backendService',
      'serviceModule', 'searchOperator', 'searchField', 'wireframeAndSearchfield', 'serviceModuleField']
  }
};

const BODYPARSER = {

  JSON_PARSER: {
    limit: '50mb'
  },

  URLENCODED: {
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
  }
};

const ACCESS_HEADERS = {
  ALLOWED_DOMAINS: ENV_CONFIGURATION().ALLOWED_DOMAINS,

  ALLOW_METHODS: ENV_CONFIGURATION().ALLOW_METHODS,

  ALLOW_HEADERS: ENV_CONFIGURATION().ALLOW_HEADERS,
};

const LDAP = {
  ...ENV_CONFIGURATION().ldap
};

const ACCESS_LEVELS = {
  ...ENV_CONFIGURATION().ACCESS_LEVELS
};

const REDIS_CONFIG = {
  ...ENV_CONFIGURATION().redis_config
};

const FRONTEND_URL = {
  ...ENV_CONFIGURATION().frontend_urls
};
const ROLES_CAN_MANAGE_OTHERS_DASHBOARDS = ENV_CONFIGURATION().roles_can_manage_others_dashboards;

module.exports = {

  APPLICATION,

  BODYPARSER,

  ACCESS_HEADERS,

  SWAGGER,

  LDAP,

  ACCESS_LEVELS,

  REDIS_CONFIG,

  FRONTEND_URL,

  ROLES_CAN_MANAGE_OTHERS_DASHBOARDS,
};
