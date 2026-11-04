'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Encriptamos la contraseña "admin123" usando bcrypt
    const passwordHash = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('Users', [{
      id: uuidv4(),
      name: 'Admin General',
      email: 'admin@biznation.com',
      password_hash: passwordHash,
      role: 'admin',
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { email: 'admin@biznation.com' }, {});
  }
};