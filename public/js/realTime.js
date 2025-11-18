
const socket = io(); // La función io() se hace globalmente disponible por la librería socket.io.js

const productList = document.getElementById('productList');
const addForm = document.getElementById('addProductForm');
const deleteForm = document.getElementById('deleteProductForm');

socket.on('productsUpdate', (products) => {
    productList.innerHTML = ''; 

    if (products.length > 0) {
        products.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `**ID:** ${product.id} | **Nombre:** ${product.name} | **Precio:** $${product.price}`;
            productList.appendChild(li);
        });
    } else {
        productList.innerHTML = '<li>No hay productos agregados.</li>';
    }
});

addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    
    if (name && price) {
        socket.emit('newProduct', { name, price });
        
        addForm.reset(); 
    }
});

deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const idToDelete = document.getElementById('productIdToDelete').value;
    
    if (idToDelete) {
        socket.emit('deleteProduct', idToDelete);
        deleteForm.reset(); 
    }
});