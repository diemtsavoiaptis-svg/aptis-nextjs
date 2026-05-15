"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import part2Rows from "../../dashboard/listening/part-2/data.json";

function splitTranscriptBySpeaker(text) {
  const raw = String(text || "").trim();

  if (!raw) return [];

  return raw
    .replace(/\s*((?:Person\s+)?[A-D]:)/gi, "\n$1")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^((?:Person\s+)?[A-D]):\s*(.*)$/i);

      if (!match) {
        return {
          speaker: "",
          text: line,
        };
      }

      const shortSpeaker = match[1]
        .replace(/Person\s+/i, "")
        .replace(":", "")
        .toUpperCase();

      return {
        speaker: shortSpeaker,
        text: match[2].trim(),
      };
    });
}

function clean(value) {
  return String(value ?? "").trim();
}

function getAudioUrl(row) {
  const url = clean(row.audioLink || row.audio);
  const id = clean(row.audio_drive_file_id);

  if (url.includes("drive.google.com")) {
    const match = url.match(/\/d\/([^/]+)/);
    const fileId = match ? match[1] : id;
    return fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : url;
  }

  if (id) return `https://drive.google.com/uc?export=download&id=${id}`;

  return url;
}

function getAnswerOptions(row) {
  if (Array.isArray(row.answers) && row.answers.length) {
    return row.answers.map(clean).filter(Boolean);
  }

  return clean(row.answerBank)
    .replace(/^Lựa chọn:\s*/i, "")
    .replace(/^Lua chon:\s*/i, "")
    .split(",")
    .map(clean)
    .filter(Boolean);
}

function normalizeRow(row, index) {
  const answerOptions = getAnswerOptions(row);

  return {
    ...row,
    order: Number(row.order || row.stt || index + 1),
    stt: clean(row.stt || row.order || index + 1),
    topic: clean(row.topic || "Listening Part 2"),
    audioUrl: getAudioUrl(row),
    answerOptions,
    people: [
      {
        key: "person1",
        label: "Người 1",
        correct: clean(row.correct1 || row.person1),
      },
      {
        key: "person2",
        label: "Người 2",
        correct: clean(row.correct2 || row.person2),
      },
      {
        key: "person3",
        label: "Người 3",
        correct: clean(row.correct3 || row.person3),
      },
      {
        key: "person4",
        label: "Người 4",
        correct: clean(row.correct4 || row.person4),
      },
    ],
    paragraph: clean(row.voiceParagraph || row.paragraph || row.transcript),
  };
}

