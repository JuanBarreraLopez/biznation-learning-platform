'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Enrollments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      user_id: { 
        type: Sequelize.UUID, 
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      course_id: { 
        type: Sequelize.UUID, 
        references: { model: 'Courses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'active'
      },
      enrolled_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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

    // Indice compuesto único para evitar matrícula doble
    await queryInterface.addConstraint('Enrollments', {
      fields: ['user_id', 'course_id'],
      type: 'unique',
      name: 'unique_user_course_enrollment'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Enrollments');
  }
};