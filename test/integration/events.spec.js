const request = require('supertest');
const proxy = require('proxyquire');

describe('integration:events', () => {
  let app;

  before(() => {
    app = proxy('../../index', {
      './config/db.json': dbConfig,
    });
  });
});