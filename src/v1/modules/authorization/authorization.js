const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const { Config, Database } = require('../../../../config');

const { DB_NAME_V1 } = Config.APPLICATION;

const conn = Database.Mongo.getConnection(DB_NAME_V1);

mongoose.connection = conn;

const authorizationSchema = new Schema(
  {}

);
const authorization = mongoose.model(
  'authorization',
  authorizationSchema
);

module.exports = authorization;


