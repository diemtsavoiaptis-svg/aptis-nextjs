"use client";

import Link from "next/link";

const parts = [
  {
    id: 1,
    title: "Listening Part 1",
    subtitle: "Short Conversations",
    description: "Manage short audio questions with A, B, C answer choices.",
    adminHref: "/dashboard/listening/part-1",
    studentHref: "/listening/part-1?mode=student",
    status: "Active",
  },
  {
    id: 2,
    title: "Listening Part 2",
    subtitle: "Information Matching",
    description: "Manage audio, topics, speakers, answer pool and voice data.",
    adminHref: "/dashboard/listening/part-2",
    studentHref: "/listening/part-2",
    status: "Design",
  },
  {
    id: 3,
    title: "Listening Part 3",
    subtitle: "Opinion / Identity",
    description: "Manage audio, topics, four questions and speaker answers.",
    adminHref: "/dashboard/listening/part-3",
    studentHref: "/listening/part-3",
    status: "Design",
  },
  {
    id: 4,
    title: "Listening Part 4",
    subtitle: "Monologue / Summary",
    description: "Manage long audio passages, questions, answers and paraphrase data.",
    adminHref: "/dashboard/listening/part-4",
    studentHref: "/listening/part-4",
    status: "Design",
  },
];

export default function ListeningDashboardPage() {
  return (
    <main className="dashboardPage">
      <aside className="sidebar">
        <div className="brandCard">
          <div className="brandIcon">A</div>
          <div>
            <p>ADMIN SYSTEM</p>
            <h1>Aptis</h1>
          </div>
        </div>

        <nav className="sideNav">
          <Link href="/dashboard" className="navItem">
            <span>D</span>
            <div>
              <strong>Dashboard</strong>
              <small>Overview</small>
            </div>
          </Link>

          <Link href="/dashboard/listening" className="navItem active">
            <span>L</span>
            <div>
              <strong>Listening</strong>
              <small>Admin 1 — 4</small>
            </div>
          </Link>

          <div className="navItem disabled">
            <span>R</span>
            <div>
              <strong>Reading</strong>
              <small>Coming soon</small>
            </div>
          </div>

          <div className="navItem disabled">
            <span>S</span>
            <div>
              <strong>Speaking</strong>
              <small>Coming soon</small>
            </div>
          </div>

          <div className="navItem disabled">
            <span>W</span>
            <div>
              <strong>Writing</strong>
              <small>Coming soon</small>
            </div>
          </div>

          <div className="navItem disabled">
            <span>G&V</span>
            <div>
              <strong>G&V</strong>
              <small>Coming soon</small>
            </div>
          </div>
        </nav>
      </aside>

      <section className="mainContent">
        <header className="hero">
          <div>
            <p>LISTENING MANAGEMENT</p>
            <h2>Listening Dashboard</h2>
            <span>
              Manage all Aptis Listening sections in one fluid, full-width admin workspace.
            </span>
          </div>

          <Link href="/listening" className="previewBtn">
            View Student UI
          </Link>
        </header>

        <section className="summaryGrid">
          <div className="summaryCard">
            <span>Total Parts</span>
            <strong>4</strong>
          </div>
          <div className="summaryCard">
            <span>Active Data</span>
            <strong>Part 1</strong>
          </div>
          <div className="summaryCard">
            <span>Design Mode</span>
            <strong>3 Parts</strong>
          </div>
          <div className="summaryCard">
            <span>Theme</span>
            <strong>Pastel Red</strong>
          </div>
        </section>

        <section className="partsGrid">
          {parts.map((part) => (
            <article key={part.id} className="partCard">
              <div className="partTop">
                <div className="partNumber">{part.id}</div>
                <span>{part.status}</span>
              </div>

              <h3>{part.title}</h3>
              <p className="subtitle">{part.subtitle}</p>
              <p className="description">{part.description}</p>

              <div className="cardActions">
                <Link href={part.adminHref} className="primaryAction">
                  Open Admin
                </Link>
                <Link href={part.studentHref} className="secondaryAction">
                  Student View
                </Link>
              </div>
            </article>
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
          font-family: Arial, sans-serif;
        }

        .dashboardPage {
          min-height: 100vh;
          width: 100%;
          display: flex;
          background:
            linear-gradient(rgba(255, 246, 248, 0.94), rgba(255, 246, 248, 0.94)),
            repeating-linear-gradient(
              -14deg,
              rgba(244, 63, 94, 0.075) 0,
              rgba(244, 63, 94, 0.075) 2px,
              transparent 2px,
              transparent 86px
            );
          color: #3d0810;
        }

        .sidebar {
          width: 280px;
          flex: 0 0 280px;
          min-height: 100vh;
          padding: 24px 18px;
          background: rgba(255, 255, 255, 0.92);
          border-right: 1px solid #ffc0cc;
          box-shadow: 16px 0 40px rgba(190, 18, 60, 0.08);
        }

        .brandCard {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px;
          border-radius: 26px;
          background: #fff0f3;
          margin-bottom: 28px;
        }

        .brandIcon {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          background: linear-gradient(135deg, #ff315b, #d90429);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 900;
          box-shadow: 0 12px 24px rgba(217, 4, 41, 0.2);
        }

        .brandCard p {
          margin: 0 0 4px;
          color: #e6003f;
          font-size: 11px;
          font-weight: 900;
        }

        .brandCard h1 {
          margin: 0;
          font-size: 22px;
          color: #3d0810;
        }

        .sideNav {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .navItem {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          border-radius: 20px;
          color: #9f001f;
          text-decoration: none;
        }

        .navItem span {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: #ffe3e8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          flex-shrink: 0;
        }

        .navItem strong {
          display: block;
          font-size: 15px;
        }

        .navItem small {
          display: block;
          margin-top: 3px;
          color: #e46b82;
          font-weight: 800;
        }

        .navItem.active {
          background: #fff0f3;
          box-shadow: inset 0 0 0 1px #ffc0cc;
        }

        .navItem.disabled {
          opacity: 0.62;
        }

        .mainContent {
          flex: 1;
          min-width: 0;
          padding: 28px 32px;
        }

        .hero {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 34px;
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid #ffc0cc;
          box-shadow: 0 14px 34px rgba(190, 18, 60, 0.12);
          margin-bottom: 22px;
        }

        .hero p {
          margin: 0 0 10px;
          color: #e6003f;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .hero h2 {
          margin: 0 0 10px;
          font-size: clamp(42px, 5vw, 72px);
          line-height: 1;
          font-weight: 500;
          color: #3d0810;
        }

        .hero span {
          color: #7a2d38;
          font-size: 18px;
        }

        .previewBtn {
          min-height: 54px;
          padding: 0 26px;
          border-radius: 18px;
          background: #e6003f;
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-weight: 900;
          white-space: nowrap;
          box-shadow: 0 14px 26px rgba(217, 4, 41, 0.22);
        }

        .summaryGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 22px;
        }

        .summaryCard {
          min-height: 130px;
          padding: 22px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid #ffc0cc;
          box-shadow: 0 14px 34px rgba(190, 18, 60, 0.1);
        }

        .summaryCard span {
          display: block;
          color: #e6003f;
          font-size: 14px;
          font-weight: 900;
          margin-bottom: 16px;
        }

        .summaryCard strong {
          color: #3d0810;
          font-size: 34px;
          line-height: 1;
        }

        .partsGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .partCard {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          padding: 24px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid #ffc0cc;
          box-shadow: 0 14px 34px rgba(190, 18, 60, 0.1);
        }

        .partTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 22px;
        }

        .partNumber {
          width: 62px;
          height: 62px;
          border-radius: 20px;
          background: linear-gradient(135deg, #ff315b, #d90429);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 900;
          box-shadow: 0 12px 24px rgba(217, 4, 41, 0.2);
        }

        .partTop span {
          border: 1px solid #ffc0cc;
          background: #fff4f6;
          color: #9f001f;
          border-radius: 999px;
          padding: 8px 14px;
          font-weight: 900;
          font-size: 13px;
        }

        .partCard h3 {
          margin: 0 0 8px;
          font-size: 26px;
          color: #3d0810;
        }

        .subtitle {
          margin: 0 0 14px;
          color: #e6003f;
          font-weight: 900;
        }

        .description {
          margin: 0;
          color: #7a2d38;
          font-size: 15px;
          line-height: 1.55;
        }

        .cardActions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: auto;
          padding-top: 24px;
        }

        .cardActions a {
          min-height: 44px;
          padding: 0 16px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-weight: 900;
        }

        .primaryAction {
          background: #e6003f;
          color: white;
        }

        .secondaryAction {
          border: 1px solid #ffc0cc;
          color: #9f001f;
          background: white;
        }

        @media (max-width: 1440px) {
          .partsGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .summaryGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .dashboardPage {
            flex-direction: column;
          }

          .sidebar {
            width: 100%;
            flex: none;
            min-height: auto;
            border-right: none;
            border-bottom: 1px solid #ffc0cc;
          }

          .mainContent {
            padding: 18px;
          }

          .hero {
            flex-direction: column;
            align-items: flex-start;
          }

          .previewBtn {
            width: 100%;
          }

          .partsGrid,
          .summaryGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
