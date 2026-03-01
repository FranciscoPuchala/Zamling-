// Mapping of product IDs to their image URLs
const productImageMap = {
    '1': '../img/pantalon1.jpeg',
    '2': '../img/vestido_animal.jpeg',
    '3': '../img/chaleco_lino.jpeg',
    '4': '../img/bolso.jpeg',
    '5': '../img/cartera_blanca.jpeg',
    '6': '../img/estirado.jpeg',
    '7': '../img/pantalones.jpeg',
    '8': '../img/pantalon_jean.jpeg',
    '9': '../img/pantalon_lino.jpeg',
    '10': '../img/pantalon_marron.jpeg',
    '11': '../img/pantalon_algodon.jpeg',
    '12': '../img/vestido_prili.jpeg',
    '13': '../img/vestido_algodon.jpeg',
    '14': '../img/vestido2.jpeg',
    '15': '../img/Remera_italiana.jpeg',
    '16': '../img/remera_lino.jpeg',
    '17': '../img/remera_algo_lino.jpeg',
    '18': '../img/remera_italiana2.jpeg',
    '19': '../img/cinturon.jpeg',
    '20': '../img/mini_cartera.jpeg',
};

// Function to show a temporary notification to the user
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

// Function to add a product to the cart in localStorage
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
    showNotification(`✅ "${name}" added to cart.`);
    console.log(`Product added: ${name} (ID: ${productId}, Image: ${imageURL})`);
};

// Function to animate product cards
const animateCards = (category) => {
    const cards = category.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.remove('card-animate');
        void card.offsetWidth;
        card.classList.add('card-animate');
    });
};

// Function to show a category with animation
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
    updateCartCount();
    initHamburgerMenu(); // Initialize hamburger menu

    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCategories = document.querySelectorAll('.product-category');

    // Initial animation on page load
    setTimeout(() => {
        productCategories.forEach(category => {
            animateCards(category);
        });
    }, 200);

    // Handle filter button clicks
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

    // Handle "Add to cart" button clicks
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
                    console.error('Error capturing product data for the cart:', { productId, productName, productPrice, productImage });
                }
            }
        });
    });

    // Handle product card clicks for redirection
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (event) => {
            // Do not redirect if the "Add to cart" button was clicked
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

            // Description and features based on product ID
            if (productId === "1") {
                productDescription = "High-waist stretch jeans designed for comfort and style. Perfect for any occasion with a modern, flattering fit.";
                productFeatures = ["High waist", "Stretch fabric", "Contemporary design", "Perfect fit"];
            } else if (productId === "2") {
                productDescription = "Animal print dress that combines elegance with a bold, wild style.";
                productFeatures = ["Animal print pattern", "Elegant design", "Premium quality fabric", "Flattering cut"];
            } else if (productId === "3") {
                productDescription = "Lightweight and versatile linen vest, ideal for creating sophisticated looks.";
                productFeatures = ["100% natural linen", "Breathable", "Versatile", "Premium finish"];
            } else if (productId === "4") {
                productDescription = "Trunk-style handbag with an exclusive design that blends functionality and style.";
                productFeatures = ["Trunk-style design", "Multiple compartments", "Durable material", "Luxury finish"];
            } else if (productId === "5") {
                productDescription = "Elegant handbag with a minimalist design, perfect for any occasion.";
                productFeatures = ["Minimalist design", "Compact and functional", "High-quality material", "Guaranteed versatility"];
            } else if (productId === "6") {
                productDescription = "Modern-cut stretch trousers, ideal for everyday wear.";
                productFeatures = ["Stretch material", "Modern cut", "Maximum comfort", "Versatile design"];
            } else if (productId === "7") {
                productDescription = "Classic trousers with a timeless silhouette that works for every look.";
                productFeatures = ["Classic cut", "Timeless style", "Quality fabric", "Versatile pairing"];
            } else if (productId === "8") {
                productDescription = "Everyday denim jeans with a relaxed yet refined cut.";
                productFeatures = ["Denim fabric", "Relaxed fit", "Durable construction", "Versatile style"];
            } else if (productId === "9") {
                productDescription = "Breathable linen trousers perfect for warm weather and effortless style.";
                productFeatures = ["Natural linen", "Breathable", "Lightweight", "Easy to style"];
            } else if (productId === "10") {
                productDescription = "Refined gabardine trousers with a structured silhouette for a polished look.";
                productFeatures = ["Gabardine fabric", "Structured cut", "Wrinkle-resistant", "Professional style"];
            } else if (productId === "11") {
                productDescription = "Soft cotton trousers that offer all-day comfort with a clean, modern look.";
                productFeatures = ["Cotton fabric", "Soft and comfortable", "Modern fit", "Easy care"];
            } else if (productId === "12") {
                productDescription = "Beautiful embroidered Prili dress with intricate details for a unique and feminine look.";
                productFeatures = ["Hand-inspired embroidery", "Unique design", "Premium fabric", "Feminine silhouette"];
            } else if (productId === "13") {
                productDescription = "Light cotton dress with a relaxed fit, perfect for casual and semi-formal occasions.";
                productFeatures = ["100% cotton", "Relaxed fit", "Comfortable", "Easy to style"];
            } else if (productId === "14") {
                productDescription = "Breezy summer cotton dress with a flowing silhouette ideal for warm days.";
                productFeatures = ["Lightweight cotton", "Flowing silhouette", "Summer-ready", "Versatile"];
            } else if (productId === "15") {
                productDescription = "Classic Italian-style top with refined details and exceptional fabric quality.";
                productFeatures = ["Italian-inspired design", "Premium fabric", "Refined details", "Elegant look"];
            } else if (productId === "16") {
                productDescription = "Comfortable linen and cotton blend tee with a relaxed, effortless look.";
                productFeatures = ["Linen & cotton blend", "Breathable", "Relaxed fit", "All-day comfort"];
            } else if (productId === "17") {
                productDescription = "Short-sleeve linen and cotton tee, perfect for layering or wearing solo.";
                productFeatures = ["Short sleeves", "Linen & cotton blend", "Lightweight", "Easy to layer"];
            } else if (productId === "18") {
                productDescription = "Italian long-sleeve top with an elegant, streamlined design.";
                productFeatures = ["Long sleeves", "Italian style", "Elegant cut", "Premium quality"];
            } else if (productId === "19") {
                productDescription = "Genuine leather belts that add a polished finishing touch to any outfit.";
                productFeatures = ["Genuine leather", "Multiple sizes", "Durable hardware", "Timeless style"];
            } else if (productId === "20") {
                productDescription = "Compact mini purse with a chic design, perfect for essentials on the go.";
                productFeatures = ["Compact design", "Chic style", "Quality materials", "Adjustable strap"];
            } else {
                productDescription = "Contemporary fashion piece by Velour & Co.";
                productFeatures = ["Premium quality", "Exclusive design", "Contemporary style"];
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
                console.error('Error capturing data for redirect to product page.');
            }
        });
    });
});
