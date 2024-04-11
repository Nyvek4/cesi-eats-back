const express = require('express');
const { Sequelize } = require('sequelize');
const deliveryRoutes = require('./deliveryRoutes');
const cors = require('cors');

require('dotenv').config();

// Initialisation de l'application Express
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT_SERVICE_DELIVERY || 3007;


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
app.get('/delivery', (req, res) => {
  res.send('/!\\ SERVICE Delivery : IS UP /!\\');
});

app.use('/delivery', deliveryRoutes);

// Démarrage du service
app.listen(PORT, () => {
  console.log(`/!\\ SERVICE Delivery : IS RUNNING ON ${PORT}  /!\\`);
});