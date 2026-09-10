-- ============================================================================
-- SMARTSHOP – SMART SHOPPING FOR A BETTER TOMORROW
-- AICTE Smart India Hackathon 2026
-- MySQL Complete Schema & Sample Seed Data
-- ============================================================================

CREATE DATABASE IF NOT EXISTS smartshop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smartshop_db;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    mobile VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'CUSTOMER',
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id BIGINT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount VARCHAR(30),
    stock INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    image_url VARCHAR(500),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. CART TABLE
CREATE TABLE IF NOT EXISTS cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. WISHLIST TABLE
CREATE TABLE IF NOT EXISTS wishlist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY user_product_wishlist (user_id, product_id)
) ENGINE=InnoDB;

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'Confirmed',
    payment_status VARCHAR(50) DEFAULT 'Paid',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_address TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- 9. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'Success',
    transaction_id VARCHAR(100) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. HOTELS TABLE
CREATE TABLE IF NOT EXISTS hotels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    location VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 4.5,
    image_url VARCHAR(500)
) ENGINE=InnoDB;

-- 11. HOTEL BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS hotel_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    hotel_id BIGINT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INT NOT NULL DEFAULT 1,
    room_type VARCHAR(80) DEFAULT 'Deluxe Room',
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Confirmed',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) DEFAULT 'Movie',
    location VARCHAR(150) NOT NULL,
    event_date DATE NOT NULL,
    event_time VARCHAR(20),
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image_url VARCHAR(500)
) ENGINE=InnoDB;

-- 13. EVENT BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS event_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total_amount DECIMAL(10, 2) NOT NULL,
    booking_status VARCHAR(50) DEFAULT 'Confirmed',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 14. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 15. REWARDS TABLE
CREATE TABLE IF NOT EXISTS rewards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    points INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 16. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Completed',
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 17. OFFERS TABLE
CREATE TABLE IF NOT EXISTS offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    discount VARCHAR(50) NOT NULL,
    coupon_code VARCHAR(30) NOT NULL UNIQUE,
    expiry_date DATE NOT NULL
) ENGINE=InnoDB;


-- ============================================================================
-- SEED SAMPLE DATA (Realistic Indian Rupee Market Data)
-- ============================================================================

-- Categories (5)
INSERT INTO categories (id, name) VALUES 
(1, 'Fashion'),
(2, 'Electronics'),
(3, 'Beauty'),
(4, 'Home & Living'),
(5, 'Accessories');

-- Users (Customer & Admin)
-- Password for Aarav is 'password123', Admin is 'admin123' (BCrypt hashes)
INSERT INTO users (id, name, email, mobile, password, role, address) VALUES
(1, 'Aarav Sharma', 'customer@smartshop.com', '9876543210', '$2a$10$wK7nZ9HfgK8uX1yS8Z4mCe5iA8uY6M3zH1i4Uv1.yS1tJ2F8wMhKC', 'CUSTOMER', 'Flat 402, Lotus Greens, Sector 45, Bengaluru, Karnataka - 560102'),
(2, 'Sneha Reddy', 'admin@smartshop.com', '9988776655', '$2a$10$wK7nZ9HfgK8uX1yS8Z4mCe5iA8uY6M3zH1i4Uv1.yS1tJ2F8wMhKC', 'ADMIN', 'Innovation Hub, Tech Park, Hyderabad, Telangana - 500081');

