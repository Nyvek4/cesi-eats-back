'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true, 
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      birthdate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      address: {
        type: Sequelize.JSON,
        allowNull: true
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'user'
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      userType: {
        type: Sequelize.STRING,
        defaultValue: 'customer'
      },
      lastLogin: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
