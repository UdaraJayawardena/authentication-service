/* eslint-disable no-unused-vars */
const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class counter extends Model { }

counter.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  seq: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize,
  modelName: 'counter',
  timestamps: false
});


// CountersSchema.statics.getNextSequence = async function (id, sequence) {

//   const ret = await this.findOneAndUpdate(
//     { id: id },
//     { $inc: { seq: (sequence ? sequence : 1) } },
//     {
//       new: true,
//       upsert: true
//     }
//   );

//   return ret.seq;
// };

const getNextSequence = async function (id, sequence) {
  const seqValue = (sequence ? sequence : 1);
  const [ret, isNew] = await counter.findOrCreate(
    {
      where: {
        id: id
      },
      defaults: {
        seq: seqValue
      }
    });

  const newSeqValue = ret.seq + seqValue;
  const updatedSequence = await counter.update({ seq: newSeqValue }, { where: { id } });

  return ret.seq;
};


module.exports = { counter, getNextSequence };