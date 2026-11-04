'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
      Course.hasMany(models.Lesson, { foreignKey: 'course_id', as: 'lessons' });
      Course.hasMany(models.Enrollment, { foreignKey: 'course_id', as: 'enrollments' });
    }
  }
  Course.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: { type: DataTypes.STRING, defaultValue: 'draft' },
    created_by: DataTypes.UUID
  }, { 
    sequelize, 
    modelName: 'Course',
    paranoid: true // Habilita borrado lógico
  });
  return Course;
};