const fs = require("fs");
const path = require("path");

const root = process.cwd();

const files = [
  "app/dashboard/listening/part-1/page.js",
  "app/dashboard/listening/part-2/page.js",
  "app/dashboard/listening/part-3/page.js",
  "app/dashboard/listening/part-4/page.js",
];

function patchFile(relativePath) {
  const file = path.join(root, relativePath);

  if (!fs.existsSync(file)) {
    console.log("Skip missing:", relativePath);
    return;
  }

  let code = fs.readFileSync(file, "utf8");
  const backup = file + ".backup-top-scrollbar-" + Date.now();
  fs.copyFileSync(file, backup);

  // Nếu đã có topScrollWrap thì ép CSS kiểu thanh kéo nằm trên.
  if (code.includes("topScrollWrap")) {
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

    // Thêm rule xoay ngược table/con trực tiếp bên trong.
    if (!code.includes(".topScrollWrap > table")) {
      const styleEnd = code.lastIndexOf("`}</style>");
      if (styleEnd !== -1) {
        code =
          code.slice(0, styleEnd) +
`
        .topScrollWrap > table,
        .topScrollWrap > div,
        .topScrollWrap .tableInner {
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

` +
          code.slice(styleEnd);
      }
    }
  } else {
    // Nếu file chưa có topScrollWrap, đổi wrapper overflow-x gần table thành topScrollWrap.
    code = code.replace(
      /<div className="([^"]*overflow[^"]*)">([\s\S]*?<table[\s\S]*?<\/table>[\s\S]*?)<\/div>/,
      `<div className="topScrollWrap">$2</div>`
    );

    const styleEnd = code.lastIndexOf("`}</style>");
    if (styleEnd !== -1 && !code.includes(".topScrollWrap")) {
      code =
        code.slice(0, styleEnd) +
`
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

` +
        code.slice(styleEnd);
    }
  }

  fs.writeFileSync(file, code, "utf8");

  console.log("Updated:", relativePath);
  console.log("Backup:", path.relative(root, backup));
}

files.forEach(patchFile);

console.log("");
console.log("Done: moved horizontal table scrollbars to the top for Part 1-4 admin pages.");
