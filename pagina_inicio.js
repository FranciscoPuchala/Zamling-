// File: pagina_inicio.js
// This script handles the logic for adding products to the cart from the home page,
// ensuring all necessary data is saved, including the image, for the cart.
// It also handles hamburger menu functionality for mobile.

// Mapping of product IDs to their image URLs.
// These paths are CRITICAL for images to display correctly in the cart.
const productImageMap = {
    '1': '../img/pantalon1.jpeg',
    '2': '../img/vestido_animal.jpeg',
    '3': '../img/chaleco_lino.jpeg',
    '4': '../img/bolso.jpeg',
    '5': '../img/cartera_blanca.jpeg'
};

// Full product data for home page products (IDs 1-5)
const homeProductData = {
    '1': {
        description: "High-waist stretch jeans designed for comfort and style. Perfect for any occasion with a modern, flattering fit.",
        features: ["High waist", "Stretch fabric", "Contemporary design", "Perfect fit"]
    },
    '2': {
        description: "Animal print dress that combines elegance with a bold, wild style.",
        features: ["Animal print pattern", "Elegant design", "Premium quality fabric", "Flattering cut"]
    },
    '3': {
        description: "Lightweight and versatile linen vest, ideal for creating sophisticated looks.",
        features: ["100% natural linen", "Breathable", "Versatile", "Premium finish"]
    },
    '4': {
        description: "Trunk-style handbag with an exclusive design that blends functionality and style.",
        features: ["Trunk-style design", "Multiple compartments", "Durable material", "Luxury finish"]
    },
    '5': {
        description: "Elegant handbag with a minimalist design, perfect for any occasion.",
        features: ["Minimalist design", "Compact and functional", "High-quality material", "Guaranteed versatility"]
    }
};

// Function to show a temporary notification to the user.
const showNotification = (message) => {
    // Try to find an existing notification container or create one
    let notification = document.getElementById('cart-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'cart-notification';
        // Add basic styles with yellow/orange color and bottom-right position
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

    // Update message and show with smooth animation
    notification.textContent = message;

    // Small delay to ensure the transition is applied
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0) scale(1)';
    }, 10);

    // Hide the notification after 3 seconds with smooth animation
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(30px) scale(0.95)';
    }, 3000);
};

// Function to update the cart counter in the header.
const updateCartCount = () => {
    // Try to get the cart. If it doesn't exist, use an empty array.
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
    const cartButton = document.querySelector('.cart-button');

    if (cartButton) {
        cartButton.textContent = `🛒 Cart (${totalItems})`;
    }
    return totalItems;
};

// Function to add a product to the cart in localStorage
// 'imageURL' is added as a new parameter.
const addToCart = (productId, name, price, imageURL) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        // Product is already in the cart, increment the quantity
        cart[productIndex].quantity += 1;
    } else {
        // New product, add it
        const newProduct = {
            id: productId,
            name: name,
            price: price,
            image: imageURL, // CRITICAL: Save the image URL
            quantity: 1,
        };
        cart.push(newProduct);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); // Update the visible counter
    showNotification(`✅ "${name}" added to cart.`);
    console.log(`Product added: ${name} (ID: ${productId}, Image: ${imageURL})`);
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

// Initialize listeners for "Add to cart" buttons and product cards
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(); // Initialize the counter when the page loads
    initHamburgerMenu(); // Initialize the hamburger menu

    // 1. Handle clicks on "Add to cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Stop link navigation
            event.stopPropagation(); // Prevent the click from propagating to the card

            const productCard = event.target.closest('.product-card');

            if (productCard) {
                // Capture the CRITICAL data for the server
                const productId = productCard.getAttribute('data-id');
                const productName = productCard.querySelector('h3').textContent.trim();

                // Clean and convert the price to a decimal number (CRITICAL)
                const priceElement = productCard.querySelector('.price').textContent.trim();
                const productPrice = parseFloat(priceElement.replace('$', '').replace('.', ''));

                // CRITICAL: Get the image URL from the map
                const productImage = productImageMap[productId];


                if (productId && productName && !isNaN(productPrice) && productImage) {
                    // Call addToCart including the image URL
                    addToCart(productId, productName, productPrice, productImage);
                } else {
                    console.error('Error capturing product data for the cart:', { productId, productName, productPrice, productImage });
                }
            }
        });
    });

    // 2. Handle clicks on product cards (to maintain redirection to the detail page)
    document.querySelectorAll('.product-card').forEach(card => {
        // Exclude the "Add to cart" button so it doesn't trigger the redirect
        const addToCartButton = card.querySelector('.add-to-cart');
        if (addToCartButton) {
            // Ensure the card click only redirects if it's not the add-to-cart button
            card.addEventListener('click', (event) => {
                if (event.target !== addToCartButton && !event.target.closest('.add-to-cart')) {
                    const productId = card.getAttribute('data-id');
                    const productName = card.querySelector('h3').textContent.trim();
                    const priceElement = card.querySelector('.price').textContent.trim();
                    const productPrice = parseFloat(priceElement.replace('$', ''));
                    const productImage = productImageMap[productId];
                    const data = homeProductData[productId] || {
                        description: "Contemporary fashion piece by Velour & Co.",
                        features: ["Premium quality", "Exclusive design", "Contemporary style"]
                    };

                    // Prepare and save the selected product information
                    if (productId && productName && !isNaN(productPrice) && productImage) {
                        const selectedProduct = {
                            id: productId,
                            name: productName,
                            price: productPrice,
                            image: productImage,
                            description: data.description,
                            features: data.features
                        };

                        localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
                        // Redirect to the product page.
                        window.location.href = `./Producto/pagina_producto.html`;
                    } else {
                        console.error('Error capturing data for redirect to product page.');
                    }
                }
            });
        }
    });
});
