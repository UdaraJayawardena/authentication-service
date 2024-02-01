const expect = require('chai').expect;

const { TE, to } = require('../../src/helper');

describe('Helper', async () => {

  describe('to', async () => {

    it('When pass resolved promise, then the to function return array, error is null', async () => {

      const resolvedObject = { code: 200, success: true };

      const result = await to(Promise.resolve(resolvedObject));

      expect(result).to.be.an('array')
        .that.deep.equal([null, resolvedObject])
        .with.lengthOf(2);
    });

    it('When pass reject promise, then the to function return array, result is null', async () => {

      const rejectObject = { code: 400, errmsg: 'bad request', success: true };

      const result = await to(Promise.reject(rejectObject));

      expect(result).to.be.an('array')
        .that.deep.equal([rejectObject])
        .with.lengthOf(1);
    });
  });

  describe('TE', async () => {

    it('When passing error, then the TE function throw error', async () => {

      const error = { code: 400, errmsg: 'bad request', success: true };

      expect(() => TE(error)).to.throw().with.property('code', 400);
    });
  });
});