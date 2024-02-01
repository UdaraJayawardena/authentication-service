const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const MyDashboard = require('./myDashboard');

const Routes = require('./routes');

module.exports = {

  MyDashboardController: Controller,

  MyDashboardDatabase: Database,

  MyDashboardMiddleware: Middleware,

  MyDashboardRoutes: Routes,

  MyDashboardService: Service,

  MyDashboard: MyDashboard
};