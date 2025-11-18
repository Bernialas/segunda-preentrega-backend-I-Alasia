const express = require('express');
const router = express.Router();

const mockProducts = [ 
    { id: 10, name: "Webcam", price: 50 },
    { id: 11, name: "Micrófono", price: 120 }
]; 

// Endpoint: / (home.handlebars)
router.get('/', (req, res) => {
    res.render('home', { products: mockProducts, title: "Lista de Productos" });
});

// Endpoint: /realtimeproducts (realTimeProducts.handlebars)
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { title: "Productos en Tiempo Real" });
});

module.exports = router;