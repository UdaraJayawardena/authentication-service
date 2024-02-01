const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const FrontEndPortal = require('./forntEndPortal');

const Routes = require('./routes');

module.exports = {

  FrontEndPortalController: Controller,

  FrontEndPortalDatabase: Database,

  FrontEndPortalMiddleware: Middleware,

  FrontEndPortalRoutes: Routes,

  FrontEndPortalService: Service,

  FrontEndPortal: FrontEndPortal
};