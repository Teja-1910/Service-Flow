/**
 * ==========================================================================
 * SMARTSHOP – CHECKOUT & ORDER TRACKING JAVASCRIPT
 * Demo Payment Processor (UPI, Card, Net Banking, Wallet) & Tracking Stepper
 * ==========================================================================
 */

let selectedPaymentMethod = 'UPI';

function initCheckoutPage() {
  const user = getCurrentUser();
  const checkoutDataRaw = localStorage.getItem('smartshop_checkout_data');
  const cart = getCart();

  // If no checkout data, construct from cart
  let checkoutData;
  if (checkoutDataRaw) {
    checkoutData = JSON.parse(checkoutDataRaw);
  } else if (cart.length > 0) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal > 999 ? 0 : 99;
    checkoutData = {
      items: cart,
      subtotal: subtotal,
      delivery: delivery,
      discount: 0,
      total: subtotal + delivery
    };
  } else {
    showToast("No Items", "Your bag is empty. Please add items to checkout.", "info");
    setTimeout(() => window.location.href = 'products.html', 1000);
    return;
  }

  // Populate address if user exists
  if (user) {
    if (document.getElementById('checkoutName')) document.getElementById('checkoutName').value = user.name || '';
    if (document.getElementById('checkoutMobile')) document.getElementById('checkoutMobile').value = user.mobile || '';
    if (document.getElementById('checkoutEmail')) document.getElementById('checkoutEmail').value = user.email || '';
    if (user.address && document.getElementById('checkoutAddress')) {
      document.getElementById('checkoutAddress').value = user.address;
    }
  }

  // Update wallet display in payment options
  const walletBal = parseFloat(localStorage.getItem('smartshop_wallet_balance') || '5000');
  const walletLabel = document.getElementById('checkoutWalletBalanceText');
  if (walletLabel) {
    walletLabel.textContent = `Available Balance: ${formatINR(walletBal)}`;
  }

  // Render Order Items Summary
  const itemsContainer = document.getElementById('checkoutItemsList');
  if (itemsContainer) {
    itemsContainer.innerHTML = checkoutData.items.map(i => `
      <div class="d-flex align-items-center justify-content-between mb-2 small pb-2 border-bottom">
        <div class="d-flex align-items-center gap-2">
          <img src="${i.image}" alt="${i.name}" style="width: 42px; height: 42px; object-fit: contain; border-radius: 6px; background: #f8fafc;">
          <div>
            <div class="fw-bold text-dark text-truncate" style="max-width: 170px;">${i.name}</div>
            <div class="text-muted">Qty: ${i.quantity} × ${formatINR(i.price)}</div>
          </div>
        </div>
        <div class="fw-bold text-dark">${formatINR(i.price * i.quantity)}</div>
      </div>
    `).join('');
  }

  // Render totals
  if (document.getElementById('checkoutSubtotal')) {
    document.getElementById('checkoutSubtotal').textContent = formatINR(checkoutData.subtotal);
  }
  if (document.getElementById('checkoutDelivery')) {
    document.getElementById('checkoutDelivery').textContent = checkoutData.delivery === 0 ? 'FREE' : formatINR(checkoutData.delivery);
  }
  if (document.getElementById('checkoutDiscount')) {
    if (checkoutData.discount > 0) {
      document.getElementById('checkoutDiscountRow').style.display = 'flex';
      document.getElementById('checkoutDiscount').textContent = `- ${formatINR(checkoutData.discount)}`;
    }
  }
  if (document.getElementById('checkoutTotal')) {
    document.getElementById('checkoutTotal').textContent = formatINR(checkoutData.total);
  }
  if (document.getElementById('checkoutButtonTotal')) {
    document.getElementById('checkoutButtonTotal').textContent = formatINR(checkoutData.total);
  }
}

// Select Payment Tab
function selectPaymentMethod(method) {
  selectedPaymentMethod = method;
  document.querySelectorAll('.payment-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-method') === method);
  });
  document.querySelectorAll('.payment-tab-pane').forEach(pane => {
    pane.classList.toggle('d-none', pane.getAttribute('data-method') !== method);
  });
}

