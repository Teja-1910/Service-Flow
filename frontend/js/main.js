/**
 * ==========================================================================
 * SMARTSHOP – SMART SHOPPING FOR A BETTER TOMORROW
 * AICTE Smart India Hackathon 2026
 * Core JavaScript: State Management, Backend API, Navigation & UI Helpers
 * ==========================================================================
 */

// ==========================================================================
// GLOBAL API CONFIGURATION
// ==========================================================================

const API_BASE_URL = 'https://smartshop-backend-soki.onrender.com/api';

// ==========================================================================
// CURRENCY FORMATTER
// ==========================================================================

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(amount) || 0);
}

// ==========================================================================
// SEED DATA FALLBACK
// ==========================================================================
// These products are kept as a fallback if the Spring Boot backend is
// temporarily unavailable.
// ==========================================================================

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Urban Pro Running Shoes",
    category: "Fashion",
    categoryId: 1,
    price: 3499,
    originalPrice: 4999,
    discount: "30% OFF",
    rating: 4.8,
    reviewsCount: 142,
    stock: 25,
    description: "Ultra-lightweight breathable sports running shoes with ergonomic cushioning and high-grip outsole.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    tags: ["sports", "footwear", "trending", "running"],
    recommendedBecause: "Based on trending athletic wear"
  },
  {
    id: 2,
    name: "Aura Noise-Cancelling Headphones",
    category: "Electronics",
    categoryId: 2,
    price: 6999,
    originalPrice: 9999,
    discount: "30% OFF",
    rating: 4.9,
    reviewsCount: 320,
    stock: 18,
    description: "Active noise cancellation wireless over-ear headphones with 40-hour battery life and spatial audio.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    tags: ["audio", "wireless", "bestseller", "gadget"],
    recommendedBecause: "High customer satisfaction rating"
  },
  {
    id: 3,
    name: "Minimalist Chrono Smartwatch",
    category: "Accessories",
    categoryId: 5,
    price: 4299,
    originalPrice: 5999,
    discount: "28% OFF",
    rating: 4.7,
    reviewsCount: 98,
    stock: 12,
    description: "Sleek AMOLED display smartwatch with SpO2 monitoring, fitness tracking and 7-day battery life.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    tags: ["watch", "fitness", "accessories", "tech"],
    recommendedBecause: "Pairs with sports running shoes"
  },
  {
    id: 4,
    name: "Organic Rose Radiance Face Serum",
    category: "Beauty",
    categoryId: 3,
    price: 899,
    originalPrice: 1299,
    discount: "31% OFF",
    rating: 4.6,
    reviewsCount: 75,
    stock: 40,
    description: "Pure botanical hydration serum infused with Hyaluronic Acid and Vitamin C for natural glowing skin.",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
    tags: ["skincare", "glow", "organic", "beauty"],
    recommendedBecause: "Best seller in organic personal care"
  },
  {
    id: 5,
    name: "Nordic Minimalist Desk Lamp",
    category: "Home & Living",
    categoryId: 4,
    price: 1899,
    originalPrice: 2799,
    discount: "32% OFF",
    rating: 4.7,
    reviewsCount: 64,
    stock: 15,
    description: "Modern matte finish adjustable LED study lamp with 3 color temperatures and touch dimmer.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    tags: ["decor", "home", "lighting", "minimal"],
    recommendedBecause: "Trending in Home Decor"
  },
  {
    id: 6,
    name: "Classic Denim Bomber Jacket",
    category: "Fashion",
    categoryId: 1,
    price: 2499,
    originalPrice: 3999,
    discount: "37% OFF",
    rating: 4.5,
    reviewsCount: 110,
    stock: 22,
    description: "Vintage stone-washed durable denim jacket with brass buttons and dual chest pockets.",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
    tags: ["denim", "clothing", "casual", "fashion"],
    recommendedBecause: "Frequently bought with Urban Pro Shoes"
  },
  {
    id: 7,
    name: "Pro 4K Ultra Action Camera",
    category: "Electronics",
    categoryId: 2,
    price: 8499,
    originalPrice: 11999,
    discount: "29% OFF",
    rating: 4.8,
    reviewsCount: 88,
    stock: 10,
    description: "Waterproof sports action cam with dual screen, electronic image stabilization and accessories kit.",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80",
    tags: ["camera", "adventure", "electronics", "video"],
    recommendedBecause: "Popular among travel enthusiasts"
  },
  {
    id: 8,
    name: "Handcrafted Ceramic Dining Set",
    category: "Home & Living",
    categoryId: 4,
    price: 3199,
    originalPrice: 4500,
    discount: "29% OFF",
    rating: 4.9,
    reviewsCount: 52,
    stock: 8,
    description: "Artisan glazed stoneware dinner set (12-piece) microwave and dishwasher safe.",
    image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&auto=format&fit=crop&q=80",
    tags: ["kitchen", "dining", "craft", "pottery"],
    recommendedBecause: "Top rated artisan homeware"
  }
];

