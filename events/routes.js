const express = require('express');

const validations = {
  list: require('./validations/list'),
};
const handlers = {
  list: require('./handlers/list'),
};

const router = express.Router();
router.get('/', validations.list, handlers.list);

module.exports = router;
