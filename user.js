document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const filterBtn = document.getElementById("filterBtn");

  // Log out (نقدر نخليه يودّي لصفحة login عادي)
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

  // Filter (Phase 1: demo only)
  if (filterBtn) {
    filterBtn.addEventListener("click", () => {
      alert("Filtering will be implemented in Phase 2 (Demo only).");
    });
  }

  // Favourite hearts (Phase 1: demo only)
  document.querySelectorAll(".fav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert("Favourites will be implemented in Phase 2 (Demo only).");
    });
  });

  // Remove (Phase 1: demo only) لو عندك remove-text
  document.querySelectorAll(".remove-text").forEach((el) => {
    el.addEventListener("click", () => {
      alert("Remove will be implemented in Phase 2 (Demo only).");
    });
  });
});
