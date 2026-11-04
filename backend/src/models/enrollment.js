'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Enrollment extends Model {
    static associate(models) {
      Enrollment.belongsTo(models.User, { foreignKey: 'user_id', as: 'student' });
      Enrollment.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
    }
  }
  Enrollment.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: DataTypes.UUID,
    course_id: DataTypes.UUID,
    status: { type: DataTypes.STRING, defaultValue: 'active' },
    enrolled_at: DataTypes.DATE
  }, { 
    sequelize, 
    modelName: 'Enrollment' 
  });
  return Enrollment;
};