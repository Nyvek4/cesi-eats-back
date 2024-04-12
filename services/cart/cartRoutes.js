const express = require('express');
const User = require('./models/User'); // Utilise le modèle Sequelize User
const Cart = require('./models/Cart');
const checkItems = require('./utils/checkItems');
const authenticateTokenAndRole = require('./utils/authenticateTokenAndRole');
const jwt = require('jsonwebtoken');
const router = express.Router();


// Consultation du panier d'un utilisateur 
router.get('/consult',authenticateTokenAndRole, async (req, res) => {
  try {
    
    const userId = req.user.id; 
    const userType = req.user.userType;
    console.log(userType)
    if (userType !== 'customer') {
      return res.status(403).json({ message: "Unauthorized : You need to be a customer" });
    }
    cart = await Cart.findOne({ where: { userId: req.user.id } });
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// Ajout d'items au panier d'un utilisateur
router.put('/edit',authenticateTokenAndRole, async (req, res) => {
const body  = req.body;
const Items = body.Items;
const userId = req.user.id;
console.log(Items)
try {

  const check = await checkItems(Items);

  console.log(check);
  console.log(userId);

  if (!check) {
    return res.status(400).json({ message: "Invalid items in cart" });
  }
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  
  const cart = await Cart.findOne({ where: { userId: req.user.id } });
    
  const existingItems = Array.isArray(cart.items) ? cart.items : [];
  const updatedItems = [...existingItems, ...Items];
  await cart.update({ items: updatedItems });

  if(cart){
    return res.send({ message: "Items added to cart successfully" });
  }
} catch (error) {
  console.error(error);
  res.status(500).send({ message: error.message });
}});

router.put('/deleteItem',authenticateTokenAndRole, async (req, res) => {
  const body  = req.body;
  const Items = body.Items;
  const userId = req.user.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    if (!Items) {
      return res.status(400).send({ message: "Please send the new cart" });
    }

    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if(!cart){
      return res.status(404).send({ message: "Cart not found" });
    }
    if(cart.items.length === 0){
      return res.status(400).send({ message: "Cart is already empty" });
    }

    await cart.update({ items: Items });
    if(cart){
      return res.send({ message: "Item deleted from cart successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
})

module.exports = router;
