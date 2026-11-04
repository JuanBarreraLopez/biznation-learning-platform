'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Lessons', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
      course_id: { 
        type: Sequelize.UUID, 
        references: { model: 'Courses', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      title: { type: Sequelize.STRING },
      content: { type: Sequelize.TEXT },
      position: { type: Sequelize.INTEGER },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE } // Soft delete
    });
  },
  async down(queryInterface, Sequelize) { await queryInterface.dropTable('Lessons'); }
};