function ListeningPart2Content() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isStudentMode = mode === "student";

  const rows = useMemo(() => {
    const allRows = Array.isArray(part2Rows) ? part2Rows.map(normalizeRow) : [];

    if (isStudentMode) return allRows;

    return allRows.filter((row) => row.guestVisible || row.showInGuest);
  }, [isStudentMode]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const activeRow = rows[activeIndex];
  const transcriptLines = splitTranscriptBySpeaker(activeRow?.paragraph || activeRow?.voiceParagraph || activeRow?.transcript);

  if (!activeRow) {
    return (
      <main className="part2Page">
        <section className="emptyState">
          <div className="partBadge">2</div>
          <h1>Chưa có bài Part 2</h1>
          <p>
            {isStudentMode
              ? "Chưa có dữ liệu Part 2 cho giao diện học viên."
              : "Chưa có bài Part 2 nào được chọn cho giao diện khách."}
          </p>
        </section>

        <style jsx global>{`
          body {
            margin: 0;
            background: #fff6f8;
            color: #3d0810;
            font-family: Arial, sans-serif;
          }

          .part2Page {
            min-height: 100vh;
            padding: 32px;
            background:
              linear-gradient(rgba(255, 246, 248, 0.96), rgba(255, 246, 248, 0.96)),
              repeating-linear-gradient(
                -14deg,
                rgba(244, 63, 94, 0.06) 0,
                rgba(244, 63, 94, 0.06) 2px,
                transparent 2px,
                transparent 86px
              );
          }

          .emptyState {
            max-width: 860px;
            margin: 80px auto;
            border: 1px solid #ffc0cc;
            border-radius: 32px;
            background: white;
            padding: 42px;
            box-shadow: 0 16px 38px rgba(190, 18, 60, 0.12);
          }

          .partBadge {
            width: 82px;
            height: 82px;
            border-radius: 24px;
            background: #e6003f;
            color: white;
            display: grid;
            place-items: center;
            font-size: 42px;
            font-weight: 900;
            margin-bottom: 24px;
          }

          .emptyState h1 {
            margin: 0 0 12px;
            font-size: 46px;
          }

          .emptyState p {
            margin: 0;
            color: #9f001f;
            font-size: 18px;
            font-weight: 800;
          }
        `}</style>
      </main>
    );
  }

  const questionKey = String(activeRow.order || activeIndex + 1);

  function updateAnswer(personKey, value) {
    setChecked(false);
    setAnswers((oldAnswers) => ({
      ...oldAnswers,
      [questionKey]: {
        ...(oldAnswers[questionKey] || {}),
        [personKey]: value,
      },
    }));
  }

  function getUserAnswer(personKey) {
    return answers[questionKey]?.[personKey] || "";
  }

  function isCorrect(person) {
    return clean(getUserAnswer(person.key)) === clean(person.correct);
  }

  const correctCount = activeRow.people.filter(isCorrect).length;
  const progressPercent = rows.length ? Math.round(((activeIndex + 1) / rows.length) * 100) : 0;

  return (
    <main className="part2Page">
      <section className="pageShell">
        <header className="heroCard">
          <div className="partBadge">
            <span>PHẦN</span>
            <strong>2</strong>
          </div>

          <div className="heroText">
            <p>APTIS LISTENING</p>
            <h1>Nối thông tin</h1>
            <span>
              Bài {activeIndex + 1}/{rows.length} · Chọn đáp án phù hợp cho từng người.
            </span>
          </div>

          <div className="progressBox">
            <strong>{progressPercent}%</strong>
            <span>Tiến độ</span>
          </div>
        </header>

        <section className="topGrid">
          <article className="audioPanel">
            <div className="sectionLabel">AUDIO</div>

            <div className="audioBar">
              <audio controls src={activeRow.audioUrl} />
            </div>

            <button
              type="button"
              className="outlineBtn"
              onClick={() => setShowTranscript((value) => !value)}
            >
              {showTranscript ? "Ẩn lời thoại" : "Xem lời thoại"}
            </button>
          </article>

          <article className="topicPanel">
            <div className="sectionLabel">TOPIC</div>
            <h2>{activeRow.topic}</h2>
            <p>
              Listen to four people talking about the same topic. Choose the best matching answer for each person.
            </p>
          </article>
        </section>

        {showTranscript && transcriptLines.length ? (
          <section className="transcriptPanel">
            <div className="sectionLabel">LỜI THOẠI</div>

            <div className="transcriptText">
              {transcriptLines.map((item, index) => (
                <p key={index}>
                  {item.speaker ? <strong>{item.speaker}: </strong> : null}
                  {item.text}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        <section className="answerPanel">
          <div className="answerHeader">
            <div>
              <p>ANSWER SHEET</p>
              <h2>Chọn đáp án cho từng người</h2>
            </div>

            <span>{activeRow.people.length} câu</span>
          </div>

          <div className="matchingGrid">
            {activeRow.people.map((person) => {
              const selected = getUserAnswer(person.key);
              const resultClass = !checked
                ? ""
                : isCorrect(person)
                  ? "correct"
                  : "wrong";

              return (
                <div key={person.key} className={`matchRow ${resultClass}`}>
                  <div className="personTag">{person.label}</div>

                  <select
                    value={selected}
                    onChange={(event) => updateAnswer(person.key, event.target.value)}
                  >
                    <option value="">-- Chọn đáp án --</option>
                    {activeRow.answerOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  {checked ? (
                    <div className="resultText">
                      {isCorrect(person) ? "Đúng" : `Đáp án đúng: ${person.correct || "Chưa có"}`}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        <section className="bottomActions">
          <button
            type="button"
            className="checkBtn"
            onClick={() => setChecked(true)}
          >
            Kiểm tra đáp án
          </button>

          {checked ? (
            <div className="scorePill">
              Đúng {correctCount}/{activeRow.people.length}
            </div>
          ) : null}

          <div className="navBtns">
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={() => {
                setChecked(false);
                setShowTranscript(false);
                setActiveIndex((index) => Math.max(0, index - 1));
              }}
            >
              ← Bài trước
            </button>

            <button
              type="button"
              className="nextBtn"
              disabled={activeIndex >= rows.length - 1}
              onClick={() => {
                setChecked(false);
                setShowTranscript(false);
                setActiveIndex((index) => Math.min(rows.length - 1, index + 1));
              }}
            >
              Bài tiếp theo →
            </button>
          </div>
        </section>
      </section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #fff6f8;
          color: #3d0810;
          font-family: Arial, sans-serif;
        }

        .part2Page {
          min-height: 100vh;
          padding: 24px;
          background:
            linear-gradient(rgba(255, 246, 248, 0.96), rgba(255, 246, 248, 0.96)),
            repeating-linear-gradient(
              -14deg,
              rgba(244, 63, 94, 0.055) 0,
              rgba(244, 63, 94, 0.055) 2px,
              transparent 2px,
              transparent 86px
            );
        }

        .pageShell {
          width: min(1500px, 100%);
          margin: 0 auto;
        }

        .heroCard,
        .audioPanel,
        .topicPanel,
        .transcriptPanel,
        .answerPanel {
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid #ffc0cc;
          box-shadow: 0 16px 36px rgba(190, 18, 60, 0.12);
        }

        .heroCard {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 24px;
          align-items: center;
          border-radius: 34px;
          padding: 30px;
          margin-bottom: 20px;
        }

        .partBadge {
          width: 108px;
          height: 108px;
          border-radius: 30px;
          background: linear-gradient(135deg, #ff315b, #e6003f);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 18px 34px rgba(230, 0, 63, 0.22);
        }

        .partBadge span {
          font-size: 16px;
          font-weight: 900;
        }

        .partBadge strong {
          font-size: 54px;
          line-height: 1;
        }

        .heroText p,
        .sectionLabel,
        .answerHeader p {
          margin: 0 0 10px;
          color: #e6003f;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        .heroText h1 {
          margin: 0 0 10px;
          font-size: clamp(44px, 6vw, 78px);
          line-height: 0.95;
          font-weight: 500;
        }

        .heroText span {
          color: #7b2835;
          font-size: 18px;
          font-weight: 700;
        }

        .progressBox {
          width: 116px;
          height: 88px;
          border: 1px solid #ffc0cc;
          border-radius: 24px;
          background: #fff4f6;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .progressBox strong {
          color: #e6003f;
          font-size: 30px;
        }

        .progressBox span {
          color: #9f001f;
          font-weight: 900;
        }

        .topGrid {
          display: grid;
          grid-template-columns: 1.35fr 0.9fr;
          gap: 18px;
          margin-bottom: 18px;
        }

        .audioPanel,
        .topicPanel,
        .transcriptPanel,
        .answerPanel {
          border-radius: 28px;
          padding: 24px;
        }

        .audioBar {
          min-height: 86px;
          border-radius: 24px;
          background: #e6003f;
          display: flex;
          align-items: center;
          padding: 18px;
          margin-bottom: 16px;
        }

        .audioBar audio {
          width: 100%;
          height: 44px;
          border-radius: 999px;
        }

        .outlineBtn {
          min-height: 48px;
          padding: 0 20px;
          border-radius: 16px;
          border: 1px solid #ffc0cc;
          background: white;
          color: #9f001f;
          font-weight: 900;
          cursor: pointer;
        }

        .topicPanel h2 {
          margin: 0 0 12px;
          font-size: 32px;
          color: #3d0810;
        }

        .topicPanel p,
        .transcriptPanel p {
          margin: 0;
          color: #5f5066;
          font-size: 17px;
          line-height: 1.7;
          font-weight: 700;
        }

        .transcriptPanel {
          margin-bottom: 18px;
        }

        .transcriptText {
          color: #4b465f;
          font-size: 18px;
          line-height: 1.8;
          font-weight: 700;
        }

        .transcriptText p {
          margin: 0 0 10px;
        }

        .transcriptText strong {
          color: #e6003f;
          font-weight: 900;
        }

        .answerHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }

        .answerHeader h2 {
          margin: 0;
          font-size: 34px;
          font-weight: 500;
        }

        .answerHeader span {
          border: 1px solid #ffc0cc;
          background: #fff4f6;
          color: #e6003f;
          border-radius: 999px;
          padding: 12px 22px;
          font-weight: 900;
          white-space: nowrap;
        }

        .matchingGrid {
          display: grid;
          gap: 14px;
        }

        .matchRow {
          display: grid;
          grid-template-columns: 160px minmax(260px, 1fr) minmax(180px, auto);
          align-items: center;
          gap: 14px;
          min-height: 82px;
          border: 1px solid #ffe0e6;
          border-radius: 22px;
          background: white;
          padding: 14px 18px;
        }

        .matchRow.correct {
          border-color: #86efac;
          background: #f0fff4;
        }

        .matchRow.wrong {
          border-color: #ffc0cc;
          background: #fff0f3;
        }

        .personTag {
          color: #e6003f;
          font-size: 18px;
          font-weight: 900;
        }

        .matchRow select {
          width: 100%;
          min-height: 54px;
          border: 1px solid #ffc0cc;
          border-radius: 16px;
          background: white;
          color: #25243a;
          font-size: 17px;
          font-weight: 900;
          padding: 0 16px;
          outline: none;
        }

        .matchRow select:focus {
          border-color: #e6003f;
          box-shadow: 0 0 0 4px rgba(230, 0, 63, 0.08);
        }

        .resultText {
          color: #9f001f;
          font-weight: 900;
          line-height: 1.4;
        }

        .correct .resultText {
          color: #047857;
        }

        .bottomActions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 22px;
          padding-bottom: 24px;
        }

        .checkBtn,
        .navBtns button {
          min-height: 58px;
          border: 0;
          border-radius: 18px;
          padding: 0 28px;
          font-size: 17px;
          font-weight: 900;
          cursor: pointer;
        }

        .checkBtn,
        .nextBtn {
          background: #e6003f;
          color: white;
          box-shadow: 0 14px 26px rgba(230, 0, 63, 0.2);
        }

        .navBtns {
          display: flex;
          gap: 12px;
        }

        .navBtns button {
          border: 1px solid #ffc0cc;
          background: #fff4f6;
          color: #9f001f;
        }

        .navBtns button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .scorePill {
          min-height: 54px;
          display: flex;
          align-items: center;
          border-radius: 999px;
          border: 1px solid #ffc0cc;
          background: white;
          color: #e6003f;
          padding: 0 22px;
          font-weight: 900;
        }

        @media (max-width: 950px) {
          .heroCard,
          .topGrid,
          .matchRow,
          .bottomActions {
            grid-template-columns: 1fr;
        }

          .bottomActions {
            display: grid;
          }

          .navBtns {
            display: grid;
          }

          .progressBox {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}

export default function ListeningPart2Page() {
  return (
    <Suspense
      fallback={
        <main style={{ minHeight: "100vh", padding: 24, background: "#fff6f8", color: "#e6003f", fontWeight: 900 }}>
          Đang tải Part 2...
        </main>
      }
    >
      <ListeningPart2Content />
    </Suspense>
  );
}
