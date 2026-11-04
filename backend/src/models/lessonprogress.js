'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LessonProgress extends Model {
    static associate(models) {
      LessonProgress.belongsTo(models.User, { foreignKey: 'user_id', as: 'student' });
      LessonProgress.belongsTo(models.Lesson, { foreignKey: 'lesson_id', as: 'lesson' });
    }
  }
  LessonProgress.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: DataTypes.UUID,
    lesson_id: DataTypes.UUID,
    status: { type: DataTypes.STRING, defaultValue: 'not_started' },
    completed_at: DataTypes.DATE
  }, { sequelize, modelName: 'LessonProgress' });
  return LessonProgress;
};