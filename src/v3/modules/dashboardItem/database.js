const DashboardItem = require('./dashboardItem');
const PopulatedDashboardItem = require('../views/populated_dashboard_item');
const Counter = require('../../../counter');
const { TE } = require('../../../helper');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  const dbData = await DashboardItem.findAll({ where: { name: data.name, dashboardId: data.dashboardId } });
  if (dbData.length > 0) {
    TE('Dashboard item already available.');
  }
  const id = await Counter.getNextSequence('dashboard_item_id');
  data.id = `DI${id.toString().padStart(6, '0')}`;

  return await DashboardItem.create(singleRecode);
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];

  const dbRecodes = await DashboardItem.findAll();


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    let isAvailabel = false;
    // Find if the array contains an object by comparing the property value
    if (dbRecodes.some(dbRecode => (dbRecode.name === recode.name && dbRecode.dashboardId === recode.dashboardId))) {
      isAvailabel = true;
    }

    if (!isAvailabel) {
      const id = await Counter.getNextSequence('dashboard_item_id');
      recode.id = `DI${id.toString().padStart(6, '0')}`;
      newRecodes.push(recode);
    }
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await DashboardItem.bulkCreate(newRecodes);
  }
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await DashboardItem.update(updates, query);

const updateRecode = async (condition, dataNeedToUpdate) =>
  await DashboardItem.update(dataNeedToUpdate, condition);

const findOneByQuery = async (query) =>
  await PopulatedDashboardItem.findOne(query);

const findByQuery = async (query) =>
  await PopulatedDashboardItem.findAll(query);


module.exports = {

  Schema: DashboardItem,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

};
