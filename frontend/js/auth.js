/**
 * ==========================================================================
 * SMARTSHOP – AUTHENTICATION & PROFILE JAVASCRIPT
 * Handles Login, Registration, BCrypt-style Hashing, Profile & Sessions
 * ==========================================================================
 */

// Simple hashing simulator for browser-side storage (backend uses BCrypt)
function pseudoHashPassword(pwd) {
  let hash = 0;
  for (let i = 0; i < pwd.length; i++) {
    const char = pwd.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return 'bcr_sec_' + Math.abs(hash).toString(16);
}

// Seed default users if not present
function initDefaultUsers() {
  const users = JSON.parse(localStorage.getItem('smartshop_users') || '[]');
  if (users.length === 0) {
    const defaultUsers = [
      {
        id: 1,
        name: "Aarav Sharma",
        email: "customer@smartshop.com",
        mobile: "9876543210",
        passwordHash: pseudoHashPassword("password123"),
        role: "CUSTOMER",
        address: "Flat 402, Lotus Greens, Sector 45, Bengaluru, Karnataka - 560102",
        joinedDate: "2026-01-15"
      },
      {
        id: 2,
        name: "Sneha Reddy (Admin)",
        email: "admin@smartshop.com",
        mobile: "9988776655",
        passwordHash: pseudoHashPassword("admin123"),
        role: "ADMIN",
        address: "Innovation Hub, Tech Park, Hyderabad, Telangana - 500081",
        joinedDate: "2026-01-01"
      }
    ];
    localStorage.setItem('smartshop_users', JSON.stringify(defaultUsers));
  }
}

// Register user
async function registerUser(name, email, mobile, password) {
  initDefaultUsers();
  const users = JSON.parse(localStorage.getItem('smartshop_users') || '[]');

  // Check duplicate email
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    throw new Error("An account with this email address already exists.");
  }

  // Check mobile length
  if (!/^\d{10}$/.test(mobile)) {
    throw new Error("Please enter a valid 10-digit Indian mobile number.");
  }

  // Attempt backend API call if server is up
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, mobile, password, role: 'CUSTOMER' })
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Registered via Spring Boot API:', data);
    }
  } catch (err) {
    console.log('Backend API offline, continuing with local persistent storage:', err.message);
  }

  const newUser = {
    id: users.length + 1,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    mobile: mobile.trim(),
    passwordHash: pseudoHashPassword(password),
    role: "CUSTOMER",
    address: "",
    joinedDate: new Date().toISOString().split('T')[0]
  };

  users.push(newUser);
  localStorage.setItem('smartshop_users', JSON.stringify(users));

  // Automatically log user in
  localStorage.setItem('smartshop_current_user', JSON.stringify(newUser));
  localStorage.setItem('smartshop_jwt_token', 'demo_jwt_token_' + Date.now());

  // Welcome bonus: 500 points
  let currentPoints = parseInt(localStorage.getItem('smartshop_rewards_points') || '1250');
  currentPoints += 500;
  localStorage.setItem('smartshop_rewards_points', currentPoints.toString());

  return newUser;
}

// Login user
async function loginUser(email, password) {
  initDefaultUsers();
  const users = JSON.parse(localStorage.getItem('smartshop_users') || '[]');

  // Attempt backend API login if available
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('smartshop_jwt_token', data.token);
      }
    }
  } catch (err) {
    console.log('Backend API offline, continuing with local persistent verification:', err.message);
  }

  const enteredHash = pseudoHashPassword(password);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.passwordHash !== enteredHash) {
    throw new Error("Invalid email or password. Please check your credentials.");
  }

  localStorage.setItem('smartshop_current_user', JSON.stringify(user));
  if (!localStorage.getItem('smartshop_jwt_token')) {
    localStorage.setItem('smartshop_jwt_token', 'demo_jwt_token_' + Date.now());
  }

  return user;
}

// Quick demo login helper
function quickDemoLogin(type) {
  initDefaultUsers();
  const email = type === 'admin' ? 'admin@smartshop.com' : 'customer@smartshop.com';
  const pwd = type === 'admin' ? 'admin123' : 'password123';
  
  const emailInput = document.getElementById('loginEmail');
  const pwdInput = document.getElementById('loginPassword');
  if (emailInput && pwdInput) {
    emailInput.value = email;
    pwdInput.value = pwd;
  }

  loginUser(email, pwd)
    .then(user => {
      showToast("Demo Login Successful!", `Welcome, ${user.name} (${user.role})`, "success");
      setTimeout(() => {
        window.location.href = user.role === 'ADMIN' ? 'admin.html' : 'index.html';
      }, 1000);
    })
    .catch(err => {
      showToast("Login Failed", err.message, "error");
    });
}

