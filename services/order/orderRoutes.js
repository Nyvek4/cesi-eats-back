const express = require('express');
const router = express.Router();
const Order = require('./models/Order');
const Cart = require('./models/Cart');
const Article = require('./models/Article');
const Menu = require('./models/Menu');
const verifyCard = require('./utils/verifyCard');
const authenticateTokenAndRole = require('./utils/authenticateTokenAndRole');
const { Op } = require('sequelize');

// Route pour créer une commande à partir du panier
router.post('/create', authenticateTokenAndRole, async (req, res) => {
  const userId = req.user.id;

  try {
    if (req.user.userType !== 'customer') {
      return res.status(403).json({ message: 'Unauthorized: You need to be a customer' });
    }

    const cart = await Cart.findOne({ where: { userId: userId } });
    if (!cart) {
      return res.status(404).send({ message: 'Cart not found' });
    }

    // Préparer les items de la commande
    if(cart.items.length === 0){
      return res.status(400).send({ message: 'Cart is empty' });
    }

    const itemsWithRestaurantId = await Promise.all(cart.items.map(async (itemId) => {
      console.log(itemId)
      // Tenter de trouver l'item comme un Article
      let item = await Article.findByPk(itemId);
      if (item) {
        return { itemId, restaurantId: item.userId, state : false };
      }
      // Sinon, tenter de le trouver comme un Menu
      item = await Menu.findByPk(itemId);
      if (item) {
        return { itemId, restaurantId: item.userId , state : false};
      }
      // Retourner null si l'item n'est trouvé ni comme Article ni comme Menu
      return null;
    }));

    // Filtrer les éventuels null si des items n'ont pas été trouvés
    const filteredItems = itemsWithRestaurantId.filter(item => item !== null);

    // Créer la commande avec les items transformés
    const order = await Order.create({
      userId: userId,
      items: filteredItems,
      address: req.body.address,
    });

    // Supprimer le panier
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
  if (cardDate == undefined || cardDate == null || cardDate == '' || cardDate == 'Invalid Date'){
    return res.status(400).json({ message: "Invalid expiration date" });
  }
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
  const userId = req.user.id; // L'ID du restaurateur actuel
  
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // S'assurer que la commande est payée avant de continuer
    if (!order.isPaid) {
      return res.status(400).json({ message: "Order cannot be accepted until it's paid." });
    }

    // Analyser les items de la commande pour obtenir un tableau d'objets
    console.log(order.items)
    const items = order.items;

    // Marquer les articles appartenant au restaurateur comme acceptés
    const updatedItems = items.map(item => {
      if (item.restaurantId === userId) {
        return { ...item, state: true };
      }
      return item;
    });

    // Vérifier si tous les articles ont été acceptés
    const allItemsAccepted = updatedItems.every(item => item.state === true);

    if (allItemsAccepted) {
      // Si tous les articles sont acceptés, mettre à jour le statut de la commande
      await order.update({ isAccepted: true, items: updatedItems});
      res.json({ message: "All items have been accepted. Order is now accepted." });
    } else {
      // Sinon, sauvegarder la commande avec les articles mis à jour
      await order.update({ items: updatedItems });
      res.json({ message: "Items accepted by the current restaurant. Waiting for other restaurants to accept their items." });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});
// Route pour refuser une commande
router.put('/refuse/:orderId', authenticateTokenAndRole, async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id; // L'ID de l'utilisateur courant
  
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // S'assurer que la commande est payée avant de continuer
    if (!order.isPaid) {
      return res.status(400).json({ message: "Order cannot be refused until it's paid." });
    }

    if (order.isRefused) {
      return res.status(400).json({ message: "Order is already refused." });
    }

    // Analyser les items de la commande pour obtenir un tableau d'objets
    const items = order.items

    // Marquer les articles appartenant au restaurateur comme refusés
    let itemRefused = false;
    const updatedItems = items.map(item => {
      if (item.restaurantId === userId) {
        itemRefused = true; // Marquer qu'au moins un article a été refusé
        return { ...item, state: false }; // state: false peut représenter l'article refusé
      }
      return item;
    });

    // Si au moins un article est refusé, mettre à jour le statut de la commande
    if (itemRefused) {
      await order.update({ isAccepted: false, isRefused: true, items: updatedItems });
      res.json({ message: "Order has been refused by the restaurant." });
    } else {
      // Si aucun article n'a été refusé par ce restaurateur
      res.json({ message: "No items from this restaurant to refuse in the order." });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});


module.exports = router;

