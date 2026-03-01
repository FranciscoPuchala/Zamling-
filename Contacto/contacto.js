// Function to update the cart counter in the header
const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
    const cartButton = document.querySelector('.cart-button');

    if (cartButton) {
        cartButton.textContent = `🛒 Cart (${totalItems})`;
    }
    return totalItems;
};

// Function to add a message to the chat
const addMessage = (text, sender) => {
    const chatMessages = document.getElementById('chat-messages');
    const messageBubble = document.createElement('div');
    messageBubble.className = `chat-bubble chat-bubble-${sender}`;
    messageBubble.textContent = text;
    chatMessages.appendChild(messageBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

// Function to show the typing indicator
const showTypingIndicator = () => {
    const chatMessages = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

// Function to hide the typing indicator
const hideTypingIndicator = () => {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
};

// Function to simulate a support response
const simulateSupportResponse = () => {
    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();
        const responses = [
            'Hello! How can I help you today?',
            'Thank you for reaching out. A specialist will respond to you shortly.',
            'We are here to help you with any questions about our products.',
            'Do you have any questions about our garments or shipping?',
            'Our team is ready to assist you. What do you need?'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'support');
    }, 1500);
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

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Update cart counter on load
    updateCartCount();

    // Initialize hamburger menu
    initHamburgerMenu();

    // References to chat elements
    const startChatBtn = document.getElementById('start-chat-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatWidget = document.getElementById('chat-widget');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Open chat if the button exists
    if (startChatBtn) {
        startChatBtn.addEventListener('click', () => {
            chatWidget.style.display = 'flex';
            setTimeout(() => {
                chatWidget.classList.add('visible');
                if (chatMessages.children.length === 0) {
                    addMessage('Welcome to Velour & Co.! How can we help you?', 'support');
                }
            }, 10);
        });
    }

    // Close chat
    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', () => {
            chatWidget.classList.remove('visible');
            setTimeout(() => {
                chatWidget.style.display = 'none';
            }, 400);
        });
    }

    // Send message in chat
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageText = chatInput.value.trim();
            if (messageText) {
                addMessage(messageText, 'user');
                chatInput.value = '';
                simulateSupportResponse();
            }
        });
    }

    // Contact card entrance animation
    const contactCards = document.querySelectorAll('.contact-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    contactCards.forEach(card => {
        observer.observe(card);
    });
});