// Initialize Auth forms on page load
document.addEventListener('DOMContentLoaded', () => {
  initDefaultUsers();

  // Handle Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const errorAlert = document.getElementById('loginAlert');

      try {
        if (errorAlert) errorAlert.classList.add('d-none');
        const user = await loginUser(email, password);
        showToast("Login Successful!", `Welcome back, ${user.name}!`, "success");
        setTimeout(() => {
          window.location.href = user.role === 'ADMIN' ? 'admin.html' : 'index.html';
        }, 800);
      } catch (err) {
        if (errorAlert) {
          errorAlert.textContent = err.message;
          errorAlert.classList.remove('d-none');
        }
        showToast("Login Error", err.message, "error");
      }
    });
  }

  // Handle Register Form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const mobile = document.getElementById('regMobile').value.trim();
      const password = document.getElementById('regPassword').value;
      const confirmPassword = document.getElementById('regConfirmPassword').value;
      const errorAlert = document.getElementById('registerAlert');

      if (password !== confirmPassword) {
        if (errorAlert) {
          errorAlert.textContent = "Passwords do not match!";
          errorAlert.classList.remove('d-none');
        }
        return;
      }

      if (password.length < 6) {
        if (errorAlert) {
          errorAlert.textContent = "Password must be at least 6 characters long.";
          errorAlert.classList.remove('d-none');
        }
        return;
      }

      try {
        if (errorAlert) errorAlert.classList.add('d-none');
        const user = await registerUser(name, email, mobile, password);
        showToast("Account Created!", "Welcome to SmartShop! +500 Reward Points added!", "success");
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1200);
      } catch (err) {
        if (errorAlert) {
          errorAlert.textContent = err.message;
          errorAlert.classList.remove('d-none');
        }
        showToast("Registration Error", err.message, "error");
      }
    });
  }

  // Handle Profile Page details
  if (document.getElementById('profileUserName')) {
    loadUserProfile();
  }
});

// Load User Profile Data
function loadUserProfile() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('profileUserName').textContent = user.name;
  document.getElementById('profileUserEmail').textContent = user.email;
  document.getElementById('profileUserMobile').textContent = user.mobile || 'Not provided';
  document.getElementById('profileUserRole').textContent = user.role || 'Member';
  
  if (document.getElementById('profileAvatarLetter')) {
    document.getElementById('profileAvatarLetter').textContent = user.name.charAt(0).toUpperCase();
  }

  if (document.getElementById('inputProfileName')) {
    document.getElementById('inputProfileName').value = user.name;
    document.getElementById('inputProfileEmail').value = user.email;
    document.getElementById('inputProfileMobile').value = user.mobile || '';
    document.getElementById('inputProfileAddress').value = user.address || '';
  }

  // Load wallet & rewards counters in profile
  const wallet = localStorage.getItem('smartshop_wallet_balance') || '5000';
  const rewards = localStorage.getItem('smartshop_rewards_points') || '1250';
  if (document.getElementById('profileWalletBalance')) {
    document.getElementById('profileWalletBalance').textContent = formatINR(parseFloat(wallet));
  }
  if (document.getElementById('profileRewardPoints')) {
    document.getElementById('profileRewardPoints').textContent = `${rewards} Pts`;
  }

  loadProfileOrders();
  loadProfileBookings();
}

// Update User Profile Handler
function saveProfileChanges(e) {
  if (e) e.preventDefault();
  const user = getCurrentUser();
  if (!user) return;

  const name = document.getElementById('inputProfileName').value.trim();
  const mobile = document.getElementById('inputProfileMobile').value.trim();
  const address = document.getElementById('inputProfileAddress').value.trim();

  user.name = name;
  user.mobile = mobile;
  user.address = address;

  localStorage.setItem('smartshop_current_user', JSON.stringify(user));

  // Also update in all users array
  const users = JSON.parse(localStorage.getItem('smartshop_users') || '[]');
  const idx = users.findIndex(u => u.id === user.id);
  if (idx > -1) {
    users[idx].name = name;
    users[idx].mobile = mobile;
    users[idx].address = address;
    localStorage.setItem('smartshop_users', JSON.stringify(users));
  }

  showToast("Profile Updated!", "Your contact and address details were saved.", "success");
  loadUserProfile();
}

