// Task 1: Data Structure - Product Class
class Product {
    constructor(id, name, price, image, category = "General", description = "") {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.category = category;
        this.description = description;
    }
}

// Product Data Array (10+ products for testing)
const products = [
    new Product(1, "HyperSound X1 Headphones", 149.99, "menclothes (1).jpg", "Electronics", "Immersive audio with active noise cancellation and 40h battery life."),
    new Product(2, "AeroFlex Running Shoes", 89.99, "menclothes (1).jpg", "Fashion", "Breathable mesh, responsive cushioning, perfect for daily runners."),
    new Product(3, "Minimalist Smart Lamp", 39.99, "menclothes (1).jpg", "Home & Living", "Touch control, warm-to-cool dimming, energy-efficient LED."),
    new Product(4, "Ceramic Non-Stick Pan Set", 59.99, "menclothes (1).jpg", "Home & Living", "Eco-friendly coating, scratch-resistant, oven-safe up to 450°F."),
    new Product(5, "Wool Blend Overcoat", 129.99, "menclothes (1).jpg", "Fashion", "Classic tailored fit, premium wool blend, perfect for winter layering."),
    new Product(6, "UltraView 4K Drone", 349.00, "menclothes (1).jpg", "Electronics", "GPS stabilization, 4K camera, 30-min flight time, foldable design."),
    new Product(7, "ErgoMesh Office Chair", 199.99, "menclothes (1).jpg", "Home & Living", "Lumbar support, breathable mesh, adjustable armrests."),
    new Product(8, "Stainless Steel Cookware Set", 129.00, "menclothes (1).jpg", "Home & Living", "10-piece set, induction ready, even heat distribution."),
    new Product(9, "Smart Fitness Watch", 69.99, "menclothes (1).jpg", "Electronics", "Heart rate monitor, sleep tracking, waterproof, 7-day battery."),
    new Product(10, "Men's Classic T-Shirt", 25.00, "menclothes (1).jpg", "Fashion", "100% cotton, comfortable fit, available in multiple colors."),
    new Product(11, "Women's Yoga Pants", 45.99, "menclothes (1).jpg", "Fashion", "Stretchy, breathable fabric, perfect for workouts."),
    new Product(12, "Bluetooth Speaker", 79.99, "menclothes (1).jpg", "Electronics", "Portable, waterproof, 20-hour battery life.")
];

// Cart State Management

let cart = []; // Each item: { product, quantity }

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('urbanMartCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('urbanMartCart', JSON.stringify(cart));
}

// Add product to cart
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.product.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ product, quantity });
    }
    
    saveCartToStorage();
    
    // Task 6: Animation feedback
    const addButton = document.querySelector(`[data-id="${productId}"]`);
    if (addButton) {
        addButton.classList.add('btn-clicked');
        setTimeout(() => addButton.classList.remove('btn-clicked'), 300);
        
        // Add fade-in class to product card for animation
        const productCard = addButton.closest('.product-card, .card');
        if (productCard) {
            productCard.classList.add('fade-in');
            setTimeout(() => productCard.classList.remove('fade-in'), 500);
        }
    }
    
    // Update cart count display
    updateCartCount();
}

// Update cart count badge
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartBadge = document.querySelector('.cart-count');
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'inline-block' : 'none';
    }
}

// Task 2: Dynamic Product Rendering

