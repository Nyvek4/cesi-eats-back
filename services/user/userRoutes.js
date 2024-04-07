const express = require('express');
const User = require('./models/User'); // Utilise le modèle Sequelize User
const jwt = require('jsonwebtoken');
const authenticateTokenAndRole = require('./utils/authenticateTokenAndRole');
const router = express.Router();

router.put('/:id', authenticateTokenAndRole, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Assumant que l'ID de l'utilisateur est inclus dans le JWT
    const userRole = req.user.role; // Assumant que le rôle de l'utilisateur est inclus dans le JWT
    console.log(userId, userRole, id, req.body)
  
    if (userId === id || userRole === 'admin') {
      
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      await user.update(req.body);
      res.send({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }

  } else {
    return res.status(403).send({ message: "Unauthorized" });
  }
    
});
  
router.delete('/:id', authenticateTokenAndRole, async (req, res) => {
const { id } = req.params;
const userId = req.user.id;
const userRole = req.user.role;


if (userId !== id && userRole !== 'admin') {
    return res.status(403).send({ message: "Unauthorized" });
}

try {
    const user = await User.findByPk(id);
    if (!user) {
    return res.status(404).send({ message: "User not found" });
    }
    await user.destroy();
    res.send({ message: "User deleted successfully" });
} catch (error) {
    res.status(500).send({ message: error.message });
}
});

router.get('/list', authenticateTokenAndRole, async (req, res) => {
    const userRole = req.user.role;
  
    if (userRole !== 'admin') {
      return res.status(403).send({ message: "Unauthorized" });
    }
  
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
});

router.get('/:id', authenticateTokenAndRole, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; 
  const userRole = req.user.role; 

  // Autoriser l'accès si l'utilisateur demande ses propres informations ou si l'utilisateur est un admin
  if (userId === id || userRole === 'admin') {
    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] } 
      });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.json(user); 
    } catch (error) {
      console.error(error); 
      res.status(500).send({ message: error.message });
    }
  } else {
    // Si l'utilisateur faisant la requête n'est pas l'utilisateur ciblé et n'est pas un admin
    return res.status(403).send({ message: "Unauthorized" });
  }
});

module.exports = router;