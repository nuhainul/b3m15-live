const cart = [];

const productContainer = document.getElementById('product-container');
const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total');
const cartSubtotalElement = document.getElementById('cart-subtotal');
const cartItemsElement = document.getElementById('cart-items');

// Fetch products from the API
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display products in the product container
function displayProducts(products) {
    productContainer.innerHTML = ''; // Clear previous products
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Price: $<span class="price">${product.price}</span></p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productContainer.appendChild(productCard);
    });
    attachAddToCartHandlers(products);
}

// Attach click handlers to "Add to Cart" buttons
function attachAddToCartHandlers(products) {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id); // Ensure to match ID types
            const product = products.find(item => item.id === productId);
            addToCart(product);
            updateCart();
        });
    });
}

// Add product to the cart
function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity
    } else {
        cart.push({ ...product, quantity: 1 }); // Add new product to cart
    }
}

// Update the cart display
function updateCart() {
    cartCountElement.textContent = cart.length; // Update item count
    calculateTotal();
    displayCartItems();
}

// Calculate the totals: subtotal and final total
function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartSubtotalElement.textContent = subtotal.toFixed(2);
    cartTotalElement.textContent = subtotal.toFixed(2); // Final total same as subtotal
}

// Display cart items to the UI
function displayCartItems() {
    cartItemsElement.innerHTML = ''; // Clear previous items
    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.textContent = `${item.title} - $${item.price} x ${item.quantity}`;
        cartItemsElement.appendChild(cartItem);
    });
}

// Initial fetch of products on page load
fetchProducts();
