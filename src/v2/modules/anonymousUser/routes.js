const express = require('express');

const router = express.Router();

const Controller = require('./controller');
const authorizationMiddleware = require('../../middleware/utilityFunctions');

router.route('/').get(
  authorizationMiddleware.decodeToken,
  Controller.getRecodes);

router.post('/add-single-recode',
  authorizationMiddleware.decodeToken,
  Controller.createRecode);

router.route('/update-recode').put(
  authorizationMiddleware.decodeToken,
  Controller.updateRecode);

router.post('/get-token',
  Controller.getToken);

router.post('/generate-new-permission-key',
  Controller.permissionCodeUpdate);

module.exports = router;

/**
 * @swagger
 * /anonymous-user/:
 *    get:
 *      tags:
 *      - "anonymous-user"
 *      name: "get anonymous user details"
 *      summary: "get anonymous user details"
 *      operationId: "anonymousUserGet"
 *      consumes:
 *      - "application/json"
 *      produces:
 *      - "application/json"
 *      parameters:
 *      - in: "query"
 *        name: "condition"
 *        description: "select condition"
 *        required: true
 *        schema:
 *          type: String
 *      responses:
 *        200:
 *          description: "anonymous user details"
 *          schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: integer
 *                 default: 200
 *               data:
 *                 type: array
 *               success:
 *                 type: boolean
 *        400:
 *          description: "Bad request"
 *
*/

/**
 * @swagger
 * /authorization/login:
 *    post:
 *      tags:
 *      - "authorization login"
 *      name: "validate credintials and generate token"
 *      summary: "validate credintials and generate token"
 *      operationId: "createLoginToken"
 *      consumes:
 *      - "application/json"
 *      produces:
 *      - "application/json"
 *      parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "login Details"
 *        required: true
 *        schema:
 *            type: "object"
 *            properties:
 *              userId:
 *                type: "string"
 *                example: "userId"
 *              password:
 *                type: "string"
 *                example: "password"
 *            required:
 *              - userId
 *              - password
 *      responses:
 *        200:
 *          description: "user login token"
 *          schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: integer
 *                 default: 200
 *               data:
 *                 type: object
 *               success:
 *                 type: boolean
 *        400:
 *          description: "Bad request"
 *
*/