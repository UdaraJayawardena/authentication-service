const WireframeAndSearchField = require('./wireframeAndSearchfield');
const PopulatedWireframeAndSearchField = require('../views/populated_wireframe_and_search_field');
const Counter = require('../../../counter');
const { TE } = require('../../../helper');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  const dbData = await WireframeAndSearchField.findAll({ where: { wireframeId: data.wireframeId, searchFieldId: data.searchFieldId } });
  if (dbData.length > 0) {
    TE('data already available.');
  }
  const id = await Counter.getNextSequence('wireframe_and_search_field_id');
  data.id = `WSF${id.toString().padStart(6, '0')}`;

  return await WireframeAndSearchField.create(singleRecode);
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];

  const dbRecodes = await WireframeAndSearchField.findAll();


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    let isAvailabel = false;
    // Find if the array contains an object by comparing the property value
    if (dbRecodes.some(dbRecode => (
      dbRecode.wireframeId === recode.wireframeId &&
      dbRecode.searchFieldId === recode.searchFieldId
    ))) {
      isAvailabel = true;
    }

    if (!isAvailabel) {
      const id = await Counter.getNextSequence('wireframe_and_search_field_id');
      recode.id = `WSF${id.toString().padStart(6, '0')}`;
      newRecodes.push(recode);
    }
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await WireframeAndSearchField.bulkCreate(newRecodes);
  }
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await WireframeAndSearchField.update(updates, query);

const updateRecode = async (condition, dataNeedToUpdate) =>
  await WireframeAndSearchField.update(dataNeedToUpdate, condition);

const findOneByQuery = async (query) =>
  await PopulatedWireframeAndSearchField.findOne(query);

const findByQuery = async (query) =>
  await PopulatedWireframeAndSearchField.findAll(query);


module.exports = {

  Schema: WireframeAndSearchField,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

};
