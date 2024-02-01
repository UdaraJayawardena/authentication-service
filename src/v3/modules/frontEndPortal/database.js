const FrontEndPortal = require('./forntEndPortal');
// const PopulatedWireframe = require('../views/populated_wireframe');
const Counter = require('../../../counter');
const { TE } = require('../../../helper');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  const dbData = await FrontEndPortal.findAll({ where: { name: data.name } });
  if (dbData.length > 0) {
    TE('Front end portal already available.');
  }
  const id = await Counter.getNextSequence('frontEndPortal_id');
  data.id = `FEP${id.toString().padStart(6, '0')}`;

  return await FrontEndPortal.create(singleRecode);
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];

  const dbRecodes = await FrontEndPortal.findAll();


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    let isAvailabel = false;
    // Find if the array contains an object by comparing the property value
    if (dbRecodes.some(dbRecode => dbRecode.name === recode.name)) {
      isAvailabel = true;
    }

    if (!isAvailabel) {
      const id = await Counter.getNextSequence('frontEndPortal_id');
      recode.id = `FEP${id.toString().padStart(6, '0')}`;
      newRecodes.push(recode);
    }
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await FrontEndPortal.bulkCreate(newRecodes);
  }
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await FrontEndPortal.update(updates, query);

const updateRecode = async (condition, dataNeedToUpdate) =>
  await FrontEndPortal.update(dataNeedToUpdate, condition);

const findOneByQuery = async (query) =>
  await FrontEndPortal.findOne(query);

const findByQuery = async (query) =>
  await FrontEndPortal.findAll(query);


module.exports = {

  Schema: FrontEndPortal,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

};
