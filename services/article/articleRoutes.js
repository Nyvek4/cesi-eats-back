const express = require('express');
const Article = require('./models/Article');
const User = require('./models/User');
const { Sequelize } = require('sequelize');
const authenticateTokenAndRole = require('./utils/authenticateTokenAndRole');
const router = express.Router();

// Récupérer tous les articles
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: { userId: req.params.restaurantId }
    });
    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

router.get('/search/:articleName', async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: {
        name: {
          [Sequelize.Op.iLike]: `%${req.params.articleName}%` // Utilise iLike pour une recherche insensible à la casse
        }
      },
      include: {
        model: User,
        attributes: ['id'] // Inclure seulement l'ID de l'utilisateur
      },
      attributes: ['userId'] // Inclure seulement l'ID de l'utilisateur dans l'objet article
    });

    // Extraire les IDs des utilisateurs depuis les articles
    const userIds = articles.map(article => article.User.id);

    res.json({ userIds });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// Créer un article
router.post('/', authenticateTokenAndRole, async (req, res) => {
  const { name, description, price, composition, type, restaurantId, categorieId } = req.body;
  const { id, role, userType } = req.user;
  console.log(role,userType)
  // Seuls les utilisateurs avec le type "restaurant" ou le role "admin" peuvent créer des articles
  if (userType === 'restaurant' || role === 'admin') {

    try {
      if (!name || !description || !price || !type || !categorieId) {
        return res.status(400).send({ message: "Please provide name, description, price, type and categorieId" });
      }
      if (role === 'admin' && !restaurantId) {
        return res.status(400).send({ message: "Please provide restaurantId" });
      }
      console.log(role,userType)
      const restaurantIdValue = role !== 'admin' ? id : restaurantId;

      // Vérifie si un article avec le même nom existe déjà pour ce restaurant
      const existingArticle = await Article.findOne({
        where: {
          name: name,
          userId: restaurantIdValue,
        },
      });

      if (existingArticle) {
        return res.status(409).send({ message: "An article with this name already exists for the restaurant." });
      }

      const article = await Article.create({ name, description, price, type, userId: restaurantIdValue, composition, categorieId});
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
      if (role === 'admin' || (userType === 'restaurant' && article.userId === id)) {
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
