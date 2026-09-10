# SmartShop – Smart Shopping for a Better Tomorrow

> **AICTE Smart India Hackathon 2026 Prototype**  
> **Theme / Problem Statement:** *“Student Innovation-Technology ideas in tertiary sectors like Hospitality, Financial Services, Entertainment and Retail.”*

---

## 🌟 Executive Summary

**SmartShop** is a unified tertiary-sector smart marketplace. Rather than forcing modern consumers to switch between fragmented single-purpose applications, SmartShop integrates:

1. 🛍️ **Smart Retail**: 20+ curated products across Fashion, Electronics, Beauty, Home & Living, and Accessories with real-time stock and AI matching.
2. 🏨 **Hospitality**: Luxury resorts, boutique havelis, and dining packages with seamless reservation flows.
3. 🎬 **Entertainment**: Blockbuster movie premieres, electronic music festivals, and tech hackathons with instant digital QR e-tickets.
4. 💳 **Financial Services**: Built-in demo digital wallet (with 1-click checkout) and an interactive monthly EMI calculator with visual amortization ratio.
5. ✨ **Smart Recommendations**: Rule-based affinity scoring engine correlating purchases and viewed items (e.g. Athletic Shoes &rarr; Sports Tech & Gym Accessories; Vacation Bookings &rarr; Travel Gear).
6. 🎁 **Cross-Sector Loyalty (Smart Points)**: Earn points when shopping for retail items and redeem them directly to discount luxury stays or cinema tickets!

---

## 📂 Project Structure

```text
SmartShop/
│
├── frontend/                       # Modern, responsive client application
│   ├── index.html                  # Homepage with Hero, 4 Pillars, Offers & Showcase
│   ├── login.html                  # User login with one-click demo credentials
│   ├── register.html               # Registration with 500 bonus points
│   ├── profile.html                # User profile (orders, bookings, address, wallet)
│   ├── products.html               # Retail catalog (search, price & rating filters, sort)
│   ├── product-details.html        # Product page (large image, quantity, reviews, related)
│   ├── wishlist.html               # Saved items with 1-click Move to Cart
│   ├── cart.html                   # Shopping bag with live subtotal, coupons & rewards
│   ├── checkout.html               # Delivery address & demo payment gateway (UPI/Card/Wallet)
│   ├── orders.html                 # Live 5-step order tracking progress bar
│   ├── hotels.html                 # Hospitality catalog with amenities & booking modal
│   ├── hotel-details.html          # In-depth hotel views & room selections
│   ├── entertainment.html          # Movies & events with live seat/ticket booking
│   ├── finance.html                # Demo Smart Wallet & interactive product EMI calculator
│   ├── rewards.html                # Loyalty point reservoir & voucher redemption store
│   ├── admin.html                  # Management console (KPI stats, product CRUD, orders)
│   ├── about.html                  # SIH 2026 narrative: Problem, Solution, Innovation
│   │
│   ├── css/
│   │   └── style.css               # Modern palette, glassmorphism, rounded cards
│   │
│   └── js/
│       ├── main.js                 # State, storage seed, cart/wishlist badges, toasts
│       ├── auth.js                 # BCrypt simulation, sessions, profile management
│       ├── products.js             # Filtering, live search, sorting, product details
│       ├── cart.js                 # Subtotal calculations, coupons (SMART200, FESTIVE10)
│       ├── checkout.js             # Address validation, payment simulation, orders
│       ├── bookings.js             # Hotel stays & entertainment ticket reservations
│       ├── finance.js              # Wallet top-ups, transactions & EMI math formula
│       ├── recommendations.js      # Category correlations & personalized suggestions
│       └── admin.js                # KPI counters, product CRUD & order status updates
│
├── backend/                        # Production-grade Java Spring Boot application
│   ├── pom.xml                     # Maven configuration (Web, JPA, Security, MySQL, H2)
│   └── src/
│       └── main/
│           ├── java/com/smartshop/
│           │   ├── SmartShopApplication.java
│           │   ├── config/         # CorsConfig & SecurityConfig (BCrypt)
│           │   ├── controller/     # 15 REST Controllers (Auth, Product, Cart, etc.)
│           │   ├── model/          # 17 JPA Entities matching MySQL schema
│           │   └── repository/     # 17 Spring Data JPA Repositories
│           └── resources/
│               └── application.properties # MySQL & dev fallback datasource config
│
└── database/
    └── smartshop.sql               # Complete MySQL schema (17 tables) & rich sample data
```

---

## 🚀 How to Run & Test

### Option 1: Instant Frontend Demo (Zero-Install)
1. Navigate into the `frontend/` folder.
2. Double-click `index.html` (or open it with any web browser like Chrome, Edge, or Firefox), or serve via any static web server:
   ```bash
   # Using Python
   python -m http.server 3000 --directory frontend
   # Open in browser: http://localhost:3000
   ```
3. The frontend is equipped with an intelligent persistent client storage engine that pre-loads all 20+ retail items, 5 hotels, 5 movies/events, sample vouchers, and demo wallet balances right in your browser!

### Option 2: Full-Stack with Spring Boot & MySQL
1. **Import Database Schema**:
   Open MySQL Workbench or MySQL CLI:
   ```bash
   mysql -u root -p < database/smartshop.sql
   ```
2. **Start Spring Boot Backend**:
   Navigate to `backend/` and run:
   ```bash
   mvn spring-boot:run
   ```
   The backend boots on `http://localhost:8080/api` with full REST API support and CORS enabled.

---

## 🔑 Demo Login Credentials

For quick evaluation during college presentations or hackathon judging, one-click demo login buttons are provided on `login.html`:

| Role | Email | Password | Access |
|---|---|---|---|
| **Customer** | `customer@smartshop.com` | `password123` | Shopping, Stays, Tickets, Wallet, Wishlist |
| **Administrator** | `admin@smartshop.com` | `admin123` | Admin Dashboard, Product CRUD, Status Updates |

---

## 💳 Demo Promo Codes for Checkout

| Code | Value | Sector / Description |
|---|---|---|
| `SMART200` | ₹200 OFF | Welcome hackathon discount on orders above ₹999 |
| `FESTIVE10` | 10% OFF | Instant 10% savings on retail items |
| `CINEMA50` | BOGO 50% | 50% off on second movie ticket |
| `HOLIDAY25` | ₹1,500 OFF | Flat ₹1,500 off on 2+ nights hotel stays |

---

## 🏆 Key Hackathon Innovations Showcase

* **One Platform + Four Sectors**: Unifies Retail, Hospitality, Entertainment, and Financial Services.
* **Unified Loyalty Ecosystem**: Points earned on buying sneakers can be spent to discount a hotel getaway.
* **Smart Recommendation Engine**: Real-time cross-selling between complementary categories (e.g. Athletic Shoes &rarr; Sports Tech & Gym Gear).
* **Demo Financial Services**: Real-time interactive monthly EMI calculator and zero-surcharge demo wallet.
* **Live Order Tracking**: Visual 5-stage stepper from `Placed` to `Delivered`.
