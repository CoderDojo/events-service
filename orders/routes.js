const express = require('express');
const validationsList = require('./validations/list');
const handlersList = require('./handlers/list');
const validationsCreate = require('./validations/create');
const handlersCreate = require('./handlers/create');
const handlersUpdate = require('./handlers/update');
const validationsUpdate = require('./validations/update');

const validations = {
  list: validationsList,
  create: validationsCreate,
  update: validationsUpdate,
};
const handlers = {
  list: handlersList,
  create: handlersCreate,
  update: handlersUpdate,
};

const router = express.Router();
router.get('/', validations.list, handlers.list);
router.post('/', validations.create, handlers.create);
router.put('/:orderId', validations.update, handlers.update);

module.exports = router;