function renderProducts(containerSelector, filterCategory = null) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Filter products if needed
    let productsToRender = products;
    if (filterCategory && filterCategory !== 'all') {
        productsToRender = products.filter(p => p.category === filterCategory);
    }
    
    // Use forEach to iterate through products
    productsToRender.forEach(product => {
        // Create product card using createElement
        const card = document.createElement('article');
        card.className = 'product-card';
        card.setAttribute('data-product-id', product.id);
        
        // Create image element
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.loading = 'lazy';
        
        // Create title element
        const title = document.createElement('h3');
        title.textContent = product.name;
        
        // Create description
        const desc = document.createElement('p');
        desc.className = 'description';
        desc.textContent = product.description;
        
        // Create price element
        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = `$${product.price.toFixed(2)}`;
        
        // Create Add to Cart button
        const addButton = document.createElement('button');
        addButton.textContent = 'Add to Cart';
        addButton.className = 'add-to-cart-btn';
        addButton.setAttribute('data-id', product.id);
        
        // Append all elements to card
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(price);
        card.appendChild(addButton);
        
        container.appendChild(card);
    });
}

// Task 3: Cart Rendering with Event Delegation

function renderCartPage() {
    const cartContainer = document.querySelector('.cart-container');
    const subtotalElement = document.querySelector('.subtotal-amount');
    const emptyMessage = document.querySelector('.empty-cart-message');
    
    if (!cartContainer) return;
    
    // Clear container
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        if (emptyMessage) emptyMessage.style.display = 'block';
        if (subtotalElement) subtotalElement.textContent = '$0.00';
        return;
    }
    
    if (emptyMessage) emptyMessage.style.display = 'none';
    
    // Use forEach to render cart items
    cart.forEach((item, index) => {
        const cartItem = document.createElement('li');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-cart-index', index);
        
        // Product image
        const img = document.createElement('img');
        img.src = item.product.image;
        img.alt = item.product.name;
        
        // Product name
        const name = document.createElement('h3');
        name.textContent = item.product.name;
        
        // Price
        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = `$${item.product.price.toFixed(2)}`;
        
        // Quantity input
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = item.quantity;
        quantityInput.min = '1';
        quantityInput.className = 'cart-quantity';
        quantityInput.setAttribute('data-product-id', item.product.id);
        
        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';
        removeBtn.setAttribute('data-product-id', item.product.id);
        
        // Subtotal per item
        const itemTotal = document.createElement('p');
        itemTotal.className = 'item-total';
        itemTotal.textContent = `$${(item.product.price * item.quantity).toFixed(2)}`;
        
        cartItem.appendChild(img);
        cartItem.appendChild(name);
        cartItem.appendChild(price);
        cartItem.appendChild(quantityInput);
        cartItem.appendChild(itemTotal);
        cartItem.appendChild(removeBtn);
        
        cartContainer.appendChild(cartItem);
    });
    
    // Calculate total using reduce
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    if (subtotalElement) subtotalElement.textContent = `$${total.toFixed(2)}`;
    
    // Update order summary in checkout if present
    updateOrderSummary();
}

// Update quantity
function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.product.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            // Remove item using filter
            cart = cart.filter(item => item.product.id !== productId);
        } else {
            item.quantity = newQuantity;
        }
        saveCartToStorage();
        renderCartPage();
        updateCartCount();
    }
}

// Remove item from cart
function removeCartItem(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    saveCartToStorage();
    renderCartPage();
    updateCartCount();
}

// Task 4: Form Validation & Submission

