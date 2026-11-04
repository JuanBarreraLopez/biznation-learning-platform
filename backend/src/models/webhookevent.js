'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WebhookEvent extends Model {
    static associate(models) {
      // Los webhooks usualmente son independientes, no requieren asociación directa
    }
  }
  WebhookEvent.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    event_id: { type: DataTypes.STRING, unique: true },
    source: DataTypes.STRING,
    type: DataTypes.STRING,
    payload: DataTypes.JSONB,
    status: { type: DataTypes.STRING, defaultValue: 'pending' },
    processed_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'WebhookEvent',
  });
  return WebhookEvent;
};