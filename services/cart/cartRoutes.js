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

// Ajout d'un article au panier d'un utilisateur
router.put('/edit',authenticateTokenAndRole, async (req, res) => {
const body  = req.body;
const Items = body.Items;
const userId = req.user.id;
console.log(Items)
try {
  if (!checkItems(Items)) {
    return res.status(400).json({ message: "Invalid items in cart :" });
  }
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  const cart = await Cart.findOne({ where: { userId: req.user.id } });
  const payload = { "items": Items}
  await cart.update(payload);
  if(cart){
    return res.send({ message: "Items added to cart successfully" });
  }
} catch (error) {
  console.error(error);
  res.status(500).send({ message: error.message });
}});

// A IMPLEMENTER VIA LE SERVICE DE COMMANDE A LA VALIDATION DU CART
// router.delete('/delete',authenticateTokenAndRole, async (req, res) => {
//   const userId = req.user.id;
//   try {
//     const cart = await Cart.findOne({ where: { userId: req.user.id } });
//     if (!cart) {
//       return res.status(404).send({ message: "Cart not found" });
//     }
//     await cart.destroy();
//     res.send({ message: "Cart deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: error.message });
//   }
// });


module.exports = router;