// ==========================================================================
// INITIAL OFFERS
// ==========================================================================

const INITIAL_OFFERS = [
  {
    id: 1,
    code: "SMART200",
    discount: "₹200 OFF",
    title: "Welcome Hackathon Bonus",
    description: "Flat ₹200 off on first purchase above ₹999 across all sectors.",
    bgClass: "bg-grad-1"
  },
  {
    id: 2,
    code: "FESTIVE10",
    discount: "10% OFF",
    title: "Retail & Dining Combo",
    description: "Get 10% instant discount on shopping + restaurant bookings.",
    bgClass: "bg-grad-2"
  },
  {
    id: 3,
    code: "CINEMA50",
    discount: "Buy 1 Get 1",
    title: "Entertainment Weekend",
    description: "Book movie tickets and enjoy 50% discount on second ticket.",
    bgClass: "bg-grad-3"
  },
  {
    id: 4,
    code: "HOLIDAY25",
    discount: "₹1,500 OFF",
    title: "Hospitality Getaway",
    description: "Flat ₹1,500 off on 2+ nights hotel booking across India.",
    bgClass: "bg-grad-4"
  }
];

// ==========================================================================
// CATEGORY HELPERS
// ==========================================================================

function getCategoryName(categoryId) {
  const categories = {
    1: "Fashion",
    2: "Electronics",
    3: "Beauty",
    4: "Home & Living",
    5: "Accessories"
  };

  return categories[Number(categoryId)] || "Accessories";
}

// ==========================================================================
// DISCOUNT / ORIGINAL PRICE HELPERS
// ==========================================================================

function calculateOriginalPrice(price, discount) {
  const currentPrice = Number(price) || 0;

  if (!discount) {
    return currentPrice;
  }

  const match = String(discount).match(/(\d+(?:\.\d+)?)\s*%/);

  if (match) {
    const percentage = Number(match[1]);

    if (percentage > 0 && percentage < 100) {
      return Math.round(currentPrice / (1 - percentage / 100));
    }
  }

  return currentPrice;
}

// ==========================================================================
// INITIALIZE LOCAL STORAGE DEFAULTS
// ==========================================================================

function initAppStorage() {

  if (!localStorage.getItem('smartshop_products')) {
    localStorage.setItem(
      'smartshop_products',
      JSON.stringify(INITIAL_PRODUCTS)
    );
  }

  if (!localStorage.getItem('smartshop_cart')) {
    localStorage.setItem(
      'smartshop_cart',
      JSON.stringify([])
    );
  }

  if (!localStorage.getItem('smartshop_wishlist')) {
    localStorage.setItem(
      'smartshop_wishlist',
      JSON.stringify([])
    );
  }

  if (!localStorage.getItem('smartshop_offers')) {
    localStorage.setItem(
      'smartshop_offers',
      JSON.stringify(INITIAL_OFFERS)
    );
  }

  if (!localStorage.getItem('smartshop_wallet_balance')) {
    localStorage.setItem(
      'smartshop_wallet_balance',
      '5000'
    );
  }

  if (!localStorage.getItem('smartshop_rewards_points')) {
    localStorage.setItem(
      'smartshop_rewards_points',
      '1250'
    );
  }

  if (!localStorage.getItem('smartshop_recent_views')) {
    localStorage.setItem(
      'smartshop_recent_views',
      JSON.stringify([1, 2])
    );
  }
}

