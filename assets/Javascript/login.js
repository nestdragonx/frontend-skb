import { BACKEND_URL } from "./config.js";

document.getElementById("loginBtn").addEventListener("click", async () => {
  const password = document.getElementById("adminPass").value;

  try {
    const res = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("authToken", data.token);
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("loginError").textContent = "Password salah!";
    }
  } catch (err) {
    console.error(err);
    alert("Gagal terhubung ke server backend.");
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

    // Tekan Enter untuk login
    adminPass.addEventListener("keypress", (e) => {
      if (e.key === "Enter") loginBtn.click();
    });