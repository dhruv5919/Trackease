document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // ✅ Navigation Menu
  // ==========================
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  const hero = document.querySelector(".hero");
  if (hero) {
    hero.style.opacity = 0;
    hero.style.transition = "opacity 1s ease";
    setTimeout(() => (hero.style.opacity = 1), 100);
  }

  const observeSection = (selector) => {
    const section = document.querySelector(selector);
    if (section) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              section.classList.add("fade-in");
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(section);
    }
  };

  observeSection(".how-it-works");
  observeSection(".features");
  observeSection(".contact");

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add("active");
    });
  });
});

// ==========================
// ✅ Cab Fare Search (Global)
// ==========================
window.handleCabSearch = async function () {
  const pickup = document.getElementById("pickup").value;
  const drop = document.getElementById("drop").value;
  const resultBox = document.getElementById("cabResults");

  resultBox.innerHTML = "";
  if (!pickup || !drop) {
    alert("Please enter both pickup and drop locations.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/cabs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pickup, drop }),
    });

    const data = await res.json();

    if (!res.ok || !data || !Array.isArray(data.fares)) {
      throw new Error("Invalid response from server.");
    }

    if (data.fares.length === 0) {
      resultBox.innerHTML = `<p>No fares available for this route.</p>`;
      return;
    }

    resultBox.innerHTML = `
      <h3>Estimated Distance: ${data.distance}</h3>
      <ul class="fare-list">
        ${data.fares
          .map(
            (f) => `
          <li>
            <strong>${f.app}</strong> <span>${f.fare}</span><br>
            <a href="${f.url}" target="_blank" class="book-link">Book on ${f.app}</a>
          </li>`
          )
          .join("")}
      </ul>`;
  } catch (error) {
    console.error("Cab search error:", error);
    resultBox.innerHTML = `<p style="color:red;">Unable to fetch cab fares. Please try again later.</p>`;
  }
};

// ==========================
// ✅ Hotel Fare Search (Global)
// ==========================
let allHotelResults = [];
let hotelDisplayIndex = 0;

async function handleHotelSearch() {
  const location = document.getElementById("hotelLocation").value;
  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;
  const resultBox = document.getElementById("hotelResults");
  const showMoreBtn = document.getElementById("showMoreBtn");

  resultBox.innerHTML = "";
  hotelDisplayIndex = 0;
  allHotelResults = [];
  showMoreBtn.style.display = "none";

  if (!location || !checkin || !checkout) {
    alert("Please fill all hotel fields.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/hotels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, checkin, checkout }),
    });

    const data = await res.json();
    if (!data.result || data.result.length === 0) {
      resultBox.innerHTML = `<p>No hotels found for ${location}.</p>`;
      return;
    }

    allHotelResults = data.result;
    applyHotelFilters();
  } catch (error) {
    console.error("Hotel fetch error:", error);
    resultBox.innerHTML = `<p style="color:red;">Error fetching hotel data.</p>`;
  }
}
window.handleHotelSearch = handleHotelSearch;

function applyHotelFilters() {
  const maxPrice = parseFloat(document.getElementById("maxPrice")?.value) || Infinity;
  const minRating = parseFloat(document.getElementById("minRating")?.value) || 0;

  const filtered = allHotelResults.filter((hotel) => {
    const price = parseFloat(hotel.min_total_price);
    const rating = parseFloat(hotel.review_score || 0);
    return price <= maxPrice && rating >= minRating;
  });

  hotelDisplayIndex = 0;
  document.getElementById("hotelResults").innerHTML = "<h3>Showing Hotels</h3>";
  renderHotels(filtered);
  window.filteredHotelResults = filtered;
}

function renderHotels(hotels) {
  const chunk = hotels.slice(hotelDisplayIndex, hotelDisplayIndex + 5);
  const html = chunk.map((hotel) => `
    <div class="hotel-card">
      <h4>${hotel.hotel_name}</h4>
      <p>${hotel.address}</p>
      <p class="price">Price: ₹${hotel.min_total_price}</p>
      <p>Rating: ${hotel.review_score || 'N/A'} / 10</p>
    </div>
  `).join("");

  document.getElementById("hotelResults").innerHTML += html;
  hotelDisplayIndex += chunk.length;

  const showMoreBtn = document.getElementById("showMoreBtn");
  showMoreBtn.style.display = hotelDisplayIndex < hotels.length ? "inline-block" : "none";
}

document.getElementById("showMoreBtn")?.addEventListener("click", () => {
  renderHotels(window.filteredHotelResults || allHotelResults);
});
document.getElementById("maxPrice")?.addEventListener("input", applyHotelFilters);
document.getElementById("minRating")?.addEventListener("input", applyHotelFilters);

// ==========================
// ✅ Testimonials Carousel
// ==========================
const testimonials = [
  {
    quote: "Trackease helped me save so much time while booking my cab. I could compare fares instantly!",
    author: "Aditi Sharma, Mumbai",
  },
  {
    quote: "Loved how I could view hotel prices side by side. Clean and simple UI!",
    author: "Rahul Mehra, Bangalore",
  },
  {
    quote: "This app is a must-have for frequent travelers. Saved me ₹150 on my last trip.",
    author: "Priya Nair, Delhi",
  },
];

let currentTestimonial = 0;

function displayTestimonial(index) {
  const card = document.getElementById("testimonialCard");
  if (!card) return;
  card.style.opacity = 0;
  setTimeout(() => {
    card.innerHTML = `
      <p>"${testimonials[index].quote}"</p>
      <div class="testimonial-author">— ${testimonials[index].author}</div>`;
    card.style.opacity = 1;
  }, 300);
}

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  displayTestimonial(currentTestimonial);
}

function prevTestimonial() {
  currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  displayTestimonial(currentTestimonial);
}

document.addEventListener("DOMContentLoaded", () => {
  displayTestimonial(currentTestimonial);
  setInterval(nextTestimonial, 6000);
  document.querySelector(".nav-btn.left")?.addEventListener("click", prevTestimonial);
  document.querySelector(".nav-btn.right")?.addEventListener("click", nextTestimonial);
});

// ==========================
// ✅ Google Maps Loader
// ==========================
window.initMap = function () {
  new google.maps.Map(document.getElementById("map"), {
    center: { lat: 28.6139, lng: 77.2090 },
    zoom: 12,
  });
};

// Auto-load Google Maps (fallback if dynamic loading fails)
if (typeof google === "undefined") {
  const script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}
