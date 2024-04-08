const Cart = require('../models/Cart');

const verify = async (userId) => {
  try {
    const cart = await Cart.findOne({ where: { userId } });
    return cart !== null;
  } catch (error) {
    console.error('Error verifying cart:', error);
    throw error; // Lancez une erreur que vous pouvez intercepter dans votre middleware
  }
};

module.exports = verify;