-- Retail Products (20+)
INSERT INTO products (id, name, description, category_id, price, discount, stock, rating, image_url) VALUES
(1, 'Urban Pro Running Shoes', 'Ultra-lightweight breathable sports running shoes with ergonomic cushioning and high-grip outsole.', 1, 3499.00, '30% OFF', 25, 4.80, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'),
(2, 'Aura Noise-Cancelling Headphones', 'Active noise cancellation wireless over-ear headphones with 40-hour battery life and spatial audio.', 2, 6999.00, '30% OFF', 18, 4.90, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'),
(3, 'Minimalist Chrono Smartwatch', 'Sleek AMOLED display smartwatch with SpO2 monitoring, fitness tracking and 7-day battery life.', 5, 4299.00, '28% OFF', 12, 4.70, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'),
(4, 'Organic Rose Radiance Face Serum', 'Pure botanical hydration serum infused with Hyaluronic Acid and Vitamin C for natural glowing skin.', 3, 899.00, '31% OFF', 40, 4.60, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80'),
(5, 'Nordic Minimalist Desk Lamp', 'Modern matte finish adjustable LED study lamp with 3 color temperatures and touch dimmer.', 4, 1899.00, '32% OFF', 15, 4.70, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80'),
(6, 'Classic Denim Bomber Jacket', 'Vintage stone-washed durable denim jacket with brass buttons and dual chest pockets.', 1, 2499.00, '37% OFF', 22, 4.50, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80'),
(7, 'Pro 4K Ultra Action Camera', 'Waterproof sports action cam with dual screen, electronic image stabilization and accessories kit.', 2, 8499.00, '29% OFF', 10, 4.80, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'),
(8, 'Handcrafted Ceramic Dining Set', 'Artisan glazed stoneware dinner set (12-piece) microwave and dishwasher safe.', 4, 3199.00, '29% OFF', 8, 4.90, 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&auto=format&fit=crop&q=80'),
(9, 'Breeze Linen Casual Shirt', '100% pure organic cotton-linen breathable regular fit casual summer shirt.', 1, 1499.00, '25% OFF', 35, 4.40, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80'),
(10, 'Pulse Bass Wireless Earbuds', 'True Wireless Stereo earbuds with quad mics for clear calls and fast type-C charging.', 2, 1999.00, '50% OFF', 45, 4.65, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80'),
(11, 'Hydra Repair Night Moisturizer', 'Deep restoring anti-aging cream with ceramides and niacinamide for overnight skin renewal.', 3, 1199.00, '20% OFF', 28, 4.55, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80'),
(12, 'Ergonomic Memory Foam Pillow', 'Contoured orthopedic cervical pillow for optimal neck support and sound sleep.', 4, 1699.00, '35% OFF', 30, 4.75, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80'),
(13, 'Vintage Italian Leather Wallet', 'Hand-stitched genuine top-grain bi-fold leather wallet with RFID blocking layer.', 5, 1299.00, '35% OFF', 40, 4.80, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80'),
(14, 'Studio Mechanical Gaming Keyboard', 'RGB backlit mechanical keyboard with hot-swappable tactile brown switches.', 2, 4999.00, '23% OFF', 14, 4.85, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'),
(15, 'Botanical Vitamin C Brightening Kit', 'Complete 3-step skincare regimen: gentle cleanser, antioxidant serum and glow lotion.', 3, 2199.00, '30% OFF', 19, 4.70, 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80'),
(16, 'AeroLite Cabin Hardside Suitcase', '360 spinner wheel durable polycarbonate luggage with integrated TSA combination lock.', 5, 5499.00, '45% OFF', 12, 4.90, 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600&auto=format&fit=crop&q=80'),
(17, 'Boho Macrame Indoor Plant Hanger', 'Handmade cotton macrame rope hanging planter for balcony and living room greenery.', 4, 699.00, '30% OFF', 50, 4.50, 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=600&auto=format&fit=crop&q=80'),
(18, 'Polarized Wayfarer Sunglasses', 'UV400 protective polarized lenses with lightweight matte black durable frame.', 5, 1799.00, '40% OFF', 25, 4.60, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80'),
(19, 'AirFlex Athleisure Gym Joggers', 'Tapered moisture-wicking stretch track pants with zippered phone pocket.', 1, 1599.00, '36% OFF', 32, 4.65, 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop&q=80'),
(20, 'Smart Aroma Diffuser & Humidifier', 'Ultrasonic essential oil diffuser with soothing ambient night light and auto-off.', 4, 2299.00, '25% OFF', 16, 4.75, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80');

-- Hotels (5)
INSERT INTO hotels (id, name, location, description, price, rating, image_url) VALUES
(1, 'Taj Exotica Resort & Spa', 'Benaulim, South Goa', '5-star Mediterranean style beach sanctuary with lush gardens, private beach access, world-class dining and rejuvenating spa therapies.', 14500.00, 4.90, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80'),
(2, 'The Oberoi Amarvilas', 'Taj East Gate, Agra', 'Unsurpassed panoramic views of the iconic Taj Mahal from every room, Mughal architectural majesty and premier hospitality.', 22000.00, 4.95, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80'),
(3, 'Heritage Boutique Palace', 'Old City, Udaipur', 'Lakeside restored royal haveli with traditional Mewari fresco artwork, rooftop dining and sunset boat rides on Lake Pichola.', 9500.00, 4.80, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80'),
(4, 'Cloud Valley Misty Resort', 'Munnar, Kerala', 'Surrounded by sprawling emerald tea plantations, cool mountain breeze, guided spice plantation treks and infinity heated pool.', 6800.00, 4.70, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80'),
(5, 'Skyline Urban Business Hotel', 'Whitefield, Bengaluru', 'High-tech smart hotel designed for digital nomads and executives with 1 Gbps fiber, coworking lounge, 24/7 fitness center and rooftop bar.', 5200.00, 4.65, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80');

-- Events & Movies (5)
INSERT INTO events (id, name, category, location, event_date, event_time, price, description, image_url) VALUES
(1, 'CyberOdyssey: Sci-Fi IMAX 3D', 'Movie', 'PVR Superplex, Forum Mall, Bengaluru', '2026-09-18', '07:30 PM', 450.00, 'A visually breathtaking interstellar journey exploring humanity and quantum artificial intelligence in true IMAX 3D.', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80'),
(2, 'Sunburn Electronic Arena Festival', 'Music Event', 'Vagator Beachfront, North Goa', '2026-10-02', '05:00 PM', 1999.00, 'India’s largest electronic dance music spectacle featuring top international DJs, holographic visuals, and food carnivals.', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80'),
(3, 'National Student AI Hackathon Expo', 'Tech Event', 'KTPO Exhibition Center, Bengaluru', '2026-09-25', '09:00 AM', 299.00, 'Join 2,000+ top engineering innovators, showcase projects to venture capitalists, and participate in masterclasses.', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=80'),
(4, 'The Laugh Boulevard: Stand-Up Special', 'Comedy', 'NCPA Experimental Theatre, Mumbai', '2026-09-20', '08:00 PM', 799.00, 'Two hours of nonstop side-splitting comedy and audience banter with India’s favorite touring comedians.', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600&auto=format&fit=crop&q=80'),
(5, 'Shadows in the Mist: Psychological Thriller', 'Movie', 'INOX Megaplex, GVK One, Hyderabad', '2026-09-19', '09:45 PM', 380.00, 'A gripping, award-winning mystery crime thriller with heart-pounding twists, Dolby Atmos spatial sound.', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80');

-- Offers (5)
INSERT INTO offers (id, title, description, discount, coupon_code, expiry_date) VALUES
(1, 'Welcome Hackathon Bonus', 'Flat ₹200 off on first purchase above ₹999 across all sectors.', '₹200 OFF', 'SMART200', '2026-12-31'),
(2, 'Retail & Dining Combo', 'Get 10% instant discount on shopping + restaurant bookings.', '10% OFF', 'FESTIVE10', '2026-11-30'),
(3, 'Entertainment Weekend', 'Book movie tickets and enjoy 50% discount on second ticket.', 'BOGO 50%', 'CINEMA50', '2026-10-31'),
(4, 'Hospitality Getaway', 'Flat ₹1,500 off on 2+ nights hotel booking across India.', '₹1,500 OFF', 'HOLIDAY25', '2026-12-15'),
(5, 'Smart Wallet Cashpack', 'Add money to your demo smart wallet and get 5% cashback points.', '5% Cashback', 'WALLET05', '2026-12-31');

-- Seed Rewards for user 1
INSERT INTO rewards (id, user_id, points) VALUES
(1, 1, 1250);

-- Seed Transactions for user 1
INSERT INTO transactions (id, user_id, amount, transaction_type, status, transaction_date) VALUES
(1, 1, 5000.00, 'Wallet Top-up', 'Completed', '2026-09-01 10:30:00'),
(2, 1, 3499.00, 'Retail Purchase (Shoes)', 'Completed', '2026-09-05 14:15:00'),
(3, 1, 799.00, 'Event Booking (Comedy)', 'Completed', '2026-09-08 19:45:00');

-- Seed Product Reviews
INSERT INTO reviews (id, user_id, product_id, rating, comment) VALUES
(1, 1, 1, 5, 'Super comfortable shoes! Wore them for a 10k marathon, no blisters at all.'),
(2, 1, 2, 5, 'ANC is incredible. Blocks out all subway noise and battery lasts days.'),
(3, 1, 3, 4, 'Great battery and bright display. Highly recommend at this price point.');
