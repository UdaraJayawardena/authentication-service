const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const User = require('./user');

const Routes = require('./routes');

module.exports = {

  UserController: Controller,

  UserDatabase: Database,

  UserMiddleware: Middleware,

  UserRoutes: Routes,

  UserService: Service,

  User: User
};