function setupCheckoutForm() {
    const form = document.querySelector('.checkout-form form, form');
    if (!form) return;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent page reload
        
        // Get form fields
        const nameInput = document.querySelector('#name, input[name="name"], label:contains("Name") input');
        const addressInput = document.querySelector('#address, input[name="address"]');
        const zipInput = document.querySelector('#zip, input[name="zip"]');
        
        // Find inputs more reliably
        const allInputs = form.querySelectorAll('input');
        let nameField, addressField, zipField;
        
        allInputs.forEach(input => {
            const label = input.closest('label');
            const labelText = label ? label.textContent.toLowerCase() : '';
            
            if (labelText.includes('name') || input.id === 'name' || input.name === 'name') {
                nameField = input;
            } else if (labelText.includes('address') || input.id === 'address') {
                addressField = input;
            } else if (labelText.includes('zip') || input.id === 'zip') {
                zipField = input;
            }
        });
        
        let isValid = true;
        
        // Validate Name
        if (!nameField || nameField.value.trim() === '') {
            showError(nameField, 'Name is required');
            isValid = false;
        } else {
            clearError(nameField);
        }
        
        // Validate Address
        if (!addressField || addressField.value.trim() === '') {
            showError(addressField, 'Address is required');
            isValid = false;
        } else {
            clearError(addressField);
        }
        
        // Validate ZIP
        if (!zipField || zipField.value.trim() === '') {
            showError(zipField, 'ZIP code is required');
            isValid = false;
        } else if (!/^\d{4,6}$/.test(zipField.value.trim())) {
            showError(zipField, 'Please enter a valid ZIP code (4-6 digits)');
            isValid = false;
        } else {
            clearError(zipField);
        }
        
        if (isValid) {
            console.log('Form validated successfully!');
            // Simulate successful order
            const order = {
                date: new Date().toLocaleDateString(),
                total: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
                items: [...cart],
                orderNumber: 'ORD-' + Math.floor(Math.random() * 10000)
            };
            
            // Save order to history
            saveOrderToHistory(order);
            
            // Clear cart
            cart = [];
            saveCartToStorage();
            updateCartCount();
            
            alert(`Order placed successfully! Order #: ${order.orderNumber}\nTotal: $${order.total.toFixed(2)}`);
            
            // Redirect to account page
            window.location.href = 'account.html';
        }
    });
}

