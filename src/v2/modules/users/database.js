const User = require('./user');
const Counter = require('../../../counter');
const { TE } = require('../../../helper');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  const dbData = await User.find({ name: data.name, role: data.role });
  if (dbData.length > 0) {
    TE('user already available.');
  }
  const id = await Counter.getNextSequence('user_id');
  data.id = `U${id.toString().padStart(6, '0')}`;

  return await User.create(singleRecode);
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];

  const dbRecodes = await User.find({});


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
        dbRecode.role.toString() === recode.role.toString()
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
    result = await User.insertMany(newRecodes);
  }
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await User.updateMany(query, updates, { new: true });

const updateRecode = async (condition, dataNeedToUpdate) =>
  await User.findOneAndUpdate(condition, dataNeedToUpdate, { new: true, runValidators: true });

const findOneByQuery = async (query) =>
  await User.findOne(query);

const findByQuery = async (query) =>
  await User.find(query).populate({ path: 'role' });


module.exports = {

  Schema: User,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

};
