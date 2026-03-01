// Select the DOM elements we will use
const cartContainer = document.getElementById('cart-container');
const subtotalElement = document.getElementById('subtotal-price');
const totalElement = document.getElementById('total-price');
const cartButton = document.querySelector('.cart-button');

// Function to show a temporary notification to the user.
const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification-message';

    // Notification styles
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
        color: #fff;
        padding: 18px 30px;
        border-radius: 15px;
        z-index: 1000;
        opacity: 0;
        transform: translateY(100px) scale(0.9);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 30px rgba(255, 152, 0, 0.4);
        font-weight: 600;
        font-size: 1em;
        backdrop-filter: blur(10px);
    `;

    document.body.appendChild(notification);

    // Animate the notification entrance
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0) scale(1)';
    }, 10);

    // Hide the notification after 2 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(50px) scale(0.95)';
        notification.addEventListener('transitionend', () => {
            notification.remove();
        });
    }, 2000);
};

// Function to update the cart counter in the header.
const updateCartCount = () => {
    // Get the cart from localStorage; if it doesn't exist, use an empty array.
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Calculate the total items by summing the quantities of each product.
    const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
    // Update the cart button text with the new total.
    cartButton.textContent = `🛒 Cart (${totalItems})`;
};

// Function to render cart products and update the summary
const renderCartItems = () => {
    cartContainer.innerHTML = '';
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
    } else {
        cart.forEach(product => {
            // Calculate the cart subtotal
            subtotal += product.price * product.quantity;

            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.setAttribute('data-id', product.id);

            // Create the HTML for each cart item
            cartItemDiv.innerHTML = `
                <div class="item-info">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="item-details">
                        <span class="item-name">${product.name}</span>
                        <span class="item-price">$${product.price ? product.price.toFixed(2) : '0.00'}</span>
                    </div>
                </div>
                <div class="item-actions">
                    <input type="number" class="item-quantity" value="${product.quantity}" min="1">
                    <button class="remove-item">Remove</button>
                </div>
            `;
            cartContainer.appendChild(cartItemDiv);
        });
    }

    // Total equals Subtotal (no taxes)
    const total = subtotal;

    // Save the unified Subtotal/Total to localStorage
    localStorage.setItem('checkoutTotal', total.toFixed(2));

    // Update the cart summary elements in the DOM
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;

    // Assign events to the remove buttons after rendering the elements
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.cart-item');
            const productId = productCard.getAttribute('data-id');

            // Filter the cart to remove the selected product
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(item => item.id !== productId);

            // Save the modified cart
            localStorage.setItem('cart', JSON.stringify(cart));

            // Show notification
            showNotification('✓ Product removed from cart');

            // Re-render the cart list and update the cart counter in the UI
            renderCartItems();
            updateCartCount();
        });
    });

    // Assign change event to quantity input fields
    const quantityInputs = document.querySelectorAll('.item-quantity');
    quantityInputs.forEach(input => {
        input.addEventListener('change', (event) => {
            const productCard = event.target.closest('.cart-item');
            const productId = productCard.getAttribute('data-id');
            const newQuantity = parseInt(event.target.value, 10);

            if (newQuantity > 0) {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const productIndex = cart.findIndex(item => item.id === productId);

                if (productIndex > -1) {
                    // Update the quantity and save the cart
                    cart[productIndex].quantity = newQuantity;
                    localStorage.setItem('cart', JSON.stringify(cart));

                    // Show notification
                    showNotification('✓ Quantity updated');

                    // Re-render the cart list and update the counter
                    renderCartItems();
                    updateCartCount();
                }
            } else {
                // If quantity is 0, remove the product
                const removeButton = productCard.querySelector('.remove-item');
                removeButton.click();
            }
        });
    });
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

// Runs on page load
document.addEventListener('DOMContentLoaded', () => {
    // Render products on page load
    renderCartItems();
    // Update cart counter
    updateCartCount();
    // Initialize hamburger menu
    initHamburgerMenu();
});

document.querySelector('.checkout-button').addEventListener('click', function() {
    window.location.href = '../Finalizar_compra/Finalizar_compra.html';
});
