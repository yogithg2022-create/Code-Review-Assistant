/* =========================================================
   score.js
   Computes the Code Quality Score using rules.json data
========================================================= */

let SCORING = null;

/* ---------- Load Scoring Weights ---------- */
(async function loadScoringConfig() {
    try {
        const res = await fetch("data/rules.json");
        const json = await res.json();
        SCORING = json.scoring_weights;
    } catch (err) {
        console.error("❌ Failed to load scoring config:", err);
        SCORING = {
            base_score: 100,
            errors: -10,
            warnings: -5,
            suggestions: -2,
            readability_factor: 0.3,
            structure_factor: 0.4,
            naming_factor: 0.3
        };
    }
})();

/* ---------- Calculate Quality Score ---------- */
function calculateScore(issues, code) {
    if (!SCORING) {
        return { total: 100, breakdown: { readability: 100, structure: 100, naming: 100 } };
    }

    const { errors, warnings, suggestions } = countIssueTypes(issues);

    let score = SCORING.base_score;
    score += errors * SCORING.errors;
    score += warnings * SCORING.warnings;
    score += suggestions * SCORING.suggestions;

    const breakdown = computeBreakdownScores(code, issues);

    const weighted =
        breakdown.readability * SCORING.readability_factor +
        breakdown.structure * SCORING.structure_factor +
        breakdown.naming * SCORING.naming_factor;

    const finalScore = Math.max(0, Math.min(100, Math.round(score - (100 - weighted))));

    return {
        total: finalScore,
        breakdown
    };
}

/* ---------- Issue Type Counter ---------- */
function countIssueTypes(issues) {
    return {
        errors: issues.filter(i => i.severity === "error").length,
        warnings: issues.filter(i => i.severity === "warning").length,
        suggestions: issues.filter(i => i.severity === "suggestion").length
    };
}

/* ---------- Breakdown Computations ---------- */
function computeBreakdownScores(code, issues) {
    const lines = code.split("\n").length;

    const readabilityPenalty = issues.filter(i =>
        ["long_lines", "poor_variable_names", "single_letter_vars"].includes(i.name)
    ).length * 4;

    const structurePenalty = issues.filter(i =>
        ["deep_nesting", "duplicate_code", "large_function_params"].includes(i.name)
    ).length * 5;

    const namingPenalty = issues.filter(i =>
        ["camelCase_functions", "CONSTANTS_UPPERCASE", "boolean_prefix"].includes(i.name)
    ).length * 3;

    return {
        readability: Math.max(0, 100 - readabilityPenalty),
        structure: Math.max(0, 100 - structurePenalty),
        naming: Math.max(0, 100 - namingPenalty)
    };
}

/* ---------- UI Score Update ---------- */
function updateScoreUI(score) {
    document.getElementById("quality-score").textContent = score.total;
    document.getElementById("readability-score").textContent = score.breakdown.readability;
    document.getElementById("structure-score").textContent = score.breakdown.structure;
    document.getElementById("naming-score").textContent = score.breakdown.naming;

    // Progress Ring
    const ring = document.getElementById("score-progress-ring");
    const circumference = 339;
    const offset = circumference - (circumference * score.total) / 100;
    ring.style.strokeDashoffset = offset;
}
