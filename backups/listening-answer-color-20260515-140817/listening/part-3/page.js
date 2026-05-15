"use client";

import { useEffect, useMemo, useState } from "react";

const answerOptions = ["Man", "Woman", "Both"];

function normalize(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function extractDriveId(url) {
  const text = String(url || "");
  const match = text.match(/\/d\/([^/]+)/);
  return match ? match[1] : "";
}

function getAudioSrc(row) {
  const driveId =
    row?.audio_drive_file_id ||
    row?.audioDriveFileId ||
    row?.driveFileId ||
    extractDriveId(row?.audioLink || row?.audio || "");

  if (driveId) return `/api/audio?id=${encodeURIComponent(driveId)}`;
  return row?.audioLink || row?.audio || "";
}

function compactTranscript(text) {
  return String(text || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b(W|Woman)\s*:/g, "\nW:")
    .replace(/\b(M|Man)\s*:/g, "\nM:")
    .replace(/^\n/, "");
}

function getStatements(row) {
  return [
    { id: 1, question: row?.question1 || "", answer: row?.answer1 || "" },
    { id: 2, question: row?.question2 || "", answer: row?.answer2 || "" },
    { id: 3, question: row?.question3 || "", answer: row?.answer3 || "" },
    { id: 4, question: row?.question4 || "", answer: row?.answer4 || "" },
  ].filter((item) => item.question);
}

export default function ListeningPart3Page() {
  const [mode, setMode] = useState("guest");
  const [rows, setRows] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentMode = params.get("mode") === "student" ? "student" : "guest";
    setMode(currentMode);

    async function loadData() {
      try {
        const file =
          currentMode === "student"
            ? "/data/part3-full.json"
            : "/data/part3-admin.json";

        const res = await fetch(file, { cache: "no-store" });
        if (!res.ok) throw new Error("Cannot load Part 3 data");

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.rows || [];

        const nextRows =
          currentMode === "student"
            ? list
            : list.filter((row) => row.showInGuest || row.guestVisible);

        setRows(nextRows);
        setActiveIndex(0);
      } catch (error) {
        console.error(error);
        setRows([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const currentRow = rows[activeIndex] || {};
  const statements = useMemo(() => getStatements(currentRow), [currentRow]);
  const currentAnswers = answers[activeIndex] || {};
  const progress = rows.length ? ((activeIndex + 1) / rows.length) * 100 : 0;

  function chooseAnswer(statementId, value) {
    setAnswers((old) => ({
      ...old,
      [activeIndex]: {
        ...(old[activeIndex] || {}),
        [statementId]: value,
      },
    }));
    setChecked(false);
  }

  function checkAnswers() {
    setChecked(true);
  }

  function getResult(statement) {
    const selected = currentAnswers[statement.id];
    if (!selected) return "missing";
    if (!statement.answer) return "info";
    return normalize(selected) === normalize(statement.answer) ? "correct" : "wrong";
  }

  function goPrevious() {
    setActiveIndex((index) => Math.max(0, index - 1));
    setChecked(false);
    setShowVoice(false);
  }

  function goNext() {
    setActiveIndex((index) => Math.min(rows.length - 1, index + 1));
    setChecked(false);
    setShowVoice(false);
  }

  if (loading) {
    return (
      <main className="part3DesktopPage">
        <section className="part3DesktopShell">
          <div className="emptyBox">Đang tải dữ liệu Part 3...</div>
        </section>
      </main>
    );
  }

  if (!rows.length) {
    return (
      <main className="part3DesktopPage">
        <section className="part3DesktopShell">
          <div className="emptyBox">
            {mode === "student"
              ? "Chưa có dữ liệu Part 3."
              : "Chưa có bài Part 3 nào được chọn cho giao diện khách."}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="part3DesktopPage">
      <section className="part3DesktopShell">
        <header className="part3Hero">
          <div className="partNumber">{activeIndex + 1}</div>

          <div className="heroText">
            <p>APTIS ESOL</p>
            <h1>Listening Part 3</h1>
            <span>
              {mode === "student"
                ? "Chế độ học viên · Toàn bộ dữ liệu Part 3"
                : "Chế độ khách · Các bài đã được chọn"}
            </span>
          </div>

          <div className="progressBox">
            <strong>
              Bài {activeIndex + 1}/{rows.length}
            </strong>
            <div className="progressTrack">
              <div style={{ width: `${progress}%` }} />
            </div>
          </div>
        </header>

        <section className="audioSection">
          <div className="audioMain">
            <div className="audioLabel">Audio</div>

            <div className="audioPlayerBox">
              {getAudioSrc(currentRow) ? (
                <audio controls src={getAudioSrc(currentRow)} />
              ) : (
                <p>Chưa có audio.</p>
              )}
            </div>
          </div>

          <button
            type="button"
            className="transcriptBtn"
            onClick={() => setShowVoice((value) => !value)}
          >
            {showVoice ? "Ẩn lời thoại" : "Xem lời thoại"}
          </button>
        </section>

        {showVoice && (
          <section className="voiceBox">
            {compactTranscript(currentRow.voiceParagraph) ||
              "Chưa có dữ liệu lời thoại."}
          </section>
        )}

        <section className="answerPanel">
          <div className="answerList">
            {statements.map((statement) => {
              const selected = currentAnswers[statement.id] || "";
              const result = checked ? getResult(statement) : "";

              return (
                <article
                  key={statement.id}
                  className={checked ? `answerRow ${result}` : "answerRow"}
                >
                  <div className="questionInfo">
                    <span>Câu {statement.id}</span>
                    <p>{statement.question}</p>

                    {checked && result === "correct" && (
                      <small className="correctText">Chính xác</small>
                    )}

                    {checked && result === "wrong" && (
                      <small className="wrongText">
                        Đáp án đúng: {statement.answer}
                      </small>
                    )}

                    {checked && result === "missing" && (
                      <small className="missingText">Chưa chọn đáp án</small>
                    )}

                    {checked && result === "info" && (
                      <small className="missingText">
                        Câu này chưa có đáp án đúng trong dữ liệu.
                      </small>
                    )}
                  </div>

                  <select
                    value={selected}
                    onChange={(event) => chooseAnswer(statement.id, event.target.value)}
                  >
                    <option value="">-- Chọn đáp án</option>
                    {answerOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bottomActions">
          <button type="button" className="checkBtn" onClick={checkAnswers}>
            Kiểm tra đáp án
          </button>

          <div className="navButtons">
            <button type="button" onClick={goPrevious} disabled={activeIndex === 0}>
              ← Bài trước
            </button>

            <button
              type="button"
              className="nextBtn"
              onClick={goNext}
              disabled={activeIndex === rows.length - 1}
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
          background: #fff7f9;
          font-family: Arial, sans-serif;
        }

        .part3DesktopPage {
          min-height: 100vh;
          padding: 24px;
          background:
            linear-gradient(rgba(255, 247, 249, 0.96), rgba(255, 247, 249, 0.96)),
            repeating-linear-gradient(
              -14deg,
              rgba(242, 24, 88, 0.06) 0,
              rgba(242, 24, 88, 0.06) 2px,
              transparent 2px,
              transparent 84px
            );
          color: #202033;
        }

        .part3DesktopShell {
          width: min(1320px, 100%);
          margin: 0 auto;
        }

        .part3Hero {
          display: grid;
          grid-template-columns: 76px 1fr minmax(240px, 340px);
          gap: 18px;
          align-items: center;
          border-radius: 28px;
          border: 1px solid #ffd0dc;
          background: rgba(255, 255, 255, 0.94);
          padding: 20px 24px;
          box-shadow: 0 14px 30px rgba(190, 18, 60, 0.09);
          margin-bottom: 14px;
        }

        .partNumber {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: #f21858;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          font-weight: 900;
          box-shadow: 0 12px 22px rgba(242, 24, 88, 0.22);
        }

        .heroText p {
          margin: 0 0 4px;
          color: #f21858;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .heroText h1 {
          margin: 0 0 6px;
          color: #202033;
          font-size: clamp(34px, 4vw, 52px);
          line-height: 1;
        }

        .heroText span {
          color: #724350;
          font-size: 16px;
        }

        .progressBox strong {
          display: block;
          margin-bottom: 8px;
          color: #202033;
          font-size: 15px;
        }

        .progressTrack {
          height: 10px;
          border-radius: 999px;
          overflow: hidden;
          background: #ffd0dc;
        }

        .progressTrack div {
          height: 100%;
          border-radius: inherit;
          background: #f21858;
        }

        .audioSection {
          display: grid;
          grid-template-columns: 1fr 170px;
          gap: 12px;
          margin-bottom: 12px;
        }

        .audioMain {
          display: grid;
          grid-template-columns: 76px 1fr;
          align-items: center;
          gap: 10px;
          border-radius: 20px;
          background: #f21858;
          padding: 10px 14px;
          box-shadow: 0 10px 20px rgba(242, 24, 88, 0.16);
        }

        .audioLabel {
          color: white;
          font-weight: 900;
          font-size: 15px;
          text-align: center;
        }

        .audioPlayerBox {
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.22);
          padding: 6px 10px;
        }

        .audioPlayerBox audio {
          width: 100%;
          height: 30px;
        }

        .audioPlayerBox p {
          margin: 0;
          color: white;
          font-weight: 900;
        }

        .transcriptBtn {
          min-height: 52px;
          border-radius: 18px;
          border: 2px solid #f21858;
          background: white;
          color: #f21858;
          font-weight: 900;
          cursor: pointer;
          font-size: 15px;
        }

        .voiceBox {
          max-height: 160px;
          overflow-y: auto;
          white-space: pre-wrap;
          border-radius: 16px;
          border: 1px solid #ffd0dc;
          background: #fff7f9;
          color: #4d4d62;
          font-size: 15px;
          line-height: 1.55;
          padding: 14px 16px;
          margin-bottom: 12px;
        }

        .answerPanel {
          border-radius: 24px;
          background: #f7f7fa;
          padding: 16px;
          margin-bottom: 16px;
          box-shadow: inset 0 0 0 1px #eeeeF3;
        }

        .answerList {
          display: grid;
          gap: 10px;
        }

        .answerRow {
          display: grid;
          grid-template-columns: 1fr 220px;
          gap: 16px;
          align-items: center;
          min-height: 70px;
          border-radius: 18px;
          border: 1px solid #eeeeF3;
          background: white;
          padding: 12px 16px;
        }

        .answerRow.correct {
          border-color: #8ed9a8;
          background: #f0fff5;
        }

        .answerRow.wrong {
          border-color: #ff9eb0;
          background: #fff0f3;
        }

        .answerRow.missing {
          border-color: #ffd28a;
          background: #fff8e8;
        }

        .questionInfo span {
          display: block;
          margin-bottom: 4px;
          color: #f21858;
          font-size: 12px;
          font-weight: 900;
        }

        .questionInfo p {
          margin: 0;
          color: #303044;
          font-size: 16px;
          font-weight: 800;
          line-height: 1.28;
        }

        .questionInfo small {
          display: block;
          margin-top: 6px;
          font-weight: 900;
        }

        .correctText {
          color: #098447;
        }

        .wrongText {
          color: #d90429;
        }

        .missingText {
          color: #a66a00;
        }

        .answerRow select {
          width: 100%;
          height: 44px;
          border-radius: 14px;
          border: 1px solid #e3e3ea;
          background: white;
          color: #303044;
          padding: 0 14px;
          font-weight: 800;
          outline: none;
        }

        .bottomActions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-top: 6px;
        }

        .checkBtn,
        .navButtons button {
          min-height: 52px;
          border: none;
          border-radius: 16px;
          padding: 0 24px;
          font-weight: 900;
          cursor: pointer;
        }

        .checkBtn,
        .nextBtn {
          background: #f21858;
          color: white;
          box-shadow: 0 10px 20px rgba(242, 24, 88, 0.18);
        }

        .navButtons {
          display: flex;
          gap: 12px;
        }

        .navButtons button {
          background: #ffe5ec;
          color: #f21858;
        }

        .navButtons .nextBtn {
          background: #f21858;
          color: white;
        }

        button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .emptyBox {
          border-radius: 24px;
          background: #fff0f4;
          border: 1px solid #ffd2dc;
          color: #f21858;
          font-weight: 900;
          text-align: center;
          padding: 34px;
        }

        @media (max-width: 900px) {
          .part3Hero,
          .audioSection,
          .answerRow {
            grid-template-columns: 1fr;
          }

          .transcriptBtn {
            min-height: 50px;
          }

          .bottomActions {
            flex-direction: column;
            align-items: stretch;
          }

          .navButtons {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </main>
  );
}
