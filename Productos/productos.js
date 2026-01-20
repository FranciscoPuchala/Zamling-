// Selecciona el botón del carrito
const cartButton = document.querySelector('.cart-button');

// Función para mostrar una notificación temporal al usuario.
const showNotification = (message) => {
    // Crea el elemento de notificación
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification-message';
    document.body.appendChild(notification);

    // Oculta la notificación después de 2 segundos.
    setTimeout(() => {
        notification.classList.add('fade-out');
        notification.addEventListener('transitionend', () => {
            notification.remove();
        });
    }, 2000);
};

// Función para actualizar el contador del carrito en el encabezado.
const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
    cartButton.textContent = `🛒 Carrito (${totalItems})`;
};

// Función para animar las tarjetas de productos
const animateCards = (category) => {
    const cards = category.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.remove('card-animate');
        void card.offsetWidth;
        card.classList.add('card-animate');
    });
};

// Función para mostrar categoría con animación
const showCategory = (selectedCategory, allCategories) => {
    allCategories.forEach(category => {
        const categoryType = category.getAttribute('data-category');
        
        if (selectedCategory === 'all' || categoryType === selectedCategory) {
            category.classList.remove('hiding');
            category.classList.add('showing');
            category.style.display = 'block';
            
            setTimeout(() => {
                animateCards(category);
            }, 100);
        } else {
            category.classList.add('hiding');
            category.classList.remove('showing');
            
            setTimeout(() => {
                category.style.display = 'none';
            }, 300);
        }
    });
};

// Lógica para el filtro de categorías
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCategories = document.querySelectorAll('.product-category');
    
    // Animación inicial al cargar la página
    setTimeout(() => {
        productCategories.forEach(category => {
            animateCards(category);
        });
    }, 200);
    
    // Función para manejar el filtro al hacer clic en un botón
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            // Remueve la clase 'active' de todos los botones de filtro
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Agrega la clase 'active' al botón seleccionado
            button.classList.add('active');

            // Muestra la categoría con animación
            showCategory(category, productCategories);
            
            // Scroll suave hacia el contenido
            window.scrollTo({
                top: document.querySelector('.products-page-main').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });

    // Lógica para redirigir a la página de producto
    const viewProductBtns = document.querySelectorAll('.view-product-btn, .add-to-cart');
    viewProductBtns.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productCard = button.closest('.product-card');

            if (!productCard) {
                console.error("No se encontró la tarjeta de producto.");
                showNotification("Error: No se puede ver el producto. Inténtalo de nuevo.");
                return;
            }

            // Recopila los datos del producto
            const productId = productCard.getAttribute('data-id');
            const productName = productCard.querySelector('h3').textContent;
            const productPriceText = productCard.querySelector('.price').textContent;
            const productPrice = parseFloat(productPriceText.replace('$', '').replace('.', '').replace(',', '.'));
            
            let productImage = '';
            const imgElement = productCard.querySelector('img');

            if (imgElement) {
                productImage = imgElement.src;
            } else {
                if (productId === '1') {
                    productImage = '../img/iphone-16-pro-max-1_6EFF873F24804524AAB5AAD8389E9913.jpg';
                } else if (productId === '8') {
                    productImage = '../img/descarga.avif';
                } else if (productId === '2') {
                    productImage = '../img/D_NQ_NP_758447-MLA46975173385_082021-O.webp';
                } else if (productId === '6') {
                    productImage = '../img/D_NQ_NP_977736-MLA83571171203_042025-O.webp';
                } else if (productId === '3') {
                    productImage = '../img/D_Q_NP_2X_882490-MLU77852262960_072024-P.webp';
                } else if (productId === '7') {
                    productImage = '../img/apple-airpods-pro-segunda-generacion.jpg';
                } else if (productId === '5') {
                    productImage = '../img/D_NQ_NP_692212-MLU70775490991_072023-O.webp';
                }
                
                if (!productImage) {
                    productImage = 'https://placehold.co/300x300/CCCCCC/333333?text=Sin+Imagen';
                }
            }

            let productDescription;
            let productFeatures;
            
            if (productId === "1") { 
                productDescription = "El iPhone más potente y sofisticado hasta la fecha. Con una pantalla más grande, cámaras de nivel profesional y un rendimiento inigualable.";
                productFeatures = ["Cámara principal de 50 MP", "Pantalla OLED de 6.7\" con ProMotion", "Batería de larga duración", "Cuerpo de titanio"];
            } else if (productId === "8") {
                productDescription = "El iPhone SE combina el chip A15 Bionic, 5G, gran autonomía y un diseño robusto en un solo dispositivo.";
                productFeatures = ["Chip A15 Bionic", "Conectividad 5G ultrarrápida", "Gran autonomía de batería", "Botón de inicio con Touch ID"];
            } else if (productId === "2") {
                productDescription = "El iPad Pro es el lienzo y el cuaderno más versátiles del mundo.";
                productFeatures = ["Chip M4 ultrarrápido", "Pantalla Liquid Retina XDR", "Sistema de cámara avanzado"];
            } else if (productId === "6") {
                productDescription = "El MacBook Air 15'' es increíblemente fino, potente y perfecto para cualquier tarea.";
                productFeatures = ["Chip M3", "Pantalla Liquid Retina de 15.3 pulgadas", "Batería de hasta 18 horas"];
            } else if (productId === "3") {
                productDescription = "El Apple Watch Series 10 te ayuda a mantenerte activo, sano y conectado.";
                productFeatures = ["Pantalla más grande", "Nuevas funciones de salud", "Detección de accidentes"];
            } else if (productId === "7") {
                productDescription = "Los AirPods Pro ofrecen cancelación de ruido, sonido envolvente y un ajuste cómodo.";
                productFeatures = ["Cancelación activa de ruido", "Modo de sonido ambiente adaptable", "Audio espacial personalizado"];
            } else if (productId === "5") {
                productDescription = "El Cargador MagSafe simplifica la carga inalámbrica.";
                productFeatures = ["Carga rápida inalámbrica", "Imanes perfectamente alineados", "Diseño compacto"];
            } else {
                productDescription = "Descripción no disponible.";
                productFeatures = [];
            }
            
            const selectedProduct = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                description: productDescription,
                features: productFeatures
            };

            localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
            window.location.href = `../Producto/pagina_producto.html`;
        });
    });
});

// Llama a la función de actualización del carrito.
updateCartCount();