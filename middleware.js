const express = require('express');

const app = express();
app.use(express.json());
const PORT = process.env.PORT_MIDDLEWARE || 3000;

app.get('/', (req, res) => {
  res.send('MIDDLEWARE IS UP');
});

app.listen(PORT, () => {
  console.log(`Middleware is running on port ${PORT}`); 
});
