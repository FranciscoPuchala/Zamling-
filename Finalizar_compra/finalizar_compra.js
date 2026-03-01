// Select the DOM elements we will use
const totalElement = document.getElementById('total-price');
const mpOption = document.getElementById('mp-option');
const transferOption = document.getElementById('transfer-option');
const cartButton = document.querySelector('.cart-button');
const confirmPurchaseButton = document.getElementById('pay-mp-button');

// ** IMPORTANT: MERCADO PAGO PUBLIC KEY **
// We keep the key in case you use other components, but it is not strictly necessary for the redirect.
const MP_PUBLIC_KEY = "APP_USR-6dd13bed-0f80-4ddf-b7b6-2382f59895ac";

// Utility function to display messages (Using console.log/error instead of alert)
const showMessage = (message, isError = false) => {
    if (isError) {
        console.error("USER ALERT ERROR:", message);
    } else {
        console.log("USER ALERT INFO:", message);
    }
    // Implement a modal or DOM message if you don't want to use alert()
};


// 2. Other utility functions
const updateCheckoutTotal = () => {
    const checkoutTotal = localStorage.getItem('checkoutTotal');
    const subtotalSummary = document.getElementById('subtotal-price');

    if (checkoutTotal) {
        if (totalElement) totalElement.textContent = `$${checkoutTotal}`;
        if (subtotalSummary) subtotalSummary.textContent = `$${checkoutTotal}`;
    } else {
        if (totalElement) totalElement.textContent = '$0.00';
        if (subtotalSummary) subtotalSummary.textContent = '$0.00';
    }
};

const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
    if (cartButton) {
        cartButton.textContent = `🛒 Cart (${totalItems})`;
    }
};

const handlePaymentSelection = () => {
    if (mpOption) {
        mpOption.addEventListener('click', () => {
            document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));
            mpOption.classList.add('selected');
        });
    }

    if (transferOption) {
        transferOption.addEventListener('click', () => {
            document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));
            transferOption.classList.add('selected');
        });
    }
};


// 5. Function to handle purchase confirmation (UPDATED FOR REDIRECT)
const handlePaymentConfirmation = () => {
    if (!confirmPurchaseButton) {
        console.error("Error: Payment button is missing.");
        return;
    }

    confirmPurchaseButton.addEventListener('click', async () => {
        // Disable the button and show status
        confirmPurchaseButton.textContent = 'Generating Payment...';
        confirmPurchaseButton.disabled = true;

        try {

            // KEY STEP 1: GET CART DATA
            const fullCart = JSON.parse(localStorage.getItem('cart')) || [];
            if (fullCart.length === 0) {
                showMessage('Your cart is empty. Add products before paying.', true);
                throw new Error("Empty cart.");
            }

            // Safe mapping of ID and quantity
            const itemsForServer = fullCart.map(item => ({
                id: String(item.id),
                quantity: Number(item.quantity),
            }));

            const requestBody = { cart: itemsForServer };

            // Call the server to create the payment preference
            const response = await fetch('https://layoutprueba.com/create_preference.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create preference on the server.');
            }

            const { init_point } = data; // 🟢 Get the redirect URL

            if (init_point) {
                 // 🟢 KEY STEP 2: Redirect
                 showMessage('Redirecting to Mercado Pago...', false);
                 // Redirect the user to the Mercado Pago payment page
                 window.location.href = init_point;

            } else {
                throw new Error("The server did not return the payment link (init_point).");
            }


        } catch (error) {
            console.error('Error during purchase confirmation:', error.message);
            // Show error to the user
            showMessage('There was an error processing the payment: ' + error.message, true);
            // Restore the button
            confirmPurchaseButton.textContent = 'Error. Retry Purchase';
            confirmPurchaseButton.disabled = false;
        }
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

// Execution on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCheckoutTotal();
    updateCartCount();
    handlePaymentSelection();
    handlePaymentConfirmation();
    initHamburgerMenu(); // Initialize hamburger menu
});
