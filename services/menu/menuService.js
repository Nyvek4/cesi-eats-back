const express = require('express');
const { Sequelize } = require('sequelize');
const menuRoutes = require('./menuRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT_SERVICE_MENU || 3004;
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
app.get('/menu', (req, res) => {
  res.send('/!\\ SERVICE Menu : IS UP /!\\');
});

app.use('/menu', menuRoutes);

// Démarrage du service
app.listen(PORT, () => {
  console.log(`/!\\ SERVICE Menu : IS RUNNING ON ${PORT}  /!\\`);
});

