import { BACKEND_URL } from "./config.js";
// Immediately invoked async function to check token and render dashboard

(async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/verifyToken`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    if (!data.valid) {
      return (window.location.href = "login.html");
      // If token is valid, render the dashboard HTML
    } else {
      const body = document.querySelector("body");
      body.innerHTML = `
            <header class="navbar">
    <div class="logo">📊 Dashboard Admin</div>
    <button id="logoutBtn" class="btn-logout">Logout</button>
  </header>

  <main class="container">

    <!-- === DASHBOARD === -->
    <section id="dashboard-section">
<div id="myModal" class="modal">
  <div class="modal-content" id="modalContent">
    <button class="close" type="button">&times;</button>
  </div>
</div>

      <!-- Carousel Upload -->
      <div class="card">
        <h3>🖼️ Update Carousel</h3>
        <input type="text" id="carouselTitle" placeholder="Judul Gambar">
        <label for="judul">Input Gambar</label>
        <input type="file" id="carouselImage" accept="image/*">
        <label for="judul">Judul Kegiatan</label>
        <input type="text" id="judul" name="judul" placeholder="Masukkan judul kegiatan">
        <label for="deskripsi">Deskripsi Kegiatan</label>
        <textarea id="deskripsi" name="deskripsi" placeholder="Masukkan deskripsi kegiatan"></textarea>
        <label for="judul">Input PDF</label>
        <input type="file" id="carouselPDF" accept="application/pdf">
        
        <button id="uploadCarousel" class="btn">Upload ke Carousel</button>
       <div id="carouselPreview" class="preview"></div>
      </div>
      <div class="card">
        <h3>🖼️ List Carousel</h3>
        <table id="carouselTable" cell-spacing="10px" class="table" style="width: 100% ; text-align: left;" border="1">
          <thead>
            <tr>
              <th style="width: 10%; text-align: center">No</th>
              <th style="width: 50%; text-align: center">Judul</th>
              <th style="width: 40%; text-align: center">Gambar</th>
              <th style="width: 10%; text-align: center">Aksi</th>
            </tr>
          </thead>
          <tbody id="carouselImageTableData"></tbody>
        </table>
      </div>

      <!-- Jumlah Peserta -->
      <div class="card">
        <h3>👩‍🎓 Jumlah Peserta</h3>
        <div class="stat-grid">
          <label>PAUD <input type="number" id="paud" min="0"></label>
          <label>Paket A <input type="number" id="paketA" min="0"></label>
          <label>Paket B <input type="number" id="paketB" min="0"></label>
          <label>Paket C <input type="number" id="paketC" min="0"></label>
        </div>
        <button id="updateStatistik" class="btn">Update Statistik</button>
      </div>
    </section>

  </main>

  <footer>
 <p>© 2025 SKB 1 Padang | Dashboard Admin</p>
  </footer>`;
    
  // modal
// --- Modal ---
const modal = document.getElementById("myModal");
const closeBtn = document.querySelector("#myModal .close");

// Delegasi klik untuk tombol Edit di TABEL (elemen bisa muncul belakangan)
const tableBody = document.getElementById("carouselImageTableData");

// Jaga-jaga: pastikan ada tbody-nya
if (tableBody) {
  tableBody.addEventListener("click", async (e) => {
    const editBtn = e.target.closest(".btn-edit");
    if (!editBtn) return;
    e.preventDefault();

    // Tambahkan event listener untuk tombol Hapus di sini juga
    const deleteBtn = e.target.closest(".btn-delete");
    if (deleteBtn) {
      e.preventDefault();
      if (confirm("Apakah Anda yakin ingin menghapus gambar ini?")) {
        const imageId = deleteBtn.getAttribute("data-id");
        try {
          const res = await fetch(`${BACKEND_URL}/images/${imageId}`, {
            method: "DELETE",
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok && data.success) {
            alert("Gambar berhasil dihapus!");
            deleteBtn.closest("tr").remove(); // Hapus baris dari tabel
          } else {
            alert(data.error || "Gagal menghapus gambar");
          }
        } catch (err) {
          console.error("Error deleting image:", err);
          alert("Gagal menghapus gambar.");
        }
      }
      return; // Hentikan eksekusi agar tidak membuka modal edit
    }

    modal.dataset.id = editBtn.dataset.id;
    modal.style.display = "block";
    // isi konten modal sesuai data gambar
    const modalForm = document.getElementById("modalContent");
    const row = editBtn.closest("tr");
    const title = row.children[1].innerText;
    const imgSrc = row.children[2].querySelector("img").src;
    modalForm.innerHTML = `
      <h2>${title}</h2>
      <img src="${imgSrc}" width=200px height=200px style="object-fit: contain"  alt="${title}" loading="lazy" width="100%" height="100%">
       <input type="text" id="carouselTitle" placeholder="Judul Gambar">
        <input type="file" id="carouselImage" accept="image/*">
        <button id="editCarousel" class="btn" type="button">Upload ke Carousel</button>
    `;
    
    // edit
     const editCarouselBtn = document.getElementById("editCarousel");
    const mongoID = modal.dataset.id;
    editCarouselBtn.addEventListener("click", async () => {
    const file = document.getElementById("carouselImage").files[0];
    const imageAlt = document.getElementById("carouselTitle").value;
    if (!file) return alert("Pilih gambar dulu!");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        credentials: "include", // kalau pakai cookie auth
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // set image preview
        const source = data?.data?.imageUrl;
        const cloudinaryId = data?.data?.cloudinaryId;
        const updateToMongo = await fetch(`${BACKEND_URL}/images/${mongoID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ imageAlt: imageAlt, imageUrl: source, cloudinaryId: cloudinaryId }),
        });
        const dataMongo = await updateToMongo.json();
        if (!updateToMongo.ok || !dataMongo.success) {
          console.error("Error saving image to database:", dataMongo.error);
          alert("Gagal menyimpan data gambar ke database.");
          return;
        }
      
        alert("Gambar berhasil diupload!");
        // update UI
        row.children[1].innerText = imageAlt;
        row.children[2].querySelector("img").src = source;
        modal.style.display = "none";
      } else {
        alert(data.error || "Gagal upload");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Gagal upload gambar.");
    }
  });
  });
}

