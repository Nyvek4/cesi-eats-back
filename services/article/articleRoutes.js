const express = require('express');
const Article = require('./models/Article');
const User = require('./models/User');
const Categorie = require('./models/Category');
const { Sequelize } = require('sequelize');
const authenticateTokenAndRole = require('./utils/authenticateTokenAndRole');
const router = express.Router();
const defineAssociations = require('./models/associations');
defineAssociations();

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
// Récupérer les restaurants par un nom d'article
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
        as: 'User',
        attributes: ['id'] // Inclure seulement l'ID de l'utilisateur
      },
      order: [['createdAt', 'DESC']], 
    });

    // Créer un objet pour suivre les userId déjà ajoutés
    const addedUserIds = new Set();
    const uniqueArticles = [];

    articles.forEach(article => {
      if (!addedUserIds.has(article.User.id)) {
        uniqueArticles.push(article); // Ajouter l'article au tableau des résultats uniques
        addedUserIds.add(article.User.id); // Marquer le userId comme ajouté
      }
    });

    // Extraire les IDs des utilisateurs depuis les articles uniques
    const userIds = uniqueArticles.map(article => article.User.id);

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
// Récupérer la liste des catégories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Categorie.findAll();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send({ message: 'Error fetching categories' });
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
    console.log(role,userType)
    // Vérifier si l'utilisateur est autorisé à supprimer l'article
    if (role === 'admin' || (userType === 'restaurant' && article.userId === id)) {
      await article.destroy();
      res.send({ message: "Article "+article.name+" deleted successfully" });
    } else {
      return res.status(403).send({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});
// Recuperer les détails d'un article
router.get('/:articleId', async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.articleId);
    if (!article) {
      return res.status(404).send({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});


module.exports = router;
