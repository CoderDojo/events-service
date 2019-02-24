const express = require('express');
const validations = require('./validations');
const handlers = require('./handlers');

const router = express.Router();
router.get('/', validations.list, handlers.list);
router.delete('/:id', validations.delete, handlers.delete);

module.exports = router;
