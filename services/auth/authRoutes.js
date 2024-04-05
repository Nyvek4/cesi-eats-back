const express = require('express');
const User = require('./models/User'); // Utilise le modèle Sequelize User
const jwt = require('jsonwebtoken');
const router = express.Router();

// Inscription
const bcrypt = require('bcryptjs');
const saltRounds = 10; 

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
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ firstname, lastname, email, password: hashedPassword, birthdate, address });
    res.status(201).send({Type: 'SUCCESS', Status: 'User registered successfully.'});
  } catch (error) {
    res.status(500).send({Type: 'ERROR', Status: error.message});
  }
});

// Connexion 
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    let token 
    if (user && await bcrypt.compare(password, user.password)) {
        switch (user.role) {
          case 'admin':
            token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '10h' });
            break;
          case 'user':
            token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '3h' });
            break;
          default:
            break;
        }
        res.status(200).json({ token });
    } else {
      res.status(401).send('Authentication failed.');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});




module.exports = router;
