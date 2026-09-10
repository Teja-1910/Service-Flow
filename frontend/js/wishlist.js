/**
 * ==========================================================================
 * SMARTSHOP – WISHLIST JAVASCRIPT
 * Manage Saved Products, Remove, and Move to Cart
 * ==========================================================================
 */

function loadWishlistPage() {
  const container = document.getElementById('wishlistItemsGrid');
  const countBadge = document.getElementById('wishlistCountText');
  if (!container) return;

  const wishlist = getWishlist();
  if (countBadge) {
    countBadge.textContent = `${wishlist.length} Saved Item(s)`;
  }

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="mx-auto mb-3" style="width: 80px; height: 80px; border-radius: 50%; background: #fee2e2; color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 2.2rem;">
          <i class="far fa-heart"></i>
        </div>
        <h4 class="fw-bold text-dark">Your Wishlist is Empty</h4>
        <p class="text-muted">Explore our catalog and save your favorite retail items here for later.</p>
        <a href="products.html" class="btn btn-smart-primary rounded-pill px-4">
          <i class="fas fa-bag-shopping me-2"></i> Explore Products
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = wishlist.map(item => `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      <div class="card border rounded-4 overflow-hidden shadow-sm h-100 bg-white">
        <div class="position-relative p-3 bg-light text-center" style="height: 200px; display: flex; align-items: center; justify-content: center;">
          <img src="${item.image}" alt="${item.name}" style="max-height: 100%; object-fit: contain;">
          <button class="btn btn-sm btn-light rounded-circle position-absolute top-0 end-0 m-2 shadow-sm text-danger border" onclick="removeFromWishlistPage(${item.id})" title="Remove">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
        <div class="card-body d-flex flex-direction-column flex-column justify-content-between">
          <div>
            <span class="badge bg-primary-subtle text-primary mb-1 small">${item.category}</span>
            <h6 class="fw-bold text-dark mb-2 text-truncate" title="${item.name}">
              <a href="product-details.html?id=${item.id}" class="text-dark">${item.name}</a>
            </h6>
            <div class="fw-bold text-dark fs-5 mb-3">${formatINR(item.price)}</div>
          </div>
          <button class="btn btn-outline-primary btn-sm rounded-pill w-100 fw-bold py-2" onclick="moveWishlistItemToCart(${item.id})">
            <i class="fas fa-cart-arrow-down me-1"></i> Move to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function removeFromWishlistPage(productId) {
  let wishlist = getWishlist();
  wishlist = wishlist.filter(w => w.id !== productId);
  saveWishlist(wishlist);
  showToast("Removed from Wishlist", "Item removed successfully.", "info");
  loadWishlistPage();
}

function moveWishlistItemToCart(productId) {
  const wishlist = getWishlist();
  const item = wishlist.find(w => w.id === productId);
  if (!item) return;

  addToCart(productId, 1);
  removeFromWishlistPage(productId);
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('wishlistItemsGrid')) {
    loadWishlistPage();
  }
});
