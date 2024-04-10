const express = require('express');
const User = require('./models/User');
const Order = require('./models/Order');
const jwt = require('jsonwebtoken');
const authenticateTokenAndRole = require('./utils/authenticateTokenAndRole');
const router = express.Router();


// routes/deliveryRoutes.js
router.get('/listOrder', authenticateTokenAndRole, async (req, res) => {
  try {

    if (req.user.userType !== 'delivery') {
      return res.status(403).json({ message: "Unauthorized : You need to be a delivery" });
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

router.put('/assignOrder/:orderId', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId);
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

module.exports = router;
