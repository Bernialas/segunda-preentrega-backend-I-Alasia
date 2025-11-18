const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io'); 
const path = require('path'); 


const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', viewsRouter); // Router de Vistas (Home y Real Time Products)
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const httpServer = app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));

const io = new Server(httpServer);

let realTimeProducts = [ 
    { id: 1, name: "Producto Live A", price: 100 },
    { id: 2, name: "Producto Live B", price: 200 }
]; 

io.on('connection', socket => {
    console.log('Nuevo cliente conectado.');

    socket.emit('productsUpdate', realTimeProducts);

    socket.on('newProduct', productData => {
        productData.id = realTimeProducts.length + 1;
        realTimeProducts.push(productData);
        io.emit('productsUpdate', realTimeProducts); 
    });

    socket.on('deleteProduct', productId => {
        realTimeProducts = realTimeProducts.filter(p => p.id !== parseInt(productId)); 
        io.emit('productsUpdate', realTimeProducts);
    });
});

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));