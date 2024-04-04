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
app.use('/auth', authRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`/!\\ SERVICE Auth : IS RUNNING ON ${PORT}  /!\\`);
});