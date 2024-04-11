const express = require('express');
const User = require('./models/User'); // Utilise le modèle Sequelize User
const jwt = require('jsonwebtoken');
const Order = require('./models/Order');
const { where,Op } = require('sequelize');
const authenticateTokenAndRole = require('./utils/authenticateTokenAndRole');
const router = express.Router();

// Route pour le status de toutes les commandes en cours (admin)
router.get('/orderStatus', authenticateTokenAndRole, async (req, res) => {
  try {

    const orders = await Order.findAll();
    res.json(orders);

  } catch (error) {

    console.error(error);
    res.status(500).send({ message: error.message });

  }
});
// Chiffre d'affaire total des transactions en cours (admin)
router.get('/totalSales',authenticateTokenAndRole, async (req, res) => {
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
      Gain: total * 0.0834
    };
    res.json({ stats });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});
// Chiffre d'affaire total des transactions en cours sur une période donnée (admin)
router.get('/totalSalesPeriod',authenticateTokenAndRole, async (req, res) => {
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
router.get('/restaurantStats',authenticateTokenAndRole, async (req, res) => {
  try {

    const restaurantId = req.user.id;
    const Total_Income = await Order.getRestaurantIncome(restaurantId);
    const Total_Orders = await Order.getRestaurantOrders(restaurantId);
    const Total_Customers = await Order.getRestaurantCustomers(restaurantId);
    const Total_Articles = await Order.getRestaurantArticlesTotal(restaurantId);
    const Total_Menus = await Order.getRestaurantMenusTotal(restaurantId);

     const stats = {
       Total_Income : Total_Income,
       NumberOf_Orders : Total_Orders,
       NumberOf_Customers : Total_Customers,
       NumberOf_Articles: Total_Articles,
       NumberOf_Menus: Total_Menus
     };

    res.json(stats);

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});





module.exports = router;
