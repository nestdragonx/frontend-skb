import { BACKEND_URL } from "./config.js";

loginBtn.addEventListener("click", async () => {
  if (!adminPass.value || adminPass.value.trim() === "" || !adminUsername.value || adminUsername.value.trim() === "") return (loginError.textContent = "⚠️ Username dan Password wajib diisi.");
  try {
    const res = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: adminUsername.value,password: adminPass.value }),
      credentials: 'include'
    });

    const data = await res.json();
    if (res.ok && data.success) {
      window.location.href = "dashboard.html";
    } else {
      loginError.textContent = "❌ Username atau Password salah,\nSilahkan coba lagi.";
    }
  } catch (err) {
    console.error(err);
    loginError.textContent = "⚠️ Gagal terhubung ke server. Coba lagi nanti.";
  }
});


// window di load check token valid
(async () => {
  try {
        const res = await fetch(`${BACKEND_URL}/verifyToken`, {
          method: "GET",
          credentials: 'include'
        });

        const data = await res.json();
        if (data.valid) window.location.href = "dashboard.html";
      } catch (err) {
        console.error("Error saat cek token:", err);
      }
    })();


    const loginBtn = document.getElementById("loginBtn");
    const adminUsername = document.getElementById("adminUsername");
    const adminPass = document.getElementById("adminPass");
    const loginError = document.getElementById("loginError");


    // Tekan Enter untuk login
    adminPass.addEventListener("keypress", (e) => {
      if (e.key === "Enter") loginBtn.click();
    });