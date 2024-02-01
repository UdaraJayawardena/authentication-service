const Service = require('./service');

const { ResponseHandler } = require('../../handlers');

const { TE } = require('../../../helper');

const { Config, Database } = require('../../../../config');

const { ERROR, SUCCESS } = ResponseHandler;

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

module.exports = {

  getRecodes: async (req, res) => {

    try {

      const params = req.query;

      const data = await Service.getRecodes(params);

      SUCCESS(res, 200, data);

    } catch (error) {

      ERROR(res, error);
    }
  },

  createRecode: async (req, res) => {

    try {

      const data = await Service.createSingleRecode(req);
      SUCCESS(res, 200, data);

    } catch (error) {

      ERROR(res, error);
    }
  },

  createMultipleRecodes: async (req, res) => {

    try {
      const { userList } = req.body;
      if (!userList) {
        TE({ 'error': 'user list not available.' });
      }
      const dataList = await Service.createMultipleRecodes(userList);

      SUCCESS(res, 201, dataList);

    } catch (error) {

      ERROR(res, error);
    }
  },


  updateRecode: async (req, res) => {

    try {

      const { query, updates } = req.body;

      if (!query || Object.keys(query).length === 0) TE({ 'error': 'Query not found' });

      const transaction = await Service.updateRecode(req, query, updates);

      SUCCESS(res, 200, transaction);

    } catch (error) {

      ERROR(res, error);
    }
  },

  deleteRecode: async (req, res) => {
    try {
      const { userName } = req.body;

      if (!userName) {
        TE({ 'error': 'username required.' });
      }
      const data = await Service.deleteSingleRecode(req);
      SUCCESS(res, 200, {deleted : data});

    } catch (error) {

      ERROR(res, error);
    }
  },

  /**
  * update user table columns
  * add new column to user table
  */
  updateOnUserTable: async (req, res) => {
    try {
      const tableName = 'users';
      const columnNamesArray = ['name', 'firstName', 'lastName', 'displayName'];
      const dataType = 'VARCHAR';
      const newColumn = 'jumpcloudGroupId';


      const q1 = `ALTER TABLE ${tableName} MODIFY ${columnNamesArray[0]} ${dataType}(${200});`;

      const q2 = `ALTER TABLE ${tableName} MODIFY ${columnNamesArray[1]} ${dataType}(${100});`;

      const q3 = `ALTER TABLE ${tableName} MODIFY ${columnNamesArray[2]} ${dataType}(${100});`;

      const q4 = `ALTER TABLE ${tableName} MODIFY ${columnNamesArray[3]} ${dataType}(${100});`;

      const q5 = `ALTER TABLE ${tableName} ADD COLUMN ${newColumn} ${dataType}(${50});`;


      const p1 = new Promise((resolve,) => {
        sequelize.query(q1).then((response) => {
          resolve({ message: 'success', result: response });
        }).catch((error) => {
          resolve({ message: 'failed', result: error });
        });
      });

      const p2 = new Promise((resolve) => {
        sequelize.query(q2).then((response) => {
          resolve({ message: 'success', result: response });
        }).catch((error) => {
          resolve({ message: 'failed', result: error });
        });
      });

      const p3 = new Promise((resolve,) => {
        sequelize.query(q3).then((response) => {
          resolve({ message: 'success', result: response });
        }).catch((error) => {
          resolve({ message: 'failed', result: error });
        });
      });

      const p4 = new Promise((resolve) => {
        sequelize.query(q4).then((response) => {
          resolve({ message: 'success', result: response });
        }).catch((error) => {
          resolve({ message: 'failed', result: error });
        });
      });

      const p5 = new Promise((resolve) => {
        sequelize.query(q5).then((response) => {
          resolve({ message: 'success', result: response });
        }).catch((error) => {
          resolve({ message: 'failed', result: error });
        });
      });


      Promise.all([p1, p2, p3, p4, p5]).then((queryResults) => {
        const checkResults = queryResults.map((item) => item.message).includes('failed');
        if (checkResults) {
          const checkError = queryResults.find(element => element.message === 'failed');
          const { result } = checkError;
          ERROR(res, result, req.span);
        } else {
          const message = 'Columns Successfully Updated';
          SUCCESS(res, 200, message);
        }
      });

    } catch (error) {
      ERROR(res, error, req.span);
    }
  },

  /**
   * migrate user jumpcloud data with MySQL database
   * updating existing users jumpcloud ids
  */
  migrateUserJumpcloudData: async (req, res) => {
    try {

      const params = {};
      let userDataArr = [];

      const userData = await Service.getRecodes(params);

      userDataArr = userData;
      userDataArr = JSON.parse(JSON.stringify(userData));

      const migrateResult = await Service.updateJumpcloudData(userDataArr);

      SUCCESS(res, 200, { data: migrateResult });

    } catch (error) {
      ERROR(res, error, req.span);
    }
  }

};