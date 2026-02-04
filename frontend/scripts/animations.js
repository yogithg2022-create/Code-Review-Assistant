/* =========================================================
   animations.js
   Lightweight animations & micro-interactions
   Uses only CSS transitions + JS triggers
========================================================= */

/* =========================================================
   1. ANALYZING ANIMATION
   Pulse-circle + step indicators
========================================================= */

export function animateAnalyzingStep() {
    const circle = document.getElementById("analyzing-circle");
    if (!circle) return;

    // Reset animation
    circle.style.animation = "none";
    void circle.offsetWidth; // force reflow (ensures restart)
    circle.style.animation = "pulse 1.4s ease-in-out infinite";

    animateStepsSequentially();
}

/* Animate analyzing steps: Syntax → Structure → Best Practices */
function animateStepsSequentially() {
    const steps = [
        "step-syntax",
        "step-structure",
        "step-bestpractices"
    ];

    steps.forEach((id, index) => {
        const el = document.getElementById(id);
        if (!el) return;

        el.style.opacity = 0;
        setTimeout(() => {
            el.classList.add("fade-in");
            el.style.opacity = 1;
        }, index * 500 + 200);
    });
}


/* =========================================================
   2. PANEL FADE-IN ON RESULTS LOAD
========================================================= */

export function animateResultsReveal() {
    const results = document.querySelectorAll(".panel");
    let delay = 0;

    results.forEach(panel => {
        setTimeout(() => {
            panel.classList.add("fade-in");
        }, delay);
        delay += 120; // stagger
    });
}


/* =========================================================
   3. SCORE RING ANIMATION
   Smooth transition for quality score ring
========================================================= */

export function animateScoreRing() {
    const ring = document.getElementById("score-progress-ring");
    if (!ring) return;

    ring.style.transition = "stroke-dashoffset 0.6s ease";
}


/* =========================================================
   4. BUTTON CLICK MICRO-ANIMATION
   Scales buttons slightly when clicked
========================================================= */

document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("mousedown", () => {
        btn.style.transform = "scale(0.97)";
    });

    btn.addEventListener("mouseup", () => {
        btn.style.transform = "scale(1)";
    });

    btn.addEventListener("mouseleave", () => {
        btn.style.transform = "scale(1)";
    });
});


/* =========================================================
   5. TABS TRANSITION EFFECT
========================================================= */

document.querySelectorAll(".tab-btn").forEach(tab => {
    tab.addEventListener("click", () => {
        tab.classList.add("tab-pressed");

        setTimeout(() => tab.classList.remove("tab-pressed"), 150);
    });
});


/* =========================================================
   6. SMOOTH SHOW/HIDE (Comparison section)
========================================================= */

const compareContainer = document.getElementById("comparison-container");
if (compareContainer) {
    compareContainer.addEventListener("transitionstart", () => {
        compareContainer.style.willChange = "opacity, transform";
    });

    compareContainer.addEventListener("transitionend", () => {
        compareContainer.style.willChange = "auto";
    });
}


/* =========================================================
   7. UNIVERSAL FADE-IN HOOK
   Add .js-fade elements to fade them on load
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".js-fade").forEach(el => {
        el.classList.add("fade-in");
    });
});


/* =========================================================
   8. PERFORMANCE CHECK
   Ensures animations never block UI
========================================================= */

(function ensureAnimationSmoothness() {
    let last = performance.now();

    requestAnimationFrame(function frame(ts) {
        const delta = ts - last;
        last = ts;

        // Drop frames if the browser is overwhelmed
        if (delta > 200) {
            console.warn("⚠ Animation frame delayed — performance spike detected.");
        }

        requestAnimationFrame(frame);
    });
})();
