'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Deliveries', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      driverId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      orderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id'
        }
      },
      isCanceled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      start_geoData: Sequelize.JSON,
      end_geoData: Sequelize.JSON,
      current_geoData: Sequelize.JSON,
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Deliveries');
  }
};
