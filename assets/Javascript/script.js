// Efek smooth scroll saat klik navbar

// Statistik Peserta Didik Ajaran
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('tahun-ajaran');
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth(); 

  const startYear = m >= 5 ? y : y - 1; // Juni (5) ke atas pakai tahun ini, selain itu tahun lalu
  const endYear = startYear + 1;

  el.textContent = `Statistik Peserta Didik ${startYear}/${endYear}`;
});

document.querySelectorAll('.nav-links a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

// Saat tombol hamburger diklik
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  menuToggle.classList.toggle("active");
});

// Saat salah satu link di dalam menu diklik → menu menutup
const links = document.querySelectorAll(".nav-links a");
links.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuToggle.classList.remove("active");
  });
});

