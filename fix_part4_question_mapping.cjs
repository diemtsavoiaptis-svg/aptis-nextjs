const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "listening", "part-4", "page.js");

if (!fs.existsSync(file)) {
  console.error("Cannot find:", file);
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");
const backup = file + ".backup-fix-part4-question-mapping-" + Date.now();
fs.writeFileSync(backup, code, "utf8");

const newHelpers = `
function pick(row, keys) {
  for (const key of keys) {
    const value = row?.[key];

    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }

  return "";
}

function getQuestionSet(row) {
  const q16 = pick(row, [
    "question16",
    "question_16",
    "q16",
    "cauHoi16",
    "cauhoi16",
    "cau_hoi_16",
    "Câu hỏi 16",
    "Cau hoi 16",
    "Question 16",
    "question16Text",
    "q16Text",
  ]);

  const q17 = pick(row, [
    "question17",
    "question_17",
    "q17",
    "cauHoi17",
    "cauhoi17",
    "cau_hoi_17",
    "Câu hỏi 17",
    "Cau hoi 17",
    "Question 17",
    "question17Text",
    "q17Text",
  ]);

  const q16Choices = [
    pick(row, ["answer1", "answerA", "optionA16", "choiceA16", "q16A", "Trả lời 1", "Tra loi 1", "Answer 1"]),
    pick(row, ["answer2", "answerB", "optionB16", "choiceB16", "q16B", "Trả lời 2", "Tra loi 2", "Answer 2"]),
    pick(row, ["answer3", "answerC", "optionC16", "choiceC16", "q16C", "Trả lời 3", "Tra loi 3", "Answer 3"]),
  ];

  const q17Choices = [
    pick(row, ["choice1", "choiceA", "optionA17", "choiceA17", "q17A", "Lựa chọn 1", "Lua chon 1", "Choice 1"]),
    pick(row, ["choice2", "choiceB", "optionB17", "choiceB17", "q17B", "Lựa chọn 2", "Lua chon 2", "Choice 2"]),
    pick(row, ["choice3", "choiceC", "optionC17", "choiceC17", "q17C", "Lựa chọn 3", "Lua chon 3", "Choice 3"]),
  ];

  const q16Correct = pick(row, [
    "correct16",
    "answer16",
    "correctAnswer16",
    "dapAn16",
    "dap_an_16",
    "Đáp án 16",
    "Dap an 16",
  ]);

  const q17Correct = pick(row, [
    "correct17",
    "answer17",
    "correctAnswer17",
    "dapAn17",
    "dap_an_17",
    "Đáp án 17",
    "Dap an 17",
  ]);

  return [
    {
      id: "16",
      title: "16.1",
      question: q16,
      choices: q16Choices,
      correct: q16Correct,
    },
    {
      id: "17",
      title: "16.2",
      question: q17,
      choices: q17Choices,
      correct: q17Correct,
    },
  ].filter((item) => item.question || item.choices.some(Boolean));
}
`;

code = code.replace(
/function getQuestionSet\(row\) \{[\s\S]*?\n\}/,
newHelpers.trim()
);

fs.writeFileSync(file, code, "utf8");

console.log("Fixed Part 4 question field mapping.");
console.log("Backup:", backup);
