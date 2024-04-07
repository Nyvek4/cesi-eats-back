const express = require('express');
const { Sequelize } = require('sequelize');
const dashboardRoutes = require('./dashboardRoutes');
const cors = require('cors');

require('dotenv').config();

// Initialisation de l'application Express
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT_SERVICE_DASHBOARD || 3008;

// Connexion à PostgreSQL avec Sequelize
const sequelize = new Sequelize(process.env.POSTGRES_URI); // Assure-toi que POSTGRES_URI est défini dans ton .env
// Test de la connexion
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully !!§.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Routes
app.get('/dashboard', (req, res) => {
  res.send('/!\\ SERVICE Dashboard : IS UP /!\\');
});

app.use('/dashboard', authRoutes);

// Démarrage du service
app.listen(PORT, () => {
  console.log(`/!\\ SERVICE Dashboard : IS RUNNING ON ${PORT}  /!\\`);
});