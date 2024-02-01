const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const Dashboard = require('./dashboard');

const Routes = require('./routes');

module.exports = {

  DashboardController: Controller,

  DashboardDatabase: Database,

  DashboardMiddleware: Middleware,

  DashboardRoutes: Routes,

  DashboardService: Service,

  Dashboard: Dashboard
};