/**
 * ==========================================================================
 * SMARTSHOP – ADMIN DASHBOARD JAVASCRIPT
 * Real-Time KPI Stats, Product Management, Order Processing & Catalog Admin
 * ==========================================================================
 */

function initAdminDashboard() {
  checkAdminAccess();
  loadAdminKPIs();
  loadAdminProductsTable();
  loadAdminOrdersTable();
}

function checkAdminAccess() {
  const user = getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    showToast("Access Restricted", "The Admin Dashboard requires an Administrator account.", "error");
    // Show banner or allow evaluation in demo mode
  }
}

// Load KPI Statistics
function loadAdminKPIs() {
  const users = JSON.parse(localStorage.getItem('smartshop_users') || '[]');
  const products = getProducts();
  const orders = JSON.parse(localStorage.getItem('smartshop_orders') || '[]');
  const hotelBookings = JSON.parse(localStorage.getItem('smartshop_hotel_bookings') || '[]');
  const eventBookings = JSON.parse(localStorage.getItem('smartshop_event_bookings') || '[]');

  const totalUsers = Math.max(users.length, 2);
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalBookings = hotelBookings.length + eventBookings.length;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) +
    hotelBookings.reduce((sum, h) => sum + (h.totalAmount || 0), 0) +
    eventBookings.reduce((sum, e) => sum + (e.totalAmount || 0), 0);

  if (document.getElementById('statTotalUsers')) document.getElementById('statTotalUsers').textContent = totalUsers;
  if (document.getElementById('statTotalProducts')) document.getElementById('statTotalProducts').textContent = totalProducts;
  if (document.getElementById('statTotalOrders')) document.getElementById('statTotalOrders').textContent = totalOrders;
  if (document.getElementById('statTotalBookings')) document.getElementById('statTotalBookings').textContent = totalBookings;
  if (document.getElementById('statTotalRevenue')) document.getElementById('statTotalRevenue').textContent = formatINR(totalRevenue);
}

// ==========================================================================
// PRODUCTS MANAGEMENT
// ==========================================================================
function loadAdminProductsTable() {
  const container = document.getElementById('adminProductsTableBody');
  if (!container) return;

  const products = getProducts();
  container.innerHTML = products.map(p => `
    <tr>
      <td class="text-center" style="width: 60px;">
        <img src="${p.image}" alt="${p.name}" style="width: 42px; height: 42px; object-fit: contain; border-radius: 6px; background: #f8fafc;">
      </td>
      <td>
        <div class="fw-bold text-dark">${p.name}</div>
        <span class="small text-muted">ID: #${p.id}</span>
      </td>
      <td><span class="badge bg-primary-subtle text-primary">${p.category}</span></td>
      <td class="fw-bold text-dark">${formatINR(p.price)}</td>
      <td>
        <span class="badge ${p.stock > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}">
          ${p.stock} units
        </span>
      </td>
      <td><i class="fas fa-star text-warning me-1"></i> ${p.rating}</td>
      <td class="text-end">
        <button class="btn btn-outline-danger btn-sm rounded-pill" onclick="deleteAdminProduct(${p.id})">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function handleAddProduct(e) {
  e.preventDefault();
  const name = document.getElementById('newProdName').value.trim();
  const category = document.getElementById('newProdCategory').value;
  const price = parseFloat(document.getElementById('newProdPrice').value);
  const stock = parseInt(document.getElementById('newProdStock').value);
  const image = document.getElementById('newProdImage').value.trim();
  const description = document.getElementById('newProdDesc').value.trim();

  const products = getProducts();
  const newProduct = {
    id: products.length + 1,
    name,
    category,
    categoryId: category === 'Fashion' ? 1 : category === 'Electronics' ? 2 : category === 'Beauty' ? 3 : category === 'Home & Living' ? 4 : 5,
    price,
    originalPrice: Math.round(price * 1.3),
    discount: "25% OFF",
    rating: 5.0,
    reviewsCount: 1,
    stock,
    description,
    image: image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
  };

  products.unshift(newProduct);
  localStorage.setItem('smartshop_products', JSON.stringify(products));

  showToast("Product Added!", `"${name}" added to retail catalog.`, "success");
  
  loadAdminKPIs();
  loadAdminProductsTable();

  const modalEl = document.getElementById('addProductModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
  e.target.reset();
}

function deleteAdminProduct(productId) {
  if (!confirm("Are you sure you want to delete this product?")) return;
  let products = getProducts();
  products = products.filter(p => p.id !== productId);
  localStorage.setItem('smartshop_products', JSON.stringify(products));
  showToast("Product Deleted", "Product removed from catalog.", "info");
  loadAdminKPIs();
  loadAdminProductsTable();
}

// ==========================================================================
// ORDERS MANAGEMENT
// ==========================================================================
function loadAdminOrdersTable() {
  const container = document.getElementById('adminOrdersTableBody');
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem('smartshop_orders') || '[]');

  if (orders.length === 0) {
    container.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No orders placed yet.</td></tr>`;
    return;
  }

  container.innerHTML = orders.map(order => `
    <tr>
      <td class="fw-bold font-monospace">#${order.id}</td>
      <td>
        <div class="fw-bold text-dark">${order.customerName || 'Aarav Sharma'}</div>
        <div class="small text-muted">${order.customerMobile || '9876543210'}</div>
      </td>
      <td class="fw-bold text-dark">${formatINR(order.totalAmount)}</td>
      <td><span class="badge bg-light text-secondary border">${order.paymentMethod || 'UPI'}</span></td>
      <td>
        <select class="form-select form-select-sm rounded-pill fw-bold border-primary" style="width: 140px;" onchange="updateOrderStatus(${order.id}, this.value)">
          <option value="Confirmed" ${order.orderStatus === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="Packed" ${order.orderStatus === 'Packed' ? 'selected' : ''}>Packed</option>
          <option value="Shipped" ${order.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Delivered" ${order.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
        </select>
      </td>
      <td class="small text-muted">${order.orderDate}</td>
    </tr>
  `).join('');
}

function updateOrderStatus(orderId, newStatus) {
  const orders = JSON.parse(localStorage.getItem('smartshop_orders') || '[]');
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.orderStatus = newStatus;
    localStorage.setItem('smartshop_orders', JSON.stringify(orders));
    showToast("Status Updated!", `Order #${orderId} status set to "${newStatus}".`, "success");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('statTotalUsers')) {
    initAdminDashboard();
  }
});