// ==========================================================================
// LOAD PRODUCTS FROM SPRING BOOT BACKEND
// ==========================================================================

async function loadProductsFromAPI() {

  try {

    console.log("SmartShop: Loading products from backend...");

    const response = await fetch(
      `${API_BASE_URL}/products`
    );

    if (!response.ok) {
      throw new Error(
        `API error: ${response.status}`
      );
    }

    const products = await response.json();

    if (!Array.isArray(products)) {
      throw new Error(
        "Invalid product data received from backend"
      );
    }

    // Convert Spring Boot Product objects
    // into the format expected by the existing frontend.
    const mappedProducts = products.map(product => {

      const price = Number(product.price) || 0;

      const discount = product.discount || "";

      return {
        id: Number(product.id),

        name: product.name || "Unnamed Product",

        category:
          product.category ||
          getCategoryName(product.categoryId),

        categoryId:
          Number(product.categoryId) || 0,

        price: price,

        originalPrice:
          product.originalPrice
            ? Number(product.originalPrice)
            : calculateOriginalPrice(
                price,
                discount
              ),

        discount: discount,

        rating:
          product.rating !== null &&
          product.rating !== undefined
            ? Number(product.rating)
            : 0,

        reviewsCount:
          product.reviewsCount !== undefined &&
          product.reviewsCount !== null
            ? Number(product.reviewsCount)
            : 0,

        stock:
          product.stock !== null &&
          product.stock !== undefined
            ? Number(product.stock)
            : 0,

        description:
          product.description || "",

        image:
          product.imageUrl ||
          product.image ||
          "",

        tags:
          Array.isArray(product.tags)
            ? product.tags
            : [],

        recommendedBecause:
          product.recommendedBecause || ""
      };
    });

    // Save backend products locally so all existing
    // frontend functions can continue using getProducts().
    localStorage.setItem(
      'smartshop_products',
      JSON.stringify(mappedProducts)
    );

    console.log(
      `SmartShop: ${mappedProducts.length} products loaded from backend.`
    );

    return mappedProducts;

  } catch (error) {

    console.error(
      "SmartShop: Failed to load products from backend:",
      error
    );

    console.warn(
      "SmartShop: Using local fallback products."
    );

    // Keep existing local demo products as fallback.
    return getProducts();
  }
}

// ==========================================================================
// GET ALL PRODUCTS
// ==========================================================================

function getProducts() {

  const data = localStorage.getItem(
    'smartshop_products'
  );

  return data
    ? JSON.parse(data)
    : INITIAL_PRODUCTS;
}

// ==========================================================================
// GET CART
// ==========================================================================

function getCart() {

  const data = localStorage.getItem(
    'smartshop_cart'
  );

  return data
    ? JSON.parse(data)
    : [];
}

// ==========================================================================
// SAVE CART
// ==========================================================================

function saveCart(cart) {

  localStorage.setItem(
    'smartshop_cart',
    JSON.stringify(cart)
  );

  updateBadges();
}

// ==========================================================================
// ADD TO CART
// ==========================================================================

function addToCart(productId, quantity = 1) {

  const products = getProducts();

  const product = products.find(
    p => Number(p.id) === Number(productId)
  );

  if (!product) {
    console.warn(
      `Product ${productId} not found.`
    );
    return;
  }

  const cart = getCart();

  const existingItemIndex =
    cart.findIndex(
      item => Number(item.id) === Number(productId)
    );

  if (existingItemIndex > -1) {

    cart[existingItemIndex].quantity += quantity;

  } else {

    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: quantity
    });
  }

  saveCart(cart);

  showToast(
    "Added to Cart!",
    `${product.name} is now in your shopping bag.`,
    "success"
  );
}

// ==========================================================================
// GET WISHLIST
// ==========================================================================

