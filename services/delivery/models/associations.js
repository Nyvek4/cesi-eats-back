const User = require('./User');
const Order = require('./Order');
const Delivery = require('./Delivery');

const defineAssociations = () => {
  User.hasMany(Order, { foreignKey: 'userId' });
  Order.belongsTo(User, { foreignKey: 'userId' });
  User.hasMany(Delivery, { foreignKey: 'driverId' });
  Delivery.belongsTo(User, { foreignKey: 'driverId' });
  Order.hasOne(Delivery, { foreignKey: 'orderId' });
  Delivery.belongsTo(Order, { foreignKey: 'orderId' });

};



module.exports = defineAssociations;