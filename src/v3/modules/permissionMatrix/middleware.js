/* eslint-disable require-atomic-updates */
const { ResponseHandler } = require('../../handlers');
const { REDIS_CONFIG } = require('../../../../config/config.js');

const { TE, to, parseToObject } = require('../../../helper');

const { ERROR, SUCCESS } = ResponseHandler;

const service = require('./service');
// const roleService = require('../roles/service');
// const clusterService = require('../cluster/service');

const redis = require('redis');

//setup port constants
const port_redis = REDIS_CONFIG; //16379;
//configure redis client on port 6379
const redis_client = redis.createClient(port_redis);

const redisGetAsync = (id) => {
  return new Promise((resolve, reject) => {
    redis_client.get(id, (err, data) => {
      if (err) {
        console.log(err);
        reject({ code: 404, message: 'Error occur while getting data from cache.' });
      }
      //if no match found
      if (data != null) {
        resolve(parseToObject(data));
        //res.send(JSON.parse(data));
      } else {
        resolve(null);
      }
    });
  });
};

module.exports = {
  validateUserPermissionRequest: async (req, res, next) => {
    try {

      // const { cluster } = req.query;
      const { authorization } = req.headers;

      // if (!cluster) TE({ code: 400, message: 'Cluster required.' });

      if (!authorization)
        TE({ code: 400, message: 'need authoriization token' });

      next();
    } catch (error) {
      ERROR(res, error);

    }
  },

  setRecordsToCache: async (req, res) => {
    try {
      const Permissions = await service.getRecodes();
      // const roles = await roleService.getRecodes();
      // const clusters = await clusterService.getRecodes();
      if (Permissions.length > 0) {

        redis_client.flushdb(function (err, succeeded) {
          console.log(succeeded); // will be true if successfull
        });

        const obj = {};
        for (const permission of Permissions) {
          const role = permission.roleName.replace(/\s/g, '');
          const cluster = permission.clusterName.replace(/\s/g, '');

          const formattedData = {
            role: permission.roleName,
            cluster: permission.clusterName,
            accessRight: permission.accessRightName,
            functionality: permission.functionalityName,
            permission: permission.permission
          };

          if (formattedData.permission) {
            // role and cluster
            if (obj[role + cluster])
              obj[role + cluster].push(formattedData);
            else {
              obj[role + cluster] = [formattedData];
            }

            // role
            if (obj[role])
              obj[role].push(formattedData);
            else {
              obj[role] = [formattedData];
            }

            // cluster
            if (obj[cluster])
              obj[cluster].push(formattedData);
            else {
              obj[cluster] = [formattedData];
            }
          }

        }
        const ids = Object.keys(obj);

        if (ids.length > 0) {
          for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            //add data to Redis
            redis_client.set(id, JSON.stringify(obj[id]));
          }

        }

      }

      SUCCESS(res, 200, { message: 'ok' });
    } catch (error) {
      ERROR(res, error);
    }
  },


  setRecordsToCacheInternally: async () => {
    try {
      const Permissions = await service.getRecodes();

      // redis_client.flushdb(function (err, succeeded) {
      //   console.log('redis cache updated : ', succeeded); // will be true if successfull
      // });

      if (Permissions.length > 0) {
        const obj = {};
        for (const permission of Permissions) {
          const role = permission.roleName.replace(/\s/g, '');
          const cluster = permission.clusterName.replace(/\s/g, '');

          const formattedData = {
            role: permission.roleName,
            cluster: permission.clusterName,
            accessRight: permission.accessRightName,
            functionality: permission.functionalityName,
            permission: permission.permission
          };

          if (formattedData.permission) {
            // role and cluster
            if (obj[role + cluster])
              obj[role + cluster].push(formattedData);
            else {
              obj[role + cluster] = [formattedData];
            }

            // role
            if (obj[role])
              obj[role].push(formattedData);
            else {
              obj[role] = [formattedData];
            }

            // cluster
            if (obj[cluster])
              obj[cluster].push(formattedData);
            else {
              obj[cluster] = [formattedData];
            }
          }

        }
        const ids = Object.keys(obj);

        if (ids.length > 0) {
          redis_client.flushdb(function (err, succeeded) {
            console.log('redis cache updated : ', succeeded); // will be true if successfull
            for (let i = 0; i < ids.length; i++) {
              const id = ids[i];
              //add data to Redis
              redis_client.set(id, JSON.stringify(obj[id]));
            }
          });


        }

      }
      return true;
    } catch (error) {
      console.log(error);
    }
  },

  checkCache: (req, res, next) => {
    const { id } = req.params;

    redis_client.get(id, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      //if no match found
      if (data != null) {
        res.send(data);
      } else {
        //proceed to next middleware function
        next();
      }
    });
  },

  getRecordsFromCache: async (req, res) => {
    try {
      const { cluster } = req.query;
      const role = req.user.role;
      let formattedRole = '';
      let formattedCluster = '';
      if (role) {
        formattedRole = role.replace(/\s/g, '');
      } else {
        TE({ code: 404, message: 'User role must required.' });
      }

      if (cluster) {
        formattedCluster = cluster.replace(/\s/g, '');
      }

      const id = formattedRole + formattedCluster;

      redis_client.get(id, (err, data) => {
        if (err) {
          console.log(err);
          // TE({ code: 404, message: 'Error occur while getting data from cache.' });
          ERROR(res, { code: 404, message: 'Error occur while getting data from cache.' });
        }
        //if no match found
        if (data != null) {
          SUCCESS(res, 200, { pemissions: JSON.parse(data) });
          //res.send(JSON.parse(data));
        } else {
          const err = { code: 404, message: 'no permission data available for this user (from cache)' };
          // TE(err);
          ERROR(res, err);
        }
      });
    }
    catch (error) {
      ERROR(res, error);
    }

  },

  getPermissionsFromCache: async (req, res, next) => {
    try {
      const { cluster } = req.query;
      const role = req.user.role;
      const clusters = req.clusters;
      let formattedRole = '';

      if (role) {
        formattedRole = role.replace(/\s/g, '');
      } else {
        TE({ code: 404, message: 'User role must required.' });
      }

      let permissionReqArray = [];
      if (clusters && Array.isArray(clusters) && clusters.length > 0) {
        permissionReqArray = clusters.map(c => redisGetAsync(formattedRole + c.replace(/\s/g, '')));
      }
      else if (cluster) {
        permissionReqArray.push(redisGetAsync(formattedRole + cluster.replace(/\s/g, '')));
      }

      const [err, data] = await to(Promise.all(permissionReqArray));

      if (err) ERROR(res, err);

      if (data === null) ERROR(res, { code: 404, message: 'no permission data available for this user (from cache)' });

      const permissions = data.reduce((a, cv) => {
        if (Array.isArray(cv)) a.push(...cv);
        return a;
      }, []);

      req.permissions = permissions;

      next();
    }
    catch (error) {
      ERROR(res, error);
    }
  },

  getRecordsFromCacheForFutureUse: async (req, res, next) => {
    try {
      req.permissions = [];
      const { cluster } = req.query;
      const role = req.user.role;
      let formattedRole = '';
      let formattedCluster = '';
      if (role) {
        formattedRole = role.replace(/\s/g, '');
      } else {
        TE({ code: 404, message: 'User role must required.' });
      }

      if (cluster) {
        formattedCluster = cluster.replace(/\s/g, '');
      }

      const id = formattedRole + formattedCluster;

      redis_client.get(id, (err, data) => {
        if (err) {
          console.log(err);
          // TE({ code: 404, message: 'Error occur while getting data from cache.' });
          ERROR(res, { code: 404, message: 'Error occur while getting data from cache.' });
        }
        //if no match found
        if (data != null) {
          //SUCCESS(res, 200, { pemissions: JSON.parse(data) });
          //res.send(JSON.parse(data));
          req.permissions = JSON.parse(data);
          next();
        } else {
          const err = { code: 404, message: 'no permission data available for this user (from cache)' };
          // TE(err);
          ERROR(res, err);
        }
      });

    }
    catch (error) {
      ERROR(res, error);
    }

  },
};