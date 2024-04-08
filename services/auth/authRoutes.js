const express = require('express');
const User = require('./models/User'); // Utilise le modèle Sequelize User
const jwt = require('jsonwebtoken');
const router = express.Router();

// Inscription
const bcrypt = require('bcryptjs');
const saltRounds = 10; 

router.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, password, passwordConfirm, birthdate, address, userType } = req.body;
    if (password !== passwordConfirm) {
      return res.status(410).send({Type: 'ERROR', Status: 'Passwords do not match.'});
    }
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(409).send({Type: 'ERROR', Status: 'User with the same email already exists.'});
    }
    const user = await User.create({ firstname, lastname, email, password, birthdate, address, userType });
    res.status(201).send({Type: 'SUCCESS', Status: 'User registered successfully.'});
  } catch (error) {
    res.status(500).send({Type: 'ERROR', Status: error.message});
  }
});


// Connexion
router.post('/login', async (req, res) => {
  console.log("Tentative de login", req.body); // Pour vérifier que cette route est bien atteinte
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).send('Authentication failed. User not found !!!!.');
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET, 
        { expiresIn: user.role === 'admin' ? '10h' : '3h' }
      );
      res.status(200).json({ token });
    } else {
      res.status(401).send('Authentication failed. Wrong password.');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send(error.message);
  }
});


module.exports = router;
