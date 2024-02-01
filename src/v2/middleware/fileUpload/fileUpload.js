/* cSpell:ignore originalname */
const fs = require('fs');

const { TE } = require('../../../helper');

const { ResponseHandler } = require('../../handlers');

const { ERROR } = ResponseHandler;

const multer = require('multer');

const memoryStorage = multer.memoryStorage();

const fileUploadMemoryStorage = (fileName) => multer({ storage: memoryStorage }).single(fileName);

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => {
    const fileExtention = file.originalname.split('.');
    const fileName = file.fieldname + '.' + fileExtention[fileExtention.length - 1];
    cb(null, fileName);
  }
});

const fileUploadDisckStorage = (fileName) => multer({ storage: diskStorage }).single(fileName);

const validateAndManageUploadedFile = (uploadedFileName) => async (req, res, next) => {
  try {

    const data = { file: null };

    if (req.file) data.file = req.file;
    else if (!req.file && req.body[uploadedFileName]) {

      const FILE = req.body[uploadedFileName];
      const nameSplit = FILE.originalname.split('.');
      const fileName = `${FILE.fieldname}.${nameSplit[nameSplit.length - 1]}`;
      const path = `uploads/${fileName}`;

      await fs.writeFileSync(path, FILE.buffer, 'base64');

      data.file = {
        path,
        ...FILE,
      };

      // eslint-disable-next-line require-atomic-updates
      req.file = data.file;

    }

    if (!data.file) TE({ code: 400, message: 'file not found' });

    next();

  } catch (error) {
    ERROR(res, error, req.span);
  }
};

module.exports = {
  fileUploadMemoryStorage,
  fileUploadDisckStorage,
  validateAndManageUploadedFile
};