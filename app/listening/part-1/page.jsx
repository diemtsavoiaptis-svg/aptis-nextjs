"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "../student-listening.css";

function pick(obj, keys, fallback = "") {
  for (const key of keys) {
    if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
      return obj[key];
    }
  }
  return fallback;
}

function normalizeQuestion(item, index) {
  const optionsObj = pick(item, ["options", "answers", "choices"], null);

  let options = [];

  if (Array.isArray(optionsObj)) {
    options = optionsObj.map((x, i) => ({
      key: x.key || x.label || String.fromCharCode(65 + i),
      text: x.text || x.answer || x.value || String(x),
    }));
  } else if (optionsObj && typeof optionsObj === "object") {
    options = ["A", "B", "C", "D"]
      .map((key) => ({
        key,
        text: optionsObj[key] || optionsObj[key.toLowerCase()] || "",
      }))
      .filter((x) => x.text);
  } else {
    options = [
      { key: "A", text: pick(item, ["A", "answer_a", "option_a", "choice_a", "a"], "") },
      { key: "B", text: pick(item, ["B", "answer_b", "option_b", "choice_b", "b"], "") },
      { key: "C", text: pick(item, ["C", "answer_c", "option_c", "choice_c", "c"], "") },
    ].filter((x) => x.text);
  }

  return {
    id: pick(item, ["id", "pk"], index + 1),
    title: pick(item, ["question", "title", "text", "prompt"], `Câu ${index + 1}`),
    audio: pick(item, ["audio", "audio_url", "audioUrl", "audio_link", "drive_url", "file"], ""),
    correct: String(pick(item, ["correct", "correct_answer", "answer", "right_answer"], "")).trim().toUpperCase(),
    options,
  };
}

export default function ListeningPart1Page() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState(false);
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/data/part1-full.json", { cache: "no-store" });
        const raw = await res.json();
        const list = Array.isArray(raw) ? raw : raw.questions || raw.data || raw.items || [];
        setQuestions(list.map(normalizeQuestion));
      } catch {
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }

    async function checkAccess() {
      try {
        const id = localStorage.getItem("aptis_student_id") || "";
        const role = localStorage.getItem("aptis_role") || "";
        setStudentId(id);

        if (role === "admin") {
          setApproved(true);
          return;
        }

        const res = await fetch("/api/students", { cache: "no-store" });
        const data = await res.json();
        const found = (data.students || []).find((x) => x.id === id);
        setApproved(found?.status === "approved");
      } catch {
        setApproved(false);
      }
    }

    loadData();
    checkAccess();
  }, []);

  const current = questions[currentIndex];

  const audioSrc = useMemo(() => {
    if (!current?.audio) return "";
    if (current.audio.startsWith("/")) return current.audio;
    return `/api/audio?url=${encodeURIComponent(current.audio)}`;
  }, [current]);

  const progress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const lockedNext = !approved && currentIndex >= 0;

  function nextQuestion() {
    if (!approved) return;
    setSelected("");
    setChecked(false);
    setCurrentIndex((value) => Math.min(value + 1, questions.length - 1));
  }

  function previousQuestion() {
    setSelected("");
    setChecked(false);
    setCurrentIndex((value) => Math.max(value - 1, 0));
  }

  return (
    <main className="student-page">
      <section className="student-shell">
        <header className="student-topbar">
          <Link href="/" className="student-brand">
            <span className="student-logo">A</span>
            <span>
              <strong>Điểm TSA Với Aptis</strong>
              <small>Luyện nghe Part 1</small>
            </span>
          </Link>

          <nav className="student-nav">
            <span className="student-id">
              {approved ? `Đã duyệt · ${studentId || "admin"}` : "Truy cập giới hạn"}
            </span>
            <Link href="/register" className="student-nav-btn">Đăng ký</Link>
            <Link href="/listening" className="student-nav-btn">Quay lại</Link>
          </nav>
        </header>

        <section className="student-card">
          <div className="student-hero">
            <div className="part-badge">
              <span>PART</span>
              <strong>1</strong>
            </div>

            <div>
              <h1>Luyện nghe Part 1</h1>
              <p>Nghe audio ngắn và chọn đáp án đúng A/B/C.</p>
            </div>
          </div>

          {!approved && (
            <div className="locked-banner">
              <strong>Chế độ giới hạn</strong>
              <span>Bạn chỉ xem được câu đầu tiên. Đăng ký và chờ duyệt để mở khóa toàn bộ bài học.</span>
              <Link href="/register">Đăng ký ngay</Link>
            </div>
          )}

          {loading ? (
            <div className="empty-box">Đang tải câu hỏi...</div>
          ) : !current ? (
            <div className="empty-box">Chưa tìm thấy dữ liệu Part 1.</div>
          ) : (
            <>
              <div className="progress-row">
                <strong>Câu {currentIndex + 1}/{questions.length}</strong>
                <span>{progress.toFixed(2).replace(".", ",")}%</span>
              </div>

              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>

              <article className="question-card">
                <div className="question-head">
                  <span>Câu {currentIndex + 1}</span>
                  <em>{approved ? "Đã mở khóa" : "Giới hạn"}</em>
                </div>

                <h2>{current.title}</h2>

                {audioSrc ? (
                  <audio controls preload="metadata" src={audioSrc} className="audio-player" />
                ) : (
                  <div className="audio-missing">Chưa có file nghe</div>
                )}

                <div className="answer-grid">
                  {current.options.map((option) => {
                    const isSelected = selected === option.key;
                    const isCorrect = checked && option.key === current.correct;
                    const isWrong = checked && isSelected && option.key !== current.correct;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        className={[
                          "answer-btn",
                          isSelected ? "selected" : "",
                          isCorrect ? "correct" : "",
                          isWrong ? "wrong" : "",
                        ].join(" ")}
                        onClick={() => {
                          setSelected(option.key);
                          setChecked(false);
                        }}
                      >
                        <span>{option.key}</span>
                        <p>{option.text}</p>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="check-btn"
                  onClick={() => setChecked(true)}
                  disabled={!selected}
                >
                  Kiểm tra đáp án
                </button>

                {checked && (
                  <div className={selected === current.correct ? "result-box correct" : "result-box wrong"}>
                    {selected === current.correct
                      ? "Đáp án đúng!"
                      : `Sai rồi. Đáp án đúng là: ${current.correct || "Chưa rõ"}`}
                  </div>
                )}

                <div className="bottom-actions">
                  <button type="button" onClick={previousQuestion} disabled={currentIndex === 0}>
                    ← Câu trước
                  </button>

                  <button type="button" onClick={nextQuestion} disabled={lockedNext || currentIndex === questions.length - 1}>
                    {approved ? "Câu tiếp theo →" : "Đăng ký để mở khóa 🔒"}
                  </button>
                </div>
              </article>
            </>
          )}
        </section>
      </section>
    </main>
  );
}
