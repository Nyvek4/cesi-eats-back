// models/Delivery.js
const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres', 
});

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
      model: 'Users',
      key: 'id',
    }
  },
  orderId: {
    type: DataTypes.UUID,
    references: {
      model: 'Orders',
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

Delivery.cancel = async function(orderId) {
  const delivery = await Delivery.findOne({ where: { orderId: orderId } });
  if (!delivery) {
    return false;
  }
  delivery.isCanceled = true;
  await delivery.save();
  return true;
}

module.exports = Delivery;
