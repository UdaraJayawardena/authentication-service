const SearchField = require('./searchField');
const PopulatedSearchField = require('../views/populated_search_field');
const Counter = require('../../../counter');
const { TE } = require('../../../helper');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  const dbData = await SearchField.findAll({ where: { name: data.name, serviceModuleId: data.serviceModuleId } });
  if (dbData.length > 0) {
    TE('search filed already available.');
  }
  const id = await Counter.getNextSequence('search_field_id');
  data.id = `SF${id.toString().padStart(6, '0')}`;

  return await SearchField.create(singleRecode);
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];

  const dbRecodes = await SearchField.findAll();


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    let isAvailabel = false;
    // Find if the array contains an object by comparing the property value
    if (dbRecodes.some(dbRecode => dbRecode.name === recode.name)) {
      isAvailabel = true;
    }

    if (!isAvailabel) {
      const id = await Counter.getNextSequence('search_field_id');
      recode.id = `SF${id.toString().padStart(6, '0')}`;
      newRecodes.push(recode);
    }
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await SearchField.bulkCreate(newRecodes);
  }
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await SearchField.update(updates, query);

const updateRecode = async (condition, dataNeedToUpdate) =>
  await SearchField.update(dataNeedToUpdate, condition);

const findOneByQuery = async (query) =>
  await PopulatedSearchField.findOne(query);

const findByQuery = async (query) =>
  await PopulatedSearchField.findAll(query);


module.exports = {

  Schema: SearchField,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

};
