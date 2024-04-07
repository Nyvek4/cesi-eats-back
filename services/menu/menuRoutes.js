const express = require('express');
const User = require('./models/User');
const authenticateTokenAndRole = require('./utils/authenticateTokenAndRole');
const router = express.Router();

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
      where: { name: req.params.menuName },
      include: Restaurant
    });
    res.json(menus);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// Créer un menu
router.post('/', authenticateTokenAndRole, async (req, res) => {
    const { name, description, price, composition } = req.body;
    const { id, role } = req.user;
  
    // Seuls les utilisateurs avec le rôle "restaurant" ou "admin" peuvent créer des menus
    if (role === 'restaurant' || role === 'admin') {
      try {
        const menu = await Menu.create({ name, description, price, restaurantId : id, articles});
        res.status(201).json(menu);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
      }
    } else {
      return res.status(403).send({ message: "Unauthorized" });
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
