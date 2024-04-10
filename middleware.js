const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
const PORT = process.env.PORT_MIDDLEWARE || 3000;

app.get('/', (req, res) => {
  res.send('MIDDLEWARE IS UP');
});

// Function to test a single microservice
async function testMicroservice(url) {
  try {
    const response = await axios.get(url);
    return { url, status: 'up', statusCode: response.status };
  } catch (error) {
    return { url, status: 'down', statusCode: error.response ? error.response.status : 'N/A' };
  }
}

// Route to test all microservices
app.get('/build-validation', async (req, res) => {
  const services = [
    'http://article-service:3003/article',
    'http://auth-service:3001/auth',
    'http://user-service:3002/user',
    'http://cart-service:3005/cart',
    'http://delivery-service:3007/delivery',
    'http://menu-service:3004/menu',
    'http://order-service:3006/order'
  ];

  // Map through services and test each one
  const results = await Promise.all(services.map(service => testMicroservice(service)));

  // Send the response
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Middleware is running on port ${PORT}`); 
});
