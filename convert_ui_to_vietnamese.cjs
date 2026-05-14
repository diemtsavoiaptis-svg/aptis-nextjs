const fs = require("fs");
const path = require("path");

const rootDirs = [
  path.join(process.cwd(), "app", "dashboard"),
  path.join(process.cwd(), "app", "listening"),
];

const exts = new Set([".js", ".jsx", ".ts", ".tsx"]);

const replacements = [
  ["ADMIN SYSTEM", "HỆ THỐNG QUẢN TRỊ"],
  ["Admin System", "Hệ thống quản trị"],
  ["Aptis", "Aptis"],

  ["Listening Dashboard", "Bảng điều khiển Listening"],
  ["LISTENING MANAGEMENT", "QUẢN LÝ LISTENING"],
  ["Manage all Aptis Listening sections in one fluid, full-width admin workspace.", "Quản lý toàn bộ các phần Listening trong một giao diện quản trị rộng và dễ dùng."],
  ["Manage all Aptis Listening sections in one fluid, full-width admin workspace", "Quản lý toàn bộ các phần Listening trong một giao diện quản trị rộng và dễ dùng"],
  ["Manage all Aptis Listening sections in one fluid, full-", "Quản lý toàn bộ các phần Listening trong một giao diện quản trị rộng và dễ dùng"],
  ["width admin workspace.", ""],

  ["View Student UI", "Xem giao diện học viên"],
  ["Student View", "Xem học viên"],
  ["Open Admin", "Mở trang quản trị"],
  ["Dashboard", "Bảng điều khiển"],
  ["Overview", "Tổng quan"],
  ["Coming soon", "Sắp có"],
  ["Active", "Đang hoạt động"],
  ["Design Mode", "Đang thiết kế"],
  ["Design", "Đang thiết kế"],
  ["Theme", "Giao diện"],
  ["Pastel Red", "Đỏ pastel"],
  ["Total Parts", "Tổng số phần"],
  ["Active Data", "Dữ liệu chính"],

  ["Listening Practice", "Luyện nghe"],
  ["APTIS LISTENING", "APTIS LISTENING"],
  ["Part 1 Practice", "Luyện tập Phần 1"],
  ["Student Access · Full Part 1 data", "Chế độ học viên · Toàn bộ dữ liệu Phần 1"],
  ["Guest Access · Selected Part 1 questions", "Chế độ khách · Các câu đã được chọn"],
  ["Question", "Câu"],
  ["Student", "Học viên"],
  ["Guest", "Khách"],
  ["No audio available.", "Chưa có audio."],
  ["Check voice", "Xem lời thoại"],
  ["No voice transcript available.", "Chưa có dữ liệu lời thoại."],
  ["Check answer", "Kiểm tra đáp án"],
  ["Correct answer.", "Chính xác."],
  ["Not correct. Correct answer:", "Chưa đúng. Đáp án đúng:"],
  ["Please choose A, B or C before checking.", "Vui lòng chọn A, B hoặc C trước khi kiểm tra."],
  ["Your answer has been selected. This question does not have an answer key yet.", "Bạn đã chọn đáp án. Câu này hiện chưa có đáp án đúng."],
  ["Previous question", "Câu trước"],
  ["Next question", "Câu tiếp theo"],
  ["Loading Part 1 data...", "Đang tải dữ liệu Phần 1..."],
  ["No Part 1 data found.", "Không tìm thấy dữ liệu Phần 1."],
  ["No questions have been selected for guest view yet.", "Chưa có câu nào được chọn cho giao diện khách."],

  ["Short Conversations", "Hội thoại ngắn"],
  ["Information Matching", "Nối thông tin"],
  ["Opinion / Identity", "Ý kiến / Nhân vật"],
  ["Monologue / Summary", "Bài nói dài / Tóm tắt"],

  ["Manage short audio questions with A, B, C answer choices.", "Quản lý câu hỏi nghe ngắn với lựa chọn A, B, C."],
  ["Manage audio, topics, speakers, answer pool and voice data.", "Quản lý audio, chủ đề, người nói, kho đáp án và dữ liệu voice."],
  ["Manage audio, topics, four questions and speaker answers.", "Quản lý audio, chủ đề, 4 câu hỏi và đáp án người nói."],
  ["Manage long audio passages, questions, answers and paraphrase data.", "Quản lý bài nghe dài, câu hỏi, đáp án và dữ liệu paraphrase."],

  ["Search...", "Tìm kiếm..."],
  ["Student UI", "Giao diện học viên"],
  ["Full Part 1 data", "Toàn bộ dữ liệu Phần 1"],
  ["Selected Part 1 questions", "Các câu đã chọn của Phần 1"],
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  const results = [];

  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      results.push(...walk(full));
    } else if (exts.has(path.extname(full))) {
      results.push(full);
    }
  }

  return results;
}

const files = rootDirs.flatMap(walk);
const backupDir = path.join(process.cwd(), "backups", "vi-ui-" + Date.now());
fs.mkdirSync(backupDir, { recursive: true });

let changed = 0;

for (const file of files) {
  let code = fs.readFileSync(file, "utf8");
  const original = code;

  for (const [from, to] of replacements) {
    code = code.split(from).join(to);
  }

  if (code !== original) {
    const relative = path.relative(process.cwd(), file);
    const backupFile = path.join(backupDir, relative);
    fs.mkdirSync(path.dirname(backupFile), { recursive: true });
    fs.writeFileSync(backupFile, original, "utf8");
    fs.writeFileSync(file, code, "utf8");
    changed++;
    console.log("Updated:", relative);
  }
}

console.log("");
console.log("Vietnamese UI update completed.");
console.log("Changed files:", changed);
console.log("Backup folder:", backupDir);
