'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Classifications', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
      user_id: { 
        type: Sequelize.UUID, 
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      status: { type: Sequelize.STRING }, // 'active', 'at_risk', 'inactive'
      reason: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Classifications');
  }
};