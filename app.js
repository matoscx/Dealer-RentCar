// --- SIMULACIÓN DE BASE DE DATOS ---
const initialVehicles = [
    { id: 1, name: 'Toyota Corolla', year: 2023, price: 45, category: 'economico', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Hyundai Tucson', year: 2024, price: 70, category: 'suv', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'BMW X5', year: 2024, price: 135, category: 'lujo', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80' },
    { id: 4, name: 'Kia Rio', year: 2022, price: 40, category: 'economico', image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=400&q=80' }
];

// Inicializar DB si está vacía
if (!localStorage.getItem('vehicles')) {
    localStorage.setItem('vehicles', JSON.stringify(initialVehicles));
}

// --- FUNCIONES DEL CATÁLOGO ---
function renderCars(filter = 'todos') {
    const grid = document.getElementById('vehicleGrid');
    if (!grid) return;
    
    const vehicles = JSON.parse(localStorage.getItem('vehicles'));
    grid.innerHTML = '';

    const filtered = filter === 'todos' ? vehicles : vehicles.filter(v => v.category === filter);

    filtered.forEach(car => {
        grid.innerHTML += `
            <div class="car-card">
                <img src="${car.image}" alt="${car.name}">
                <div class="car-info">
                    <span class="category-tag">${car.category}</span>
                    <h3>${car.name} <span>(${car.year})</span></h3>
                    <p class="price">$${car.price}<span>/día</span></p>
                    <button onclick="bookCar(${car.id})" class="btn-rent">Reservar Ahora</button>
                </div>
            </div>
        `;
    });
}

// --- LÓGICA DE RESERVA (RESTRICCIÓN DE LOGIN) ---
function bookCar(id) {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        alert("Debes iniciar sesión para realizar una reserva.");
        window.location.href = 'login.html';
    } else {
        localStorage.setItem('selectedCarId', id);
        window.location.href = 'checkout.html';
    }
}

// --- FILTROS ---
function filterCars(category, btn) {
    renderCars(category);
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// --- SESIÓN ---
function updateNavbar() {
    const userLink = document.getElementById('user-auth-link');
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && userLink) {
        userLink.innerHTML = `
            <span class="user-welcome">Hola, ${user.name}</span>
            <button onclick="logout()" class="logout-btn">Salir</button>
        `;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', () => {
    renderCars();
    updateNavbar();
});
