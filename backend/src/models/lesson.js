'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    static associate(models) {
      Lesson.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
    }
  }
  Lesson.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    course_id: DataTypes.UUID,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    position: DataTypes.INTEGER
  }, { 
    sequelize, 
    modelName: 'Lesson',
    paranoid: true 
  });
  return Lesson;
};