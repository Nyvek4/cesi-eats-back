const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ validity: false, message: "Token not provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ validity: false, message: "Token invalid or expired" });
    }

    // Le token est valide. On stocke les informations de l'utilisateur dans req.user pour les utiliser plus tard.
    req.user = decoded; 

    next();
  });
};