const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./authRoutes')

const app = express();
app.use(express.json());
require('dotenv').config();
const PORT = process.env.PORT_SERVICE_AUTH || 3001;

app.get('/auth', (req, res) => {
  res.send('/!\\ SERVICE Auth : IS UP /!\\');
});
app.listen(PORT, () => {
  console.log(`/!\\ SERVICE Auth : IS RUNNING ON ${PORT}  /!\\`);
});

mongoose.connect(process.env.MONGODB_URI);
app.use(express.json());
app.use('/auth', authRoutes);