// Process Demo Payment
async function processDemoPayment(e) {
  e.preventDefault();

  const name = document.getElementById('checkoutName').value.trim();
  const mobile = document.getElementById('checkoutMobile').value.trim();
  const address = document.getElementById('checkoutAddress').value.trim();
  const city = document.getElementById('checkoutCity').value.trim();
  const state = document.getElementById('checkoutState').value.trim();
  const pincode = document.getElementById('checkoutPincode').value.trim();

  if (!name || !mobile || !address || !city || !state || !pincode) {
    showToast("Missing Information", "Please fill in all delivery address details.", "error");
    return;
  }

  const fullAddress = `${address}, ${city}, ${state} - ${pincode}`;

  const checkoutData = JSON.parse(localStorage.getItem('smartshop_checkout_data') || '{}');
  const cart = getCart();
  const items = checkoutData.items || cart;
  const total = checkoutData.total || items.reduce((s, i) => s + (i.price * i.quantity), 0);

  // If Wallet payment chosen, check balance
  let walletBal = parseFloat(localStorage.getItem('smartshop_wallet_balance') || '5000');
  if (selectedPaymentMethod === 'Wallet') {
    if (walletBal < total) {
      showToast("Insufficient Balance", "Your Smart Wallet balance is insufficient. Top up or select another method.", "error");
      return;
    }
    walletBal -= total;
    localStorage.setItem('smartshop_wallet_balance', walletBal.toString());
  }

  // Show processing loader modal
  const modalEl = document.getElementById('paymentProcessingModal');
  let modalInstance;
  if (modalEl) {
    modalInstance = new bootstrap.Modal(modalEl, { backdrop: 'static', keyboard: false });
    modalInstance.show();
  }

  // Call backend API if available
  const user = getCurrentUser();
  const userId = user ? user.id : 1;

  try {
    await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId,
        totalAmount: total,
        deliveryAddress: fullAddress
      })
    });
  } catch (err) {
    console.log('Backend API offline, persisting order locally:', err.message);
  }

  // Simulate payment gateway delay (1.2 seconds)
  setTimeout(() => {
    if (modalInstance) modalInstance.hide();

    // Create persistent order
    const orders = JSON.parse(localStorage.getItem('smartshop_orders') || '[]');
    const newOrderId = 1000 + orders.length + 1;
    const pointsEarned = Math.floor(total / 10);

    const newOrder = {
      id: newOrderId,
      userId: userId,
      items: items,
      totalAmount: total,
      deliveryAddress: fullAddress,
      customerName: name,
      customerMobile: mobile,
      orderStatus: "Confirmed",
      paymentStatus: "Paid",
      paymentMethod: selectedPaymentMethod,
      orderDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      pointsEarned: pointsEarned
    };

    orders.unshift(newOrder);
    localStorage.setItem('smartshop_orders', JSON.stringify(orders));

    // Award reward points
    let points = parseInt(localStorage.getItem('smartshop_rewards_points') || '1250');
    points += pointsEarned;
    localStorage.setItem('smartshop_rewards_points', points.toString());

    // Record demo transaction
    const transactions = JSON.parse(localStorage.getItem('smartshop_transactions') || '[]');
    transactions.unshift({
      id: "TXN_" + Math.random().toString(36).substring(2, 9).toUpperCase(),
      date: new Date().toLocaleDateString('en-IN'),
      type: "Shopping Order",
      amount: total,
      status: "Success"
    });
    localStorage.setItem('smartshop_transactions', JSON.stringify(transactions));

    // Clear cart and checkout cache
    localStorage.setItem('smartshop_cart', JSON.stringify([]));
    localStorage.removeItem('smartshop_checkout_data');
    updateBadges();

    showToast("Order Placed!", `Order #${newOrderId} confirmed! +${pointsEarned} Points earned.`, "success");

    setTimeout(() => {
      window.location.href = `orders.html?id=${newOrderId}`;
    }, 1000);

  }, 1200);
}

// ==========================================================================
// ORDER TRACKING PAGE LOGIC
// ==========================================================================
function loadOrdersPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const requestedId = parseInt(urlParams.get('id'));
  const orders = JSON.parse(localStorage.getItem('smartshop_orders') || '[]');

  const trackerCard = document.getElementById('activeOrderTrackerCard');
  const allOrdersContainer = document.getElementById('allOrdersList');

  if (orders.length === 0) {
    if (trackerCard) trackerCard.style.display = 'none';
    if (allOrdersContainer) {
      allOrdersContainer.innerHTML = `
        <div class="text-center py-5">
          <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
          <h4 class="fw-bold text-dark">No Orders Found</h4>
          <p class="text-muted">You haven't placed any retail orders yet.</p>
          <a href="products.html" class="btn btn-smart-primary rounded-pill px-4">Start Shopping</a>
        </div>
      `;
    }
    return;
  }

  // Active tracked order (either requested in URL or most recent)
  const activeOrder = requestedId 
    ? orders.find(o => o.id === requestedId) || orders[0]
    : orders[0];

  renderOrderTracker(activeOrder);

  // Render list of all past orders
  if (allOrdersContainer) {
    allOrdersContainer.innerHTML = orders.map(order => `
      <div class="card border rounded-4 p-3 mb-3 shadow-sm bg-white ${order.id === activeOrder.id ? 'border-primary' : ''}">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-2 pb-2 border-bottom">
          <div>
            <span class="fw-bold text-dark me-2">Order #${order.id}</span>
            <span class="text-muted small">${order.orderDate}</span>
          </div>
          <div>
            <span class="badge ${order.orderStatus === 'Delivered' ? 'bg-success' : 'bg-primary'} px-3 py-1 rounded-pill">
              ${order.orderStatus}
            </span>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <div class="small text-muted">${order.items ? order.items.length : 1} item(s) • Paid via <strong>${order.paymentMethod}</strong></div>
            <div class="fw-bold text-dark fs-6 mt-1">Total: ${formatINR(order.totalAmount)}</div>
          </div>
          <a href="orders.html?id=${order.id}" class="btn btn-outline-primary btn-sm rounded-pill px-3">
            Track This Order
          </a>
        </div>
      </div>
    `).join('');
  }
}

