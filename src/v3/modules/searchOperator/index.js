const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const SearchOperator = require('./searchOperator');

const Routes = require('./routes');

module.exports = {

  SearchOperatorController: Controller,

  SearchOperatorDatabase: Database,

  SearchOperatorMiddleware: Middleware,

  SearchOperatorRoutes: Routes,

  SearchOperatorService: Service,

  SearchOperator: SearchOperator
};