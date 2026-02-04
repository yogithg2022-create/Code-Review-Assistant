/* =========================================================
   export.js
   Export analysis results as TXT or JSON
========================================================= */

document.getElementById("export-txt")?.addEventListener("click", () => {
    const data = gatherExportData();
    downloadTextFile(formatAsText(data), "code-review-report.txt");
});

document.getElementById("export-json")?.addEventListener("click", () => {
    const data = gatherExportData();
    downloadJSONFile(data, "code-review-report.json");
});

/* ---------- Collect All Data ---------- */
function gatherExportData() {
    return {
        score: document.getElementById("quality-score")?.textContent || "N/A",
        readability: document.getElementById("readability-score")?.textContent,
        structure: document.getElementById("structure-score")?.textContent,
        naming: document.getElementById("naming-score")?.textContent,
        before: document.getElementById("before-code")?.textContent || "",
        after: document.getElementById("after-code")?.textContent || "",
        issues: gatherIssues(),
        exportedAt: new Date().toISOString()
    };
}

/* ---------- Extract Issue Lists ---------- */
function gatherIssues() {
    const types = ["errors", "warnings", "suggestions"];
    const collected = {};

    types.forEach(type => {
        const container = document.getElementById(`${type}-list`);
        if (!container) return;

        const items = [];
        container.querySelectorAll(".issue-item").forEach(div => {
            const lines = div.innerText.split("\n");
            items.push(lines.join(" "));
        });

        collected[type] = items;
    });

    return collected;
}

/* ---------- Format TXT Output ---------- */
function formatAsText(data) {
    return `
CODE REVIEW REPORT
==============================

Score: ${data.score}
Readability: ${data.readability}
Structure: ${data.structure}
Naming: ${data.naming}

------------------------------
Detected Issues
------------------------------
Errors:
${data.issues.errors.join("\n")}

Warnings:
${data.issues.warnings.join("\n")}

Suggestions:
${data.issues.suggestions.join("\n")}

------------------------------
Original Code
------------------------------
${data.before}

------------------------------
Improved Code
------------------------------
${data.after}

Generated At: ${data.exportedAt}
`;
}

/* ---------- Download Helpers ---------- */
function downloadTextFile(text, filename) {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}

function downloadJSONFile(obj, filename) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}
