/* =========================================================
   app.js
   Global UI Logic (Tabs, Theme, Modals, Loading)
========================================================= */

/* ---------- Loading Screen ---------- */
window.addEventListener("load", () => {
    const loader = document.getElementById("loading-screen");
    if (loader) {
        loader.classList.add("fade-out");
        setTimeout(() => loader.remove(), 300);
    }
});

/* ---------- Theme Toggle ---------- */
const themeToggle = document.getElementById("theme-toggle");
themeToggle?.addEventListener("click", () => {
    const body = document.body;
    const newTheme = body.dataset.theme === "dark" ? "light" : "dark";
    body.dataset.theme = newTheme;

    // Optional: Save preference
    localStorage.setItem("cra-theme", newTheme);
});

// Load saved theme
document.body.dataset.theme = localStorage.getItem("cra-theme") || "dark";

/* ---------- Tab Switching ---------- */
document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.tab;

        // Remove active state from all tabs
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach((tab) =>
            tab.classList.remove("active")
        );

        // Add active to selected
        btn.classList.add("active");
        document.getElementById(`${target}-tab`)?.classList.add("active");
    });
});

/* ---------- Comparison Toggle ---------- */
document.getElementById("toggle-comparison")?.addEventListener("click", () => {
    const container = document.getElementById("comparison-container");
    container.classList.toggle("hidden");
});

/* ---------- Modals ---------- */
function setupModal(triggerId, modalId) {
    const trigger = document.getElementById(triggerId);
    const modal = document.getElementById(modalId);

    if (!trigger || !modal) return;

    const closeBtn = modal.querySelector(".modal-close");
    const overlay = modal.querySelector(".modal-overlay");

    trigger.addEventListener("click", () => modal.classList.remove("hidden"));
    closeBtn?.addEventListener("click", () => modal.classList.add("hidden"));
    overlay?.addEventListener("click", () => modal.classList.add("hidden"));
}

setupModal("help-btn", "help-modal");
setupModal("export-btn", "export-modal");
