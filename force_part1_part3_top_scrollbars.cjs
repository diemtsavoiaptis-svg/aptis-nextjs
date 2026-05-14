const fs = require("fs");
const path = require("path");

const root = process.cwd();

const files = [
  "app/dashboard/listening/part-1/page.js",
  "app/dashboard/listening/part-3/page.js",
];

function addTopScrollbarCss(code) {
  const css = `
        .topScrollWrap {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          transform: rotateX(180deg);
          border-top: 1px solid #ffd4dc;
          border-radius: 16px 16px 0 0;
        }

        .topScrollWrap > table,
        .topScrollWrap > div,
        .topScrollWrap .tableInner {
          transform: rotateX(180deg);
        }

        .topScrollWrap table {
          transform: rotateX(180deg);
        }

        .topScrollWrap::-webkit-scrollbar {
          height: 14px;
        }

        .topScrollWrap::-webkit-scrollbar-track {
          background: #fff0f3;
          border-radius: 999px;
        }

        .topScrollWrap::-webkit-scrollbar-thumb {
          background: #b8b8b8;
          border-radius: 999px;
          border: 3px solid #fff0f3;
        }

        .topScrollWrap::-webkit-scrollbar-thumb:hover {
          background: #8f8f8f;
        }

`;

  if (code.includes(".topScrollWrap::-webkit-scrollbar-thumb:hover")) return code;

  const styleEnd = code.lastIndexOf("`}</style>");
  if (styleEnd !== -1) {
    return code.slice(0, styleEnd) + css + code.slice(styleEnd);
  }

  return code;
}

function patch(relativePath) {
  const file = path.join(root, relativePath);

  if (!fs.existsSync(file)) {
    console.log("Missing:", relativePath);
    return;
  }

  let code = fs.readFileSync(file, "utf8");
  const backup = file + ".backup-force-top-scroll-" + Date.now();
  fs.copyFileSync(file, backup);

  // Nếu đã có topScrollWrap, chỉ sửa CSS.
  if (code.includes('className="topScrollWrap"')) {
    code = code.replace(
/\.topScrollWrap\s*\{[\s\S]*?\n\s*\}/g,
`.topScrollWrap {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          transform: rotateX(180deg);
          border-top: 1px solid #ffd4dc;
          border-radius: 16px 16px 0 0;
        }`
    );

    code = addTopScrollbarCss(code);
    fs.writeFileSync(file, code, "utf8");

    console.log("Updated existing topScrollWrap:", relativePath);
    console.log("Backup:", path.relative(root, backup));
    return;
  }

  // Bắt các wrapper bảng phổ biến và đổi thành topScrollWrap.
  const patterns = [
    /<div className="topScroll">\s*([\s\S]*?<table[\s\S]*?<\/table>)\s*<\/div>/,
    /<div className="tableScroll">\s*([\s\S]*?<table[\s\S]*?<\/table>)\s*<\/div>/,
    /<div className="tableWrapper">\s*([\s\S]*?<table[\s\S]*?<\/table>)\s*<\/div>/,
    /<div className="overflow-x-auto">\s*([\s\S]*?<table[\s\S]*?<\/table>)\s*<\/div>/,
    /<div className="[^"]*overflow-x-auto[^"]*">\s*([\s\S]*?<table[\s\S]*?<\/table>)\s*<\/div>/,
    /<div className="[^"]*overflow-auto[^"]*">\s*([\s\S]*?<table[\s\S]*?<\/table>)\s*<\/div>/,
  ];

  let changed = false;

  for (const pattern of patterns) {
    if (pattern.test(code)) {
      code = code.replace(pattern, `<div className="topScrollWrap">$1</div>`);
      changed = true;
      break;
    }
  }

  // Nếu chưa bắt được wrapper, bọc trực tiếp table đầu tiên.
  if (!changed) {
    const tableMatch = code.match(/<table[\s\S]*?<\/table>/);

    if (tableMatch) {
      code = code.replace(tableMatch[0], `<div className="topScrollWrap">${tableMatch[0]}</div>`);
      changed = true;
    }
  }

  code = addTopScrollbarCss(code);

  fs.writeFileSync(file, code, "utf8");

  console.log(changed ? "Forced top scrollbar:" : "No table found:", relativePath);
  console.log("Backup:", path.relative(root, backup));
}

files.forEach(patch);

console.log("");
console.log("Done. Part 1 + Part 3 table scrollbars should now appear at the top.");