// Helper functions for form validation
function showError(input, message) {
    if (!input) return;
    input.classList.add('error');
    
    let errorDiv = input.parentElement.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('small');
        errorDiv.className = 'error-message';
        input.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function clearError(input) {
    if (!input) return;
    input.classList.remove('error');
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Task 5: User Account & Order History

const currentUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    orderHistory: []
};

// Load order history from localStorage
function loadOrderHistory() {
    const savedOrders = localStorage.getItem('urbanMartOrders');
    if (savedOrders) {
        currentUser.orderHistory = JSON.parse(savedOrders);
    }
}

// Save order to history
function saveOrderToHistory(order) {
    currentUser.orderHistory.unshift(order);
    localStorage.setItem('urbanMartOrders', JSON.stringify(currentUser.orderHistory));
    renderOrderHistory();
}

// Render order history in account page
function renderOrderHistory() {
    const orderContainer = document.querySelector('.order-history-container, .order-list');
    if (!orderContainer) return;
    
    orderContainer.innerHTML = '';
    
    if (currentUser.orderHistory.length === 0) {
        orderContainer.innerHTML = '<p>No orders yet. Start shopping!</p>';
        return;
    }
    
    currentUser.orderHistory.forEach((order, index) => {
        const details = document.createElement('details');
        details.className = 'order-details';
        
        const summary = document.createElement('summary');
        summary.textContent = `Order #${order.orderNumber} - ${order.date} - Total: $${order.total.toFixed(2)}`;
        
        const orderInfo = document.createElement('div');
        orderInfo.className = 'order-info';
        
        const itemsList = document.createElement('ul');
        itemsList.className = 'order-items';
        
        order.items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.product.name} x ${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}`;
            itemsList.appendChild(li);
        });
        
        orderInfo.appendChild(itemsList);
        details.appendChild(summary);
        details.appendChild(orderInfo);
        orderContainer.appendChild(details);
    });
}

// Set user greeting
function setUserGreeting() {
    const greetingElement = document.querySelector('.user-greeting, header h1, .account-header');
    if (greetingElement) {
        greetingElement.textContent = `Welcome, ${currentUser.name}!`;
    }
}

// Task 6: Event Delegation & Global Event Listeners

function setupEventDelegation() {
    // Event delegation on body for Add to Cart buttons
    document.body.addEventListener('click', function(event) {
        // Check if clicked element is Add to Cart button
        const addButton = event.target.closest('.add-to-cart-btn');
        if (addButton) {
            event.preventDefault();
            const productId = parseInt(addButton.getAttribute('data-id'));
            if (productId) {
                addToCart(productId);
            }
        }
        
        // Handle quantity changes in cart
        const quantityInput = event.target.closest('.cart-quantity');
        if (quantityInput) {
            const productId = parseInt(quantityInput.getAttribute('data-product-id'));
            const newQuantity = parseInt(quantityInput.value);
            if (!isNaN(newQuantity) && productId) {
                updateCartQuantity(productId, newQuantity);
            }
        }
        
        // Handle remove button
        const removeBtn = event.target.closest('.remove-btn');
        if (removeBtn) {
            const productId = parseInt(removeBtn.getAttribute('data-product-id'));
            if (productId) {
                removeCartItem(productId);
            }
        }
    });
}

// Filter functionality (Task 6 enhancement)
function setupFilter() {
    const filterForm = document.querySelector('.filter-sidebar form');
    if (!filterForm) return;
    
    const checkboxes = filterForm.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    
    const applyFilter = () => {
        // Get selected categories
        const selectedCategories = [];
        filterForm.querySelectorAll('input:checked').forEach(input => {
            const label = input.closest('label');
            if (label) {
                const category = label.textContent.trim();
                selectedCategories.push(category);
            }
        });
        
        // Filter products based on categories
        let filteredProducts = products;
        if (selectedCategories.length > 0) {
            filteredProducts = products.filter(product => 
                selectedCategories.some(cat => 
                    product.category.toLowerCase().includes(cat.toLowerCase())
                )
            );
        }
        
        // Re-render products with filter
        const productContainer = document.querySelector('.product-grid, .card-container');
        if (productContainer) {
            productContainer.innerHTML = '';
            renderProductsInContainer(productContainer, filteredProducts);
        }
    };
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilter);
    });
}

function renderProductsInContainer(container, productsToRender) {
    productsToRender.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';
        
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        
        const title = document.createElement('h3');
        title.textContent = product.name;
        
        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = `$${product.price.toFixed(2)}`;
        
        const button = document.createElement('button');
        button.textContent = 'Add to Cart';
        button.className = 'add-to-cart-btn';
        button.setAttribute('data-id', product.id);
        
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(button);
        
        container.appendChild(card);
    });
}


// Page-specific initialization
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from storage
    loadCartFromStorage();
    loadOrderHistory();
    
    // Setup event delegation
    setupEventDelegation();
    
    // Determine which page we're on and initialize accordingly
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Products page
    if (currentPage.includes('products') || currentPage.includes('product')) {
        const productContainer = document.querySelector('.product-grid, .card-container');
        if (productContainer) {
            renderProducts('.product-grid, .card-container');
        }
        setupFilter();
    }
    
    // Cart page
    if (currentPage.includes('cart')) {
        renderCartPage();
    }
    
    // Checkout page
    if (currentPage.includes('checkout')) {
        setupCheckoutForm();
        updateOrderSummary();
    }
    
    // Account page
    if (currentPage.includes('account')) {
        setUserGreeting();
        renderOrderHistory();
    }
    
    // Landing page - update featured products
    if (currentPage.includes('index') || currentPage === '' || currentPage === 'landing.html') {
        const featuredContainer = document.querySelector('.featured-products .product-grid, .featured-section .product-grid');
        if (featuredContainer) {
            renderProducts('.featured-products .product-grid, .featured-section .product-grid');
        }
    }
    
    // Update cart count on all pages
    updateCartCount();
});

// Helper for order summary
function updateOrderSummary() {
    const summaryTotal = document.querySelector('.order-summary p, .summary-total');
    if (summaryTotal) {
        const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        summaryTotal.textContent = `Total: $${total.toFixed(2)}`;
    }
}

// Export for debugging (optional)
window.urbanMart = { products, cart, addToCart, renderProducts };