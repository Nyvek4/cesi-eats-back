const jwt = require('jsonwebtoken');
const User = require('../models/User');


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
      role: user.role
    };
    next();
  } catch (err) {
    // Gestion des erreurs (token invalide, expiré, ou erreur DB)
    console.error('Token error:', err);
    return res.status(403).json({ validity: false, message: "Token invalid or expired" });
  }
};