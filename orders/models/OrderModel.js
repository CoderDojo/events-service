const uuid = require('uuid/v4');
const { Model } = require('objection');
const ApplicationModel = require('../../applications/models/ApplicationModel');

class OrderModel extends Model {
  static get tableName() {
    return 'cd_orders';
  }
  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }
  static get relationMappings() {
    return {
      applications: {
        relation: Model.HasManyRelation,
        modelClass: ApplicationModel,
        join: {
          from: 'cd_orders.id',
          to: 'cd_applications.orderId',
        },
      },
    };
  }
}

module.exports = OrderModel;
