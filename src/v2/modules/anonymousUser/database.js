const AnonymousUser = require('./anonymousUser');
const Counter = require('../../../counter');
const { TE } = require('../../../helper');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  const dbData = await AnonymousUser.find({ userName: data.userName });
  if (dbData.length > 0) {
    TE('Anonymous user already available.');
  }
  const id = await Counter.getNextSequence('AnonymousUser_id');
  data.id = `AU${id.toString().padStart(6, '0')}`;

  return await AnonymousUser.create(singleRecode);
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];

  const dbRecodes = await AnonymousUser.find({});


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    let isAvailabel = false;
    // Find if the array contains an object by comparing the property value
    if (dbRecodes.some(dbRecode => dbRecode.name === recode.name)) {
      isAvailabel = true;
    }

    if (!isAvailabel) {
      const id = await Counter.getNextSequence('AnonymousUser_id');
      recode.id = `AU${id.toString().padStart(6, '0')}`;
      newRecodes.push(recode);
    }
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await AnonymousUser.insertMany(newRecodes);
  }
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await AnonymousUser.updateMany(query, updates, { new: true });

const updateRecode = async (condition, dataNeedToUpdate) =>
  await AnonymousUser.findOneAndUpdate(condition, dataNeedToUpdate, { new: true, runValidators: true });

const findOneByQuery = async (query) =>
  await AnonymousUser.findOne(query);

const findByQuery = async (query) =>
  await AnonymousUser.find(query);


module.exports = {

  Schema: AnonymousUser,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

};
