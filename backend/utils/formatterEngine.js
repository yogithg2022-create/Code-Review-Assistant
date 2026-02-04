/* =========================================================
   formatterEngine.js
   Produces improved code using examples.json + transformations
========================================================= */

const fs = require("fs");
const path = require("path");

let EXAMPLES = [];

/* ---------- Load Examples JSON ---------- */
(function loadExamples() {
    try {
        const filePath = path.join(__dirname, "../data/examples.json");
        const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
        EXAMPLES = json.examples || [];
    } catch (err) {
        console.error("❌ Failed to load examples.json:", err);
        EXAMPLES = [];
    }
})();

/* ---------- Main Formatter ---------- */
function generateImprovedVersion(code) {
    if (!code.trim()) return code;

    // 1. Try matching examples
    const ex = findMatchingExample(code);
    if (ex) return ex.improvedVersion.trim();

    // 2. Apply transformations
    let cleaned = code;
    cleaned = removeConsoleLogs(cleaned);
    cleaned = replaceVar(cleaned);
    cleaned = addMissingSemicolons(cleaned);
    cleaned = indentBlocks(cleaned);
    cleaned = arrowFunctions(cleaned);
    cleaned = templateStrings(cleaned);

    return cleaned.trim();
}

/* ---------- Example Matcher ---------- */
function findMatchingExample(user) {
    const clean = s => s.replace(/\s+/g, "");
    const a = clean(user);

    for (let ex of EXAMPLES) {
        const b = clean(ex.code);
        const similarity = Math.min(a.length, b.length) / Math.max(a.length, b.length);
        if (similarity >= 0.6) return ex;
    }
    return null;
}

/* ---------- Transformations ---------- */

function removeConsoleLogs(str) {
    return str.replace(/console\.log\(.*?\);?/g, "");
}

function replaceVar(str) {
    return str.replace(/\bvar\b/g, "let");
}

function addMissingSemicolons(str) {
    return str.split("\n").map(line => {
        const trimmed = line.trim();

        if (!trimmed) return line;
        if (/[;{}]$/.test(trimmed)) return line;
        if (trimmed.startsWith("//")) return line;

        return line + ";";
    }).join("\n");
}

function indentBlocks(str) {
    const lines = str.split("\n");
    let indent = 0;
    return lines.map(line => {
        const trimmed = line.trim();
        if (trimmed.endsWith("}")) indent--;

        const formatted = "    ".repeat(Math.max(indent, 0)) + trimmed;

        if (trimmed.endsWith("{")) indent++;

        return formatted;
    }).join("\n");
}

function arrowFunctions(str) {
    return str.replace(/function\s*\((.*?)\)\s*\{/g, "($1) => {");
}

function templateStrings(str) {
    return str.replace(/(["'])(.*?)\1\s*\+\s*(\w+)/g, "`$2 \${$3}`");
}

module.exports = { generateImprovedVersion };
