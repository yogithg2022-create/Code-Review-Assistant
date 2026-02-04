/* =========================================================
   analyze.js
   Master Analysis Orchestrator
   Uses: beginner-checks.js, smell-detector.js, score.js, tips.js
========================================================= */

importScriptsSafe();

/* ---------- Main Analyze Handler ---------- */
document.getElementById("analyze-btn")?.addEventListener("click", () => {
    if (!codeEditor) return;

    const code = codeEditor.getValue().trim();
    if (!code.length) return showWelcomeState();

    switchToAnalyzingState();

    setTimeout(() => {
        const analysisResults = runFullAnalysis(code);
        displayResults(analysisResults);
    }, 300); // mimic realistic scan time
});

/* ---------- Analysis Pipeline ---------- */
function runFullAnalysis(code) {
    try {
        const beginnerIssues = detectBeginnerMistakes(code);  // from beginner-checks.js
        const smellIssues = detectCodeSmells(code);            // from smell-detector.js
        const merged = [...beginnerIssues, ...smellIssues];

        return {
            issues: merged,
            score: calculateScore(merged, code),               // from score.js
            before: code,
            after: formatImprovedVersion(code),                // from formatter.js
            tips: generateLearningTips(merged)                 // from tips.js
        };
    } catch (err) {
        console.error("❌ Analysis failed:", err);
        return { issues: [], score: 100, before: code, after: code, tips: [] };
    }
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
