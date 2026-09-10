/**
 * ==========================================================================
 * SMARTSHOP – HOSPITALITY & ENTERTAINMENT BOOKINGS JAVASCRIPT
 * Handles Hotels, Stays, Dining, Movies, Events & E-Ticket Generation
 * ==========================================================================
 */

const INITIAL_HOTELS = [
  {
    id: 1,
    name: "Taj Exotica Resort & Spa",
    location: "Benaulim, South Goa",
    price: 14500,
    rating: 4.9,
    reviews: 210,
    description: "5-star Mediterranean beach sanctuary with private shoreline access, lush palm gardens, private villas, and ayurvedic jiva spa.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&auto=format&fit=crop&q=80",
    amenities: ["Private Beach", "Infinity Pool", "Free Breakfast", "Spa & Wellness", "WiFi"]
  },
  {
    id: 2,
    name: "The Oberoi Amarvilas",
    location: "Taj East Gate, Agra",
    price: 22000,
    rating: 4.95,
    reviews: 340,
    description: "Unmatched uninterrupted views of the Taj Mahal from every room, Mughal architecture, torch-lit reflecting pools, and royal butler service.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=700&auto=format&fit=crop&q=80",
    amenities: ["Taj Mahal View", "Butler Service", "Heated Pool", "Fine Dining", "Luxury Spa"]
  },
  {
    id: 3,
    name: "Heritage Boutique Palace",
    location: "Old City, Udaipur",
    price: 9500,
    rating: 4.8,
    reviews: 145,
    description: "Lakeside restored Mewari palace haveli with royal suites, rooftop sunset dining overlooking Lake Pichola and folk dance recitals.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=700&auto=format&fit=crop&q=80",
    amenities: ["Lake View", "Rooftop Restaurant", "Heritage Suite", "Cultural Shows", "WiFi"]
  },
  {
    id: 4,
    name: "Cloud Valley Misty Resort",
    location: "Munnar, Kerala",
    price: 6800,
    rating: 4.7,
    reviews: 128,
    description: "Surrounded by emerald rolling tea plantations, mist-covered mountain peaks, aromatic spice treks and warm wooden cottages.",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=700&auto=format&fit=crop&q=80",
    amenities: ["Tea Garden Trek", "Heated Pool", "Free Breakfast", "Mountain View", "Campfire"]
  },
  {
    id: 5,
    name: "Skyline Urban Business Hotel",
    location: "Whitefield, Bengaluru",
    price: 5200,
    rating: 4.65,
    reviews: 195,
    description: "Smart connected rooms with 1 Gbps fiber, coworking lounge, rooftop microbrewery, and 24/7 fitness center near IT tech parks.",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=700&auto=format&fit=crop&q=80",
    amenities: ["High-speed WiFi", "Meeting Rooms", "Rooftop Lounge", "Fitness Center", "Airport Shuttle"]
  }
];

const INITIAL_EVENTS = [
  {
    id: 1,
    name: "CyberOdyssey: Sci-Fi IMAX 3D",
    type: "Movie",
    category: "Sci-Fi / Action",
    location: "PVR Superplex, Forum Mall, Bengaluru",
    date: "2026-09-18",
    time: "07:30 PM",
    price: 450,
    rating: 4.9,
    description: "A visually breathtaking interstellar journey exploring quantum AI and human consciousness in true IMAX 3D with Dolby Atmos.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=700&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Shadows in the Mist: Thriller",
    type: "Movie",
    category: "Mystery / Thriller",
    location: "INOX Megaplex, GVK One, Hyderabad",
    date: "2026-09-19",
    time: "09:45 PM",
    price: 380,
    rating: 4.8,
    description: "A gripping, edge-of-the-seat psychological crime thriller with unpredictable twists and captivating cinematography.",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=700&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Sunburn Electronic Arena Festival",
    type: "Music Event",
    category: "EDM / Live Festival",
    location: "Vagator Beachfront, North Goa",
    date: "2026-10-02",
    time: "05:00 PM",
    price: 1999,
    rating: 4.9,
    description: "India's legendary electronic dance music festival with international DJs, holographic lasers, beach carnival and food truck alley.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=700&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "National Student AI Hackathon Expo",
    type: "Tech Event",
    category: "Technology / Hackathon",
    location: "KTPO Exhibition Center, Bengaluru",
    date: "2026-09-25",
    time: "09:00 AM",
    price: 299,
    rating: 4.85,
    description: "Join 2,000+ top engineering minds, showcase your SIH projects to venture capitalists, and participate in generative AI masterclasses.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=700&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    name: "The Laugh Boulevard: Stand-Up Special",
    type: "Comedy",
    category: "Live Comedy",
    location: "NCPA Experimental Theatre, Mumbai",
    date: "2026-09-20",
    time: "08:00 PM",
    price: 799,
    rating: 4.75,
    description: "Two hours of nonstop laughing with India’s top viral touring stand-up comedians and live audience roast sessions.",
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=700&auto=format&fit=crop&q=80"
  }
];

