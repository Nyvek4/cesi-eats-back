const express = require('express');
const router = express.Router();
const Order = require('./models/Order');
const Cart = require('./models/Cart');
const verifyCard = require('./utils/verifyCard');
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
router.get('/tocook', authenticateTokenAndRole, async (req, res) => {
  const userId  = req.user.id;
  const { id } = req.params;

  if (req.user.role === 'admin' && id) {
    userId = id;
  }
  console.log(req.user.userType)

  if (req.user.userType === 'delivery' || req.user.userType === 'customer') {
    return res.status(400).send({ message: 'Bad userType ' });
  }

  try {
    console.log(userId)
    const orders = await Order.findAll({
      where: {
        userId: userId, isPaid: true, isCooked: false, isAccepted: false, isRefused: false
      }
    });
    res.json(orders);
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
// Route pour payer une commande 
router.post('/checkout', async (req, res) => {
  const { orderId, cardInfo } = req.body;

  // Vérification de la carte bancaire
  if (!verifyCard(cardInfo.cardNumber)) {
    return res.status(400).json({ message: "Invalid card information" });
  }
  if(cardInfo.cvc.length !== 3){
    return res.status(400).json({ message: "Invalid cvv information" });
  }
  //check if the card is expired
  const today = new Date();
  const cardDate = new Date(cardInfo.expirationDate);
  if(today > cardDate){
    return res.status(400).json({ message: "Card is expired" });
  }

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.isPaid) {
      return res.status(400).json({ message: "Order is already paid" });
    }

    // Mettre à jour le statut isPaid de la commande
    await order.update({ isPaid: true });
    res.json({ message: "Order has been paid successfully" });

    // Ici, vous pourriez également déclencher une nouvelle demande de livraison au micro-service delivery
    // selon votre logique métier.
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred while processing the payment" });
  }
});
// Route pour acquitter une commande (basé sur le token ou sur param si admin)
router.put('/acquit/:orderId', authenticateTokenAndRole, async (req, res) => {
  const { orderId } = req.params;
  const id  = req.user.id;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    // Vérification des conditions supplémentaires
    if (!order.isPaid || !order.isRefused || !order.isAccepted || !order.isAssigned || !order.isCooked || !order.isPickedUp) {
      return res.status(400).json({ message: "Order cannot be acquitted under current status" });
    }

    if (req.user.role === 'admin' || order.userId === id) {
      await order.update({ isAcquitted: true });
      res.json({ message: "Order has been acquitted successfully" });
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});
// Route pour marquer une commande comme cuisinée
router.put('/cooked/:orderId', authenticateTokenAndRole, async (req, res) => {
  const { orderId } = req.params;
  const id = req.user.id;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.isCooked) {
      return res.status(400).json({ message: "Order is already cooked" });
    }
    if(order.isRefused){
      return res.status(400).json({ message: "Order is refused, you can't cook it now" });
    }
    if (!order.isPaid || !order.isAccepted) {
      return res.status(400).json({ message: "Order cannot be marked as cooked under current status" });
    }

    if (req.user.userType === 'admin' || (req.user.userType === 'restaurant' && order.userId === id)) {
      await order.update({ isCooked: true });
      res.json({ message: "Order has been marked as cooked successfully" });
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});
// Route pour accepter une commande
router.put('/accept/:orderId', authenticateTokenAndRole, async (req, res) => {
  const { orderId } = req.params;
  const id = req.user.id;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (!order.isPaid) {
      return res.status(400).json({ message: "Order cannot be accepted if it's not paid" });
    }
    if (req.user.userType === 'admin' || (req.user.userType === 'restaurant' && order.userId === id)) {
      await order.update({ isAccepted: true });
      res.json({ message: "Order has been accepted successfully" });
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});
// Route pour refuser une commande
router.put('/refuse/:orderId', authenticateTokenAndRole, async (req, res) => {
  const { orderId } = req.params;
  const id = req.user.id;

  try {
    const order = await Order.findByPk(orderId)
    if (order.isRefused) {
      return res.status(400).json({ message: "Order is already refused" });
    }
    if (order.isAccepted) {
      return res.status(400).json({ message: "Order is accepted, you can't cancel it now" });
    }
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (!order.isPaid) {
      return res.status(400).json({ message: "Order cannot be refused if it's not paid" });
    }

    if (req.user.userType === 'admin' || (req.user.userType === 'restaurant' && order.userId === id)) {
      await order.update({ isRefused: true });
      res.json({ message: "Order has been refused successfully" });
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;

