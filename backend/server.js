const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* 🧠 MAIN ANALYSIS FUNCTION */
function analyze(code, lang) {
    let issues = [];
    let improvedCode = code;

    /* ================= JS ================= */
    if (lang === "javascript") {

        if (improvedCode.includes("var ")) {
            issues.push("❌ Avoid 'var' → use 'let/const'");
            improvedCode = improvedCode.replace(/\bvar\b/g, "let");
        }

        if (improvedCode.includes("==")) {
            issues.push("⚠️ Use '===' instead of '=='");
            improvedCode = improvedCode.replace(/==/g, "===");
        }

        if (improvedCode.includes("console.log")) {
            issues.push("⚠️ Remove console.log in production");
        }
    }

    /* ================= PYTHON ================= */
    if (lang === "python") {

        if (improvedCode.includes("== None")) {
            issues.push("⚠️ Use 'is None' instead of '== None'");
            improvedCode = improvedCode.replace(/== None/g, "is None");
        }

        if (improvedCode.includes("print(")) {
            issues.push("⚠️ Avoid print() in production logging");
        }
    }

    /* ================= JAVA ================= */
    if (lang === "java") {

        if (improvedCode.includes("System.out.println")) {
            issues.push("⚠️ Avoid debug prints in production");
        }
    }

    /* ================= C++ ================= */
    if (lang === "cpp") {

        if (improvedCode.includes("using namespace std")) {
            issues.push("⚠️ Avoid 'using namespace std'");
            improvedCode = improvedCode.replace("using namespace std;", "");
        }

        if (improvedCode.includes("cout")) {
            issues.push("⚠️ Avoid debug output in production");
        }
    }

    /* ================= HTML ================= */
    if (lang === "html") {

        if (!improvedCode.includes("<!DOCTYPE html>")) {
            issues.push("⚠️ Missing DOCTYPE declaration");
            improvedCode = "<!DOCTYPE html>\n" + improvedCode;
        }

        if (improvedCode.includes("<img") && !improvedCode.includes("alt=")) {
            issues.push("⚠️ Add alt attribute to <img> for accessibility");

            improvedCode = improvedCode.replace(
                /<img([^>]*)>/g,
                '<img$1 alt="image">'
            );
        }
    }

    /* ================= COMMON RULE ================= */
    if (code.split("\n").length > 25) {
        issues.push("⚠️ Code too long → consider modularizing");
    }

    return {
        issues,
        improvedCode
    };
}

/* 🚀 API ROUTE */
app.post("/review", (req, res) => {
    const { code, language } = req.body;

    const result = analyze(code, language);

    res.json(result);
});

/* 🟢 START SERVER */
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});