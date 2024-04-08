const express = require('express');
const { Sequelize } = require('sequelize');
const articleRoutes = require('./articleRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT_SERVICE_ARTICLE || 3003;
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
app.get('/article', (req, res) => {
  res.send('/!\\ SERVICE Article : IS UP /!\\');
});

app.use('/article', articleRoutes);

// Démarrage du service
app.listen(PORT, () => {
  console.log(`/!\\ SERVICE Article : IS RUNNING ON ${PORT}  /!\\`);
});