// Initialize Storage for Hospitality & Entertainment
function initBookingStorage() {
  if (!localStorage.getItem('smartshop_hotels')) {
    localStorage.setItem('smartshop_hotels', JSON.stringify(INITIAL_HOTELS));
  }
  if (!localStorage.getItem('smartshop_events')) {
    localStorage.setItem('smartshop_events', JSON.stringify(INITIAL_EVENTS));
  }
  if (!localStorage.getItem('smartshop_hotel_bookings')) {
    localStorage.setItem('smartshop_hotel_bookings', JSON.stringify([]));
  }
  if (!localStorage.getItem('smartshop_event_bookings')) {
    localStorage.setItem('smartshop_event_bookings', JSON.stringify([]));
  }
}

// ==========================================================================
// HOTELS & HOSPITALITY MODULE
// ==========================================================================
function loadHotelsPage() {
  const container = document.getElementById('hotelsCatalogGrid');
  if (!container) return;

  const hotels = JSON.parse(localStorage.getItem('smartshop_hotels') || JSON.stringify(INITIAL_HOTELS));

  container.innerHTML = hotels.map(hotel => `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card border rounded-4 overflow-hidden shadow-sm h-100 bg-white">
        <div class="position-relative" style="height: 220px; overflow: hidden;">
          <img src="${hotel.image}" alt="${hotel.name}" class="w-100 h-100" style="object-fit: cover;">
          <span class="badge bg-dark bg-opacity-75 text-white position-absolute bottom-0 start-0 m-3 px-3 py-1 rounded-pill small">
            <i class="fas fa-location-dot text-danger me-1"></i> ${hotel.location}
          </span>
          <span class="badge bg-warning text-dark position-absolute top-0 end-0 m-3 px-2 py-1 rounded-pill fw-bold">
            <i class="fas fa-star me-1"></i> ${hotel.rating}
          </span>
        </div>
        <div class="card-body d-flex flex-column justify-content-between p-4">
          <div>
            <h5 class="fw-bold text-dark mb-2">${hotel.name}</h5>
            <p class="text-muted small mb-3" style="min-height: 48px;">${hotel.description}</p>
            <div class="d-flex flex-wrap gap-1 mb-4">
              ${hotel.amenities.map(a => `<span class="badge bg-light text-secondary border px-2 py-1 small">${a}</span>`).join('')}
            </div>
          </div>
          <div class="border-top pt-3 d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small">Per Night</span>
              <div class="fw-bold text-dark fs-5">${formatINR(hotel.price)}</div>
            </div>
            <button class="btn btn-smart-primary btn-sm px-3 rounded-pill fw-bold" onclick="openHotelBookingModal(${hotel.id})">
              <i class="fas fa-calendar-check me-1"></i> Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

let activeBookingHotel = null;

function openHotelBookingModal(hotelId) {
  const hotels = JSON.parse(localStorage.getItem('smartshop_hotels') || JSON.stringify(INITIAL_HOTELS));
  activeBookingHotel = hotels.find(h => h.id === hotelId);
  if (!activeBookingHotel) return;

  document.getElementById('modalHotelName').textContent = activeBookingHotel.name;
  document.getElementById('modalHotelPrice').textContent = `${formatINR(activeBookingHotel.price)} / night`;

  // Set default dates (tomorrow to +2 days)
  const today = new Date();
  const checkIn = new Date(today);
  checkIn.setDate(today.getDate() + 1);
  const checkOut = new Date(today);
  checkOut.setDate(today.getDate() + 3);

  document.getElementById('bookingCheckIn').value = checkIn.toISOString().split('T')[0];
  document.getElementById('bookingCheckOut').value = checkOut.toISOString().split('T')[0];
  document.getElementById('bookingGuests').value = "2";

  calculateHotelBookingTotal();

  const modal = new bootstrap.Modal(document.getElementById('hotelBookingModal'));
  modal.show();
}

function calculateHotelBookingTotal() {
  if (!activeBookingHotel) return;

  const inDate = new Date(document.getElementById('bookingCheckIn').value);
  const outDate = new Date(document.getElementById('bookingCheckOut').value);
  
  let nights = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));
  if (nights <= 0) nights = 1;

  const total = activeBookingHotel.price * nights;
  const points = Math.floor(total / 20);

  document.getElementById('bookingNightsText').textContent = `${nights} Night(s)`;
  document.getElementById('bookingTotalAmount').textContent = formatINR(total);
  document.getElementById('bookingRewardPointsBadge').textContent = `+${points} Smart Points Earned`;
}

async function confirmHotelBooking(e) {
  e.preventDefault();
  if (!activeBookingHotel) return;

  const checkIn = document.getElementById('bookingCheckIn').value;
  const checkOut = document.getElementById('bookingCheckOut').value;
  const guests = parseInt(document.getElementById('bookingGuests').value);
  const roomType = document.getElementById('bookingRoomType').value;

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  let nights = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));
  if (nights <= 0) nights = 1;

  const total = activeBookingHotel.price * nights;
  const user = getCurrentUser();
  const userId = user ? user.id : 1;

  // Call backend API if running
  try {
    await fetch(`${API_BASE_URL}/hotel-bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        hotelId: activeBookingHotel.id,
        checkIn,
        checkOut,
        guests,
        roomType,
        totalAmount: total,
        status: "Confirmed"
      })
    });
  } catch (err) {
    console.log('Backend API offline, persisting hotel booking locally:', err.message);
  }

  // Persist locally
  const bookings = JSON.parse(localStorage.getItem('smartshop_hotel_bookings') || '[]');
  const newBooking = {
    id: 5000 + bookings.length + 1,
    hotelId: activeBookingHotel.id,
    hotelName: activeBookingHotel.name,
    checkIn,
    checkOut,
    guests,
    roomType,
    totalAmount: total,
    status: "Confirmed",
    dateBooked: new Date().toLocaleDateString('en-IN')
  };
  bookings.unshift(newBooking);
  localStorage.setItem('smartshop_hotel_bookings', JSON.stringify(bookings));

  // Points bonus
  const pts = Math.floor(total / 20);
  let curPts = parseInt(localStorage.getItem('smartshop_rewards_points') || '1250');
  curPts += pts;
  localStorage.setItem('smartshop_rewards_points', curPts.toString());

  // Close modal
  const modalEl = document.getElementById('hotelBookingModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();

  showToast("Reservation Confirmed!", `${activeBookingHotel.name} booked for ${nights} nights! +${pts} Pts awarded.`, "success");

  setTimeout(() => {
    window.location.href = 'profile.html';
  }, 1200);
}

