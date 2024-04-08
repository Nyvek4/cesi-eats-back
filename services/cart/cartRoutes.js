const express = require('express');
const User = require('./models/User'); // Utilise le modèle Sequelize User
const authenticateTokenAndRole = require('./utils/authenticateTokenAndRole');
const jwt = require('jsonwebtoken');
const router = express.Router();


// Consultation du panier d'un utilisateur 

router.get('/',authenticateTokenAndRole, async (req, res) => {
  try {
    
    const userId = req.user.id; 
    const userType = req.user.userType;
    if (userType !== 'customer') {
      return res.status(403).json({ message: "Unauthorized : You need to be a customer" });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found : No cart there" });
    }
    res.json(user.cart);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// Ajout d'un article au panier d'un utilisateur
router.post('/add',authenticateTokenAndRole, async (req, res) => {
const { articleId } = req.body;
const userId = req.user.id;
try {
  //verifier que l'article est en base
  const article = await Article.findByPk(articleId);
  if (!article) {
    return res.status(404).send({ message: "Article not found" });
  }
  //verifier que l'utilisateur est en base
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  //ajouter l'article au panier de l'utilisateur
  user.cart.push(articleId);
  await user.save();
  res.send({ message: "Article added to cart successfully" });
} catch (error) {
  console.error(error);
  res.status(500).send({ message: error.message });
}});


module.exports = router;
