const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const { Config, Database } = require('../../../../config');

const { DB_NAME_V2 } = Config.APPLICATION;

const conn = Database.Mongo.getConnection(DB_NAME_V2);

mongoose.connection = conn;

const ENUM_STATUS = [
  'active',
  'in-active',
  'deleted'
];

const AnonymousUserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },

    firstName: { type: String, required: true },

    lastName: { type: String, required: true },

    permissionKey: { type: String, required: true, unique: true },

    userName: { type: String, required: true, index: true, unique: true },

    email: { type: String, required: true, index: true },

    organization: { type: String, required: true },

    status: {
      type: String,
      enum: ENUM_STATUS,
      default: 'active',
      index: true
    },

    statusHistory: {
      type: [
        {
          createdAt: { type: Date, default: Date.now },
          status: {
            type: String,
            enum: ENUM_STATUS,
            default: 'active'
          },
          user: { type: String, default: 'system' }
        }
      ],
      default: [{ status: 'active' }]
    },



    discription: { type: String },

    camundaUserId: { type: String, required: true, unique: true },

    camundaPassword: { type: String, required: true }
  },
  { timestamps: true }
);

const AnonymousUser = mongoose.model(
  'AnonymousUser',
  AnonymousUserSchema
);

module.exports = AnonymousUser;
