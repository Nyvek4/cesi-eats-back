const express = require('express');
const { Sequelize } = require('sequelize');
const orderRoutes = require('./orderRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT_SERVICE_ORDER || 3006;
const sequelize = new Sequelize(process.env.POSTGRES_URI); 

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Routes
app.get('/order', (req, res) => {
  res.send('/!\\ SERVICE Order : IS UP /!\\');
});

app.use('/order', orderRoutes);

// Démarrage du service
app.listen(PORT, () => {
  console.log(`/!\\ SERVICE Order : IS RUNNING ON ${PORT}  /!\\`);
});

