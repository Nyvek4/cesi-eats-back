// models/Delivery.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assurez-vous que le chemin est correct

class Delivery extends Model {}

Delivery.init({
  // Définition des attributs du modèle
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  driverId: {
    type: DataTypes.UUID,
    references: {
      model: 'User',
      key: 'id',
    }
  },
  orderId: {
    type: DataTypes.UUID,
    references: {
      model: 'Order',
      key: 'id',
    }
  },
  isCanceled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  start_geoData: DataTypes.JSON, // À implémenter plus tard
  end_geoData: DataTypes.JSON, // À implémenter plus tard
  current_geoData: DataTypes.JSON, // À implémenter plus tard
}, {
  sequelize,
  modelName: 'Delivery',
});

module.exports = Delivery;
