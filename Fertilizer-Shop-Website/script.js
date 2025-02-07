document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    // Product Data
    const products = [
        { id: 1, name: 'Organic Compost', price: 599, category: 'organic', image: 'compost.jpg' },
        { id: 2, name: 'NPK Fertilizer', price: 799, category: 'inorganic', image: 'npk.jpg' },
        { id: 3, name: 'Bone Meal', price: 499, category: 'organic', image: 'bone-meal.jpg' },
        { id: 4, name: 'Urea', price: 299, category: 'inorganic', image: 'urea.jpg' },
        { id: 5, name: 'Vermicompost', price: 699, category: 'organic', image: 'vermicompost.jpg' },
        { id: 6, name: 'DAP Fertilizer', price: 899, category: 'inorganic', image: 'dap.jpg' },
        { id: 7, name: 'Fish Meal', price: 399, category: 'organic', image: 'fish-meal.jpg' },
        { id: 8, name: 'Potassium Chloride', price: 499, category: 'inorganic', image: 'potassium-chloride.jpg' },
        // Add more products
    ];

    // Render Products
    function renderProducts(filter = 'all') {
        const container = document.getElementById('productsContainer');
        container.innerHTML = '';
        
        const filtered = filter === 'all' 
            ? products 
            : products.filter(p => p.category === filter);
        
        filtered.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="images/${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>Rs. ${product.price}</p>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Cart Functionality
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const existing = cart.find(item => item.id === productId);
        
        if(existing) {
            existing.quantity++;
        } else {
            cart.push({...product, quantity: 1});
        }
        
        updateCartStorage();
    }

    function updateCartStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }

    function renderCartItems() {
        const container = document.getElementById('cartItems');
        container.innerHTML = '';
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div>
                    <h4>${item.name}</h4>
                    <p>Rs. ${item.price} x ${item.quantity}</p>
                </div>
                <div>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            `;
            container.appendChild(cartItem);
        });
        
        updateCartTotal();
    }

    // Event Listeners
    document.addEventListener('click', (e) => {
        if(e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }
        
        if(e.target.classList.contains('remove-item')) {
            const productId = parseInt(e.target.dataset.id);
            cart = cart.filter(item => item.id !== productId);
            updateCartStorage();
        }

        //add eventlisteners for buttons that load the products.
        if(e.target.classList.contains('filter-btn')) {
            // Remove 'active' class from all filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            // Add 'active' class to the clicked button
            e.target.classList.add('active');
            
            // Use the correct dataset property, 'filter'
            const filter = e.target.dataset.filter;
            renderProducts(filter);
        }
        
    });

    // Form Handling
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const submissions = JSON.parse(localStorage.getItem('contacts')) || [];
        submissions.push(Object.fromEntries(formData));
        localStorage.setItem('contacts', JSON.stringify(submissions));
        e.target.reset();
        alert('Message sent successfully!');
    });

    // Navigation
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('section').forEach(section => {
                section.classList.add('hidden');
            });
            document.querySelector(link.getAttribute('href')).classList.remove('hidden');
        });
    });

    // Initial Render
    renderProducts();
    renderCartItems();

    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = count;
    }
    
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cartTotal').textContent = total;
    }
});

