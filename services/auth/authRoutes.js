const express = require('express');
const User = require('./models/User'); // Utilise le modèle Sequelize User
const jwt = require('jsonwebtoken');
const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, password, passwordConfirm, birthdate, address } = req.body;
    if (password !== passwordConfirm) {
      return res.status(410).send({Type: 'ERROR', Status: 'Passwords do not match.'});
    }
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(409).send({Type: 'ERROR', Status: 'User with the same email already exists.'});
    }
    const user = await User.create({ firstname, lastname, email, password, birthdate, address });
    res.status(201).send({Type: 'SUCCESS', Status: 'User registered successfully.'});
  } catch (error) {
    res.status(500).send({Type: 'ERROR', Status: error.message});
  }
});

// Connexion (cet exemple ne gère pas le hachage de mot de passe pour simplifier)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (user && password === user.password) { // Attention : comparer les mots de passe hachés dans une application réelle !
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } else {
      res.status(401).send('Authentication failed.');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
