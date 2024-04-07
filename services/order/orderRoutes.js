const express = require('express');
const User = require('./models/User');
const authenticateTokenAndRole = require('./utils/authenticateTokenAndRole');
const router = express.Router();

// Récupérer toutes les commandes
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: { restaurantId: req.params.restaurantId }
    });
    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});
// Rechercher un article par nom
router.get('/search/:articleName', async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: { name: req.params.articleName },
      include: Restaurant
    });
    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// Créer un article
router.post('/', authenticateTokenAndRole, async (req, res) => {
    const { name, description, price, composition } = req.body;
    const { id, role } = req.user;
  
    // Seuls les utilisateurs avec le rôle "restaurant" ou "admin" peuvent créer des articles
    if (role === 'restaurant' || role === 'admin') {
      try {
        const article = await Article.create({ name, description, price, restaurantId : id, composition});
        res.status(201).json(article);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
      }
    } else {
      return res.status(403).send({ message: "Unauthorized" });
    }
  });
  
// Mettre à jour un article
router.put('/:articleId', authenticateTokenAndRole, async (req, res) => {
    const { articleId } = req.params;
    const { id, role, userType } = req.user;
    const updateData = req.body;
  
    try {
      const article = await Article.findByPk(articleId);
      if (!article) {
        return res.status(404).send({ message: "Article not found" });
      }
      // Vérifier si l'utilisateur est autorisé à modifier l'article
      if (role === 'admin' || (userType === 'Restaurant' && article.userId === id)) {
        await article.update(updateData);
        res.send({ message: "Article updated successfully" });
      } else {
        return res.status(403).send({ message: "Unauthorized" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  });

// Supprimer un article
router.delete('/:articleId', authenticateTokenAndRole, async (req, res) => {
  const { articleId } = req.params;
  const { id, role, userType } = req.user;

  try {
    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).send({ message: "Article not found" });
    }
    // Vérifier si l'utilisateur est autorisé à supprimer l'article
    if (role === 'admin' || (userType === 'Restaurant' && article.userId === id)) {
      await article.destroy();
      res.send({ message: "Article deleted successfully" });
    } else {
      return res.status(403).send({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});


module.exports = router;
