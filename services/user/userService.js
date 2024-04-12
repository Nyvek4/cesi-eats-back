const express = require('express');
const { Sequelize } = require('sequelize');
const userRoutes = require('./userRoutes');
const cors = require('cors');
require('dotenv').config();

// Initialisation de l'application Express
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT_SERVICE_USER || 3002;

// Connexion à PostgreSQL avec Sequelize
const sequelize = new Sequelize(process.env.POSTGRES_URI); 

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
app.get('/user', (req, res) => {
  res.send('/!\\ SERVICE User : IS UP /!\\');
});

app.use('/user', userRoutes);

// Démarrage du service
app.listen(PORT, () => {
  console.log(`/!\\ SERVICE User : IS RUNNING ON ${PORT}  /!\\`);
});

