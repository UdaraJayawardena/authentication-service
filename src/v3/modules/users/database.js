const User = require('./user');
const UserAndRole = require('../views/populated_user');
const Counter = require('../../../counter');
const { TE } = require('../../../helper');
const { Op } = require('sequelize');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  const dbData = await User.findAll({ where:  {[Op.or]: { email: data.email, userName:data.userName}}});
  if (dbData.length > 0) {
    TE('user already available.');
  }
  const id = await Counter.getNextSequence('user_id');
  data.id = `U${id.toString().padStart(6, '0')}`;

  return await User.create(singleRecode);
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];

  const dbRecodes = await User.findAll();


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    // let isAvailabel = false;
    // Find if the array contains an object by comparing the property value
    // if (dbRecodes.some(dbRecode => dbRecode.name === recode.name)) {
    //   isAvailabel = true;
    // }

    const availableDBRecode = dbRecodes.find(dbRecode => {
      let isAvailable = false;
      if (dbRecode.name === recode.name &&
        dbRecode.roleId.toString() === recode.roleId.toString()
      ) {
        isAvailable = true;
      }
      return isAvailable;
    });

    if (!availableDBRecode) {
      const id = await Counter.getNextSequence('user_id');
      recode.id = `U${id.toString().padStart(6, '0')}`;
      newRecodes.push(recode);
    }
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await User.bulkCreate(newRecodes);
  }
  return result;
};

const deleteSingleRecode = async data => {
  const result = await User.destroy({ where:  {userName:data.userName}});
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await User.update(updates, query);

const updateRecode = async (condition, dataNeedToUpdate) =>
  await User.update(dataNeedToUpdate, condition);

const findOneByQuery = async (query) =>
  await UserAndRole.findOne(query);

const findByQuery = async (query) =>
  await UserAndRole.findAll(query);//.populate({ path: 'role' });


module.exports = {

  Schema: User,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

  deleteSingleRecode

};
