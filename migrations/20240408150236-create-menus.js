'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Menus', {
      id: {
        allowNull: false,
        primaryKey: true, 
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.FLOAT
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users', // Assure-toi que cela correspond au nom de ta table utilisateurs
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type: {
        type: Sequelize.ENUM('starter', 'main_dish', 'dessert', 'drink'),
        allowNull: false
      },
      // Assure-toi que categorieId est défini correctement comme une clé étrangère sans utiliser `Sequelize.literal('uuid_generate_v4()')`
      categorieId: {
        type: Sequelize.UUID,
        references: {
          model: 'Categories', // Assure-toi que cela correspond au nom de ta table catégories
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Ou 'CASCADE' selon ta logique métier
      },
      Menus: {
        type: Sequelize.JSONB,
        defaultValue: {} // Donne une valeur par défaut vide pour la composition
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
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Menus');
  }
};
