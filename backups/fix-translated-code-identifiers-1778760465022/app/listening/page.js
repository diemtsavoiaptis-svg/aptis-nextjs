"use client";

import Link from "next/link";

const parts = [
  {
    href: "/listening/part-1",
    number: "1",
    label: "PART 1",
    title: "Hội thoại ngắn",
    desc: "Listen to short conversations and choose the correct answer A/B/C.",
    tag: "Multiple Choice",
  },
  {
    href: "/listening/part-2",
    number: "2",
    label: "PART 2",
    title: "Nối thông tin",
    desc: "Listen and match information with the correct speaker, place, or detail.",
    tag: "Matching",
  },
  {
    href: "/listening/part-3",
    number: "3",
    label: "PART 3",
    title: "Ý kiến / Nhân vật",
    desc: "Identify the speaker, identity, or their specific point of view.",
    tag: "Speaker Opinion",
  },
  {
    href: "/listening/part-4",
    number: "4",
    label: "PART 4",
    title: "Bài nói dài / Tóm tắt",
    desc: "Listen to a longer passage and identify the main topic or theme.",
    tag: "Main Idea",
  },
];

export default function ListeningHomePage() {
  return (
    <main className="listeningPage">
      <section className="listeningShell">
        <header className="mainHero">
          <div>
            <p className="eyebrow">APTIS LISTENING PRACTICE</p>
            <h1>Listening Module</h1>
            <p>
              A clean 4-part practice structure for Khách Preview and Học viên Access.
              This is a design-only version. Real data will be imported later.
            </p>
          </div>

          <div className="heroBadge">
            <span>4</span>
            <strong>Parts</strong>
          </div>
        </header>

        <section className="partGrid">
          {parts.map((part) => (
            <Link href={part.href} className="partCard" key={part.number}>
              <div className="partIcon">
                <small>{part.label}</small>
                <strong>{part.number}</strong>
              </div>

              <div className="partContent">
                <div className="partTop">
                  <span>{part.tag}</span>
                  <b>Đang thiết kế Preview</b>
                </div>

                <h2>{part.title}</h2>
                <p>{part.desc}</p>

                <div className="partFooter">
                  <strong>Open preview</strong>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
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

        .listeningPage {
          min-height: 100vh;
          padding: 28px 12px;
          background:
            linear-gradient(rgba(255, 246, 248, 0.92), rgba(255, 246, 248, 0.92)),
            repeating-linear-gradient(
              -14deg,
              rgba(244, 63, 94, 0.075) 0,
              rgba(244, 63, 94, 0.075) 2px,
              transparent 2px,
              transparent 86px
            );
          color: #3d0810;
          font-family: Arial, sans-serif;
        }

        .listeningShell {
          width: min(1080px, 100%);
          margin: 0 auto;
          padding: 28px;
          border-radius: 34px;
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(244, 63, 94, 0.18);
          box-shadow: 0 24px 80px rgba(190, 18, 60, 0.14);
        }

        .mainHero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 22px;
          padding: 28px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(244, 63, 94, 0.14);
          margin-bottom: 22px;
        }

        .eyebrow {
          margin: 0 0 10px;
          color: #d90429;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .mainHero h1 {
          margin: 0 0 12px;
          color: #3d0810;
          font-size: clamp(38px, 6vw, 68px);
          line-height: 0.95;
          font-weight: 500;
        }

        .mainHero p {
          margin: 0;
          max-width: 690px;
          color: #70404a;
          font-size: 17px;
          line-height: 1.65;
        }

        .heroBadge {
          width: 136px;
          height: 136px;
          border-radius: 34px;
          background: linear-gradient(135deg, #ff315b, #d90429);
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 44px rgba(217, 4, 41, 0.22);
          flex: 0 0 auto;
        }

        .heroBadge span {
          font-size: 58px;
          line-height: 1;
          font-weight: 900;
        }

        .heroBadge strong {
          font-size: 17px;
          margin-top: 8px;
        }

        .partGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .partCard {
          display: grid;
          grid-template-columns: 104px 1fr;
          gap: 18px;
          min-height: 230px;
          padding: 20px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #ffc0cc;
          color: inherit;
          text-decoration: none;
          transition: 0.18s ease;
        }

        .partCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 42px rgba(190, 18, 60, 0.13);
        }

        .partIcon {
          width: 104px;
          height: 104px;
          border-radius: 28px;
          background: linear-gradient(135deg, #ff315b, #d90429);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 18px 34px rgba(217, 4, 41, 0.18);
        }

        .partIcon small {
          font-size: 13px;
          font-weight: 900;
        }

        .partIcon strong {
          margin-top: 8px;
          font-size: 46px;
          line-height: 1;
        }

        .partContent {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .partTop {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-bottom: 18px;
        }

        .partTop span,
        .partTop b {
          min-height: 34px;
          padding: 0 13px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          background: #fff0f3;
          border: 1px solid #ffc6d0;
          color: #9f001f;
          font-size: 13px;
          font-weight: 900;
        }

        .partContent h2 {
          margin: 0 0 10px;
          color: #3d0810;
          font-size: 28px;
          line-height: 1.12;
          font-weight: 700;
        }

        .partContent p {
          margin: 0;
          color: #70404a;
          font-size: 15px;
          line-height: 1.55;
        }

        .partFooter {
          margin-top: auto;
          padding-top: 18px;
          display: flex;
          justify-content: space-between;
          color: #d90429;
          font-weight: 900;
        }

        @media (max-width: 860px) {
          .partGrid {
            grid-template-columns: 1fr;
          }

          .mainHero {
            align-items: flex-start;
          }

          .heroBadge {
            width: 100px;
            height: 100px;
            border-radius: 28px;
          }

          .heroBadge span {
            font-size: 42px;
          }
        }

        @media (max-width: 620px) {
          .listeningShell {
            padding: 16px;
            border-radius: 24px;
          }

          .mainHero {
            flex-direction: column;
          }

          .partCard {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
