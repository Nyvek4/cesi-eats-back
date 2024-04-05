const express = require('express');
const { Sequelize } = require('sequelize');
const authRoutes = require('./authRoutes');
require('dotenv').config();

// Initialisation de l'application Express
const app = express();
app.use(express.json());
const PORT = process.env.PORT_SERVICE_AUTH || 3001;

// Connexion à PostgreSQL avec Sequelize
const sequelize = new Sequelize(process.env.POSTGRES_URI); // Assure-toi que POSTGRES_URI est défini dans ton .env

// Test de la connexion
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Routes
app.get('/auth', (req, res) => {
  res.send('/!\\ SERVICE Auth : IS UP /!\\');
});

// Vérification du token
app.post('/verify-token', (req, res) => {
    const token = req.body.token;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ valid: false });
      }
      res.send({ valid: true, decoded });
    });
  });

app.use('/auth', authRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`/!\\ SERVICE Auth : IS RUNNING ON ${PORT}  /!\\`);
});