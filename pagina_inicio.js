// Archivo: pagina_inicio.js
// Este script maneja la lógica de añadir productos al carrito desde la página de inicio, 
// asegurando que se guarden todos los datos necesarios, incluyendo la imagen, para el carrito.

// Mapeo de IDs de producto a sus URLs de imagen.
// Estos paths son CRÍTICOS para que las imágenes se muestren correctamente en el carrito.
const productImageMap = {
    '1': '../img/pantalon1.jpeg',
    '2': '../img/vestido_animal.jpeg',
    '3': '../img/chaleco_lino.jpeg',
    '4': '../img/bolso.jpeg',
    '5': '../img/cartera_blanca.jpeg'
};

// Función para mostrar una notificación temporal al usuario.
const showNotification = (message) => {
    // Intenta encontrar un contenedor de notificación existente o crea uno
    let notification = document.getElementById('cart-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'cart-notification';
        // Añadir estilos básicos con color amarillo/naranja y posición abajo a la derecha
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
    
    // Actualizar mensaje y mostrar con animación suave
    notification.textContent = message;
    
    // Pequeño delay para asegurar que la transición se aplique
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0) scale(1)';
    }, 10);

    // Ocultar la notificación después de 3 segundos con animación suave
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(30px) scale(0.95)';
    }, 3000);
};

// Función para actualizar el contador del carrito en el encabezado.
const updateCartCount = () => {
    // Intenta obtener el carrito. Si no existe, usa un array vacío.
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
    const cartButton = document.querySelector('.cart-button');

    if (cartButton) {
        cartButton.textContent = `🛒 Carrito (${totalItems})`;
    }
    return totalItems; // Retorna el total por si acaso
};

// Función para añadir un producto al carrito en localStorage
// Se añade 'imageURL' como nuevo parámetro.
const addToCart = (productId, name, price, imageURL) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        // El producto ya está en el carrito, incrementa la cantidad
        cart[productIndex].quantity += 1;
    } else {
        // El producto es nuevo, añádelo
        const newProduct = {
            id: productId,
            name: name,
            price: price, 
            image: imageURL, // CRÍTICO: Guardamos la URL de la imagen
            quantity: 1,
        };
        cart.push(newProduct);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); // Actualiza el contador visible
    // 🛒 RESTAURADO: Muestra la notificación al usuario
    showNotification(`✅ "${name}" añadido al carrito.`); 
    console.log(`Producto añadido: ${name} (ID: ${productId}, Imagen: ${imageURL})`);
};


// Inicializa los listeners de los botones "Añadir al carrito" y los productos
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(); // Inicializa el contador al cargar la página

    // 1. Manejar clics en los botones "Añadir al carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Detiene la navegación del enlace

            const productCard = event.target.closest('.product-card');

            if (productCard) {
                // Captura los datos CRÍTICOS para el servidor
                const productId = productCard.getAttribute('data-id');
                const productName = productCard.querySelector('h3').textContent.trim();
                
                // Limpia y convierte el precio a un número decimal (CRÍTICO)
                const priceElement = productCard.querySelector('.price').textContent.trim();
                const productPrice = parseFloat(priceElement.replace('$', '').replace('.', ''));
                
                // CRÍTICO: Obtiene la URL de la imagen del mapa
                const productImage = productImageMap[productId];


                if (productId && productName && !isNaN(productPrice) && productImage) {
                    // Llama a addToCart incluyendo la URL de la imagen
                    addToCart(productId, productName, productPrice, productImage);
                } else {
                    console.error('Error al capturar datos del producto para el carrito:', { productId, productName, productPrice, productImage });
                    // NOTA: Se evita el alert aquí ya que la notificación es mejor.
                }
            }
        });
    });

    // 2. Manejar clics en las tarjetas de producto (para mantener la función de redirección a la página de detalle)
    document.querySelectorAll('.product-card').forEach(card => {
        // Excluimos el botón "Añadir al carrito" para que no dispare la redirección
        const addToCartButton = card.querySelector('.add-to-cart');
        if (addToCartButton) {
            // Aseguramos que el clic en la tarjeta solo redirija si no es el botón de añadir al carrito
            card.addEventListener('click', (event) => {
                if (event.target !== addToCartButton && !event.target.closest('.add-to-cart')) {
                    const productId = card.getAttribute('data-id');
                    const productName = card.querySelector('h3').textContent.trim();
                    const priceElement = card.querySelector('.price').textContent.trim();
                    const productPrice = parseFloat(priceElement.replace('$', ''));
                    const productImage = productImageMap[productId];

                    // Prepara y guarda la información del producto seleccionado (como lo hacía tu script original)
                    if (productId && productName && !isNaN(productPrice) && productImage) {
                        const selectedProduct = {
                            id: productId,
                            name: productName,
                            price: productPrice,
                            image: productImage,
                            // Nota: La descripción y características deben ser añadidas aquí si se usan en la página de producto
                            description: "Descripción genérica...", 
                            features: ["Función 1", "Función 2"]
                        };
                        
                        localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
                        // Redirige a la página de producto.
                        window.location.href = `./Producto/pagina_producto.html`;
                    } else {
                        console.error('Error al capturar datos para la redirección a la página de producto.');
                    }
                }
            });
        }
    });
});