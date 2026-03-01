// Select the necessary DOM elements.
const productDetailSection = document.getElementById('product-details-container');
const cartButton = document.querySelector('.cart-button');
const productImageElement = document.getElementById('product-image'); // Image element

// Function to show a temporary notification to the user.
const showNotification = (message) => {
    // Try to find an existing notification container or create one
    let notification = document.getElementById('cart-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'cart-notification';
        // Styles updated with the Velour & Co. color palette
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            z-index: 1000;
            opacity: 0;
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateY(100px) scale(0.9);
            box-shadow: 0 8px 25px rgba(255, 152, 0, 0.4);
            font-weight: 500;
            font-size: 0.95em;
            backdrop-filter: blur(10px);
        `;
        document.body.appendChild(notification);
    }

    // Update message and show
    notification.textContent = message;

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0) scale(1)';
    }, 10);

    // Hide the notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(30px) scale(0.95)';
    }, 3000);
};

// Function to update the cart counter in the header.
const updateCartCount = () => {
    // Get the cart from localStorage. If it doesn't exist, use an empty array.
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Calculate the total items in the cart by summing the quantities of each product.
    const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
    // Update the cart button text with the new total.
    cartButton.textContent = `🛒 Cart (${totalItems})`;
};

// Function to populate the product details on the page.
const renderProductDetails = (selectedProduct) => {
    document.getElementById('product-name').textContent = selectedProduct.name;
    document.getElementById('product-price').textContent = `$${selectedProduct.price}`;
    document.getElementById('product-description').textContent = selectedProduct.description;

    // IMAGE LOGIC: Load the selected product's image
    if (productImageElement && selectedProduct.image) {
        productImageElement.src = selectedProduct.image;
        productImageElement.alt = `Image of ${selectedProduct.name}`;
    }

    // Populate the features
    const featuresList = document.getElementById('product-features');
    featuresList.innerHTML = ''; // Clear existing features
    selectedProduct.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });

    // Add the event for the "Add to cart" button
    const addToCartButton = document.querySelector('.add-to-cart-button');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Logic to add to cart
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            const existingProductIndex = cart.findIndex(item => item.id === selectedProduct.id);

            if (existingProductIndex !== -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push({
                    id: selectedProduct.id,
                    name: selectedProduct.name,
                    price: selectedProduct.price,
                    image: selectedProduct.image,
                    quantity: 1
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            showNotification(`✅ "${selectedProduct.name}" has been added to the cart.`);
        });
    }
};

// ============================================
// HAMBURGER MENU FUNCTIONALITY
// ============================================
const initHamburgerMenu = () => {
    const hamburgerButton = document.getElementById('hamburger-menu');
    const nav = document.getElementById('main-nav');

    if (hamburgerButton && nav) {
        hamburgerButton.addEventListener('click', () => {
            // Toggle active classes
            hamburgerButton.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerButton.classList.remove('active');
                nav.classList.remove('active');
            });
        });

        // Close menu when clicking outside of it
        document.addEventListener('click', (event) => {
            const isClickInsideNav = nav.contains(event.target);
            const isClickOnHamburger = hamburgerButton.contains(event.target);

            if (!isClickInsideNav && !isClickOnHamburger && nav.classList.contains('active')) {
                hamburgerButton.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }
};

// Initialize the page when the DOM loads.
document.addEventListener('DOMContentLoaded', () => {
    // Select the image element to ensure it exists before trying to use it.
    const productImageElement = document.getElementById('product-image');

    // Show a fallback if the image fails to load (useful for debugging)
    if (productImageElement) {
        productImageElement.onerror = function() {
            console.error("Error loading image. Check the path in localStorage.");
            // Optionally set a placeholder if load fails completely:
            // this.src = 'https://via.placeholder.com/400x400/FF0000/FFFFFF?text=Image+Load+Error';
            this.style.display = 'none'; // Hide if it completely fails
        };
    }

    updateCartCount();
    initHamburgerMenu(); // Initialize hamburger menu

    // Get the selected product from localStorage (saved from the home/products page).
    const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));

    if (selectedProduct) {
        renderProductDetails(selectedProduct);
    } else {
        // If no product was found, show an error message.
        productDetailSection.innerHTML = `<p>Product not found. Please go back to the <a href="../Productos/Productos.html">products page</a>.</p>`;
    }
});
