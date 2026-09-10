/**
 * ==========================================================================
 * SMARTSHOP – PRODUCTS JAVASCRIPT
 * Catalog Filtering, Search, Sorting, Product Details & Related Items
 * ==========================================================================
 */

let allProducts = [];
let filteredProducts = [];
let activeCategory = 'all';
let maxPrice = 25000;
let minRating = 0;
let currentSort = 'popular';

// Load products for the catalog page
async function initProductsPage() {
  allProducts = getProducts();

  // Check URL query parameters for category or search
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  const catParam = urlParams.get('category');

  if (searchParam) {
    const searchBox = document.getElementById('catalogSearchInput');
    if (searchBox) searchBox.value = searchParam;
  }
  if (catParam) {
    activeCategory = catParam;
    updateActiveCategoryTab(catParam);
  }

  applyFilters();
}

// Category filter tabs
function filterByCategory(categoryName, element) {
  activeCategory = categoryName;
  document.querySelectorAll('.cat-filter-btn').forEach(btn => btn.classList.remove('active'));
  if (element) element.classList.add('active');
  applyFilters();
}

function updateActiveCategoryTab(categoryName) {
  document.querySelectorAll('.cat-filter-btn').forEach(btn => {
    if (btn.getAttribute('data-category').toLowerCase() === categoryName.toLowerCase()) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Apply multi-criteria filtering
function applyFilters() {
  const searchInput = document.getElementById('catalogSearchInput');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

  const priceSlider = document.getElementById('priceRangeSlider');
  if (priceSlider) maxPrice = parseInt(priceSlider.value);

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) currentSort = sortSelect.value;

  filteredProducts = allProducts.filter(product => {
    // Category match
    const catMatch = activeCategory === 'all' || product.category.toLowerCase() === activeCategory.toLowerCase();
    
    // Search match
    const searchMatch = !query || product.name.toLowerCase().includes(query) || 
      product.description.toLowerCase().includes(query) || 
      product.category.toLowerCase().includes(query);

    // Price match
    const priceMatch = product.price <= maxPrice;

    // Rating match
    const ratingMatch = product.rating >= minRating;

    return catMatch && searchMatch && priceMatch && ratingMatch;
  });

  // Sorting
  if (currentSort === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  } else {
    // Default popularity: reviews count & rating
    filteredProducts.sort((a, b) => (b.reviewsCount * b.rating) - (a.reviewsCount * a.rating));
  }

  renderProductGrid();
}

// Render product grid
function renderProductGrid() {
  const container = document.getElementById('catalogProductsGrid');
  const countBadge = document.getElementById('productCountBadge');
  if (!container) return;

  if (countBadge) {
    countBadge.textContent = `${filteredProducts.length} Products Found`;
  }

  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-search fa-3x text-muted mb-3"></i>
        <h4 class="fw-bold text-dark">No products found</h4>
        <p class="text-muted">Try adjusting your filters or search keywords.</p>
        <button class="btn btn-outline-primary rounded-pill px-4" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredProducts.map(p => renderProductCard(p)).join('');
  updateWishlistIcons();
}

// Reset filters
function resetFilters() {
  activeCategory = 'all';
  minRating = 0;
  maxPrice = 25000;
  
  const searchInput = document.getElementById('catalogSearchInput');
  if (searchInput) searchInput.value = '';

  const priceSlider = document.getElementById('priceRangeSlider');
  if (priceSlider) {
    priceSlider.value = 25000;
    const label = document.getElementById('priceRangeValue');
    if (label) label.textContent = formatINR(25000);
  }

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) sortSelect.value = 'popular';

  document.querySelectorAll('input[name="ratingFilter"]').forEach(radio => radio.checked = false);
  const allRatingRadio = document.getElementById('ratingAll');
  if (allRatingRadio) allRatingRadio.checked = true;

  document.querySelectorAll('.cat-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === 'all');
  });

  applyFilters();
}

// Set rating filter
function filterByRating(min) {
  minRating = min;
  applyFilters();
}

