"use client";

import { useMemo, useState } from "react";

const demoContent = {
  1: {
    label: "PART 1",
    title: "Listening Part 1 Practice",
    subtitle: "Listen to short audio and choose the correct answer A/B/C.",
    type: "Short Conversations",
    questions: [
      {
        question: "What did she advise for people who lack motivation at work?",
        options: ["Furniture", "Home", "Bicycle"],
        voiceText:
          "Welcome! I’m so glad you are interested in this beautiful property. This house was built in the 1920s and has maintained much of its original charm. The hardwood floors you see here are completely original, and they’ve been carefully preserved over the years. However, the furniture you see isn’t original. It was replaced a few years ago to give the home a more modern, functional feel.",
      },
      {
        question: "Where does the man want to go this afternoon?",
        options: ["The library", "The station", "The supermarket"],
        voiceText:
          "The man says he needs to go to the station this afternoon because he wants to buy a ticket before the evening train becomes too crowded.",
      },
      {
        question: "What is the woman planning to buy?",
        options: ["A ticket", "A jacket", "A phone"],
        voiceText:
          "The woman explains that the weather is getting colder, so she is planning to buy a new jacket before her trip.",
      },
      {
        question: "Why is the man calling?",
        options: ["To book a table", "To change a meeting", "To ask for directions"],
        voiceText:
          "The man is calling because he cannot attend the meeting at the original time and wants to move it to a later appointment.",
      },
      {
        question: "What is the problem with the order?",
        options: ["It is late", "It is expensive", "It is broken"],
        voiceText:
          "The customer says the order arrived two days later than expected, so the main problem is that it is late.",
      },
    ],
  },
  2: {
    label: "PART 2",
    title: "Listening Part 2 Practice",
    subtitle: "Listen and match the information with the correct option.",
    type: "Information Matching",
    questions: [
      {
        question: "Match the speaker with the correct activity.",
        options: ["Planning a trip", "Buying a gift", "Joining a class"],
        voiceText:
          "Speaker one is checking hotel prices and looking at transport options. Speaker two is choosing something for a friend’s birthday. Speaker three wants to improve their skills by attending weekly lessons.",
      },
      {
        question: "Match the place with the correct description.",
        options: ["Quiet area", "Busy entrance", "New building"],
        voiceText:
          "The first place is away from the main road and is very peaceful. The second place is near the front door where many people pass through. The third place was completed only last month.",
      },
      {
        question: "Match the announcement with the correct detail.",
        options: ["Time changed", "Room changed", "Price changed"],
        voiceText:
          "The announcement says the session will now begin at three o’clock instead of two o’clock. The room and price remain the same.",
      },
      {
        question: "Match the person with their main reason.",
        options: ["Work", "Study", "Travel"],
        voiceText:
          "One person needs the course for their job. Another person wants to prepare for university. The last person wants to communicate better when visiting another country.",
      },
      {
        question: "Match the item with the correct location.",
        options: ["Reception", "Office", "Storage room"],
        voiceText:
          "The keys are kept at reception, the documents are in the office, and the extra chairs are in the storage room.",
      },
    ],
  },
  3: {
    label: "PART 3",
    title: "Listening Part 3 Practice",
    subtitle: "Identify the speaker or their specific point of view.",
    type: "Opinion / Identity",
    questions: [
      {
        question: "Which speaker thinks online learning is more convenient?",
        options: ["Speaker A", "Speaker B", "Speaker C"],
        voiceText:
          "Speaker A says online learning saves time because students do not need to travel. Speaker B prefers face-to-face lessons. Speaker C thinks both methods can be useful.",
      },
      {
        question: "Which speaker prefers working in a team?",
        options: ["Speaker A", "Speaker B", "Speaker C"],
        voiceText:
          "Speaker B says working with others helps generate more creative ideas and makes difficult tasks easier to complete.",
      },
      {
        question: "Which speaker has a negative opinion about the new plan?",
        options: ["Speaker A", "Speaker B", "Speaker C"],
        voiceText:
          "Speaker C says the new plan is confusing and may create more problems than it solves.",
      },
      {
        question: "Which speaker is most confident about the result?",
        options: ["Speaker A", "Speaker B", "Speaker C"],
        voiceText:
          "Speaker A says they are completely sure the project will succeed because the team has prepared carefully.",
      },
      {
        question: "Which speaker gives a personal example?",
        options: ["Speaker A", "Speaker B", "Speaker C"],
        voiceText:
          "Speaker B describes their own experience from last year to explain why they agree with the idea.",
      },
    ],
  },
  4: {
    label: "PART 4",
    title: "Listening Part 4 Practice",
    subtitle: "Listen to a monologue and identify the main topic or theme.",
    type: "Monologue / Summary",
    questions: [
      {
        question: "What is the main topic of the passage?",
        options: ["A local project", "A travel problem", "A business idea"],
        voiceText:
          "The speaker describes a local project designed to improve public parks, create safer walking paths, and encourage residents to spend more time outdoors.",
      },
      {
        question: "What is the speaker mainly explaining?",
        options: ["A process", "A complaint", "A personal story"],
        voiceText:
          "The speaker mainly explains the process of applying for a community grant, including preparing documents, submitting forms, and waiting for approval.",
      },
      {
        question: "What is the purpose of the talk?",
        options: ["To inform", "To persuade", "To apologize"],
        voiceText:
          "The purpose of the talk is to inform listeners about changes to the local transport schedule and explain how the new system will work.",
      },
      {
        question: "Which title best matches the passage?",
        options: ["Changing Cities", "Learning Faster", "Saving Money"],
        voiceText:
          "The passage discusses how cities are changing because of new technology, public transport improvements, and different lifestyles.",
      },
      {
        question: "What is the speaker's final point?",
        options: ["Start early", "Ask for help", "Check the details"],
        voiceText:
          "At the end, the speaker reminds listeners that careful planning is important and says they should always check the details before making a final decision.",
      },
    ],
  },
};

