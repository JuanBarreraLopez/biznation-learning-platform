'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courses', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
      title: { type: Sequelize.STRING },
      description: { type: Sequelize.TEXT },
      status: { type: Sequelize.STRING, defaultValue: 'draft' },
      created_by: { 
        type: Sequelize.UUID, 
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE } // Para el soft delete
    });
  },
  async down(queryInterface, Sequelize) { await queryInterface.dropTable('Courses'); }
};