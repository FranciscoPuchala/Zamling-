// Selecciona los elementos del DOM necesarios.
const productDetailSection = document.getElementById('product-details-container');
const cartButton = document.querySelector('.cart-button');
const productImageElement = document.getElementById('product-image'); // Elemento de imagen

// Función para mostrar una notificación temporal al usuario.
const showNotification = (message) => {
    // Intenta encontrar un contenedor de notificación existente o crea uno
    let notification = document.getElementById('cart-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'cart-notification';
        // Estilos actualizados con la paleta de colores de Zamlnig
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
    
    // Actualizar mensaje y mostrar
    notification.textContent = message;
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0) scale(1)';
    }, 10);

    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(30px) scale(0.95)';
    }, 3000);
};

// Función para actualizar el contador del carrito en el encabezado.
const updateCartCount = () => {
    // Obtiene el carrito de localStorage, si no existe, usa un array vacío.
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Calcula el total de artículos en el carrito sumando las cantidades de cada producto.
    const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
    // Actualiza el texto del botón del carrito con el nuevo total.
    cartButton.textContent = `🛒 Carrito (${totalItems})`;
};

// Función para rellenar los detalles del producto en la página.
const renderProductDetails = (selectedProduct) => {
    document.getElementById('product-name').textContent = selectedProduct.name;
    document.getElementById('product-price').textContent = `$${selectedProduct.price}`;
    document.getElementById('product-description').textContent = selectedProduct.description;

    // LÓGICA DE LA IMAGEN: Carga la imagen del producto seleccionado
    if (productImageElement && selectedProduct.image) {
        productImageElement.src = selectedProduct.image;
        productImageElement.alt = `Imagen de ${selectedProduct.name}`;
    }

    // Rellena las características
    const featuresList = document.getElementById('product-features');
    featuresList.innerHTML = ''; // Limpia las características existentes
    selectedProduct.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });

    // Añade el evento para el botón "Añadir al carrito"
    const addToCartButton = document.querySelector('.add-to-cart-button');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Lógica para añadir al carrito
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
            showNotification(`✅ "${selectedProduct.name}" añadido al carrito.`);
        });
    }
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

// Inicializa la página al cargar el DOM.
document.addEventListener('DOMContentLoaded', () => {
    // Selecciona el elemento de imagen para asegurarse de que exista antes de intentar usarlo.
    const productImageElement = document.getElementById('product-image');

    // Muestra una imagen de fallback si la imagen no se carga (útil para depurar)
    if (productImageElement) {
        productImageElement.onerror = function() {
            console.error("Error al cargar la imagen. Revisar la ruta en localStorage.");
            // Opcionalmente puedes poner un placeholder si falla la carga:
            // this.src = 'https://via.placeholder.com/400x400/FF0000/FFFFFF?text=Error+Carga+Imagen';
            this.style.display = 'none'; // Ocultar si falla completamente
        };
    }

    updateCartCount();
    initHamburgerMenu(); // Inicializa el menú hamburguesa

    // Obtiene el producto seleccionado de localStorage (guardado desde la página de inicio).
    const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));

    if (selectedProduct) {
        renderProductDetails(selectedProduct);
    } else {
        // Si no se encontró un producto, muestra un mensaje de error.
        productDetailSection.innerHTML = `<p>Producto no encontrado. Por favor, vuelve a la <a href="../Productos/Productos.html">página de productos</a>.</p>`;
    }
});