const express = require('express');
const User = require('./models/User'); // Utilise le modèle Sequelize User
const jwt = require('jsonwebtoken');
const authenticateTokenAndRole = require('../../utils/authenticateTokenAndRole');
const router = express.Router();

router.put('/:id', authenticateTokenAndRole, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Assumant que l'ID de l'utilisateur est inclus dans le JWT
    const userRole = req.user.role; // Assumant que le rôle de l'utilisateur est inclus dans le JWT
  
    if (userId !== id || userRole !== 'admin') {
      return res.status(403).send({ message: "Unauthorized" });
    }
  
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   hashedPassword = req.body.password;
    //   req.body.password = hashedPassword;
      await user.update(req.body);
      res.send({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
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
    console.log("USER LIST REQUESTED")
  
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


module.exports = router;