function getWishlist() {

  const data = localStorage.getItem(
    'smartshop_wishlist'
  );

  return data
    ? JSON.parse(data)
    : [];
}

// ==========================================================================
// SAVE WISHLIST
// ==========================================================================

function saveWishlist(wishlist) {

  localStorage.setItem(
    'smartshop_wishlist',
    JSON.stringify(wishlist)
  );

  updateBadges();
}

// ==========================================================================
// TOGGLE WISHLIST
// ==========================================================================

function toggleWishlist(productId) {

  const products = getProducts();

  const product = products.find(
    p => Number(p.id) === Number(productId)
  );

  if (!product) {
    return;
  }

  let wishlist = getWishlist();

  const index =
    wishlist.findIndex(
      item => Number(item.id) === Number(productId)
    );

  if (index > -1) {

    wishlist.splice(index, 1);

    saveWishlist(wishlist);

    showToast(
      "Removed from Wishlist",
      `${product.name} removed from your saved items.`,
      "info"
    );

  } else {

    wishlist.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });

    saveWishlist(wishlist);

    showToast(
      "Added to Wishlist!",
      `${product.name} saved to your wishlist.`,
      "success"
    );
  }

  updateWishlistIcons();
}

// ==========================================================================
// UPDATE CART / WISHLIST BADGES
// ==========================================================================

function updateBadges() {

  const cart = getCart();

  const totalCartCount =
    cart.reduce(
      (sum, item) =>
        sum + (Number(item.quantity) || 0),
      0
    );

  const cartBadge =
    document.getElementById('cartBadge');

  if (cartBadge) {

    cartBadge.textContent =
      totalCartCount;

    cartBadge.style.display =
      totalCartCount > 0
        ? 'flex'
        : 'none';
  }

  const wishlist = getWishlist();

  const wishlistBadge =
    document.getElementById('wishlistBadge');

  if (wishlistBadge) {

    wishlistBadge.textContent =
      wishlist.length;

    wishlistBadge.style.display =
      wishlist.length > 0
        ? 'flex'
        : 'none';
  }
}

// ==========================================================================
// UPDATE WISHLIST HEART ICONS
// ==========================================================================

function updateWishlistIcons() {

  const wishlist = getWishlist();

  const wishlistIds =
    new Set(
      wishlist.map(
        item => Number(item.id)
      )
    );

  document
    .querySelectorAll('.btn-wishlist-toggle')
    .forEach(btn => {

      const pid =
        Number(
          btn.getAttribute(
            'data-product-id'
          )
        );

      if (wishlistIds.has(pid)) {

        btn.classList.add('active');

        btn.innerHTML =
          '<i class="fas fa-heart text-danger"></i>';

      } else {

        btn.classList.remove('active');

        btn.innerHTML =
          '<i class="far fa-heart"></i>';
      }
    });
}

// ==========================================================================
// TRACK RECENTLY VIEWED PRODUCT
// ==========================================================================

