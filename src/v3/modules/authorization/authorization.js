const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const { Config, Database } = require('../../../../config');

const { DB_NAME_V3 } = Config.APPLICATION;

const conn = Database.Mongo.getConnection(DB_NAME_V3);

mongoose.connection = conn;

const authorizationSchema = new Schema(
  {}

);
const authorization = mongoose.model(
  'authorization1',
  authorizationSchema
);

module.exports = authorization;


