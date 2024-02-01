const ServiceModuleField = require('./serviceModuleField');
const PopulatedServiceModuleField = require('../views/populated_service_module_field');
const Counter = require('../../../counter');
const { TE, to } = require('../../../helper');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  const dbData = await ServiceModuleField.findAll({ where: { name: data.name, serviceModuleId: data.serviceModuleId, displayName: data.displayName } });
  if (dbData.length > 0) {
    TE('service module field already available.');
  }
  const id = await Counter.getNextSequence('service_module_field_id');
  data.id = `SMF${id.toString().padStart(6, '0')}`;

  return await ServiceModuleField.create(singleRecode);
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];
  const updatedRecodes = [];

  const dbRecodes = await ServiceModuleField.findAll();


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    // need to check recode available or new
    let isUpdate = false;
    let isNew = false;
    // Find if the array contains an object by comparing the property value
    const availableDBRecode = dbRecodes.find(dbRecode => {
      let isAvailable = false;
      if (dbRecode.name === recode.name &&
        dbRecode.serviceModuleId === recode.serviceModuleId
      ) {
        isAvailable = true;
      }
      return isAvailable;
    });

    if (availableDBRecode) {
      // need to check data need to update (isNeedtodisplay has changed)
      if (availableDBRecode.isNeedToDisplay !== recode.isNeedToDisplay) {
        isUpdate = true;
      }
    } else {
      isNew = true;
    }

    // if recode new then need add
    if (isNew) {
      const id = await Counter.getNextSequence('service_module_field_id');
      recode.id = `SMF${id.toString().padStart(6, '0')}`;
      newRecodes.push(recode);
    } else if (isUpdate) {
      // need to update isNeedtodisplay
      recode.id = availableDBRecode.id;
      updatedRecodes.push(recode);
    }
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await ServiceModuleField.bulkCreate(newRecodes);
  }

  if (updatedRecodes.length > 0) {
    const [Error] = await to(ServiceModuleField.bulkCreate(updatedRecodes, { updateOnDuplicate: ['isNeedToDisplay'] }));
    if (Error) {
      console.log(Error);
    }
  }
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await ServiceModuleField.update(updates, query);

const updateRecode = async (condition, dataNeedToUpdate) =>
  await ServiceModuleField.update(dataNeedToUpdate, condition);

const findOneByQuery = async (query) =>
  await PopulatedServiceModuleField.findOne(query);

const findByQuery = async (query) =>
  await PopulatedServiceModuleField.findAll(query);


module.exports = {

  Schema: ServiceModuleField,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

};
