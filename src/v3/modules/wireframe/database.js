const Wireframe = require('./wireframe');
const PopulatedWireframe = require('../views/populated_wireframe');
const Counter = require('../../../counter');
const { TE } = require('../../../helper');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  const dbData = await Wireframe.findAll({ where: { name: data.name } });
  if (dbData.length > 0) {
    TE('Wireframe already available.');
  }
  const id = await Counter.getNextSequence('wireframe_id');
  data.id = `W${id.toString().padStart(6, '0')}`;

  return await Wireframe.create(singleRecode);
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];

  const dbRecodes = await Wireframe.findAll();


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    let isAvailabel = false;
    // Find if the array contains an object by comparing the property value
    if (dbRecodes.some(dbRecode => dbRecode.name === recode.name)) {
      isAvailabel = true;
    }

    if (!isAvailabel) {
      const id = await Counter.getNextSequence('wireframe_id');
      recode.id = `W${id.toString().padStart(6, '0')}`;
      newRecodes.push(recode);
    }
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await Wireframe.bulkCreate(newRecodes);
  }
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await Wireframe.update(updates, query);

const updateRecode = async (condition, dataNeedToUpdate) =>
  await Wireframe.update(dataNeedToUpdate, condition);

const findOneByQuery = async (query) =>
  await PopulatedWireframe.findOne(query);

const findByQuery = async (query) =>
  await PopulatedWireframe.findAll(query);


module.exports = {

  Schema: Wireframe,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

};
