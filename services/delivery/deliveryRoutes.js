const express = require('express');
const User = require('./models/User'); // Utilise le modèle Sequelize User
const jwt = require('jsonwebtoken');
const router = express.Router();


// routes/deliveryRoutes.js
router.get('/listOrder', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        isPaid: true,
        isAccepted: true,
        // Assurez-vous que tous les autres booléens sont à false
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


module.exports = router;
