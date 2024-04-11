const { Sequelize, DataTypes, Model } = require('sequelize');
const User = require('./User');
const Article = require('./Article');
const Menu = require('./Menu');
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
    type: DataTypes.JSONB,
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
  isCooked: {
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


Order.getDelieryAddress = async (orderId,choosedAddress) => {
  const order = await Order.findByPk(orderId);
  if (!order) {
    return null;
  }
  this_user = await User.findByPk(order.userId);
  address = this_user.address[choosedAddress]
  return address;
};

Order.getPrice = async (orderId) => {
  const order = await Order.findByPk(orderId);
  if (!order) {
    return null;
  }
  let total = 0;
  for (let i = 0; i < order.items.length; i++) {
    this_ = await Article.findByPk(order.items[i].itemId);

    if (!this_) {
      this_ = await Menu.findByPk(order.items[i].itemId);

      if (!this_){
        continue;
      }
    }
    if(this_.price){      
      if (parseFloat(this_.price))
      {
        total += parseFloat(this_.price)
      }
    }
  }
  return total;
};

Order.getRestaurantAddress = async (orderId) => {
  const order = await Order.findByPk(orderId);
  if (!order) {
    return null;
  }
  let addresses = [];
  //Boucler sur les items pour récupérer l'adresse des restaurant
  for (let i = 0; i < order.items.length; i++) {
    let address
    idRestaurant = order.items[i].restaurantId
    thisRestaurant = await User.findByPk(idRestaurant);
    address = thisRestaurant.address;
    addresses.push(address);
  }


  return addresses;
};


module.exports = Order;