function renderOrderTracker(order) {
  const container = document.getElementById('activeOrderTrackerCard');
  if (!container) return;

  container.style.display = 'block';

  // Determine active step based on orderStatus
  let currentStep = 2; // Default Confirmed
  if (order.orderStatus === 'Placed') currentStep = 1;
  if (order.orderStatus === 'Packed') currentStep = 3;
  if (order.orderStatus === 'Shipped') currentStep = 4;
  if (order.orderStatus === 'Delivered') currentStep = 5;

  container.innerHTML = `
    <div class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-5">
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-2">
        <div>
          <span class="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-bold mb-1">
            <i class="fas fa-check-circle me-1"></i> ${order.paymentStatus} via ${order.paymentMethod}
          </span>
          <h3 class="fw-bold text-dark mb-0">Order #${order.id}</h3>
          <span class="text-muted small">Placed on ${order.orderDate}</span>
        </div>
        <div class="text-end">
          <div class="text-muted small">Order Total</div>
          <h3 class="fw-bold text-primary mb-0">${formatINR(order.totalAmount)}</h3>
          <span class="badge bg-warning text-dark mt-1">+${order.pointsEarned || Math.floor(order.totalAmount / 10)} Smart Points Earned</span>
        </div>
      </div>

      <!-- Live Order Stepper -->
      <div class="py-4">
        <h6 class="fw-bold text-dark mb-4 text-center">Live Delivery Status</h6>
        <div class="stepper-wrapper">
          <div class="stepper-item ${currentStep >= 1 ? 'completed' : ''}">
            <div class="step-counter"><i class="fas fa-receipt"></i></div>
            <div class="step-name">Placed</div>
          </div>
          <div class="stepper-item ${currentStep >= 2 ? 'completed' : ''}">
            <div class="step-counter"><i class="fas fa-check"></i></div>
            <div class="step-name">Confirmed</div>
          </div>
          <div class="stepper-item ${currentStep >= 3 ? 'completed' : ''}">
            <div class="step-counter"><i class="fas fa-box"></i></div>
            <div class="step-name">Packed</div>
          </div>
          <div class="stepper-item ${currentStep >= 4 ? 'completed' : ''}">
            <div class="step-counter"><i class="fas fa-truck-fast"></i></div>
            <div class="step-name">Shipped</div>
          </div>
          <div class="stepper-item ${currentStep >= 5 ? 'completed' : ''}">
            <div class="step-counter"><i class="fas fa-house-chimney"></i></div>
            <div class="step-name">Delivered</div>
          </div>
        </div>
      </div>

      <!-- Order Details Grid -->
      <div class="row g-4 mt-2">
        <div class="col-12 col-md-6">
          <div class="p-3 bg-light rounded-3 border h-100">
            <h6 class="fw-bold text-dark mb-2"><i class="fas fa-location-dot text-danger me-2"></i> Shipping Address</h6>
            <div class="fw-bold text-dark">${order.customerName || 'Customer'}</div>
            <div class="text-muted small mb-2">${order.customerMobile || ''}</div>
            <div class="text-muted small">${order.deliveryAddress}</div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="p-3 bg-light rounded-3 border h-100">
            <h6 class="fw-bold text-dark mb-2"><i class="fas fa-box-archive text-primary me-2"></i> Purchased Items (${order.items ? order.items.length : 0})</h6>
            <div style="max-height: 140px; overflow-y: auto;">
              ${order.items ? order.items.map(i => `
                <div class="d-flex justify-content-between small text-muted mb-1">
                  <span class="text-truncate" style="max-width: 220px;">${i.name} (×${i.quantity})</span>
                  <span class="fw-bold text-dark">${formatINR(i.price * i.quantity)}</span>
                </div>
              `).join('') : ''}
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('checkoutItemsList')) {
    initCheckoutPage();
  }
  if (document.getElementById('activeOrderTrackerCard')) {
    loadOrdersPage();
  }
});
