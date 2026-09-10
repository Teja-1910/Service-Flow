/**
 * ==========================================================================
 * SMARTSHOP – SMART RECOMMENDATION SYSTEM JAVASCRIPT
 * Rule-Based Recommendation Engine & Cross-Sector Bundle Suggestions
 * AICTE Smart India Hackathon 2026 Innovation Showcase
 * ==========================================================================
 */

// Category Cross-Sell Graph (Correlations)
const CATEGORY_CORRELATIONS = {
  "Fashion": ["Accessories", "Beauty"],
  "Electronics": ["Accessories"],
  "Beauty": ["Fashion", "Home & Living"],
  "Home & Living": ["Beauty", "Electronics"],
  "Accessories": ["Fashion", "Electronics"]
};

// Compute Smart Recommendations based on user behavior
function getPersonalizedRecommendations() {
  const products = getProducts();
  const recentViews = JSON.parse(localStorage.getItem('smartshop_recent_views') || '[]');
  const wishlist = getWishlist();
  const wishlistIds = new Set(wishlist.map(w => w.id));

  // Determine top user interests from recent views and wishlist
  const categoryScores = {};
  
  recentViews.forEach((pid, index) => {
    const p = products.find(prod => prod.id === pid);
    if (p) {
      const weight = 10 - index; // Higher weight for more recent views
      categoryScores[p.category] = (categoryScores[p.category] || 0) + weight;
    }
  });

  wishlist.forEach(w => {
    categoryScores[w.category] = (categoryScores[w.category] || 0) + 8;
  });

  // Score each candidate product
  const scoredProducts = products.map(product => {
    let score = product.rating * 2; // base score from rating

    // Category affinity bonus
    if (categoryScores[product.category]) {
      score += categoryScores[product.category] * 1.5;
    }

    // Correlation bonus: check if it matches correlated categories of viewed items
    Object.keys(categoryScores).forEach(viewedCat => {
      const correlated = CATEGORY_CORRELATIONS[viewedCat] || [];
      if (correlated.includes(product.category)) {
        score += 5;
      }
    });

    // Do not recommend items already saved in wishlist as top picks
    if (wishlistIds.has(product.id)) {
      score -= 3;
    }

    return { product, score };
  });

  // Sort descending by score
  scoredProducts.sort((a, b) => b.score - a.score);
  return scoredProducts.map(sp => sp.product);
}

// Render "Because You Viewed..." Section
function renderBecauseYouViewed() {
  const container = document.getElementById('becauseYouViewedGrid');
  const titleEl = document.getElementById('becauseViewedHeaderTitle');
  if (!container) return;

  const products = getProducts();
  const recentViews = JSON.parse(localStorage.getItem('smartshop_recent_views') || '[1]');
  const lastViewedId = recentViews[0] || 1;
  const lastViewedProduct = products.find(p => p.id === lastViewedId) || products[0];

  if (titleEl) {
    titleEl.textContent = `Because You Viewed "${lastViewedProduct.name}"`;
  }

  // Find products in same category or correlated categories
  const correlatedCats = CATEGORY_CORRELATIONS[lastViewedProduct.category] || [];
  const suggestions = products.filter(p => 
    p.id !== lastViewedProduct.id && 
    (p.category === lastViewedProduct.category || correlatedCats.includes(p.category))
  ).slice(0, 4);

  container.innerHTML = suggestions.map(p => renderProductCard(p, true)).join('');
  updateWishlistIcons();
}

// Render "Trending Across India"
function renderTrendingItems() {
  const container = document.getElementById('trendingItemsGrid');
  if (!container) return;

  const products = getProducts();
  // Filter by rating >= 4.7
  const trending = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  container.innerHTML = trending.map(p => renderProductCard(p)).join('');
  updateWishlistIcons();
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('becauseYouViewedGrid')) {
    renderBecauseYouViewed();
  }
  if (document.getElementById('trendingItemsGrid')) {
    renderTrendingItems();
  }
});
