/**
 * ==========================================================================
 * SMARTSHOP – CART JAVASCRIPT
 * Dynamic Cart Totals, Coupon Codes, Delivery Fees & Order Preparation
 * ==========================================================================
 */

let appliedDiscount = 0;
let appliedCouponCode = '';

function loadCartPage() {
  const container = document.getElementById('cartItemsList');
  const countBadge = document.getElementById('cartHeaderCount');
  if (!container) return;

  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (countBadge) {
    countBadge.textContent = `${totalItems} Item(s) in Bag`;
  }

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5">
        <div class="mx-auto mb-3" style="width: 80px; height: 80px; border-radius: 50%; background: #eef2ff; color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 2.2rem;">
          <i class="fas fa-shopping-bag"></i>
        </div>
        <h4 class="fw-bold text-dark">Your Shopping Bag is Empty</h4>
        <p class="text-muted">Looks like you haven't added anything to your cart yet.</p>
        <a href="products.html" class="btn btn-smart-primary rounded-pill px-4 mt-2">
          <i class="fas fa-bag-shopping me-2"></i> Start Shopping
        </a>
      </div>
    `;
    const summaryCard = document.getElementById('cartSummaryCard');
    if (summaryCard) summaryCard.style.display = 'none';
    return;
  }

  const summaryCard = document.getElementById('cartSummaryCard');
  if (summaryCard) summaryCard.style.display = 'block';

  container.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    return `
      <div class="card border rounded-4 mb-3 p-3 shadow-sm bg-white">
        <div class="row align-items-center g-3">
          <div class="col-3 col-sm-2 text-center bg-light rounded-3 p-2">
            <img src="${item.image}" alt="${item.name}" style="max-height: 70px; object-fit: contain;">
          </div>
          <div class="col-9 col-sm-4">
            <span class="badge bg-primary-subtle text-primary mb-1 small">${item.category}</span>
            <h6 class="fw-bold text-dark mb-1">
              <a href="product-details.html?id=${item.id}" class="text-dark">${item.name}</a>
            </h6>
            <div class="text-muted small">Unit Price: ${formatINR(item.price)}</div>
          </div>
          <div class="col-6 col-sm-3 d-flex align-items-center">
            <div class="qty-counter-box">
              <button type="button" onclick="updateCartItemQuantity(${item.id}, -1)">-</button>
              <input type="text" value="${item.quantity}" readonly>
              <button type="button" onclick="updateCartItemQuantity(${item.id}, 1)">+</button>
            </div>
          </div>
          <div class="col-6 col-sm-3 text-end">
            <div class="fw-bold text-dark fs-6 mb-1">${formatINR(itemTotal)}</div>
            <button class="btn btn-link btn-sm text-danger p-0 text-decoration-none" onclick="removeCartItem(${item.id})">
              <i class="fas fa-trash-alt me-1"></i> Remove
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  calculateCartTotals();
}

function updateCartItemQuantity(productId, delta) {
  let cart = getCart();
  const itemIndex = cart.findIndex(i => i.id === productId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    saveCart(cart);
    loadCartPage();
  }
}

function removeCartItem(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  showToast("Item Removed", "Product removed from your shopping bag.", "info");
  loadCartPage();
}

function calculateCartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Delivery rule: Free delivery above 999
  const delivery = subtotal > 999 || subtotal === 0 ? 0 : 99;
  
  let finalTotal = subtotal + delivery - appliedDiscount;
  if (finalTotal < 0) finalTotal = 0;

  const subtotalEl = document.getElementById('cartSubtotalAmount');
  if (subtotalEl) subtotalEl.textContent = formatINR(subtotal);

  const deliveryEl = document.getElementById('cartDeliveryAmount');
  if (deliveryEl) {
    deliveryEl.textContent = delivery === 0 ? 'FREE' : formatINR(delivery);
    deliveryEl.className = delivery === 0 ? 'text-success fw-bold' : 'fw-bold text-dark';
  }

  const discountRow = document.getElementById('cartDiscountRow');
  const discountEl = document.getElementById('cartDiscountAmount');
  if (discountRow && discountEl) {
    if (appliedDiscount > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `- ${formatINR(appliedDiscount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  const finalTotalEl = document.getElementById('cartFinalTotalAmount');
  if (finalTotalEl) finalTotalEl.textContent = formatINR(finalTotal);

  const rewardEarnedEl = document.getElementById('cartRewardEarnedBadge');
  if (rewardEarnedEl) {
    const pts = Math.floor(finalTotal / 10);
    rewardEarnedEl.textContent = `+${pts} Smart Points`;
  }
}

function applyCouponCode() {
  const input = document.getElementById('couponInput');
  const code = input ? input.value.trim().toUpperCase() : '';
  const messageEl = document.getElementById('couponFeedbackMsg');

  if (!code) {
    if (messageEl) {
      messageEl.textContent = 'Please enter a coupon code.';
      messageEl.className = 'small text-danger mt-1';
    }
    return;
  }

  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (code === 'SMART200') {
    if (subtotal < 999) {
      if (messageEl) {
        messageEl.textContent = 'SMART200 requires minimum order value of ₹999.';
        messageEl.className = 'small text-danger mt-1';
      }
      return;
    }
    appliedDiscount = 200;
    appliedCouponCode = 'SMART200';
    if (messageEl) {
      messageEl.textContent = 'Coupon SMART200 applied: ₹200 discount saved!';
      messageEl.className = 'small text-success mt-1';
    }
    showToast("Coupon Applied!", "You saved ₹200 on this order.", "success");
  } else if (code === 'FESTIVE10') {
    appliedDiscount = Math.round(subtotal * 0.10);
    appliedCouponCode = 'FESTIVE10';
    if (messageEl) {
      messageEl.textContent = `Coupon FESTIVE10 applied: 10% (₹${appliedDiscount}) discount!`;
      messageEl.className = 'small text-success mt-1';
    }
    showToast("Coupon Applied!", `You saved 10% (${formatINR(appliedDiscount)}) on this order.`, "success");
  } else {
    if (messageEl) {
      messageEl.textContent = 'Invalid coupon code. Try SMART200 or FESTIVE10.';
      messageEl.className = 'small text-danger mt-1';
    }
    return;
  }

  calculateCartTotals();
}

function proceedToCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast("Empty Bag", "Add items to your cart before checking out.", "error");
    return;
  }

  // Save current order metadata
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = subtotal > 999 ? 0 : 99;
  let finalTotal = subtotal + delivery - appliedDiscount;
  if (finalTotal < 0) finalTotal = 0;

  const checkoutData = {
    items: cart,
    subtotal: subtotal,
    delivery: delivery,
    discount: appliedDiscount,
    couponCode: appliedCouponCode,
    total: finalTotal
  };
  localStorage.setItem('smartshop_checkout_data', JSON.stringify(checkoutData));

  window.location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cartItemsList')) {
    loadCartPage();
  }
});
