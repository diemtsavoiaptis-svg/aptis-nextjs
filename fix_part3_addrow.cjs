const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "dashboard", "listening", "part-3", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-fix-addrow-" + Date.now();
fs.writeFileSync(backup, code, "utf8");

// Fix common wrong handler names
if (!code.includes("const addRow") && !code.includes("function addRow")) {
  const returnIndex = code.indexOf("return (");
  if (returnIndex === -1) {
    console.error("Cannot find return block.");
    process.exit(1);
  }

  const addRowCode = `
  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        selected: false,
        showInGuest: false,
        stt: String(prev.length + 1),
        linkAudio: "",
        audio: "",
        topic: "",
        question1: "",
        answer1: "Man/Woman/Both",
        question2: "",
        answer2: "Man/Woman/Both",
        question3: "",
        answer3: "Man/Woman/Both",
        question4: "",
        answer4: "Man/Woman/Both",
        paragraph: "",
      },
    ]);
  };

`;

  code = code.slice(0, returnIndex) + addRowCode + code.slice(returnIndex);
}

// If saveAll is also missing, alias it to existing save handler if possible
if (!code.includes("const saveAll") && !code.includes("function saveAll")) {
  const returnIndex = code.indexOf("return (");
  let saveAlias = "";

  if (code.includes("const handleSave")) {
    saveAlias = "  const saveAll = handleSave;\n\n";
  } else if (code.includes("function handleSave")) {
    saveAlias = "  const saveAll = handleSave;\n\n";
  } else if (code.includes("const handleSaveAll")) {
    saveAlias = "  const saveAll = handleSaveAll;\n\n";
  } else if (code.includes("function handleSaveAll")) {
    saveAlias = "  const saveAll = handleSaveAll;\n\n";
  } else {
    saveAlias = `
  const saveAll = async () => {
    try {
      const res = await fetch("/api/admin/part3/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });

      if (!res.ok) {
        throw new Error("Save failed");
      }

      alert("Saved successfully.");
    } catch (error) {
      console.error(error);
      alert("Cannot save Part 3 data.");
    }
  };

`;
  }

  code = code.slice(0, returnIndex) + saveAlias + code.slice(returnIndex);
}

fs.writeFileSync(file, code, "utf8");

console.log("Fixed addRow/saveAll for Part 3.");
console.log("Backup:", backup);
