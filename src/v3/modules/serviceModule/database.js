const ServiceModule = require('./serviceModule');
const PopulatedServiceModule = require('../views/populated_service_module');
const Counter = require('../../../counter');
const { TE } = require('../../../helper');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  const dbData = await ServiceModule.findAll({ where: { name: data.name, backendServiceId: data.backendServiceId } });
  if (dbData.length > 0) {
    TE('service module already available.');
  }
  const id = await Counter.getNextSequence('service_module_id');
  data.id = `SM${id.toString().padStart(6, '0')}`;

  return await ServiceModule.create(singleRecode);
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];

  const dbRecodes = await ServiceModule.findAll();


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    let isAvailabel = false;
    // Find if the array contains an object by comparing the property value
    if (dbRecodes.some(dbRecode => (dbRecode.name === recode.name && dbRecode.backendServiceId === recode.backendServiceId))) {
      isAvailabel = true;
    }

    if (!isAvailabel) {
      const id = await Counter.getNextSequence('service_module_id');
      recode.id = `SM${id.toString().padStart(6, '0')}`;
      newRecodes.push(recode);
    }
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await ServiceModule.bulkCreate(newRecodes);
  }
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await ServiceModule.update(updates, query);

const updateRecode = async (condition, dataNeedToUpdate) =>
  await ServiceModule.update(dataNeedToUpdate, condition);

const findOneByQuery = async (query) =>
  await PopulatedServiceModule.findOne(query);

const findByQuery = async (query) =>
  await PopulatedServiceModule.findAll(query);


module.exports = {

  Schema: ServiceModule,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

};
