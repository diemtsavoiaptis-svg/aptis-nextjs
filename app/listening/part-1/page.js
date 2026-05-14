"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const GUEST_LIMIT = 0;

function getStudentMode() {
  if (typeof window === "undefined") return false;

  const params = new URLSearchParams(window.location.search);
  if (params.get("mode") === "student") return true;

  const keys = ["aptis_student", "aptis_user", "student", "user", "currentUser", "isLoggedIn", "loggedIn"];

  return keys.some((key) => {
    const value = window.localStorage.getItem(key);
    if (!value) return false;
    const lower = String(value).toLowerCase();
    return lower === "true" || lower.includes("student") || lower.includes("admin") || lower.includes("@");
  });
}

export default function StudentListeningPart1Page() {
  const audioRef = useRef(null);

  const [allRows, setAllRows] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [showVoice, setShowVoice] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsStudent(getStudentMode());

    fetch("/data/part1-full.json", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setAllRows(Array.isArray(data) ? data : []))
      .catch(() => setMessage("Không tải được dữ liệu Part 1."));
  }, []);

  const visibleRows = useMemo(() => {
    if (isStudent) return allRows;
    return allRows.filter((row) => row.showInGuest).slice(0, GUEST_LIMIT || allRows.length);
  }, [allRows, isStudent]);

  const current = visibleRows[activeIndex];
  const total = visibleRows.length;
  const progressPercent = total ? ((activeIndex + 1) / total) * 100 : 0;

  function audioSrc(row) {
    if (!row) return "";
    if (row.audio_drive_file_id) return `/api/audio?id=${row.audio_drive_file_id}`;
    return row.audio || "";
  }

  function goNext() {
    if (activeIndex + 1 < total) {
      setActiveIndex(activeIndex + 1);
      setSelected("");
      setShowVoice(false);
    }
  }

  function goPrev() {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      setSelected("");
      setShowVoice(false);
    }
  }

  useEffect(() => {
    if (audioRef.current) audioRef.current.load();
  }, [current?.audio, current?.audio_drive_file_id]);

  return (
    <main className="page">
      <section className="shell">
        <header className="hero">
          <div className="partBadge">
            <span>PART</span>
            <strong>1</strong>
          </div>

          <div className="heroText">
            <p>Short Conversations</p>
            <h1>Listening Part 1 Practice</h1>
            <span>
              {isStudent ? "Student Access · Full Part 1 data" : "Guest Preview · Admin-selected questions only"}
            </span>
          </div>
        </header>

        {current ? (
          <>
            <div className="progressTop">
              <strong>Question {activeIndex + 1}/{total}</strong>
              <span>{progressPercent.toFixed(2).replace(".", ",")}%</span>
            </div>

            <div className="progressTrack">
              <div className="progressFill" style={{ width: `${progressPercent}%` }} />
            </div>

            <section className="card">
              <div className="cardTop">
                <span className="questionPill">Question {activeIndex + 1}</span>
                <span className="unlockPill">{isStudent ? "Student" : "Guest"}</span>
              </div>

              <h2 className="questionTitle">{current.question}</h2>

              <div className="audioBox">
                {audioSrc(current) ? (
                  <audio ref={audioRef} controls preload="metadata" src={audioSrc(current)} className="audioPlayer" />
                ) : (
                  <strong>No audio file</strong>
                )}
              </div>

              <div className="voiceTools">
                <button type="button" className="voiceBtn" onClick={() => setShowVoice(!showVoice)}>
                  {showVoice ? "Hide check voice" : "Check voice"}
                </button>
              </div>

              {showVoice ? (
                <div className="voicePanel">
                  <strong>Voice content:</strong>
                  <p>{current.voiceData || "No voice data."}</p>
                </div>
              ) : null}

              <div className="optionsGrid">
                {[current.answerA, current.answerB, current.answerC].map((option, index) => {
                  const letter = String.fromCharCode(65 + index);
                  const active = selected === option;

                  return (
                    <button
                      key={`${option}-${index}`}
                      type="button"
                      className={active ? "optionBtn optionSelected" : "optionBtn"}
                      onClick={() => setSelected(option)}
                    >
                      <span className="letter">{letter}</span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              <button type="button" className="checkBtn">
                Check answer
              </button>

              <div className="navRow">
                <button type="button" className="prevBtn" onClick={goPrev} disabled={activeIndex === 0}>
                  ← Previous question
                </button>

                <button type="button" className="nextBtn" onClick={goNext} disabled={activeIndex === total - 1}>
                  Next question →
                </button>
              </div>
            </section>
          </>
        ) : (
          <section className="card">
            <h2 className="questionTitle">
              {isStudent ? "Chưa có dữ liệu Part 1." : "Chưa có câu nào được chọn cho giao diện khách."}
            </h2>
            <p className="emptyText">
              Vào Admin Part 1 để tick câu muốn hiển thị cho khách.
            </p>
          </section>
        )}
      </section>

      {message ? <div className="notice">{message}</div> : null}

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #fff6f8; }

        .page {
          min-height: 100vh;
          padding: 28px 12px;
          background:
            linear-gradient(rgba(255, 246, 248, 0.9), rgba(255, 246, 248, 0.9)),
            repeating-linear-gradient(-14deg, rgba(244, 63, 94, 0.08) 0, rgba(244, 63, 94, 0.08) 2px, transparent 2px, transparent 86px);
          color: #3d0810;
          font-family: Arial, sans-serif;
        }

        .shell {
          width: min(980px, 100%);
          margin: 0 auto;
          padding: 28px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(244, 63, 94, 0.18);
          box-shadow: 0 22px 70px rgba(190, 18, 60, 0.14);
        }

        .hero {
          display: flex;
          align-items: center;
          gap: 22px;
          margin-bottom: 28px;
        }

        .partBadge {
          width: 108px;
          height: 108px;
          border-radius: 28px;
          background: linear-gradient(135deg, #ff315b, #d90429);
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          box-shadow: 0 18px 36px rgba(217, 4, 41, 0.22);
          flex: 0 0 auto;
        }

        .partBadge span {
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.04em;
        }

        .partBadge strong {
          font-size: 48px;
          line-height: 1;
          margin-top: 12px;
        }

        .heroText p {
          margin: 0 0 7px;
          color: #d90429;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .heroText h1 {
          margin: 0 0 12px;
          color: #3d0810;
          font-size: clamp(34px, 5vw, 48px);
          line-height: 1.05;
          font-weight: 500;
        }

        .heroText span {
          color: #70404a;
          font-size: 17px;
        }

        .progressTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 0 14px;
          color: #4a0b14;
          font-size: 16px;
        }

        .progressTrack {
          width: 100%;
          height: 13px;
          border-radius: 999px;
          background: #ffd0da;
          overflow: hidden;
          margin-bottom: 26px;
        }

        .progressFill {
          height: 100%;
          border-radius: 999px;
          background: #f21845;
          transition: width 0.25s ease;
        }

        .card {
          padding: 27px;
          border-radius: 28px;
          border: 1px solid #ffc0cc;
          background: rgba(255, 255, 255, 0.86);
        }

        .cardTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .questionPill,
        .unlockPill {
          min-height: 43px;
          padding: 0 18px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ffc6d0;
          background: #fff7f8;
          color: #9f001f;
          font-weight: 900;
        }

        .questionTitle {
          margin: 0 0 24px;
          color: #3d0810;
          font-size: clamp(26px, 4vw, 34px);
          line-height: 1.25;
          font-weight: 500;
        }

        .audioBox {
          min-height: 67px;
          padding: 16px 20px;
          border-radius: 20px;
          background: #fff0f3;
          color: #9f001f;
          display: flex;
          align-items: center;
          margin-bottom: 14px;
        }

        .audioPlayer {
          width: 100%;
        }

        .voiceTools {
          margin-bottom: 16px;
        }

        .voiceBtn {
          min-height: 48px;
          padding: 0 20px;
          border: 1px solid #ffc0cc;
          border-radius: 999px;
          background: linear-gradient(135deg, #fff0f3, #ffe1e8);
          color: #9f001f;
          font-size: 16px;
          font-weight: 900;
          cursor: pointer;
        }

        .voicePanel {
          margin-bottom: 24px;
          padding: 22px;
          border-radius: 20px;
          border: 1px solid #ffc0cc;
          background: linear-gradient(135deg, rgba(255, 247, 248, 0.96), rgba(255, 240, 243, 0.92));
          color: #3d0810;
          line-height: 1.65;
          font-size: 17px;
        }

        .voicePanel strong {
          display: inline-flex;
          min-height: 36px;
          padding: 0 14px;
          margin-bottom: 16px;
          border-radius: 999px;
          align-items: center;
          background: #fff0f3;
          border: 1px solid #ffc6d0;
          color: #9f001f;
          font-size: 16px;
          font-weight: 900;
        }

        .voicePanel p {
          margin: 0;
        }

        .optionsGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .optionBtn {
          min-height: 81px;
          padding: 18px 20px;
          border-radius: 20px;
          border: 1px solid #ffc0cc;
          background: rgba(255, 255, 255, 0.9);
          color: #3d0810;
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
        }

        .letter {
          width: 41px;
          height: 41px;
          border-radius: 999px;
          background: #fff0f3;
          color: #9f001f;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          flex: 0 0 auto;
        }

        .optionSelected {
          border-color: #ef476f;
          background: #fff4f6;
        }

        .checkBtn {
          width: 100%;
          min-height: 59px;
          border: 0;
          border-radius: 17px;
          background: #ec8398;
          color: #fff;
          font-size: 17px;
          font-weight: 900;
          cursor: pointer;
          margin-bottom: 22px;
        }

        .navRow {
          display: flex;
          justify-content: space-between;
          gap: 14px;
        }

        .prevBtn,
        .nextBtn {
          min-height: 58px;
          padding: 0 23px;
          border-radius: 17px;
          border: 0;
          color: #fff;
          font-size: 16px;
          font-weight: 900;
          cursor: pointer;
        }

        .prevBtn { background: #ec8398; }
        .nextBtn { background: #d90429; }

        .prevBtn:disabled,
        .nextBtn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .emptyText {
          color: #70404a;
          font-size: 17px;
        }

        .notice {
          position: fixed;
          right: 18px;
          bottom: 18px;
          padding: 14px 18px;
          border-radius: 16px;
          background: #d90429;
          color: white;
          font-weight: 900;
        }

        @media (max-width: 760px) {
          .shell { padding: 18px; border-radius: 24px; }
          .hero { align-items: flex-start; }
          .partBadge { width: 86px; height: 86px; border-radius: 23px; }
          .partBadge strong { font-size: 38px; }
          .optionsGrid { grid-template-columns: 1fr; }
          .navRow { flex-direction: column; }
          .prevBtn, .nextBtn { width: 100%; }
        }
      `}</style>
    </main>
  );
}
