const validations = {
  list: require('./validations/list'),
};
const handlers = {
  list: require('./handlers/list'),
};

module.exports = (router) => {
  router.get('/events', validations.list, handlers.list);
};