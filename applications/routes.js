const express = require('express');
const validationsList = require('./validations/list');
const handlersList = require('./handlers/list');

const validations = {
  list: validationsList,
};
const handlers = {
  list: handlersList,
};

const router = express.Router();
router.get('/', validations.list, handlers.list);

module.exports = router;
