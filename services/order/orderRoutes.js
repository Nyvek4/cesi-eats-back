const express = require('express');
const router = express.Router();
const Order = require('./models/Order');
const Cart = require('./models/Cart');
const authenticateTokenAndRole = require('./utils/authenticateTokenAndRole');
const { Op } = require('sequelize');

// Route pour créer une commande à partir du panier
router.post('/create', authenticateTokenAndRole, async (req, res) => {
  const  userId  = req.user.id;
  
  try {
    // Rechercher le panier de l'utilisateur

    if (req.user.userType !== 'customer') {
      return res.status(403).json({ message: 'Unauthorized: You need to be a customer' });
    }

    const cart = await Cart.findOne({ where: { userId: userId } });
    if (!cart) {
      return res.status(404).send({ message: 'Cart not found' });
    }
    
    // Créer la commande à partir du panier
    const order = await Order.create({
      userId: userId,
      items: cart.items, 
      address: req.body.address,
    });
    
    // Supprimer le panier (si la création de la commande est réussie)
    await cart.destroy();
    
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// Route pour lister l'historique commandes d'un utilisateur (basé sur le token ou sur param si admin)
router.get('/history', authenticateTokenAndRole, async (req, res) => {
  const userId  = req.user.id;
  const { id } = req.params;

  if (req.user.role === 'admin' && id) {
    userId = id;
  }
  if (req.user.userType === 'delivery') {
    return res.status(400).send({ message: 'Bad userType ' });
  }

  try {
    const orders = await Order.findAll({
      where: {
        userId: userId,
        [Op.or]: [
          { isAcquitted: true },
          { isRefused: true }
        ]
      }
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// Route pour lister les commandes en cours d'un utilisateur (basé sur le token ou sur param si admin)
router.get('/current', authenticateTokenAndRole, async (req, res) => {
  const userId  = req.user.id;
  const { id } = req.params;

  if (req.user.role === 'admin' && id) {
    userId = id;
  }
  if (req.user.userType === 'delivery') {
    return res.status(400).send({ message: 'Bad userType ' });
  }

  try {
    const orders = await Order.findAll({ where: { userId: userId, isAcquitted: false, isRefused: false } });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});


module.exports = router;

