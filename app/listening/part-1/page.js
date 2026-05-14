"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function getOptions(row) {
  if (Array.isArray(row?.options) && row.options.length) {
    return row.options.filter(Boolean);
  }

  return [
    row?.answerA,
    row?.answerB,
    row?.answerC,
    row?.A,
    row?.B,
    row?.C,
  ].filter(Boolean).slice(0, 3);
}

function getCorrectAnswer(row) {
  return (
    row?.correctAnswer ||
    row?.correct ||
    row?.answer ||
    row?.rightAnswer ||
    row?.dapAnDung ||
    row?.dap_an_dung ||
    row?.["Đáp án đúng"] ||
    row?.["Đáp án"] ||
    ""
  );
}

function getAudioUrl(row) {
  const driveId =
    row?.audio_drive_file_id ||
    row?.audioDriveFileId ||
    row?.driveFileId ||
    row?.fileId ||
    "";

  if (driveId) {
    return `/api/audio?id=${encodeURIComponent(driveId)}`;
  }

  return row?.audio || row?.audioUrl || row?.audioLink || "";
}

export default function ListeningPart1Page() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "student" ? "student" : "guest";

  const [rows, setRows] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [checkedResults, setCheckedResults] = useState({});
  const [showVoice, setShowVoice] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRows() {
      try {
        const url =
          mode === "student"
            ? "/data/part1-full.json"
            : "/data/part1-admin.json";

        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) {
          throw new Error("Cannot load Part 1 data");
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.rows || [];

        const nextRows =
          mode === "student"
            ? list
            : list.filter((row) => row.showInKhách || row.guestVisible);

        setRows(nextRows);
        setCurrentIndex(0);
      } catch (error) {
        console.error(error);
        setRows([]);
      } finally {
        setLoading(false);
      }
    }

    loadRows();
  }, [mode]);

  const currentRow = rows[currentIndex] || {};
  const options = useMemo(() => getOptions(currentRow), [currentRow]);
  const selectedAnswer = selectedAnswers[currentIndex] || "";
  const checkedResult = checkedResults[currentIndex] || null;

  const progress = rows.length
    ? Math.round(((currentIndex + 1) / rows.length) * 10000) / 100
    : 0;

  function chooseAnswer(option) {
    setSelectedAnswers((old) => ({
      ...old,
      [currentIndex]: option,
    }));

    setCheckedResults((old) => ({
      ...old,
      [currentIndex]: null,
    }));
  }

  function checkAnswer() {
    if (!selectedAnswer) {
      setCheckedResults((old) => ({
        ...old,
        [currentIndex]: {
          type: "warning",
          message: "Vui lòng chọn A, B hoặc C trước khi kiểm tra.",
        },
      }));
      return;
    }

    const correctAnswer = getCorrectAnswer(currentRow);

    if (!correctAnswer) {
      setCheckedResults((old) => ({
        ...old,
        [currentIndex]: {
          type: "info",
          message:
            "Bạn đã chọn đáp án. Câu này hiện chưa có đáp án đúng.",
        },
      }));
      return;
    }

    const selectedIndex = options.findIndex(
      (option) => normalizeText(option) === normalizeText(selectedAnswer)
    );

    const selectedLetter = ["A", "B", "C"][selectedIndex] || "";
    const correctNormalized = normalizeText(correctAnswer);

    const isCorrect =
      normalizeText(selectedAnswer) === correctNormalized ||
      normalizeText(selectedLetter) === correctNormalized ||
      normalizeText(`${selectedLetter}. ${selectedAnswer}`) === correctNormalized;

    setCheckedResults((old) => ({
      ...old,
      [currentIndex]: {
        type: isCorrect ? "correct" : "wrong",
        message: isCorrect
          ? "Chính xác."
          : `Chưa đúng. Đáp án đúng: ${correctAnswer}`,
      },
    }));
  }

  function goPrevious() {
    setCurrentIndex((index) => Math.max(0, index - 1));
    setShowVoice(false);
  }

  function goNext() {
    setCurrentIndex((index) => Math.min(rows.length - 1, index + 1));
    setShowVoice(false);
  }

  if (loading) {
    return (
      <main className="part1Page">
        <section className="part1Shell">
          <div className="emptyBox">Đang tải dữ liệu Phần 1...</div>
        </section>
      </main>
    );
  }

  if (!rows.length) {
    return (
      <main className="part1Page">
        <section className="part1Shell">
          <div className="emptyBox">
            {mode === "student"
              ? "Không tìm thấy dữ liệu Phần 1."
              : "Chưa có câu nào được chọn cho giao diện khách."}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="part1Page">
      <section className="part1Shell">
        <header className="partHeader">
          <div className="partBadge">1</div>

          <div>
            <p>APTIS LISTENING</p>
            <h1>Luyện tập Phần 1</h1>
            <span>
              {mode === "student"
                ? "Chế độ học viên · Toàn bộ dữ liệu Phần 1"
                : "Chế độ khách · Các câu đã được chọn"}
            </span>
          </div>
        </header>

        <section className="progressBlock">
          <div>
            <strong>
              Câu {currentIndex + 1}/{rows.length}
            </strong>
            <span>{progress}%</span>
          </div>

          <div className="progressBar">
            <div style={{ width: `${progress}%` }} />
          </div>
        </section>

        <section className="questionCard">
          <div className="questionTop">
            <span>Câu {currentRow.stt || currentRow.order || currentIndex + 1}</span>
            <span>{mode === "student" ? "Học viên" : "Khách"}</span>
          </div>

          <h2>{currentRow.question || currentRow["Câu hỏi"] || "Câu text"}</h2>

          <div className="audioBox">
            {getAudioUrl(currentRow) ? (
              <audio controls src={getAudioUrl(currentRow)} />
            ) : (
              <p>Chưa có audio.</p>
            )}
          </div>

          <button
            type="button"
            className="voiceBtn"
            onClick={() => setShowVoice((value) => !value)}
          >
            Xem lời thoại
          </button>

          {showVoice && (
            <div className="voiceBox">
              {currentRow.voiceData ||
                currentRow.voiceParagraph ||
                currentRow["dữ liệu voice"] ||
                "Chưa có dữ liệu lời thoại."}
            </div>
          )}

          <div className="optionsGrid">
            {options.map((option, index) => {
              const letter = ["A", "B", "C"][index] || String(index + 1);
              const active = selectedAnswer === option;

              return (
                <button
                  key={`${letter}-${option}`}
                  type="button"
                  className={active ? "optionBtn active" : "optionBtn"}
                  onClick={() => chooseAnswer(option)}
                >
                  <span>{letter}</span>
                  <strong>{option}</strong>
                </button>
              );
            })}
          </div>

          <button type="button" className="checkBtn" onClick={checkAnswer}>
            Kiểm tra đáp án
          </button>

          {checkedResult && (
            <div className={`resultBox ${checkedResult.type}`}>
              {checkedResult.message}
            </div>
          )}

          <div className="navButtons">
            <button
              type="button"
              onClick={goPrevious}
              disabled={currentIndex === 0}
            >
              ← Câu trước
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={currentIndex === rows.length - 1}
            >
              Câu tiếp theo →
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
          font-family: Arial, sans-serif;
        }

        .part1Page {
          min-height: 100vh;
          padding: 26px 18px;
          background:
            linear-gradient(rgba(255, 246, 248, 0.96), rgba(255, 246, 248, 0.96)),
            repeating-linear-gradient(
              -14deg,
              rgba(244, 63, 94, 0.075) 0,
              rgba(244, 63, 94, 0.075) 2px,
              transparent 2px,
              transparent 86px
            );
          color: #3d0810;
        }

        .part1Shell {
          width: min(1180px, 100%);
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #ffc0cc;
          border-radius: 30px;
          padding: 32px;
          box-shadow: 0 16px 38px rgba(190, 18, 60, 0.1);
        }

        .partHeader {
          display: flex;
          align-items: center;
          gap: 22px;
          margin-bottom: 28px;
        }

        .partBadge {
          width: 92px;
          height: 92px;
          border-radius: 26px;
          background: linear-gradient(135deg, #ff315b, #d90429);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 54px;
          font-weight: 900;
          box-shadow: 0 16px 30px rgba(217, 4, 41, 0.22);
        }

        .partHeader p {
          margin: 0 0 8px;
          color: #e6003f;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .partHeader h1 {
          margin: 0 0 8px;
          font-size: 48px;
          line-height: 1;
          font-weight: 500;
        }

        .partHeader span {
          color: #7a2d38;
          font-size: 18px;
        }

        .progressBlock {
          margin-bottom: 30px;
        }

        .progressBlock > div:first-child {
          display: flex;
          justify-content: space-between;
          margin-bottom: 14px;
          font-size: 18px;
        }

        .progressBar {
          height: 14px;
          border-radius: 999px;
          overflow: hidden;
          background: #ffc8d4;
        }

        .progressBar div {
          height: 100%;
          border-radius: inherit;
          background: #e6003f;
          transition: width 0.2s ease;
        }

        .questionCard {
          border: 1px solid #ffc0cc;
          border-radius: 28px;
          padding: 32px;
          background: white;
        }

        .questionTop {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 22px;
        }

        .questionTop span {
          border: 1px solid #ffc0cc;
          border-radius: 999px;
          padding: 12px 22px;
          background: #fff7f8;
          color: #9f001f;
          font-weight: 900;
          font-size: 18px;
        }

        .questionCard h2 {
          margin: 0 0 28px;
          font-size: clamp(30px, 3vw, 44px);
          line-height: 1.2;
          font-weight: 500;
        }

        .audioBox {
          padding: 22px;
          border-radius: 24px;
          background: #fff0f3;
          margin-bottom: 18px;
        }

        .audioBox audio {
          width: 100%;
        }

        .audioBox p {
          margin: 0;
          color: #9f001f;
          font-weight: 900;
        }

        .voiceBtn {
          min-height: 54px;
          padding: 0 24px;
          border-radius: 18px;
          border: 1px solid #ffc0cc;
          background: #fff0f3;
          color: #9f001f;
          font-weight: 900;
          cursor: pointer;
          margin-bottom: 18px;
        }

        .voiceBox {
          border: 1px solid #ffc0cc;
          border-radius: 18px;
          background: #fff7f8;
          padding: 18px;
          color: #6f2732;
          line-height: 1.6;
          margin-bottom: 18px;
          white-space: pre-wrap;
        }

        .optionsGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 22px;
        }

        .optionBtn {
          min-height: 82px;
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 18px 22px;
          border-radius: 20px;
          border: 1px solid #ffc0cc;
          background: white;
          color: #3d0810;
          cursor: pointer;
          text-align: left;
        }

        .optionBtn span {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #fff0f3;
          color: #e6003f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          flex-shrink: 0;
        }

        .optionBtn strong {
          font-size: 18px;
        }

        .optionBtn.active {
          border-color: #e6003f;
          box-shadow: 0 0 0 3px rgba(230, 0, 63, 0.08);
          background: #fff7f8;
        }

        .checkBtn {
          width: 100%;
          min-height: 66px;
          border: none;
          border-radius: 18px;
          background: #e6003f;
          color: white;
          font-size: 19px;
          font-weight: 900;
          cursor: pointer;
          margin-bottom: 18px;
        }

        .resultBox {
          border-radius: 18px;
          padding: 18px 20px;
          font-weight: 900;
          margin-bottom: 18px;
        }

        .resultBox.warning {
          background: #fff7e6;
          color: #8a5a00;
          border: 1px solid #ffd88a;
        }

        .resultBox.info {
          background: #eef6ff;
          color: #155d9c;
          border: 1px solid #acd6ff;
        }

        .resultBox.correct {
          background: #ecfdf3;
          color: #057a3d;
          border: 1px solid #9ee6bd;
        }

        .resultBox.wrong {
          background: #fff0f3;
          color: #c00032;
          border: 1px solid #ffc0cc;
        }

        .navButtons {
          display: flex;
          justify-content: space-between;
          gap: 18px;
        }

        .navButtons button {
          min-height: 66px;
          padding: 0 28px;
          border: none;
          border-radius: 18px;
          background: #e6003f;
          color: white;
          font-size: 18px;
          font-weight: 900;
          cursor: pointer;
        }

        .navButtons button:disabled {
          background: #f2b6c4;
          cursor: not-allowed;
        }

        .emptyBox {
          padding: 40px;
          border-radius: 24px;
          background: white;
          border: 1px solid #ffc0cc;
          color: #9f001f;
          font-weight: 900;
          text-align: center;
        }

        @media (max-width: 820px) {
          .part1Shell {
            padding: 18px;
          }

          .partHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .optionsGrid {
            grid-template-columns: 1fr;
          }

          .navButtons {
            flex-direction: column;
          }

          .navButtons button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
