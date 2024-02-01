const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const FunctionalityWireframe = require('./functionalityWireframe');

const Routes = require('./routes');

module.exports = {

  FunctionalityWireframeController: Controller,

  FunctionalityWireframeDatabase: Database,

  FunctionalityWireframeMiddleware: Middleware,

  FunctionalityWireframeRoutes: Routes,

  FunctionalityWireframeService: Service,

  FunctionalityWireframe: FunctionalityWireframe
};