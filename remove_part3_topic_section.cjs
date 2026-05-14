const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "listening", "part-3", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-remove-topic-section-" + Date.now();
fs.writeFileSync(backup, code, "utf8");

// Xóa block Topic / hướng dẫn
code = code.replace(
/\s*<section className="topicSection">[\s\S]*?<\/section>\s*(?=<section className="answerPanel">)/,
"\n\n        "
);

// Xóa CSS topicSection
code = code.replace(
/\s*\.topicSection\s*\{[\s\S]*?\n\s*\}\s*/g,
"\n"
);

code = code.replace(
/\s*\.topicSection span\s*\{[\s\S]*?\n\s*\}\s*/g,
"\n"
);

code = code.replace(
/\s*\.topicSection h2\s*\{[\s\S]*?\n\s*\}\s*/g,
"\n"
);

code = code.replace(
/\s*\.topicSection p\s*\{[\s\S]*?\n\s*\}\s*/g,
"\n"
);

// Xóa topicSection khỏi media query nếu còn
code = code.replace(
/\s*\.topicSection,\n/g,
"\n"
);

fs.writeFileSync(file, code, "utf8");

console.log("Removed Part 3 topic section.");
console.log("Backup:", backup);
