const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const { Config, Database } = require('../../../../config');

const { DB_NAME_V2 } = Config.APPLICATION;

const conn = Database.Mongo.getConnection(DB_NAME_V2);

mongoose.connection = conn;

const ClusterSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },

    name: { type: String, required: true, index: true },

    discription: { type: String }
  },
  { timestamps: true }
);

const Cluster = mongoose.model(
  'Cluster',
  ClusterSchema
);

module.exports = Cluster;
