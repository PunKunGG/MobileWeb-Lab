// ===== Theme Toggle (persist with localStorage) =====
(function () {
  const saved = localStorage.getItem("theme");
  const initial = saved ? saved : "dark";
  document.body.setAttribute("data-theme", initial);

  function updateButton() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    const icon = btn.querySelector(".icon");
    const label = btn.querySelector(".label");
    const theme = document.body.getAttribute("data-theme") || "dark";

    if (theme === "light") {
      icon.textContent = "☀️";
      label.textContent = "Light";
    } else {
      icon.textContent = "🌙";
      label.textContent = "Dark";
    }
  }

  updateButton();

  document.getElementById("themeToggle")?.addEventListener("click", () => {
    const current = document.body.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateButton();
  });
})();

// ===== Scroll reveal animation for cards =====
(function () {
  const cards = document.querySelectorAll(".card");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in-view");
      });
    },
    { threshold: 0.15 }
  );

  cards.forEach((c) => io.observe(c));
})();
