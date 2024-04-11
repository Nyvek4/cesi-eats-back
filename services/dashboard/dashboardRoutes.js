const express = require('express');
const User = require('./models/User'); // Utilise le modèle Sequelize User
const jwt = require('jsonwebtoken');
const Order = require('./models/Order');
const { where,Op } = require('sequelize');
const router = express.Router();

// Route pour le status de toutes les commandes en cours (admin)
router.get('/orderStatus', async (req, res) => {
  try {

    const orders = await Order.findAll();
    res.json(orders);

  } catch (error) {

    console.error(error);
    res.status(500).send({ message: error.message });

  }
});
// Chiffre d'affaire total des transactions en cours (admin)
router.get('/totalSales', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { isPaid: true, isRefused: false, isAcquitted: false }
    });
    let total = 0;
    for (const order of orders) {
      const price = await Order.getPrice(order.id);
      total += price;
    }
    const stats = {
      Total_Income: total,
      Gain: total * 0.834
    };
    res.json({ stats });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});
// Chiffre d'affaire total des transactions en cours sur une période donnée (admin)
router.post('/totalSalesPeriod', async (req, res) => {
  try {

    const start = new Date(req.body.start);
    const end = new Date(req.body.end);

    const orders = await Order.findAll({
      where: { isPaid: true, isRefused: false, isAcquitted: false, createdAt: { [Op.between]: [start, end] } }
    });
    console.log(orders);

    let total = 0;
    for (const order of orders) {
      const price = await Order.getPrice(order.id);
      total += price;
    }
    const stats = {
      Total_Income: total,
      Gain: total * 0.834
    };
    res.json({ stats });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// Chiffres clefs pour un restaurant (chiffre d'affaire, nombre de commandes, nombre de clients, etc.)
router.get('/restaurantStats', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});





module.exports = router;
