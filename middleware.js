const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Ton middleware ici, par exemple pour communiquer avec un microservice :
app.use('/api/microservice', (req, res) => {
  // Ici, tu vas intercepter les requêtes et les transmettre au microservice concerné.
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
