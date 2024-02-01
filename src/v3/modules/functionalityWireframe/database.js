const Functionality_Wireframe = require('./functionalityWireframe');
const Counter = require('../../../counter');
const { TE } = require('../../../helper');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  const dbData = await Functionality_Wireframe.findAll({ where: { functionalityId: data.functionalityId, wireframeId: data.wireframeId } });
  if (dbData.length > 0) {
    TE('finctionality Wireframe already available.');
  }
  const id = await Counter.getNextSequence('functionality_wireframe_id');
  data.id = `FW${id.toString().padStart(6, '0')}`;

  return await Functionality_Wireframe.create(singleRecode);
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];

  const dbRecodes = await Functionality_Wireframe.findAll();


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    let isAvailabel = false;
    // Find if the array contains an object by comparing the property value
    if (dbRecodes.some(dbRecode => dbRecode.name === recode.name)) {
      isAvailabel = true;
    }

    if (!isAvailabel) {
      const id = await Counter.getNextSequence('functionality_wireframe_id');
      recode.id = `FW${id.toString().padStart(6, '0')}`;
      newRecodes.push(recode);
    }
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await Functionality_Wireframe.bulkCreate(newRecodes);
  }
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await Functionality_Wireframe.update(updates, query);

const updateRecode = async (condition, dataNeedToUpdate) =>
  await Functionality_Wireframe.update(dataNeedToUpdate, condition);

const findOneByQuery = async (query) =>
  await Functionality_Wireframe.findOne(query);

const findByQuery = async (query) =>
  await Functionality_Wireframe.findAll(query);


module.exports = {

  Schema: Functionality_Wireframe,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

};
