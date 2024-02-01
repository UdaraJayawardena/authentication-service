const csv = require('csvtojson');

const fs = require('fs');

const crypto = require('crypto');

const Utility = {

  hashCode: (string) => {

    const hashCode = crypto.createHash('md5').update(string).digest('hex');

    return hashCode;
  },

  convertCSVToJSON: async (csvFilePath, removeble) => {

    const jsonArray = await csv().fromFile(csvFilePath);

    if (jsonArray) {

      if (removeble) fs.unlinkSync(csvFilePath);

      return jsonArray;
    }

    return [];
  },

  validateJSONProperty: (dataArray, keyFields) => {

    let isValid = true;

    keyFields.filter((key) => {

      // eslint-disable-next-line no-prototype-builtins
      if (!dataArray[0].hasOwnProperty(key)) {

        isValid = false;
      }
    });

    if (!isValid) {

      throw {
        code: 4004, errmsg: 'CSV File Invalid', result: {

          valiedHeaders: keyFields,

          importCsvHeaders: Object.keys(dataArray[0]),

          message: 'Csv header mismatch'
        }
      };
    }

    return true;
  },

  compareTwoArrayAndRemoveDuplicates: (array01, array02, filterProperty) => {

    return array01.filter(

      element => {

        const value = filterProperty ?

          element[filterProperty] : element;

        return !array02.includes(value);
      }
    );
  },

  capiterlizeWithoutSpace: (value) => {

    value = value.toLowerCase()
      .normalize('NFD')
      .replace(/[^a-z]/g, '');

    return value.toUpperCase();
  },

  isNullOrEmpty: data => {
    if (typeof data === String) {
      if (data.trim() === '') return true;
    }
    if (data === undefined) return true;

    if (data === null) return true;

    if (Object.keys(data) && Object.keys(data).length === 0) return true;

    return false;
  },

  encodeHTML: value => {
    if (typeof value !== 'string') return value;
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  },

  decodeHTML: value => {
    if (typeof value !== 'string') return value;
    return value
      .replace(/&apos;/g, '\'')
      .replace(/&quot;/g, '"')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&amp;/g, '&');
  },
};

module.exports = Utility;
