// src/app.js (MODIFICADO)
const express = require('express');
// --- Nuevas Importaciones ---
const handlebars = require('express-handlebars');
const { Server } = require('socket.io'); 
const path = require('path'); 
// ---------------------------

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
// --- Nueva Importación de Router de Vistas ---
const viewsRouter = require('./routes/views.router');
// ---------------------------------------------

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 1. CONFIGURACIÓN DE HANDLEBARS
// ------------------------------------------------------------------
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
// La carpeta 'views' está un nivel arriba de 'src'
app.set('views', path.join(__dirname, '..', 'views'));


// 2. CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS
// ------------------------------------------------------------------
// La carpeta 'public' está un nivel arriba de 'src'
app.use(express.static(path.join(__dirname, '..', 'public')));


// 3. ROUTERS API y VISTAS
// ------------------------------------------------------------------
app.use('/', viewsRouter); // Router de Vistas (Home y Real Time Products)
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


// 4. INICIALIZACIÓN DE SERVIDOR HTTP y SOCKET.IO
// ------------------------------------------------------------------
const httpServer = app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));

const io = new Server(httpServer);

// 5. LÓGICA DE WEBSOCKETS
// *Deberías obtener la lista de productos de tu ProductManager aquí o en un servicio*
let realTimeProducts = [ 
    { id: 1, name: "Producto Live A", price: 100 },
    { id: 2, name: "Producto Live B", price: 200 }
]; 

io.on('connection', socket => {
    console.log('Nuevo cliente conectado.');
    
    // Envío inicial
    socket.emit('productsUpdate', realTimeProducts);

    // Manejo de Creación
    socket.on('newProduct', productData => {
        // Lógica: Guardar en data/products.json usando ProductManager
        productData.id = realTimeProducts.length + 1;
        realTimeProducts.push(productData);
        io.emit('productsUpdate', realTimeProducts); 
    });

    // Manejo de Eliminación
    socket.on('deleteProduct', productId => {
        // Lógica: Eliminar de data/products.json usando ProductManager
        realTimeProducts = realTimeProducts.filter(p => p.id !== parseInt(productId)); 
        io.emit('productsUpdate', realTimeProducts);
    });
});

// Ruta 404
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));