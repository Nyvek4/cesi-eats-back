const express = require('express');
const User = require('./models/User');
const Articles = require('./models/Article');
const Categorie = require('./models/Category');
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
      where: { restaurantId: req.params.restaurantId }
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
  const { id, role } = req.user;

  if (!checkItems(articlesId)) {
    return res.status(400).json({ message: "Invalid items in menu" });
  }

  if (role !== 'admin' && role !== 'restaurant') {
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

      // Associer les articles au menu via MenuArticles
      if (articlesId && articlesId.length) {
          const menuArticles = articlesId.map(articleId => ({
              menuId: menu.id,
              articleId
          }));
          await Sequelize.models.MenuArticles.bulkCreate(menuArticles);
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
    const updateData = req.body;
  
    try {
      const menu = await Menu.findByPk(menuId);
      if (!menu) {
        return res.status(404).send({ message: "Menu not found" });
      }
      // Vérifier si l'utilisateur est autorisé à modifier le menu
      if (role === 'admin' || (userType === 'Restaurant' && menu.userId === id)) {
        await menu.update(updateData);
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
    if (role === 'admin' || (userType === 'Restaurant' && menu.userId === id)) {
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


module.exports = router;