// ==========================================================================
// PRODUCT DETAILS PAGE LOGIC
// ==========================================================================
function loadProductDetailsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id')) || 1;
  const products = getProducts();
  const product = products.find(p => p.id === productId) || products[0];

  trackProductView(product.id);

  // Update Breadcrumb & Page title
  document.title = `${product.name} | SmartShop`;
  const breadcrumbEl = document.getElementById('detailBreadcrumbName');
  if (breadcrumbEl) breadcrumbEl.textContent = product.name;

  // Images
  const mainImage = document.getElementById('detailMainImage');
  if (mainImage) mainImage.src = product.image;

  // Title, Category, Rating
  const titleEl = document.getElementById('detailTitle');
  if (titleEl) titleEl.textContent = product.name;

  const catEl = document.getElementById('detailCategory');
  if (catEl) {
    catEl.textContent = product.category;
    catEl.href = `products.html?category=${encodeURIComponent(product.category)}`;
  }

  const starsEl = document.getElementById('detailRatingStars');
  if (starsEl) starsEl.innerHTML = renderStarRating(product.rating);

  const scoreEl = document.getElementById('detailRatingScore');
  if (scoreEl) scoreEl.textContent = `${product.rating} / 5.0`;

  const reviewCountEl = document.getElementById('detailReviewsCount');
  if (reviewCountEl) reviewCountEl.textContent = `(${product.reviewsCount} reviews)`;

  // Pricing & Discount
  const currentPriceEl = document.getElementById('detailCurrentPrice');
  if (currentPriceEl) currentPriceEl.textContent = formatINR(product.price);

  const origPriceEl = document.getElementById('detailOriginalPrice');
  if (origPriceEl) origPriceEl.textContent = formatINR(product.originalPrice);

  const discountEl = document.getElementById('detailDiscount');
  if (discountEl) discountEl.textContent = product.discount;

  const pointsEarnedEl = document.getElementById('detailPointsEarned');
  if (pointsEarnedEl) pointsEarnedEl.textContent = `+${Math.floor(product.price / 10)} Smart Points`;

  // Stock
  const stockEl = document.getElementById('detailStockBadge');
  if (stockEl) {
    if (product.stock > 0) {
      stockEl.className = 'badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-bold';
      stockEl.innerHTML = `<i class="fas fa-check-circle me-1"></i> In Stock (${product.stock} units left)`;
    } else {
      stockEl.className = 'badge bg-danger-subtle text-danger px-3 py-2 rounded-pill fw-bold';
      stockEl.innerHTML = `<i class="fas fa-times-circle me-1"></i> Out of Stock`;
    }
  }

  // Description
  const descEl = document.getElementById('detailDescription');
  if (descEl) descEl.textContent = product.description;

  // Wishlist toggle button on details page
  const wishlistBtn = document.getElementById('detailWishlistBtn');
  if (wishlistBtn) {
    wishlistBtn.onclick = () => {
      toggleWishlist(product.id);
      const isSaved = getWishlist().some(w => w.id === product.id);
      wishlistBtn.innerHTML = isSaved 
        ? '<i class="fas fa-heart text-danger me-2"></i> Saved in Wishlist'
        : '<i class="far fa-heart me-2"></i> Add to Wishlist';
    };
    const isSaved = getWishlist().some(w => w.id === product.id);
    if (isSaved) {
      wishlistBtn.innerHTML = '<i class="fas fa-heart text-danger me-2"></i> Saved in Wishlist';
    }
  }

  // Add to cart with quantity
  const addToCartBtn = document.getElementById('detailAddToCartBtn');
  if (addToCartBtn) {
    addToCartBtn.onclick = () => {
      const qtyInput = document.getElementById('detailQuantityInput');
      const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
      addToCart(product.id, qty);
    };
  }

  // Buy Now button (adds to cart & routes straight to checkout)
  const buyNowBtn = document.getElementById('detailBuyNowBtn');
  if (buyNowBtn) {
    buyNowBtn.onclick = () => {
      const qtyInput = document.getElementById('detailQuantityInput');
      const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
      addToCart(product.id, qty);
      setTimeout(() => {
        window.location.href = 'checkout.html';
      }, 400);
    };
  }

  // Related products ("You May Also Like")
  const relatedContainer = document.getElementById('detailRelatedProducts');
  if (relatedContainer) {
    const related = products
      .filter(p => p.id !== product.id && (p.category === product.category || p.categoryId === 5))
      .slice(0, 4);
    relatedContainer.innerHTML = related.map(p => renderProductCard(p, true)).join('');
    updateWishlistIcons();
  }
}

// Quantity adjusters on product details page
function adjustDetailQuantity(delta) {
  const input = document.getElementById('detailQuantityInput');
  if (!input) return;
  let current = parseInt(input.value) || 1;
  current += delta;
  if (current < 1) current = 1;
  if (current > 10) current = 10;
  input.value = current;
}

// Initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('catalogProductsGrid')) {
    initProductsPage();

    // Price slider live label
    const priceSlider = document.getElementById('priceRangeSlider');
    const priceLabel = document.getElementById('priceRangeValue');
    if (priceSlider && priceLabel) {
      priceSlider.addEventListener('input', (e) => {
        priceLabel.textContent = formatINR(parseInt(e.target.value));
      });
      priceSlider.addEventListener('change', () => {
        applyFilters();
      });
    }

    // Search input on catalog page
    const searchInput = document.getElementById('catalogSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        applyFilters();
      });
    }
  }

  if (document.getElementById('detailMainImage')) {
    loadProductDetailsPage();
  }
});
