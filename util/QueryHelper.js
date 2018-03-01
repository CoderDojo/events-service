class QueryHelper {
  constructor(Model, query) {
    this.Model = Model;
    this.query = query;
    this.qb = Model.query();
    this.handlePagination();
    this.handleSorting();
    this.handleFields();
  }

  async handlePagination() {
    if (this.query.offset) {
      this.qb.offset(this.query.offset);
      delete this.query.offset;
    }
    if (this.query.limit) {
      this.qb.limit(this.query.limit);
      delete this.query.limit;
    }
    return this;
  }

  async handleSorting() {
    if (this.query.orderBy) {
      this.qb.orderBy(this.query.orderBy);
      delete this.query.orderBy;
    }
    return this;
  }

  async handleFields() {
    if (this.query.fields) {
      this.qb.column(this.query.fields.split(','));
      delete this.query.fields;
    }
    return this;
  }
}

module.exports = QueryHelper;