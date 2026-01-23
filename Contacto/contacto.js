// Función para actualizar el contador del carrito en el encabezado
const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
    const cartButton = document.querySelector('.cart-button');

    if (cartButton) {
        cartButton.textContent = `🛒 Carrito (${totalItems})`;
    }
    return totalItems;
};

// Función para agregar un mensaje al chat
const addMessage = (text, sender) => {
    const chatMessages = document.getElementById('chat-messages');
    const messageBubble = document.createElement('div');
    messageBubble.className = `chat-bubble chat-bubble-${sender}`;
    messageBubble.textContent = text;
    chatMessages.appendChild(messageBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

// Función para mostrar el indicador de escritura
const showTypingIndicator = () => {
    const chatMessages = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

// Función para ocultar el indicador de escritura
const hideTypingIndicator = () => {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
};

// Función para simular una respuesta del soporte
const simulateSupportResponse = () => {
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        const responses = [
            '¡Hola! ¿En qué puedo ayudarte hoy?',
            'Gracias por contactarnos. Un especialista te responderá pronto.',
            'Estamos aquí para ayudarte con cualquier consulta sobre nuestros productos.',
            '¿Tienes alguna pregunta sobre nuestras prendas o envíos?',
            'Nuestro equipo está listo para asistirte. ¿Qué necesitas?'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'support');
    }, 1500);
};

// ============================================
// FUNCIONALIDAD DEL MENÚ HAMBURGUESA
// ============================================
const initHamburgerMenu = () => {
    const hamburgerButton = document.getElementById('hamburger-menu');
    const nav = document.getElementById('main-nav');

    if (hamburgerButton && nav) {
        hamburgerButton.addEventListener('click', () => {
            // Toggle clases activas
            hamburgerButton.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerButton.classList.remove('active');
                nav.classList.remove('active');
            });
        });

        // Cerrar menú al hacer clic fuera de él
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

// Inicialización del DOM
document.addEventListener('DOMContentLoaded', () => {
    // Actualizar contador del carrito al cargar
    updateCartCount();
    
    // Inicializar menú hamburguesa
    initHamburgerMenu();
    
    // Referencias a elementos del chat
    const startChatBtn = document.getElementById('start-chat-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatWidget = document.getElementById('chat-widget');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Abrir chat si el botón existe
    if (startChatBtn) {
        startChatBtn.addEventListener('click', () => {
            chatWidget.style.display = 'flex';
            setTimeout(() => {
                chatWidget.classList.add('visible');
                if (chatMessages.children.length === 0) {
                    addMessage('¡Bienvenido a Zamlnig! ¿Cómo podemos ayudarte?', 'support');
                }
            }, 10);
        });
    }

    // Cerrar chat
    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', () => {
            chatWidget.classList.remove('visible');
            setTimeout(() => {
                chatWidget.style.display = 'none';
            }, 400);
        });
    }

    // Enviar mensaje en el chat
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

    // Animación de aparición de las tarjetas de contacto
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