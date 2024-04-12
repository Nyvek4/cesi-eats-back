const express = require('express');
const User = require('./models/User');
const Order = require('./models/Order');
const Delivery = require('./models/Delivery');
const defineAssociations = require('./models/associations');
const authenticateTokenAndRole = require('./utils/authenticateTokenAndRole');
const router = express.Router();

defineAssociations();
// liste des commandes à livrer
router.get('/listOrder', authenticateTokenAndRole, async (req, res) => {
  try {

    if (req.user.userType !== 'delivery') {
      return res.status(403).json({ message: "Unauthorized : You need to be a driver" });
    }

    const orders = await Order.findAll({
      where: {
        isPaid: true,
        isAccepted: true,
        isAssigned: false,
        isPickedUp: false,
        isRefused: false,
        isAcquitted: false
      }
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});
// assignation d'une commande à un livreur et creation d'une instance de delivery
router.put('/assign', authenticateTokenAndRole, async (req, res) => { 
  try {
    const driverId = req.user.id;
    if (req.user.userType !== 'delivery') {
      return res.status(403).json({ message: "Unauthorized : You need to be a driver" });
    }
    if (!req.body.orderId) {
      return res.status(400).json({ message: "Missing orderId" });
    }
    if (await Delivery.findOne({ where: { orderId: req.body.orderId } })) {
      return res.status(400).json({ message: "Already picked up / assigned" });
    }
    const order = await Order.findByPk(req.body.orderId);
    console.log("BEBUGGGGG", order)
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    order.isAssigned = true;
    await order.save();


    res.send({ message: "Order assigned successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});
// assignation d'une commande à un livreur et creation d'une instance de delivery
router.put('/pickedUp', authenticateTokenAndRole, async (req, res) => { 
  try {
    const driverId = req.user.id;
    if (req.user.userType !== 'delivery') {
      return res.status(403).json({ message: "Unauthorized : You need to be a driver" });
    }
    if (!req.body.orderId) {
      return res.status(400).json({ message: "Missing orderId" });
    }
    if (await Delivery.findOne({ where: { orderId: req.body.orderId } })) {
      return res.status(400).json({ message: "Already picked up / assigned" });
    }
    const insert_delivery = await Delivery.create({ orderId: req.body.orderId, driverId: driverId});
    const order = await Order.findByPk(req.body.orderId);
    if (order.isCooked === false || order.isAccepted === false || order.isPaid === false || order.isAssigned === true) {
      return res.status(404).send({ message: "Order isn't pickable" });
    }
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    order.isAssigned = true;
    await order.save();


    res.send({ message: "Order assigned successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});
// détails d'une order
router.get('/order/:orderId', authenticateTokenAndRole, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    const orderId = req.params.orderId;
    console.log(order.address)
    const choosedAddress = await Order.getDelieryAddress(orderId,order.address);
    const restaurantAddress = await Order.getRestaurantAddress(orderId);
    const resp = {
      to_customerId: order.to_userId,
      customer_address: choosedAddress,
      restaurant_address: restaurantAddress,
      numberOf_items: order.items.length,
    }

    res.json(resp);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});
// Cancel delivery
router.put('/cancel', authenticateTokenAndRole, async (req, res) => {
  try {
    if (req.user.userType !== 'delivery') {
      return res.status(403).json({ message: "Unauthorized : You need to be a driver" });
    }
    if (!req.body.orderId) {
      return res.status(400).json({ message: "Missing orderId" });
    }
    const order = await Order.findByPk(req.body.orderId);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    if(!order.isAssigned){
      return res.status(400).json({ message: "Order not assigned" });
    }
    if (!await Delivery.cancel(req.body.orderId)) {
      return res.status(404).send({ message: "Delivery not found" });
    }
    order.isRefused = true;
    order.isAssigned = false;
    await order.save();


    res.send({ message: "Order canceled successfully" });
    
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
})
// Récuperer les livraisons en cours à un livreur
router.get('/current', authenticateTokenAndRole, async (req, res) => {
  try {
    if (req.user.userType !== 'delivery') {
      return res.status(403).json({ message: "Unauthorized : You need to be a driver" });
    }
    console.log(req.user.id)
    // Étape 1 : Récupérer les livraisons assignées au livreur
    const deliveries = await Delivery.findAll({
      where: {
        driverId: req.user.id,
        isCanceled: false
      },
      include: [{
        model: Order,
        where: { isAcquitted: false }, // Inclure uniquement les commandes non acquittées
      }]
    });

    res.json(deliveries);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});
// Récuperer l'historique de livraisons d'un livreur
router.get('/history', authenticateTokenAndRole, async (req, res) => {
  try {
    if (req.user.userType !== 'delivery') {
      return res.status(403).json({ message: "Unauthorized : You need to be a driver" });
    }
    console.log(req.user.id)
    // Étape 1 : Récupérer les livraisons assignées au livreur
    const deliveries = await Delivery.findAll({
      where: {
        driverId: req.user.id,
        isCanceled: false
      },
      include: [{
        model: Order,
        where: { isAcquitted: true }, // Inclure uniquement les commandes non acquittées
      }]
    });

    res.json(deliveries);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
