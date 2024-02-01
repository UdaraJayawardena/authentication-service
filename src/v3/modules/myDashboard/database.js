/* eslint-disable no-unused-vars */
const MyDashboard = require('./myDashboard');
const PopulatedMyDashboard = require('../views/populated_my_dashboard');
const Counter = require('../../../counter');
const { TE, to } = require('../../../helper');

const createSingleRecode = async singleRecode => {

  if (!singleRecode.userId) {
    singleRecode.userId = null;
  }
  const data = singleRecode;
  const dbData = await MyDashboard.findAll({ where: singleRecode });
  if (dbData.length > 0) {
    TE('My dashboard already available.');
  }
  const id = await Counter.getNextSequence('my_dashboard_id');
  data.id = `MD${id.toString().padStart(6, '0')}`;

  return await MyDashboard.create(singleRecode);
};

const createSingleRecodeFromAdmins = async singleRecode => {
  let isDashboardCreated = false;
  let createdDashboard = null;

  if (!singleRecode.userId) {
    singleRecode.userId = null;
  }
  const data = singleRecode;
  const dbData = await MyDashboard.findAll({ where: singleRecode });
  // check dashboard already available
  if (dbData.length == 0) {
    // dashboard already not available
    const id = await Counter.getNextSequence('my_dashboard_id');
    data.id = `MD${id.toString().padStart(6, '0')}`;
    const [err, dashboard] = await to(MyDashboard.create(singleRecode));

    if (dashboard) {
      isDashboardCreated = true;
      createdDashboard = dashboard;
    }
  }


  return { isDashboardCreated, createdDashboard };
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];

  const dbRecodes = await MyDashboard.findAll();


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    let isAvailabel = false;
    // Find if the array contains an object by comparing the property value
    if (dbRecodes.some(dbRecode => (dbRecode.roleId === recode.roleId && dbRecode.userId === recode.userId && dbRecode.dashboardId === recode.dashboardId))) {
      isAvailabel = true;
    }

    if (!isAvailabel) {
      const id = await Counter.getNextSequence('my_dashboard_id');
      recode.id = `MD${id.toString().padStart(6, '0')}`;
      newRecodes.push(recode);
    }
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await MyDashboard.bulkCreate(newRecodes);
  }
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await MyDashboard.update(updates, query);

const updateRecode = async (condition, dataNeedToUpdate) =>
  await MyDashboard.update(dataNeedToUpdate, condition);

const findOneByQuery = async (query) =>
  await PopulatedMyDashboard.findOne(query);

const findByQuery = async (query) =>
  await PopulatedMyDashboard.findAll(query);

const deleteRecodes = async (query) =>
  await MyDashboard.destroy(query);


module.exports = {

  Schema: MyDashboard,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

  deleteRecodes,

  createSingleRecodeFromAdmins,

};