export default function ListeningPartPreview({ part = 1 }) {
  const data = demoContent[part] || demoContent[1];
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [showVoice, setShowVoice] = useState(false);

  const current = data.questions[activeIndex];
  const total = data.questions.length;
  const progressPercent = useMemo(() => ((activeIndex + 1) / total) * 100, [activeIndex, total]);

  function goNext() {
    if (activeIndex < total - 1) {
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

  return (
    <main className="page">
      <section className="shell">
        <header className="hero">
          <div className="partBadge">
            <span>PART</span>
            <strong>{part}</strong>
          </div>

          <div className="heroText">
            <p>{data.type}</p>
            <h1>{data.title}</h1>
            <span>{data.subtitle}</span>
          </div>
        </header>

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
            <span className="unlockPill">Design Preview</span>
          </div>

          <h2 className="questionTitle">{current.question}</h2>

          <div className="audioBox">
            <strong>Audio preview placeholder</strong>
          </div>

          <div className="voiceTools">
            <button type="button" className="voiceBtn" onClick={() => setShowVoice(!showVoice)}>
              {showVoice ? "Hide check voice" : "Check voice"}
            </button>
          </div>

          {showVoice ? (
            <div className="voicePanel">
              <strong>Voice content:</strong>
              <p>{current.voiceText}</p>
            </div>
          ) : null}

          <div className="optionsGrid">
            {current.options.map((option, index) => {
              const letter = String.fromCharCode(65 + index);
              const active = selected === option;

              return (
                <button
                  key={option}
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
      </section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #fff6f8;
        }

        .page {
          min-height: 100vh;
          padding: 28px 12px;
          background:
            linear-gradient(rgba(255, 246, 248, 0.9), rgba(255, 246, 248, 0.9)),
            repeating-linear-gradient(
              -14deg,
              rgba(244, 63, 94, 0.08) 0,
              rgba(244, 63, 94, 0.08) 2px,
              transparent 2px,
              transparent 86px
            );
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
          box-shadow: 0 10px 24px rgba(190, 18, 60, 0.09);
          transition: 0.18s ease;
        }

        .voiceBtn:hover {
          transform: translateY(-1px);
          background: linear-gradient(135deg, #ffe7ed, #ffd2dc);
          box-shadow: 0 14px 30px rgba(190, 18, 60, 0.13);
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
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.55);
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
          transition: 0.18s ease;
        }

        .optionBtn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 26px rgba(190, 18, 60, 0.11);
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

        .prevBtn {
          background: #ec8398;
        }

        .nextBtn {
          background: #d90429;
        }

        .prevBtn:disabled,
        .nextBtn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        @media (max-width: 760px) {
          .shell {
            padding: 18px;
            border-radius: 24px;
          }

          .hero {
            align-items: flex-start;
          }

          .partBadge {
            width: 86px;
            height: 86px;
            border-radius: 23px;
          }

          .partBadge strong {
            font-size: 38px;
          }

          .optionsGrid {
            grid-template-columns: 1fr;
          }

          .navRow {
            flex-direction: column;
          }

          .prevBtn,
          .nextBtn {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}

