// Bungkus semua logika ke dalam fungsi yang bisa diekspor
export function initializeCarousel(data) {
  console.log("Data Initialize Carousel:", data);
  // Pindahkan query selector ke dalam fungsi agar dijalankan saat dipanggil
  const slides = document.querySelectorAll('.carousel-item');
  const indicators = document.querySelector('.indicators');
  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');
  const titleField = document.getElementById("judulKegiatan");
const descField = document.getElementById("keteranganKegiatan");
const pdfLink = document.getElementById("downloadLink");

  // Jika tidak ada slide, hentikan eksekusi untuk mencegah error
  if (!slides || slides.length === 0) {
    console.warn("Carousel initialization skipped: No slides found.");
    return;
  }

  // Hapus dot lama & buat ulang sesuai jumlah slide
  indicators.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active'); // Set dot pertama aktif
    dot.dataset.slide = i;
    indicators.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');
  let currentIndex = 0;
  let interval;


  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      if (dots[i]) dots[i].classList.toggle('active', i === index);
    });
    currentIndex = index;

    const slideData = data[index];
    titleField.textContent = slideData.title;
    descField.textContent = slideData.description;
    pdfLink.href = slideData.pdfUrl;
  }

  function nextSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  function startAutoSlide() {
    clearInterval(interval); // Hentikan interval sebelumnya jika ada
    interval = setInterval(nextSlide, 5000); // Ganti durasi auto-slide jika perlu
  }

  function resetAutoSlide() {
    startAutoSlide();
  }

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-slide'));
      showSlide(index);
      resetAutoSlide();
    });
  });

  // Tampilkan slide pertama dan mulai auto-slide
  showSlide(0);
  startAutoSlide();
}
