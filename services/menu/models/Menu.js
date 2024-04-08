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
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users', // Nom de la table
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  categorieId: {
    type: DataTypes.UUID,
    references: {
      model: 'Categories', // Nom de la table
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
  sequelize,
  modelName: 'Menu',
  timestamps: true, // Active les champs createdAt et updatedAt automatiquement
});

Menu.belongsToMany(Article, {
  through: 'menuItems', // Nom de la table d'association
  as: 'articles', // Nom de la relation
  foreignKey: 'menuId', // Clé étrangère dans la table d'association qui référence Menu
  otherKey: 'articleId', // Clé étrangère dans la table d'association qui référence Article
});

module.exports = Menu;