// Tutup modal
closeBtn.addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});
// end modal

  const fetchImages = await fetch(`${BACKEND_URL}/images`);
    const imagesData = await fetchImages.json();
    if (fetchImages.ok && imagesData.success) {
      const images = imagesData.data;
      if (Array.isArray(images) && images.length > 0) {
        images.forEach((imgData, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td style="width: 10%; text-align: center">${index + 1}</td>
            <td style="width: 20%; text-align: center">${imgData.imageAlt}</td>
            <td style="width: 30%; padding: 30px; text-align: center"><img src="${imgData.imageUrl}" alt="${imgData.imageAlt}" loading="lazy" width="100%" height="auto"></td>
            <td style="width: 30%; padding: 30px; text-align: center">
            <div style="display: flex; flex-direction: column; gap: 10px">
              <button  data-id="${imgData.imageId}" data-index="${index}" class="btn btn-delete">Hapus</button>
              <button type="button" data-id="${imgData.imageId}" data-index="${index}" class="btn btn-edit">Edit</button>
            </div>
            </td>
            `;
          document.getElementById("carouselImageTableData").appendChild(row);
        });
      }
    } else {
      console.error("Error fetching images:", imagesData.error || "Gagal mengambil gambar");
    }
      // Attach event listener to the newly rendered logout button
      document
        .getElementById("logoutBtn")
        .addEventListener("click", async () => {
          await fetch(`${BACKEND_URL}/logout`, {
            method: "POST",
            credentials: "include",
          });
          window.location.href = "login.html";
        });
    }
    attachDashboardEventListeners(); 
  } catch (err) {
    console.error("Error saat cek token:", err);
    window.location.href = "login.html";
  }
})();



function attachDashboardEventListeners() {
  const uploadBtn = document.getElementById("uploadCarousel");
  const carouselPreview = document.getElementById("carouselPreview");

  uploadBtn.addEventListener("click", async () => {
    const file = document.getElementById("carouselImage").files[0];
    const imageAlt = document.getElementById("carouselTitle").value;
    const judulKegiatan = document.getElementById("judul").value;
    const deskripsiKegiatan = document.getElementById("deskripsi").value;
    const pdfFile = document.getElementById("carouselPDF").files[0];

    if (!file) return alert("Pilih gambar dulu!");
    if (!judulKegiatan.trim()) return alert("Judul kegiatan wajib diisi!");
    if (!deskripsiKegiatan.trim()) return alert("Deskripsi wajib diisi!");
    if (!pdfFile) return alert("Upload file PDF!");
    const formData = new FormData();
    formData.append("image", file);
    formData.append("pdf", pdfFile);

    
    try {
      const res = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        credentials: "include", // kalau pakai cookie auth
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // set image preview
        const source = data?.data?.imageUrl;
        const cloudinaryId = data?.data?.cloudinaryId;
        const saveToMongo = await fetch(`${BACKEND_URL}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ imageAlt: imageAlt, imageUrl: source, title: judulKegiatan, description: deskripsiKegiatan, pdfUrl: data?.data?.pdfUrl ,pdfCloudinaryId: data?.data?.pdfCloudinaryId ,cloudinaryId: cloudinaryId }),
        });
        const dataMongo = await saveToMongo.json();
        if (!saveToMongo.ok || !dataMongo.success) {
          console.error("Error saving image to database:", dataMongo.error);
          alert("Gagal menyimpan data gambar ke database.");
          return;
        }
        carouselPreview.innerHTML = `<p>Preview:</p><img src="${source}" alt="Preview" width="200px" height="200px" style="object-fit: contain">`;
        // update table
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="width: 10%; text-align: center">${document.getElementById("carouselImageTableData").children.length + 1}</td>
            <td style="width: 30%; text-align: center">${imageAlt}</td>
            <td style="width: 40%; padding: 30px; text-align: center"><img src="${source}" alt="${imageAlt}" loading="lazy" width="100%" height="auto"></td>
            <td style="height: 100%; text-align: center; display: flex; gap: 5px;">
              <button  data-id="${dataMongo.data.imageId}" data-index="${document.getElementById("carouselImageTableData").children.length}" class="btn btn-delete">Hapus</button>
              <button type="button" data-id="${dataMongo.data.imageId}" data-index="${document.getElementById("carouselImageTableData").children.length}" class="btn btn-edit">Edit</button>
            </td>
            `;
        document.getElementById("carouselImageTableData").appendChild(row);

        alert("Gambar berhasil diupload!");
      } else {
        alert(data.error || "Gagal upload");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Gagal upload gambar.");
    }
  });

  // delete
  document
    .getElementById("carouselImageTableData")
    .addEventListener("click", async (e) => {
      const deleteBtn = e.target.closest(".btn-delete");
      if (!deleteBtn) return;
      e.preventDefault();
      const imageId = deleteBtn.dataset.id;
      try {
        const res = await fetch(`${BACKEND_URL}/images/${imageId}`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.success) {
          document.getElementById("carouselImageTableData").removeChild(deleteBtn.parentElement.parentElement);
          alert("Gambar berhasil dihapus!");
        } else {
          alert(data.error || "Gagal menghapus gambar.");
        }
      } catch (err) {
        console.error("Error deleting image:", err);
        alert("Gagal menghapus gambar.");
      }
    });
      
    // Jumlah peserta peserta didik
  const paudInput = document.getElementById("paud");
  const paketAInput = document.getElementById("paketA");
  const paketBInput = document.getElementById("paketB");
  const paketCInput = document.getElementById("paketC");

  document
    .getElementById("updateStatistik")
    .addEventListener("click", async () => {
      const paudCount = parseInt(paudInput.value) || 0;
      const paketACount = parseInt(paketAInput.value) || 0;
      const paketBCount = parseInt(paketBInput.value) || 0;
      const paketCCount = parseInt(paketCInput.value) || 0;
      try {
        const res = await fetch(`${BACKEND_URL}/updatePesertaPaket`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            paudCount,
            paketACount,
            paketBCount,
            paketCCount,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          alert("Statistik berhasil diperbarui!");
        } else {
          alert(data.error || "Gagal update statistik");
        }
      } catch (err) {
        console.error("Error updating statistik:", err);
        alert("Gagal update statistik.");
      }
    });
  
    // Kode untuk event listener hapus sudah dipindahkan ke atas (event delegation)
    // jadi blok ini bisa dihapus.
   
}
