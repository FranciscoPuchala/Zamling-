// Mapeo de IDs de producto a sus URLs de imagen
const productImageMap = {
    '1': '../img/pantalon1.jpeg',
    '2': '../img/vestido_animal.jpeg',
    '3': '../img/chaleco_lino.jpeg',
    '4': '../img/bolso.jpeg',
    '5': '../img/cartera_blanca.jpeg',
    '6': '../img/estirado.jpeg',
    '7': '../img/pantalones.jpeg',
    '8': '../img/pantalon_jean.jpeg',
};

// Función para mostrar una notificación temporal al usuario
const showNotification = (message) => {
    let notification = document.getElementById('cart-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'cart-notification';
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
    
    notification.textContent = message;
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0) scale(1)';
    }, 10);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(30px) scale(0.95)';
    }, 3000);
};

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

// Función para añadir un producto al carrito en localStorage
const addToCart = (productId, name, price, imageURL) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        cart[productIndex].quantity += 1;
    } else {
        const newProduct = {
            id: productId,
            name: name,
            price: price, 
            image: imageURL,
            quantity: 1,
        };
        cart.push(newProduct);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`✅ "${name}" añadido al carrito.`); 
    console.log(`Producto añadido: ${name} (ID: ${productId}, Imagen: ${imageURL})`);
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

// Inicialización del DOM
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
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
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            showCategory(category, productCategories);
            
            window.scrollTo({
                top: document.querySelector('.products-page-main').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });

    // Manejar clics en los botones "Añadir al carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            const productCard = event.target.closest('.product-card');

            if (productCard) {
                const productId = productCard.getAttribute('data-id');
                const productName = productCard.querySelector('h3').textContent.trim();
                const priceElement = productCard.querySelector('.price').textContent.trim();
                const productPrice = parseFloat(priceElement.replace('$', '').replace('.', ''));
                const productImage = productImageMap[productId];

                if (productId && productName && !isNaN(productPrice) && productImage) {
                    addToCart(productId, productName, productPrice, productImage);
                } else {
                    console.error('Error al capturar datos del producto para el carrito:', { productId, productName, productPrice, productImage });
                }
            }
        });
    });

    // Manejar clics en las tarjetas de producto para redirección
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (event) => {
            // No redirigir si se hizo clic en el botón "Añadir al carrito"
            if (event.target.closest('.add-to-cart')) {
                return;
            }

            const productId = card.getAttribute('data-id');
            const productName = card.querySelector('h3').textContent.trim();
            const priceElement = card.querySelector('.price').textContent.trim();
            const productPrice = parseFloat(priceElement.replace('$', '').replace('.', ''));
            const productImage = productImageMap[productId];

            let productDescription;
            let productFeatures;
            
            // Descripción y características basadas en el ID del producto
            if (productId === "1") { 
                productDescription = "Pantalón jeans de tiro alto elastizado, perfecto para cualquier ocasión con un ajuste cómodo y moderno.";
                productFeatures = ["Tiro alto", "Material elastizado", "Diseño contemporáneo", "Ajuste perfecto"];
            } else if (productId === "2") {
                productDescription = "Vestido con estampado animal print que combina elegancia y estilo salvaje.";
                productFeatures = ["Estampado animal print", "Diseño elegante", "Tela de calidad premium", "Corte favorecedor"];
            } else if (productId === "3") {
                productDescription = "Chaleco de lino fresco y versátil, ideal para crear looks sofisticados.";
                productFeatures = ["100% lino natural", "Transpirable", "Versátil", "Acabado premium"];
            } else if (productId === "4") {
                productDescription = "Cartera tipo baúl con diseño exclusivo que combina funcionalidad y estilo.";
                productFeatures = ["Diseño tipo baúl", "Múltiples compartimentos", "Material resistente", "Acabado de lujo"];
            } else if (productId === "5") {
                productDescription = "Cartera elegante con diseño minimalista, perfecta para cualquier ocasión.";
                productFeatures = ["Diseño minimalista", "Compacta y funcional", "Material de alta calidad", "Versatilidad garantizada"];
            }else if (productId === "6") {
                productDescription = "Cartera elegante con diseño minimalista, perfecta para cualquier ocasión.";
                productFeatures = ["Diseño minimalista", "Compacta y funcional", "Material de alta calidad", "Versatilidad garantizada"];
            }  else {
                productDescription = "Producto de moda contemporánea con la calidad excepcional de Zamlnig.";
                productFeatures = ["Alta calidad", "Diseño exclusivo", "Estilo contemporáneo"];
            }
           
            
            if (productId && productName && !isNaN(productPrice) && productImage) {
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
            } else {
                console.error('Error al capturar datos para la redirección a la página de producto.');
            }
        });
    });
});