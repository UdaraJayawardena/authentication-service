const Functionality = require('./functionality');
const Counter = require('../../../counter');
const { TE } = require('../../../helper');

const createSingleFunctionality = async singleFunctionality => {
  const functionality = singleFunctionality;
  const dbFunctionality = await Functionality.findAll({ where: { name: functionality.name } });
  if (dbFunctionality.length > 0) {
    TE('Functionality already available.');
  }
  const id = await Counter.getNextSequence('functionality_id');
  functionality.id = `F${id.toString().padStart(6, '0')}`;

  return await Functionality.create(singleFunctionality);
};


const createMultipleFunctionalities = async (multipleFunctionality) => {
  const newFunctionalities = [];

  const dbFunctionalities = await Functionality.findAll();


  for (let i = 0; i < multipleFunctionality.length; i++) {

    const functionality = multipleFunctionality[i];
    let isAvailabel = false;
    // Find if the array contains an object by comparing the property value
    if (dbFunctionalities.some(dbfunctionality => dbfunctionality.name === functionality.name)) {
      isAvailabel = true;
    }

    if (!isAvailabel) {
      const id = await Counter.getNextSequence('functionality_id');
      functionality.id = `F${id.toString().padStart(6, '0')}`;
      newFunctionalities.push(functionality);
    }
  }

  let result = [];
  if (newFunctionalities.length > 0) {
    result = await Functionality.bulkCreate(newFunctionalities);
  }
  return result;
};

const updateMultipleFunctionalities = async (query, updates) =>
  await Functionality.update(updates, query);

const updateFunctionality = async (condition, functionalityNeedToUpdate) =>
  await Functionality.update(functionalityNeedToUpdate, condition);

const findOneByQuery = async (query) =>
  await Functionality.findOne(query);

const findByQuery = async (query) =>
  await Functionality.findAll(query);


module.exports = {

  Schema: Functionality,

  updateFunctionality: updateFunctionality,

  findOneByQuery,

  findByQuery,

  updateMultipleFunctionalities: updateMultipleFunctionalities,

  createSingleFunctionality,

  createMultipleFunctionalities,

};
