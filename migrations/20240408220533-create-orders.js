'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users', // Make sure the 'Users' table exists and is correctly named
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      items: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      address: {
        type: Sequelize.ENUM('Home', 'Work'),
        allowNull: false,
      },
      isPaid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isAccepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isRefused: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isAssigned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isPickedUp: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isAcquitted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isCooked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
      // Création du trigger pour vérifier les conditions avant mise à jour de isAcquitted
    await queryInterface.sequelize.query(`
    CREATE OR REPLACE FUNCTION verify_order_status()
    RETURNS TRIGGER AS $$
    BEGIN
      IF NEW."isAcquitted" AND (
        NOT OLD."isPaid" OR
        NOT OLD."isAccepted" OR
        NOT OLD."isAssigned" OR
        NOT OLD."isCooked" OR
        NOT OLD."isPickedUp"
      ) THEN
        RAISE EXCEPTION 'Order cannot be acquitted under current status';
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER verify_order_acquitted_before_update
    BEFORE UPDATE OF "isAcquitted" ON "Orders"
    FOR EACH ROW
    EXECUTE FUNCTION verify_order_status();
    `);
      } catch (error) {
      console.error(error);
      }
    },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Orders');
  },
};