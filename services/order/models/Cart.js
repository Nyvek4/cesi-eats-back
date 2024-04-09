const { Sequelize, DataTypes, Model } = require('sequelize');
require('dotenv').config({ path: '.env' });
const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
});

class Cart extends Model {}

Cart.init({
  // Définition des attributs du modèle
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
  sequelize,
  modelName: 'Cart',
  timestamps: true, // Active les champs createdAt et updatedAt automatiquement
});


module.exports = Cart;
