const express = require('express');
const validationsList = require('./validations/list');
const handlersList = require('./handlers/list');
const validationsCreate = require('./validations/create');
const handlersCreate = require('./handlers/create');

const validations = {
  list: validationsList,
  create: validationsCreate,
};
const handlers = {
  list: handlersList,
  create: handlersCreate,
};

const router = express.Router();
router.get('/', validations.list, handlers.list);
router.post('/', validations.create, handlers.create);

module.exports = router;
