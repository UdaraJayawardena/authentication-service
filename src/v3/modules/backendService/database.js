const BackendService = require('./backendService');
const PopulatedBackendService = require('../views/populated_back_end_service');
const Counter = require('../../../counter');
const { TE } = require('../../../helper');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  // const dbData = await BackendService.findAll({ where: { name: data.name, frontEndPortalId: data.frontEndPortalId, clusterId: data.clusterId } });
  const dbData = await BackendService.findAll({ where: { name: data.name, clusterId: data.clusterId } });
  if (dbData.length > 0) {
    TE('backend service already available.');
  }
  const id = await Counter.getNextSequence('backend_service_id');
  data.id = `BES${id.toString().padStart(6, '0')}`;

  return await BackendService.create(singleRecode);
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];

  const dbRecodes = await BackendService.findAll();


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    let isAvailabel = false;
    // Find if the array contains an object by comparing the property value
    // if (dbRecodes.some(dbRecode => (dbRecode.name === recode.name && dbRecode.frontEndPortalId === recode.frontEndPortalId && dbRecode.clusterId === recode.clusterId))) {
    if (dbRecodes.some(dbRecode => (dbRecode.name === recode.name && dbRecode.clusterId === recode.clusterId))) {
      isAvailabel = true;
    }

    if (!isAvailabel) {
      const id = await Counter.getNextSequence('backend_service_id');
      recode.id = `BES${id.toString().padStart(6, '0')}`;
      newRecodes.push(recode);
    }
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await BackendService.bulkCreate(newRecodes);
  }
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await BackendService.update(updates, query);

const updateRecode = async (condition, dataNeedToUpdate) =>
  await BackendService.update(dataNeedToUpdate, condition);

const findOneByQuery = async (query) =>
  await PopulatedBackendService.findOne(query);

const findByQuery = async (query) =>
  await PopulatedBackendService.findAll(query);


module.exports = {

  Schema: BackendService,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

};
