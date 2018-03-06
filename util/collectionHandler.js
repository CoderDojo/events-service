const builderHandler = require('./builderHandler');

module.exports = (Model) => (req, res, next) => {
  builderHandler(Model)(req, res, () => {
    const qb = res.locals.qb;
    if (req.query.page) {
      qb.page(parseInt(req.query.page, 10) - 1, parseInt(req.query.pageSize, 10) || 50);
    } else {
      qb.page(0, 'NULL');
    }
    next();
  });
}
