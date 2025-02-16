const cart = [];
let appliedPromoCode = null;

const promoCodes = {
    'ostad10': 0.10, // 10% discount
    'ostad5': 0.05   // 5% discount
};

const productContainer = document.getElementById('product-container');
const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total');
const cartSubtotalElement = document.getElementById('cart-subtotal');
const cartDiscountElement = document.getElementById('cart-discount');
const cartItemsElement = document.getElementById('cart-items');
const applyPromoButton = document.getElementById('apply-promo');
const promoCodeInput = document.getElementById('promo-code');
const promoMessage = document.getElementById('promo-message');

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

// Calculate the totals: subtotal, discount, and final total
function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = appliedPromoCode ? subtotal * promoCodes[appliedPromoCode] : 0;
    const total = subtotal - discount;

    cartSubtotalElement.textContent = subtotal.toFixed(2);
    cartDiscountElement.textContent = discount.toFixed(2);
    cartTotalElement.textContent = total.toFixed(2);
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

// Promo code application logic
applyPromoButton.addEventListener('click', () => {
    const promoCode = promoCodeInput.value.trim();
    if (promoCodes[promoCode]) {
        if (!appliedPromoCode) { // Apply promo code only if not already applied
            appliedPromoCode = promoCode; 
            promoMessage.textContent = `Promo code applied: ${promoCode}`;
            promoMessage.style.color = 'green';
        } else {
            promoMessage.textContent = `Promo code already applied: ${appliedPromoCode}`;
            promoMessage.style.color = 'red';
        }
    } else {
        promoMessage.textContent = 'Invalid promo code';
        promoMessage.style.color = 'red';
    }
    calculateTotal(); // Recalculate totals after applying promo code
});

// Initial fetch of products on page load
fetchProducts();
