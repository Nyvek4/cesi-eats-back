const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Cart = require('../models/Cart');
const verify = require('./verifyCartCreation');


module.exports = async function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ validity: false, message: "Token not provided" });
  }

  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    const user = await User.findOne({ where: { id: decoded.userId } });
    if (!user || user.deleted) {
      return res.status(404).json({ validity: false, message: "Token user is deleted or suspended" });
    }
    if (decoded.role !== user.role) {
      return res.status(403).json({ validity: false, message: "Token user role changed" });
    }
    req.user = {
      id: user.id,
      role: user.role,
      userType: user.userType
    };

    // VERIFIER QUE L'UTILISATEUR A BIEN UN PANIER
    const hasCart = await verify(req.user.id);
    if (!hasCart) {
      try {
          let cart = await Cart.create({
          userId: req.user.id,
          items: {} 
          });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while retrieving or creating the cart" });
      }   
    }

    next();
  } catch (err) {
    // Gestion des erreurs (token invalide, expiré, ou erreur DB)
    console.error('Token error:', err);
    return res.status(403).json({ validity: false, message: "Token invalid/expired or verify cart crashed" });
  }
};