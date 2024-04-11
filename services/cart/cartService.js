const express = require('express');
const { Sequelize } = require('sequelize');
const cartRoutes = require('./cartRoutes');
const cors = require('cors');

require('dotenv').config();

// Initialisation de l'application Express
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT_SERVICE_CART || 3005;

// Connexion à PostgreSQL avec Sequelize
const sequelize = new Sequelize(process.env.POSTGRES_URI); 
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
app.get('/cart', (req, res) => {
  res.send('/!\\ SERVICE Cart : IS UP /!\\');
});

app.use('/cart', cartRoutes);

// Démarrage du service
app.listen(PORT, () => {
  console.log(`/!\\ SERVICE Cart : IS RUNNING ON ${PORT}  /!\\`);
});