const express = require('express');
const validationsList = require('./validations/list');
const handlersList = require('./handlers/list');
const validationsCreate = require('./validations/create');
const handlersCreate = require('./handlers/create');
const validationsCheckin = require('./validations/checkin');
const handlersCheckin = require('./handlers/checkin');
const handlersUpdate = require('./handlers/update');
const validationsUpdate = require('./validations/update');

const validations = {
  list: validationsList,
  create: validationsCreate,
  checkin: validationsCheckin,
  update: validationsUpdate,
};
const handlers = {
  list: handlersList,
  create: handlersCreate,
  checkin: handlersCheckin,
  update: handlersUpdate,
};

const router = express.Router();
router.get('/', validations.list, handlers.list);
router.post('/', validations.create, handlers.create);
router.patch('/:orderId/checkin', validations.checkin, handlers.checkin);
router.put('/:orderId', validations.update, handlers.update);

module.exports = router;
