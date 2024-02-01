const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const { Config, Database } = require('../../../../config');

const { DB_NAME_V2 } = Config.APPLICATION;

const conn = Database.Mongo.getConnection(DB_NAME_V2);

mongoose.connection = conn;

const PermissionMatrixSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },

    functionality: { type: Schema.Types.ObjectId, ref: 'functionality', required: true },

    accessRight: { type: Schema.Types.ObjectId, ref: 'Access_Right', required: true },

    cluster: { type: Schema.Types.ObjectId, ref: 'Cluster', required: true },

    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },

    permission: { type: Boolean, required: true, default: false }
  },
  { timestamps: true }
);

const PermissionMatrix = mongoose.model(
  'Permission_Matrix',
  PermissionMatrixSchema
);

module.exports = PermissionMatrix;
