const express = require('express');
const { User } = require('./models'); // Assure-toi que le chemin est correct
const { authenticateToken, isAdmin, isUserOrAdmin } = require('../../utils/authToken'); // Middleware d'authentification et de vérification des rôles
const router = express.Router();

// Édition du profil d'un utilisateur
router.put('/users/:id', authenticateToken, isUserOrAdmin, async (req, res) => {
const { id } = req.params;
const { firstname, lastname, email, birthdate, address } = req.body;
try {
  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  await user.update({ firstname, lastname, email, birthdate, address });
  res.send({ message: "User updated successfully" });
} catch (error) {
  res.status(500).send({ message: error.message });
}

});

// Suppression d'un profil utilisateur
router.delete('/users/:id', authenticateToken, isUserOrAdmin, async (req, res) => {

});

// Récupération de la liste des profils
router.get('/users', authenticateToken, isAdmin, async (req, res) => {

});

module.exports = router;
