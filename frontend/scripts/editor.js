/* =========================================================
   editor.js
   Initializes CodeMirror editor & editor utilities
========================================================= */

let codeEditor = null;

/* ---------- Initialize Editor ---------- */
document.addEventListener("DOMContentLoaded", () => {
    const editorTextarea = document.getElementById("code-editor");
    const languageSelect = document.getElementById("language-select");

    // Safety check
    if (!editorTextarea) {
        console.error("❌ Editor textarea not found.");
        return;
    }

    codeEditor = CodeMirror.fromTextArea(editorTextarea, {
        lineNumbers: true,
        theme: "dracula",
        tabSize: 2,
        indentUnit: 2,
        autoCloseBrackets: true,
        matchBrackets: true,
    });

    updateStats();
    codeEditor.on("change", updateStats);

    /* Language Mode Switch */
    languageSelect.addEventListener("change", () => {
        const lang = languageSelect.value;

        const modeMap = {
            javascript: "javascript",
            python: "python",
            java: "text/x-java",
            cpp: "text/x-c++src",
            csharp: "text/x-csharp",
        };

        codeEditor.setOption("mode", modeMap[lang] || "javascript");
    });
});

/* ---------- Update Line & Character Count ---------- */
function updateStats() {
    if (!codeEditor) return;

    const code = codeEditor.getValue();
    document.getElementById("line-count").textContent =
        "Lines: " + code.split("\n").length;

    document.getElementById("char-count").textContent =
        "Characters: " + code.length;
}

/* ---------- Clear Editor ---------- */
document.getElementById("clear-code")?.addEventListener("click", () => {
    if (codeEditor) codeEditor.setValue("");
});

/* ---------- Load Example Code ---------- */
document.getElementById("load-example")?.addEventListener("click", () => {
    const example = `
function calculateValue(x) {
    var temp = 0;
    if (x > 10) {
        console.log("Debug: x is large");
        temp = x * 2
    }
    return temp
}`;
    codeEditor.setValue(example.trim());
});
