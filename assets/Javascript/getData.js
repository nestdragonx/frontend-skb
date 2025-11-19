 import {BACKEND_URL} from "./config.js";
 import { initializeCarousel } from "./carrousel.js";


// statistik peserta didik ajaran
const siswaPaudField = document.getElementById("siswaPaudField");
const pesertaPaketAField = document.getElementById("pesertaPaketAField");
const pesertaPaketBField = document.getElementById("pesertaPaketBField");
const pesertaPaketCField = document.getElementById("pesertaPaketCField");
await fetch(`${BACKEND_URL}/pesertaPaket`)
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      siswaPaudField.textContent = data.data.siswaPAUD;
      pesertaPaketAField.textContent = data.data.paketA;
      pesertaPaketBField.textContent = data.data.paketB;
      pesertaPaketCField.textContent = data.data.paketC;
    }
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });

const carouselContainer = document.getElementById("carouselImageContainer");
if (carouselContainer) {
  // IIFE (Immediately Invoked Function Expression) untuk fetch dan render gambar
  (async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/images`);
      const data = await res.json();

      if (res.ok && data.success) {
        const images = data.data; 
        if (Array.isArray(images) && images.length > 0) {
          carouselContainer.innerHTML = ""; // Kosongkan container
          images.forEach((imgData, index) => {
            const carouselItem = document.createElement("div");

            carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            const img = document.createElement("img");
            img.src = imgData.imageUrl; // Asumsi backend mengembalikan { imageUrl: '...' }
            img.alt = `Slide ${index + 1}`;
            
            carouselItem.appendChild(img);
            carouselContainer.appendChild(carouselItem);

            const infoBox = document.getElementById("infoBox");
            infoBox.appendChild(judulKegiatan);
            infoBox.appendChild(keteranganKegiatan);
            infoBox.appendChild(downloadLink);
          });
          console.log("getData: ",images)
          initializeCarousel(images);
        }
      } else {
        console.error("Error fetching images:", data.error || "Gagal mengambil gambar");
      }
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  })(); // <-- Tambahkan () untuk langsung memanggil fungsi async
}

