/* =========================
   CONFIGURACIÓN LOCAL
========================= */

const CURRENT_USER_KEY = "rentcar_current_user";
const USERS_KEY = "rentcar_users";
const BOOKINGS_KEY = "rentcar_bookings";
const INQUIRIES_KEY = "rentcar_inquiries";

/* =========================
   DATOS INICIALES
========================= */

function seedData() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(
      USERS_KEY,
      JSON.stringify([
        {
          name: "Administrador",
          email: "admin@rentcar.com",
          password: "Admin123*",
          role: "admin",
          phone: "000000000"
        }
      ])
    );
  }

  if (!localStorage.getItem("cars")) {
    localStorage.setItem(
      "cars",
      JSON.stringify([
        {
          id: 1,
          name: "Toyota Corolla",
          brand: "Toyota",
          year: 2024,
          category: "economico",
          transmission: "Automática",
          fuel: "Gasolina",
          seats: 5,
          location: "Santo Domingo",
          pricePerDay: 45,
          rating: 4.7,
          image:
            "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80",
          description: "Vehículo cómodo ideal para ciudad.",
          features: ["Aire acondicionado", "Bluetooth", "GPS"]
        },
        {
          id: 2,
          name: "BMW X5",
          brand: "BMW",
          year: 2024,
          category: "lujo",
          transmission: "Automática",
          fuel: "Híbrido",
          seats: 5,
          location: "Santiago",
          pricePerDay: 120,
          rating: 4.9,
          image:
            "https://images.unsplash.com/photo-1555215695-3004980ad54e",
          description: "SUV premium para viajes.",
          features: ["Sunroof", "Cuero", "Sonido premium"]
        }
      ])
    );
  }
}

/* =========================
   UTILIDADES
========================= */

function getCurrentUser() {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

function setSession(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
  window.location.href = "index.html";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

/* =========================
   AUTENTICACIÓN
========================= */

function handleLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document
      .getElementById("email")
      .value.trim()
      .toLowerCase();

    const password = document.getElementById("pass").value;

    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      alert("Correo o contraseña incorrectos");
      return;
    }

    setSession(user);
    window.location.href = resolveRoleHome(user.role);
  });
}

function handleRegister() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = {
      name: document.getElementById("registerName").value,
      email: document
        .getElementById("registerEmail")
        .value.toLowerCase(),
      phone: document.getElementById("registerPhone").value,
      password: document.getElementById("registerPassword").value,
      role: document.getElementById("registerRole").value
    };

    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

    if (users.some((u) => u.email === user.email)) {
      alert("Este correo ya existe");
      return;
    }

    users.push(user);

    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    setSession(user);

    window.location.href = resolveRoleHome(user.role);
  });
}

/* =========================
   ROLES
========================= */

function resolveRoleHome(role) {
  if (role === "admin") return "admin.html";
  if (role === "agent") return "agent.html";
  return "customer.html";
}

/* =========================
   CATÁLOGO
========================= */

function renderCatalog() {
  const grid = document.getElementById("vehicleGrid");
  if (!grid) return;

  const cars = JSON.parse(localStorage.getItem("cars")) || [];

  grid.innerHTML = cars
    .map(
      (car) => `
      <article class="car-card">
        <img src="${car.image}">
        <div class="car-info">
          <h3>${car.name} (${car.year})</h3>
          <p>${car.location}</p>
          <p class="price">${formatCurrency(car.pricePerDay)}</p>
          <a class="btn-primary" href="car-details.html?id=${car.id}">Ver detalles</a>
        </div>
      </article>
      `
    )
    .join("");
}

/* =========================
   DETALLE AUTO
========================= */

function renderCarDetails() {
  const section = document.getElementById("carDetailSection");
  if (!section) return;

  const id = Number(
    new URLSearchParams(window.location.search).get("id")
  );

  const cars = JSON.parse(localStorage.getItem("cars")) || [];

  const car = cars.find((c) => c.id === id);

  if (!car) {
    section.innerHTML = "Vehículo no encontrado";
    return;
  }

  section.innerHTML = `
    <img src="${car.image}" class="detail-img">
    <div class="detail-text">
      <h1>${car.name}</h1>
      <p>${formatCurrency(car.pricePerDay)} / día</p>
      <p>${car.description}</p>
      <ul>
        ${car.features.map((f) => `<li>${f}</li>`).join("")}
      </ul>
      <a href="checkout.html?id=${car.id}" class="btn-primary">Reservar</a>
    </div>
  `;
}

/* =========================
   RESERVAS
========================= */

function handleCheckout() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  const user = getCurrentUser();
  if (!user) {
    alert("Debes iniciar sesión");
    window.location.href = "index.html";
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = Number(
      new URLSearchParams(window.location.search).get("id")
    );

    const booking = {
      id: Date.now(),
      user: user.email,
      carId: id,
      startDate: document.getElementById("startDate").value,
      endDate: document.getElementById("endDate").value
    };

    const bookings =
      JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || [];

    bookings.push(booking);

    localStorage.setItem(
      BOOKINGS_KEY,
      JSON.stringify(bookings)
    );

    alert("Reserva realizada");
    window.location.href = "customer.html";
  });
}

/* =========================
   CONTACTO
========================= */

function handleContact() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const inquiries =
      JSON.parse(localStorage.getItem(INQUIRIES_KEY)) || [];

    inquiries.push({
      name: document.getElementById("contactName").value,
      email: document.getElementById("contactEmail").value,
      message: document.getElementById("contactMessage").value
    });

    localStorage.setItem(
      INQUIRIES_KEY,
      JSON.stringify(inquiries)
    );

    alert("Mensaje enviado");
    form.reset();
  });
}

/* =========================
   INICIALIZAR
========================= */

function initPage() {
  seedData();
  handleLogin();
  handleRegister();
  renderCatalog();
  renderCarDetails();
  handleCheckout();
  handleContact();
}

document.addEventListener("DOMContentLoaded", initPage);


document.addEventListener('DOMContentLoaded', initPage);
