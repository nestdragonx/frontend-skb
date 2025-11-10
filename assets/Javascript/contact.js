document.addEventListener("DOMContentLoaded", () => {
  const contactSection = document.querySelector(".section-contact");
  const cards = document.querySelectorAll(".contact-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Kalau section terlihat (masuk ke viewport)
        if (entry.isIntersecting) {
          cards.forEach((card, index) => {
            card.style.transition = "none"; // reset transition dulu
            card.style.opacity = "0";
            card.style.transform = "translateY(30px)";

            setTimeout(() => {
              card.style.transition = "all 0.6s ease";
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, index * 200);
          });
        } else {
          // Saat keluar layar, reset agar animasi bisa muncul lagi nanti
          cards.forEach((card) => {
            card.style.opacity = "0";
            card.style.transform = "translateY(30px)";
          });
        }
      });
    },
    {
      threshold: 0.4, // animasi aktif kalau 40% bagian contact terlihat
    }
  );

  observer.observe(contactSection);
});
