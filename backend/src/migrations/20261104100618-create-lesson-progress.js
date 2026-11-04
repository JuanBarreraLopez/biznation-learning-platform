'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LessonProgresses', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
      user_id: { type: Sequelize.UUID, references: { model: 'Users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      lesson_id: { type: Sequelize.UUID, references: { model: 'Lessons', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      status: { type: Sequelize.STRING, defaultValue: 'not_started' },
      completed_at: { type: Sequelize.DATE },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.addConstraint('LessonProgresses', {
      fields: ['user_id', 'lesson_id'],
      type: 'unique',
      name: 'unique_user_lesson_progress'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('LessonProgresses');
  }
};