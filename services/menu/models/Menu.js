const { Sequelize, DataTypes, Model } = require('sequelize');
require('dotenv').config({ path: '.env' });
const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
});

class Menu extends Model {}

Menu.init({
  // Définition des attributs du modèle
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  articlesId: { type: DataTypes.JSONB, allowNull: true },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users', // Nom de la table
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
  sequelize,
  modelName: 'Menu',
  timestamps: true, // Active les champs createdAt et updatedAt automatiquement
});

module.exports = Menu;