// ==========================================================================
// ENTERTAINMENT MODULE (MOVIES & EVENTS)
// ==========================================================================
function loadEntertainmentPage() {
  const container = document.getElementById('entertainmentCatalogGrid');
  if (!container) return;

  const events = JSON.parse(localStorage.getItem('smartshop_events') || JSON.stringify(INITIAL_EVENTS));

  container.innerHTML = events.map(evt => `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card border rounded-4 overflow-hidden shadow-sm h-100 bg-white">
        <div class="position-relative" style="height: 220px; overflow: hidden;">
          <img src="${evt.image}" alt="${evt.name}" class="w-100 h-100" style="object-fit: cover;">
          <span class="badge ${evt.type === 'Movie' ? 'bg-danger' : 'bg-primary'} position-absolute top-0 start-0 m-3 px-3 py-1 rounded-pill small fw-bold">
            <i class="fas ${evt.type === 'Movie' ? 'fa-film' : 'fa-ticket'} me-1"></i> ${evt.type}
          </span>
          <span class="badge bg-warning text-dark position-absolute top-0 end-0 m-3 px-2 py-1 rounded-pill fw-bold">
            <i class="fas fa-star me-1"></i> ${evt.rating}
          </span>
        </div>
        <div class="card-body d-flex flex-column justify-content-between p-4">
          <div>
            <div class="small text-muted mb-1"><i class="fas fa-calendar-day text-primary me-1"></i> ${evt.date} • ${evt.time}</div>
            <h5 class="fw-bold text-dark mb-2">${evt.name}</h5>
            <div class="small text-muted mb-3"><i class="fas fa-location-dot text-danger me-1"></i> ${evt.location}</div>
            <p class="text-muted small mb-3">${evt.description}</p>
          </div>
          <div class="border-top pt-3 d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small">Per Ticket</span>
              <div class="fw-bold text-dark fs-5">${formatINR(evt.price)}</div>
            </div>
            <button class="btn btn-outline-danger btn-sm px-3 rounded-pill fw-bold" onclick="openEventBookingModal(${evt.id})">
              <i class="fas fa-ticket me-1"></i> Book Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

let activeBookingEvent = null;

function openEventBookingModal(eventId) {
  const events = JSON.parse(localStorage.getItem('smartshop_events') || JSON.stringify(INITIAL_EVENTS));
  activeBookingEvent = events.find(e => e.id === eventId);
  if (!activeBookingEvent) return;

  document.getElementById('modalEventTitle').textContent = activeBookingEvent.name;
  document.getElementById('modalEventDetails').textContent = `${activeBookingEvent.date} at ${activeBookingEvent.time} • ${activeBookingEvent.location}`;
  document.getElementById('modalTicketPrice').textContent = `${formatINR(activeBookingEvent.price)} / ticket`;

  document.getElementById('eventTicketQty').value = "2";
  calculateEventBookingTotal();

  const modal = new bootstrap.Modal(document.getElementById('eventBookingModal'));
  modal.show();
}

function calculateEventBookingTotal() {
  if (!activeBookingEvent) return;
  const qty = parseInt(document.getElementById('eventTicketQty').value) || 1;
  const total = activeBookingEvent.price * qty;
  const pts = Math.floor(total / 15);

  document.getElementById('eventTotalAmount').textContent = formatINR(total);
  document.getElementById('eventRewardPointsBadge').textContent = `+${pts} Smart Points Earned`;
}

async function confirmEventBooking(e) {
  e.preventDefault();
  if (!activeBookingEvent) return;

  const qty = parseInt(document.getElementById('eventTicketQty').value) || 1;
  const total = activeBookingEvent.price * qty;
  const user = getCurrentUser();
  const userId = user ? user.id : 1;

  // Call backend API if running
  try {
    await fetch(`${API_BASE_URL}/event-bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        eventId: activeBookingEvent.id,
        quantity: qty,
        totalAmount: total,
        bookingStatus: "Confirmed"
      })
    });
  } catch (err) {
    console.log('Backend API offline, persisting event booking locally:', err.message);
  }

  // Persist locally
  const bookings = JSON.parse(localStorage.getItem('smartshop_event_bookings') || '[]');
  const newBooking = {
    id: 7000 + bookings.length + 1,
    eventId: activeBookingEvent.id,
    title: activeBookingEvent.name,
    type: activeBookingEvent.type,
    date: activeBookingEvent.date,
    venue: activeBookingEvent.location,
    quantity: qty,
    totalAmount: total,
    status: "Confirmed",
    qrCode: "QR_SMARTSHOP_" + Math.random().toString(36).substring(2, 9).toUpperCase()
  };
  bookings.unshift(newBooking);
  localStorage.setItem('smartshop_event_bookings', JSON.stringify(bookings));

  // Points bonus
  const pts = Math.floor(total / 15);
  let curPts = parseInt(localStorage.getItem('smartshop_rewards_points') || '1250');
  curPts += pts;
  localStorage.setItem('smartshop_rewards_points', curPts.toString());

  // Close modal
  const modalEl = document.getElementById('eventBookingModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();

  showToast("Tickets Confirmed!", `${qty} ticket(s) for "${activeBookingEvent.name}" reserved! +${pts} Pts awarded.`, "success");

  setTimeout(() => {
    window.location.href = 'profile.html';
  }, 1200);
}

document.addEventListener('DOMContentLoaded', () => {
  initBookingStorage();

  if (document.getElementById('hotelsCatalogGrid')) {
    loadHotelsPage();
  }
  if (document.getElementById('entertainmentCatalogGrid')) {
    loadEntertainmentPage();
  }
});
