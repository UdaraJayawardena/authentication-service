const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const { Config, Database } = require('../../../../config');

const { DB_NAME_V2 } = Config.APPLICATION;

const conn = Database.Mongo.getConnection(DB_NAME_V2);

mongoose.connection = conn;

const UserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },

    name: { type: String, required: true, index: true },

    camundaUserId: { type: String, index: true },

    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },

    active: { type: Boolean, required: true, default: false }
  },
  { timestamps: true }
);

const User = mongoose.model(
  'User',
  UserSchema
);

module.exports = User;
