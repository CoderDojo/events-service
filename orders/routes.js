const express = require('express');
const validationsList = require('./validations/list');
const handlersList = require('./handlers/list');
const validationsCreate = require('./validations/create');
const handlersCreate = require('./handlers/create');
const validationsCheckin = require('./validations/checkin');
const handlersCheckin = require('./handlers/checkin');

const validations = {
  list: validationsList,
  create: validationsCreate,
  checkin: validationsCheckin,
};
const handlers = {
  list: handlersList,
  create: handlersCreate,
  checkin: handlersCheckin,
};

const router = express.Router();
router.get('/', validations.list, handlers.list);
router.post('/', validations.create, handlers.create);
router.patch('/:orderId/checkin', validations.checkin, handlers.checkin);

module.exports = router;
