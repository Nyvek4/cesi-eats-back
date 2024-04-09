const express = require('express');
const User = require('./models/User');
const Article = require('./models/Article');
const Category = require('./models/Category');
const Menu = require('./models/Menu');
const { Sequelize } = require('sequelize');
const checkItems = require('./utils/checkItems');
const authenticateTokenAndRole = require('./utils/authenticateTokenAndRole');
const router = express.Router();
const defineAssociations = require('./models/associations');
defineAssociations();

// Récupérer tous les menus d'un restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const menus = await Menu.findAll({
      where: { userId: req.params.restaurantId }
    });
    res.json(menus);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});
// Rechercher un menu par nom
router.get('/search/:menuName', async (req, res) => {
  try {
    const menus = await Menu.findAll({
      where: {
        name: {
          [Sequelize.Op.iLike]: `%${req.params.menuName}%` // Utilise iLike pour une recherche insensible à la casse
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
    const uniqueMenus = [];

    menus.forEach(menu => {
      if (!addedUserIds.has(menu.User.id)) {
        uniqueMenus.push(menu); // Ajouter le menu au tableau des résultats uniques
        addedUserIds.add(menu.User.id); // Marquer le userId comme ajouté
      }
    });

    // Extraire les IDs des utilisateurs depuis les menus uniques
    const userIds = uniqueMenus.map(menu => menu.User.id);

    res.json({ userIds });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});
// Créer un nouveau menu
router.post('/', authenticateTokenAndRole, async (req, res) => {
  const { name, description, price, articlesId, categorieId,restaurantId } = req.body;
  const { id, role, userType } = req.user;

  if (!checkItems(articlesId)) {
    return res.status(400).json({ message: "Invalid items in menu" });
  }

  const category = await Category.findByPk(categorieId);
  if (!category) {
      return res.status(404).send({ message: "Category not found" });
  }

  if (role !== 'admin' && userType !== 'restaurant') {
      return res.status(403).send({ message: "Unauthorized" });
  }
  const restaurantIdValue = role !== 'admin' ? id : restaurantId;

  try {
      // Créer le menu
      const menu = await Menu.create({
          name,
          description,
          price,
          userId: restaurantIdValue, 
          categorieId
      });

       // Associer les articles au menu
       if (articlesId && articlesId.length > 0) {
        await menu.addArticles(articlesId); // Utilisez la méthode addArticles pour associer les articles
    }

      res.status(201).json(menu);
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
  }
});
// Mettre à jour un menu
router.put('/:menuId', authenticateTokenAndRole, async (req, res) => {
  const { menuId } = req.params;
  const { id, role, userType } = req.user;
  const { name, description, price, articlesId, categorieId } = req.body;

  try {
    const menu = await Menu.findByPk(menuId);
    if (!menu) {
      return res.status(404).send({ message: "Menu not found" });
    }
    // Vérifier si l'utilisateur est autorisé à modifier le menu
    if (role === 'admin' || (userType === 'restaurant' && menu.userId === id)) {
      // Mise à jour des informations de base du menu
      await menu.update({ name, description, price, categorieId });

      // Mise à jour des articles associés au menu, si nécessaire
      if (articlesId) {
        await menu.setArticles(articlesId); // Remplace les articles actuels par les nouveaux
      }

      res.send({ message: "Menu updated successfully" });
    } else {
      return res.status(403).send({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});
// Supprimer un menu
router.delete('/:menuId', authenticateTokenAndRole, async (req, res) => {
  const { menuId } = req.params;
  const { id, role, userType } = req.user;

  try {
    const menu = await Menu.findByPk(menuId);
    if (!menu) {
      return res.status(404).send({ message: "Menu not found" });
    }
    // Vérifier si l'utilisateur est autorisé à supprimer le menu
    if (role === 'admin' || (userType === 'restaurant' && menu.userId === id)) {
      // Suppression des associations avec les articles avant de supprimer le menu
      await menu.setArticles([]); // Retire tous les articles associés
      await menu.destroy();
      res.send({ message: "Menu deleted successfully" });
    } else {
      return res.status(403).send({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});
// Recuperer les détails d'un menu
router.get('/:menuId', async (req, res) => {
  try {
    console.log(req.params.menuId)
    const menu = await Menu.findByPk(req.params.menuId, {
      include: {
        model: Article,
        as: 'Articles'
      }
    });
    if (!menu) {
      return res.status(404).send({ message: "Menu not found" });
    }
    res.json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