function trackProductView(productId) {

  let views =
    JSON.parse(
      localStorage.getItem(
        'smartshop_recent_views'
      ) || '[]'
    );

  productId = Number(productId);

  views =
    views.filter(
      id => Number(id) !== productId
    );

  views.unshift(productId);

  if (views.length > 10) {
    views.pop();
  }

  localStorage.setItem(
    'smartshop_recent_views',
    JSON.stringify(views)
  );
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================

function showToast(
  title,
  message,
  type = "info"
) {

  let container =
    document.getElementById(
      'smartToastContainer'
    );

  if (!container) {

    container =
      document.createElement('div');

    container.id =
      'smartToastContainer';

    container.className =
      'toast-container-custom';

    document.body.appendChild(
      container
    );
  }

  const toast =
    document.createElement('div');

  toast.className =
    `smart-toast toast-${type}`;

  let iconClass =
    'fa-info-circle';

  if (type === 'success') {
    iconClass =
      'fa-check-circle';
  }

  if (type === 'error') {
    iconClass =
      'fa-exclamation-circle';
  }

  toast.innerHTML = `
    <i class="fas ${iconClass} toast-icon"></i>

    <div class="toast-content">
      <div class="toast-title">
        ${title}
      </div>

      <div class="toast-msg">
        ${message}
      </div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {

    toast.style.animation =
      'slideOutToast 0.3s forwards';

    setTimeout(
      () => toast.remove(),
      300
    );

  }, 3200);
}

// ==========================================================================
// COPY COUPON CODE
// ==========================================================================

function copyCoupon(code) {

  if (
    navigator.clipboard &&
    navigator.clipboard.writeText
  ) {

    navigator.clipboard
      .writeText(code)
      .then(() => {

        showToast(
          "Coupon Copied!",
          `Code "${code}" copied to clipboard. Apply at checkout.`,
          "success"
        );

      })
      .catch(() => {

        showToast(
          "Coupon Code",
          `Use code: ${code}`,
          "info"
        );
      });

  } else {

    showToast(
      "Coupon Code",
      `Use code: ${code}`,
      "info"
    );
  }
}

// ==========================================================================
// AUTHENTICATION STATE
// ==========================================================================

function getCurrentUser() {

  const user =
    localStorage.getItem(
      'smartshop_current_user'
    );

  return user
    ? JSON.parse(user)
    : null;
}

// ==========================================================================
// AUTH NAVBAR
// ==========================================================================

function updateAuthNavbar() {

  const user =
    getCurrentUser();

  const userNavContainer =
    document.getElementById(
      'userNavContainer'
    );

  if (!userNavContainer) {
    return;
  }

  if (user) {

    const userName =
      user.name || "User";

    const userEmail =
      user.email || "";

    const userRole =
      user.role || "Member";

    userNavContainer.innerHTML = `

      <div class="dropdown">

        <button
          class="btn nav-action-btn dropdown-toggle border-0 p-0"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          title="Account"
        >

          <div
            style="
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: var(--gradient-primary);
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 700;
            "
          >
            ${userName.charAt(0).toUpperCase()}
          </div>

        </button>

        <ul
          class="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-2 p-2"
          style="min-width: 220px;"
        >

          <li class="px-3 py-2 border-bottom">

            <div class="fw-bold text-dark">
              ${userName}
            </div>

            <div class="small text-muted">
              ${userEmail}
            </div>

            <span class="badge bg-primary-subtle text-primary mt-1">
              ${userRole}
            </span>

          </li>

          <li>
            <a
              class="dropdown-item py-2"
              href="profile.html"
            >
              <i class="fas fa-user-circle me-2 text-primary"></i>
              My Profile
            </a>
          </li>

          <li>
            <a
              class="dropdown-item py-2"
              href="orders.html"
            >
              <i class="fas fa-box me-2 text-primary"></i>
              My Orders
            </a>
          </li>

          <li>
            <a
              class="dropdown-item py-2"
              href="finance.html"
            >
              <i class="fas fa-wallet me-2 text-primary"></i>
              Smart Wallet
            </a>
          </li>

          <li>
            <a
              class="dropdown-item py-2"
              href="rewards.html"
            >
              <i class="fas fa-gift me-2 text-primary"></i>
              Reward Points
            </a>
          </li>

          ${
            userRole === 'ADMIN'
              ? `
                <li>
                  <a
                    class="dropdown-item py-2 text-danger fw-bold"
                    href="admin.html"
                  >
                    <i class="fas fa-shield-alt me-2"></i>
                    Admin Panel
                  </a>
                </li>
              `
              : ''
          }

          <li>
            <hr class="dropdown-divider">
          </li>

          <li>
            <a
              class="dropdown-item py-2 text-danger"
              href="javascript:void(0)"
              onclick="logoutUser()"
            >
              <i class="fas fa-sign-out-alt me-2"></i>
              Logout
            </a>
          </li>

        </ul>

      </div>
    `;

  } else {

    userNavContainer.innerHTML = `

      <a
        href="login.html"
        class="btn btn-outline-primary btn-sm px-3 rounded-pill fw-bold me-1"
      >
        Login
      </a>

      <a
        href="register.html"
        class="btn btn-smart-primary btn-sm px-3 rounded-pill text-white fw-bold d-none d-sm-inline-block"
      >
        Sign Up
      </a>

    `;
  }
}

// ==========================================================================
// LOGOUT
// ==========================================================================

function logoutUser() {

  localStorage.removeItem(
    'smartshop_current_user'
  );

  localStorage.removeItem(
    'smartshop_jwt_token'
  );

  showToast(
    "Logged Out",
    "You have been securely signed out.",
    "info"
  );

  setTimeout(() => {

    window.location.href =
      'index.html';

  }, 800);
}

// ==========================================================================
// PRODUCT CARD
// ==========================================================================

function renderProductCard(
  product,
  isRecommendation = false
) {

  const price =
    Number(product.price) || 0;

  const originalPrice =
    Number(product.originalPrice) || price;

  const rating =
    Number(product.rating) || 0;

  const reviewsCount =
    Number(product.reviewsCount) || 0;

  return `

    <div class="col-12 col-sm-6 col-lg-3">

      <div class="product-card">

        <div class="product-image-container">

          ${
            isRecommendation

              ? `
                <div class="badge-recommendation">
                  <i class="fas fa-sparkles"></i>
                  For You
                </div>
              `

              : `
                <div class="badge-discount">
                  ${product.discount || ''}
                </div>
              `
          }

          <button
            class="btn-wishlist-toggle"
            data-product-id="${product.id}"
            onclick="toggleWishlist(${product.id})"
            title="Save to Wishlist"
          >
            <i class="far fa-heart"></i>
          </button>

          <a
            href="product-details.html?id=${product.id}"
            class="d-flex align-items-center justify-content-center w-100 h-100"
            onclick="trackProductView(${product.id})"
          >

            <img
              src="${product.image || ''}"
              alt="${product.name}"
              class="product-image"
              loading="lazy"
            >

          </a>

        </div>

        <div class="product-body">

          <span class="product-category-text">
            ${product.category || 'Accessories'}
          </span>

          <h3 class="product-title">

            <a
              href="product-details.html?id=${product.id}"
              onclick="trackProductView(${product.id})"
            >
              ${product.name}
            </a>

          </h3>

          <div class="rating-bar">

            <div class="rating-stars">
              ${renderStarRating(rating)}
            </div>

            <span class="rating-score">
              ${rating}
            </span>

            <span class="rating-count">
              (${reviewsCount})
            </span>

          </div>

          <div class="price-container">

            <span class="price-current">
              ${formatINR(price)}
            </span>

            <span class="price-original">
              ${formatINR(originalPrice)}
            </span>

            <span class="price-save">
              ${product.discount || ''}
            </span>

          </div>

          <button
            class="btn-add-cart"
            onclick="addToCart(${product.id}, 1)"
          >
            <i class="fas fa-cart-plus"></i>
            Add to Cart
          </button>

        </div>

      </div>

    </div>

  `;
}

// ==========================================================================
// STAR RATING
// ==========================================================================

function renderStarRating(rating) {

  let starsHtml = '';

  rating =
    Math.max(
      0,
      Math.min(
        5,
        Number(rating) || 0
      )
    );

  const fullStars =
    Math.floor(rating);

  const hasHalf =
    rating % 1 >= 0.5;

  for (
    let i = 0;
    i < fullStars;
    i++
  ) {

    starsHtml +=
      '<i class="fas fa-star"></i>';
  }

  if (hasHalf) {

    starsHtml +=
      '<i class="fas fa-star-half-alt"></i>';
  }

  const emptyStars =
    5 -
    fullStars -
    (hasHalf ? 1 : 0);

  for (
    let i = 0;
    i < emptyStars;
    i++
  ) {

    starsHtml +=
      '<i class="far fa-star"></i>';
  }

  return starsHtml;
}

// ==========================================================================
// HOMEPAGE POPULAR PRODUCTS
// ==========================================================================

function loadHomepagePopularProducts() {

  const container =
    document.getElementById(
      'popularProductsGrid'
    );

  if (!container) {
    return;
  }

  const products =
    getProducts();

  const popular =
    products.slice(0, 4);

  container.innerHTML =
    popular
      .map(
        product =>
          renderProductCard(product)
      )
      .join('');

  updateWishlistIcons();
}

// ==========================================================================
// HOMEPAGE RECOMMENDED PRODUCTS
// ==========================================================================

function loadHomepageRecommendedProducts() {

  const container =
    document.getElementById(
      'recommendedProductsGrid'
    );

  if (!container) {
    return;
  }

  const products =
    getProducts();

  const recommendedProducts =
    products.slice(4, 8);

  const recommended =
    recommendedProducts.length > 0
      ? recommendedProducts
      : products.slice(0, 4);

  container.innerHTML =
    recommended
      .map(
        product =>
          renderProductCard(
            product,
            true
          )
      )
      .join('');

  updateWishlistIcons();
}

// ==========================================================================
// HOMEPAGE OFFERS
// ==========================================================================

function loadHomepageOffers() {

  const container =
    document.getElementById(
      'specialOffersGrid'
    );

  if (!container) {
    return;
  }

  const offers =
    JSON.parse(
      localStorage.getItem(
        'smartshop_offers'
      ) || '[]'
    );

  container.innerHTML =
    offers
      .map(
        offer => `

          <div class="col-12 col-md-6 col-lg-3">

            <div class="offer-card ${offer.bgClass}">

              <div>

                <span class="offer-badge">
                  <i class="fas fa-bolt me-1"></i>
                  Hackathon Deal
                </span>

                <div class="offer-value">
                  ${offer.discount}
                </div>

                <h4 class="offer-title">
                  ${offer.title}
                </h4>

                <p class="offer-desc">
                  ${offer.description}
                </p>

              </div>

              <div class="coupon-box">

                <span class="coupon-code">
                  ${offer.code}
                </span>

                <button
                  class="btn-copy-code"
                  onclick="copyCoupon('${offer.code}')"
                >
                  Copy
                </button>

              </div>

            </div>

          </div>

        `
      )
      .join('');
}

// ==========================================================================
// NAVBAR SEARCH
// ==========================================================================

function setupSearchHandler() {

  const searchInput =
    document.getElementById(
      'mainSearchInput'
    );

  if (!searchInput) {
    return;
  }

  searchInput.addEventListener(
    'keydown',
    (e) => {

      if (e.key === 'Enter') {

        const q =
          searchInput.value.trim();

        if (q) {

          window.location.href =
            `products.html?search=${encodeURIComponent(q)}`;
        }
      }
    }
  );
}

// ==========================================================================
// NAVBAR SCROLL SHADOW
// ==========================================================================

window.addEventListener(
  'scroll',
  () => {

    const navbar =
      document.querySelector(
        '.smart-navbar'
      );

    if (!navbar) {
      return;
    }

    if (window.scrollY > 30) {

      navbar.classList.add(
        'scrolled'
      );

    } else {

      navbar.classList.remove(
        'scrolled'
      );
    }
  }
);

// ==========================================================================
// APPLICATION STARTUP
// ==========================================================================
// IMPORTANT:
// Products are loaded from Spring Boot BEFORE the homepage product grids
// are rendered. Existing synchronous getProducts() calls remain unchanged.
// ==========================================================================

document.addEventListener(
  'DOMContentLoaded',
  async () => {

    console.log(
      "SmartShop: Frontend initializing..."
    );

    // Step 1:
    // Initialize fallback/local storage data.
    initAppStorage();

    // Step 2:
    // Get the latest products from Spring Boot + MySQL.
    await loadProductsFromAPI();

    // Step 3:
    // Initialize the rest of the UI.
    updateBadges();

    updateAuthNavbar();

    setupSearchHandler();

    // Step 4:
    // Render homepage products only AFTER
    // the backend synchronization is complete.
    if (
      document.getElementById(
        'popularProductsGrid'
      )
    ) {

      loadHomepagePopularProducts();

      loadHomepageRecommendedProducts();

      loadHomepageOffers();
    }

    console.log(
      "SmartShop: Frontend initialized successfully."
    );
  }
);