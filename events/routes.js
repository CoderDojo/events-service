const express = require('express');
const validationsList = require('./validations/list');
const validationsLoad = require('./validations/load');
const validationsCreate = require('./validations/create');
const validationsUpdate = require('./validations/update');
const handlersList = require('./handlers/list');
const handlersLoad = require('./handlers/load');
const handlersCreate = require('./handlers/create');
const handlersUpdate = require('./handlers/update');

const validations = {
  list: validationsList,
  load: validationsLoad,
  create: validationsCreate,
  update: validationsUpdate,
};
const handlers = {
  list: handlersList,
  load: handlersLoad,
  create: handlersCreate,
  update: handlersUpdate,
};

const router = express.Router();
router.get('/:eventId', validations.load, handlers.load);
router.get('/', validations.list, handlers.list);
router.post('/', validations.create, handlers.create);
router.put('/:eventId', validations.update, handlers.update);

module.exports = router;
