const EventsController = require('../controller');
const TicketsController = require('../../tickets/controller');
const Model = require('../models/EventModel');
const { TypeNotHandled, InvalidStatus } = require('../errors');

module.exports = [
  async (req, res, next) => {
    const { type, status } = req.body;
    // Custom business validation
    if (!Model.isEditable(status)) return next(InvalidStatus);
    if (type !== Model.types.ONE_OFF) return next(TypeNotHandled);
    // Prepare different models so they can be consumed easily afterwards
    res.locals.event = req.body;
    res.locals.sessions = req.body.sessions;
    res.locals.tickets = req.body.sessions[0].tickets;
    delete res.locals.sessions[0].tickets;
    delete res.locals.event.sessions;
    next();
  },
  async (req, res, next) => {
    const { event } = res.locals;
    res.locals.event = await EventsController.update(event);
    next();
  },
  async (req, res, next) => {
    const { event, session, tickets } = res.locals;
    const _tickets = await Promise.all(tickets.map(ticket => TicketsController.update(ticket)));
    res.send({ ...event, sessions: [{ ...session, tickets: _tickets }] });
  },
];
