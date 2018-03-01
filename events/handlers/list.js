const EventsController = require('../controller');

module.exports = [
  async (req, res) => {
    res.send(await EventsController.list(req.query));
  },
];