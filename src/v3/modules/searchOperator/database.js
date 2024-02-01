const SearchOperator = require('./searchOperator');
const Counter = require('../../../counter');
const { TE } = require('../../../helper');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  const dbData = await SearchOperator.findAll({ where: { name: data.name } });
  if (dbData.length > 0) {
    TE('Search operator already available.');
  }
  const id = await Counter.getNextSequence('search_operator_id');
  data.id = `SO${id.toString().padStart(6, '0')}`;

  return await SearchOperator.create(singleRecode);
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];

  const dbRecodes = await SearchOperator.findAll();


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    let isAvailabel = false;
    // Find if the array contains an object by comparing the property value
    if (dbRecodes.some(dbRecode => dbRecode.name === recode.name)) {
      isAvailabel = true;
    }

    if (!isAvailabel) {
      const id = await Counter.getNextSequence('search_operator_id');
      recode.id = `SO${id.toString().padStart(6, '0')}`;
      newRecodes.push(recode);
    }
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await SearchOperator.bulkCreate(newRecodes);
  }
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await SearchOperator.update(updates, query);

const updateRecode = async (condition, dataNeedToUpdate) =>
  await SearchOperator.update(dataNeedToUpdate, condition);

const findOneByQuery = async (query) =>
  await SearchOperator.findOne(query);

const findByQuery = async (query) =>
  await SearchOperator.findAll(query);


module.exports = {

  Schema: SearchOperator,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

};