// Load Orders in Profile
function loadProfileOrders() {
  const container = document.getElementById('profileOrdersList');
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem('smartshop_orders') || '[]');
  if (orders.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5 text-muted">
        <i class="fas fa-box-open fa-3x mb-3 text-light"></i>
        <h6>No orders placed yet</h6>
        <p class="small">Explore our smart retail catalog to place your first order.</p>
        <a href="products.html" class="btn btn-sm btn-primary rounded-pill px-3">Start Shopping</a>
      </div>
    `;
    return;
  }

  container.innerHTML = orders.map(order => `
    <div class="card border rounded-3 mb-3 shadow-sm">
      <div class="card-body">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-2 pb-2 border-bottom">
          <div>
            <span class="fw-bold text-dark me-2">Order #${order.id}</span>
            <span class="text-muted small">${order.orderDate || 'Today'}</span>
          </div>
          <div>
            <span class="badge ${order.orderStatus === 'Delivered' ? 'bg-success' : 'bg-primary'} px-3 py-1 rounded-pill">
              ${order.orderStatus || 'Confirmed'}
            </span>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <div class="small text-muted">${order.items ? order.items.length : 1} item(s) • Payment: <strong class="text-success">${order.paymentMethod || 'UPI'}</strong></div>
            <div class="fw-bold text-dark mt-1">Total: ${formatINR(order.totalAmount)}</div>
          </div>
          <a href="orders.html?id=${order.id}" class="btn btn-outline-primary btn-sm rounded-pill px-3">
            Track Order <i class="fas fa-arrow-right ms-1"></i>
          </a>
        </div>
      </div>
    </div>
  `).join('');
}

// Load Bookings in Profile (Hotels & Movies)
function loadProfileBookings() {
  const container = document.getElementById('profileBookingsList');
  if (!container) return;

  const hotelBookings = JSON.parse(localStorage.getItem('smartshop_hotel_bookings') || '[]');
  const eventBookings = JSON.parse(localStorage.getItem('smartshop_event_bookings') || '[]');

  if (hotelBookings.length === 0 && eventBookings.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5 text-muted">
        <i class="fas fa-calendar-check fa-3x mb-3 text-light"></i>
        <h6>No bookings found</h6>
        <p class="small">Reserve luxury stays or entertainment tickets to see them here.</p>
        <div class="d-flex gap-2 justify-content-center">
          <a href="hotels.html" class="btn btn-sm btn-outline-primary rounded-pill px-3">Book Hotel</a>
          <a href="entertainment.html" class="btn btn-sm btn-outline-danger rounded-pill px-3">Book Movie</a>
        </div>
      </div>
    `;
    return;
  }

  let html = '';
  hotelBookings.forEach(hb => {
    html += `
      <div class="card border rounded-3 mb-3 shadow-sm">
        <div class="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <span class="badge bg-warning text-dark mb-1"><i class="fas fa-hotel me-1"></i> Hotel Booking</span>
            <h6 class="mb-1 fw-bold">${hb.hotelName}</h6>
            <div class="small text-muted">Check-in: ${hb.checkIn} • Guests: ${hb.guests} • Room: ${hb.roomType}</div>
            <div class="fw-bold text-dark mt-1">Total: ${formatINR(hb.totalAmount)}</div>
          </div>
          <span class="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-bold">Confirmed</span>
        </div>
      </div>
    `;
  });

  eventBookings.forEach(eb => {
    html += `
      <div class="card border rounded-3 mb-3 shadow-sm">
        <div class="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <span class="badge bg-danger mb-1"><i class="fas fa-ticket me-1"></i> ${eb.type || 'Event / Movie'}</span>
            <h6 class="mb-1 fw-bold">${eb.title}</h6>
            <div class="small text-muted">Date: ${eb.date || 'Today'} • Tickets: ${eb.quantity} • Venue: ${eb.venue || 'Cinema Screen 2'}</div>
            <div class="fw-bold text-dark mt-1">Total: ${formatINR(eb.totalAmount)}</div>
          </div>
          <span class="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-bold">Confirmed</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}
