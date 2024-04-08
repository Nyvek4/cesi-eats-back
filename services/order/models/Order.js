const { Sequelize, DataTypes, Model } = require('sequelize');
require('dotenv').config({ path:'.env'}); 
const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres', 
});

class Order extends Model {}

Order.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  items: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    allowNull: false,
  },
  address: {
    type: DataTypes.ENUM('Home', 'Work'),
    allowNull: false,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  isAccepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  isRefused: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  isAssigned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  isPickedUp: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  isAcquitted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Order',
  timestamps: true,
});

module.exports = Order;