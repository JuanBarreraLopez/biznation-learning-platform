'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WebhookEvents', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      event_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true 
      },
      source: {
        type: Sequelize.STRING, // Ej. 'stripe', 'meta', 'paypal'
        allowNull: false
      },
      type: {
        type: Sequelize.STRING, // Ej. 'payment.success', 'message.received'
        allowNull: false
      },
      payload: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending' // pending, processed, failed
      },
      processed_at: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WebhookEvents');
  }
};