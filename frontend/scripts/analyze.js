/* =========================================================
   analyze.js
   Master Analysis Orchestrator
   Uses: beginner-checks.js, smell-detector.js, score.js, tips.js
========================================================= */

importScriptsSafe();

/* ---------- Main Analyze Handler ---------- */
document.getElementById("analyze-btn")?.addEventListener("click", async () => {
    if (!codeEditor) return;

    const code = codeEditor.getValue().trim();
    if (!code.length) return showWelcomeState();

    switchToAnalyzingState();

    setTimeout(async () => {
        const analysisResults = await runFullAnalysis(code);
        displayResults(analysisResults);
    }, 300); // mimic realistic scan time
});
/* ---------- Analysis Pipeline (Backend Powered) ---------- */
async function runFullAnalysis(code) {
    try {
        const response = await fetch("https://code-review-assistant-backend-2ef6.onrender.com/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
        });

        if (!response.ok) {
            console.error("Backend error:", response.status);
            return fallbackLocalAnalysis(code);
        }

        const data = await response.json();

        return {
            issues: data.analysis.issues,
            score: {
                total: data.analysis.totalScore,
                breakdown: data.analysis.breakdown
            },
            before: data.analysis.before,
            after: data.analysis.after,
            tips: generateLearningTips(data.analysis.issues)
        };

    } catch (err) {
        console.error("❌ Backend unreachable. Running local analysis.", err);
        return fallbackLocalAnalysis(code);
    }
}

/* ---------- Fallback Local Analysis ---------- */
function fallbackLocalAnalysis(code) {
    const beginner = detectBeginnerMistakes(code);
    const smells = detectCodeSmells(code);
    const merged = [...beginner, ...smells];

    return {
        issues: merged,
        score: calculateScore(merged, code),
        before: code,
        after: formatImprovedVersion(code),
        tips: generateLearningTips(merged)
    };
}

/* ---------- UI State Switching ---------- */
function switchToAnalyzingState() {
    document.getElementById("welcome-state")?.classList.add("hidden");
    document.getElementById("results-content")?.classList.add("hidden");

    const analyzing = document.getElementById("analyzing-state");
    analyzing?.classList.remove("hidden");

    animateAnalyzingStep(); // from animations.js
}

function showWelcomeState() {
    document.getElementById("welcome-state")?.classList.remove("hidden");
    document.getElementById("results-content")?.classList.add("hidden");
    document.getElementById("analyzing-state")?.classList.add("hidden");
}

/* ---------- Render Results ---------- */
function displayResults({ issues, score, before, after, tips }) {
    const analyzing = document.getElementById("analyzing-state");
    analyzing?.classList.add("hidden");

    document.getElementById("results-content")?.classList.remove("hidden");

    // Update score
    updateScoreUI(score);

    // Populate tabs
    populateIssueTab("errors", issues.filter(i => i.severity === "error"));
    populateIssueTab("warnings", issues.filter(i => i.severity === "warning"));
    populateIssueTab("suggestions", issues.filter(i => i.severity === "suggestion"));

    populateTips(tips);

    document.getElementById("export-btn").disabled = false;

    // Comparison Section
    document.getElementById("before-code").textContent = before;
    document.getElementById("after-code").textContent = after;
}

/* ---------- Issue Tab Renderer ---------- */
function populateIssueTab(type, list) {
    document.getElementById(`${type}-count`).textContent = list.length;

    const container = document.getElementById(`${type}-list`);
    container.innerHTML = "";

    list.forEach(issue => {
        const div = document.createElement("div");
        div.className = "issue-item";

        div.innerHTML = `
            <strong>${issue.message}</strong><br>
            <span class="issue-line">Line ${issue.line}</span><br>
            <span class="issue-explanation">${issue.explanation || ""}</span>
        `;

        container.appendChild(div);
    });
}

/* ---------- Safe Script Imports ---------- */
function importScriptsSafe() {
    window.detectBeginnerMistakes ??= () => [];
    window.detectCodeSmells ??= () => [];
    window.calculateScore ??= () => ({ total: 100 });
    window.generateLearningTips ??= () => [];
    window.formatImprovedVersion ??= (c) => c;
}
