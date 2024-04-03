const express = require('express');
const User = require('./models/User'); // Importe le modèle User
const jwt = require('jsonwebtoken');
const router = express.Router();


// Inscription
router.post('/register', async (req, res) => {
  try {
    const { firstname,lastname, email, password, passwordConfirm, birthdate, address } = req.body;
    console.log(req.body)
    // Vérifie si les mots de passe correspondent
    if (password !== passwordConfirm) {
      return res.status(410).send({Type: 'ERROR', Status: 'Passwords do not match.'});
    }
    // Vérifie si un utilisateur avec le même email existe déjà
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).send({Type: 'ERROR', Status: 'User with the same email already exists.'});
    }
    // Crée et enregistre le nouvel utilisateur
    const user = new User({ firstname,lastname, email, password, birthdate, address });
    await user.save();
    // Envoie une réponse de succès
    res.status(201).send({Type: 'SUCCESS', Status: 'User registered successfully.'});
  } catch (error) {
    // Envoie une réponse d'erreur générique
    res.status(500).send({Type: 'ERROR', Status: error.message});
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await user.comparePassword(password)) {
        let token;
        switch (user.role) {
            case 'admin':
                token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10h' });
                break;
            case 'user':
                token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                break;
            default:
                res.status(402).send({Type:'ERROR',Status:'Cannot read user role.'});
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
