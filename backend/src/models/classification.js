'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Classification extends Model {
    static associate(models) {
      Classification.belongsTo(models.User, { foreignKey: 'user_id', as: 'student' });
    }
  }
  Classification.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: DataTypes.UUID,
    status: DataTypes.STRING,
    reason: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Classification',
  });
  return Classification;
};