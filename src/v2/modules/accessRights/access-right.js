const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const { Config, Database } = require('../../../../config');

const { DB_NAME_V2 } = Config.APPLICATION;

const conn = Database.Mongo.getConnection(DB_NAME_V2);

mongoose.connection = conn;

const AccessRightSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },

    name: { type: String, required: true, index: true },

    discription: { type: String }
  },
  { timestamps: true }
);

const AccessRight = mongoose.model(
  'Access_Right',
  AccessRightSchema
);

module.exports = AccessRight;
