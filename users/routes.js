const express = require('express');
const validations = require('./validations');
const handlers = require('./handlers');

const router = express.Router();
router.delete('/:id/applications', validations.applications.delete, handlers.applications.delete);

module.exports = router;
