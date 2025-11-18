// public/js/realTime.js
// 1. Establecer la conexión con el servidor de sockets
const socket = io(); // La función io() se hace globalmente disponible por la librería socket.io.js

// 2. Obtener referencias a los elementos del DOM
const productList = document.getElementById('productList');
const addForm = document.getElementById('addProductForm');
const deleteForm = document.getElementById('deleteProductForm');

// ===========================================
// A. ESCUCHAR EVENTOS DEL SERVIDOR (ACTUALIZACIÓN)
// ===========================================
// Escucha el evento 'productsUpdate' que envía el servidor (io.emit)
socket.on('productsUpdate', (products) => {
    // 1. Limpiar la lista actual
    productList.innerHTML = ''; 

    if (products.length > 0) {
        // 2. Recorrer la lista y renderizar cada producto
        products.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `**ID:** ${product.id} | **Nombre:** ${product.name} | **Precio:** $${product.price}`;
            productList.appendChild(li);
        });
    } else {
        // 3. Mostrar mensaje si la lista está vacía
        productList.innerHTML = '<li>No hay productos agregados.</li>';
    }
});

// ===========================================
// B. EMITIR EVENTOS AL SERVIDOR (CREACIÓN)
// ===========================================
// Manejar el envío del formulario para agregar producto
addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Obtener los valores del formulario
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    
    if (name && price) {
        // Enviar evento 'newProduct' al servidor a través del socket
        socket.emit('newProduct', { name, price });
        
        // Limpiar el formulario después de enviar
        addForm.reset(); 
    }
});

// ===========================================
// C. EMITIR EVENTOS AL SERVIDOR (ELIMINACIÓN)
// ===========================================
// Manejar el envío del formulario para eliminar producto
deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Obtener el ID del producto a eliminar
    const idToDelete = document.getElementById('productIdToDelete').value;
    
    if (idToDelete) {
        // Enviar evento 'deleteProduct' al servidor a través del socket
        // El servidor se encargará de eliminarlo y emitir la actualización a todos
        socket.emit('deleteProduct', idToDelete);
        deleteForm.reset(); 
    }
});