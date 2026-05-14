"use client";

import Link from "next/link";

const navItems = [
  { label: "Bảng điều khiển", subtitle: "Tổng quan", href: "/dashboard", icon: "D", disabled: false },
  { label: "Listening", subtitle: "Admin 1 → 4", href: "/dashboard/listening", icon: "L", disabled: false },
  { label: "Reading", subtitle: "Sắp có", href: "#", icon: "R", disabled: true },
  { label: "Speaking", subtitle: "Sắp có", href: "#", icon: "S", disabled: true },
  { label: "Writing", subtitle: "Sắp có", href: "#", icon: "W", disabled: true },
  { label: "G&V", subtitle: "Sắp có", href: "#", icon: "G&V", disabled: true },
];

export default function DashboardLayout({ children }) {
  return (
    <main className="labLikeShell">
      <aside className="labSidebar">
        <div className="labBrand">
          <div className="labBrandLogo">A</div>
          <div>
            <p>HỆ THỐNG QUẢN TRỊ</p>
            <h1>Quản trị Aptis</h1>
          </div>
        </div>

        <nav className="labMenu">
          {navItems.map((item) =>
            item.disabled ? (
              <div key={item.label} className="labMenuItem disabled">
                <span>{item.icon}</span>
                <div>
                  <strong>{item.label}</strong>
                  <small>{item.subtitle}</small>
                </div>
              </div>
            ) : (
              <Link key={item.label} href={item.href} className="labMenuItem">
                <span>{item.icon}</span>
                <div>
                  <strong>{item.label}</strong>
                  <small>{item.subtitle}</small>
                </div>
              </Link>
            )
          )}
        </nav>
      </aside>

      <section className="labRight">
        <header className="labTopbar">
          <div className="labSearch">
            <span>⌕</span>
            <input placeholder="Tìm kiếm..." />
          </div>

          <div className="labTopNav">
            <Link href="/dashboard/listening">⌂</Link>
            <Link href="/dashboard/listening/part-1">1</Link>
            <Link href="/dashboard/listening/part-2">2</Link>
            <Link href="/dashboard/listening/part-3">3</Link>
            <Link href="/dashboard/listening/part-4">4</Link>
          </div>

          <div className="labAccount">
            <Link href="/listening">Giao diện học viên</Link>
            <div>A</div>
          </div>
        </header>

        <section className="labContent">
          {children}
        </section>
      </section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          width: 100%;
          min-height: 100%;
          margin: 0;
          background: #fff1f4;
          overflow-x: hidden;
          font-family: Arial, sans-serif;
        }

        .labLikeShell {
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          background:
            linear-gradient(rgba(255, 241, 244, 0.96), rgba(255, 241, 244, 0.96)),
            radial-gradient(circle at top right, rgba(255, 49, 91, 0.12), transparent 36%),
            radial-gradient(circle at bottom left, rgba(217, 4, 41, 0.08), transparent 32%);
          color: #3d0810;
        }

        .labSidebar {
          width: 300px;
          flex: 0 0 300px;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          padding: 22px 18px;
          background: linear-gradient(180deg, #fff7f8 0%, #ffe7ec 100%);
          border-right: 1px solid #ffc0cc;
          box-shadow: 16px 0 40px rgba(190, 18, 60, 0.08);
          z-index: 30;
        }

        .labBrand {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px;
          border-radius: 26px;
          background: rgba(255, 255, 255, 0.82);
          box-shadow: 0 12px 28px rgba(190, 18, 60, 0.08);
          margin-bottom: 26px;
        }

        .labBrandLogo {
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
          flex-shrink: 0;
        }

        .labBrand p {
          margin: 0 0 5px;
          color: #e6003f;
          font-size: 11px;
          font-weight: 900;
        }

        .labBrand h1 {
          margin: 0;
          color: #3d0810;
          font-size: 21px;
        }

        .labMenu {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .labMenuItem {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          border-radius: 20px;
          color: #9f001f;
          text-decoration: none;
          transition: 0.18s ease;
        }

        .labMenuItem:hover {
          background: rgba(255, 255, 255, 0.76);
          transform: translateX(2px);
        }

        .labMenuItem span {
          width: 44px;
          height: 44px;
          border-radius: 15px;
          background: #ffe1e7;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          flex-shrink: 0;
        }

        .labMenuItem strong {
          display: block;
          font-size: 15px;
        }

        .labMenuItem small {
          display: block;
          margin-top: 3px;
          color: #e46b82;
          font-weight: 800;
        }

        .labMenuItem.disabled {
          opacity: 0.58;
          cursor: not-allowed;
        }

        .labRight {
          flex: 1 1 0%;
          min-width: 0;
          width: calc(100% - 300px);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .labTopbar {
          height: 76px;
          position: sticky;
          top: 0;
          z-index: 25;
          display: grid;
          grid-template-columns: minmax(220px, 340px) 1fr auto;
          align-items: center;
          gap: 24px;
          padding: 14px 26px;
          background: rgba(255, 247, 248, 0.9);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid #ffc0cc;
        }

        .labSearch {
          height: 46px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 16px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid #ffd2da;
        }

        .labSearch span {
          color: #a0002b;
          font-weight: 900;
        }

        .labSearch input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #3d0810;
          font-size: 15px;
        }

        .labSearch input::placeholder {
          color: #c47988;
        }

        .labTopNav {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
        }

        .labTopNav a {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9f001f;
          background: rgba(255, 255, 255, 0.68);
          border: 1px solid #ffd2da;
          text-decoration: none;
          font-weight: 900;
        }

        .labAccount {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .labAccount a {
          min-height: 46px;
          padding: 0 20px;
          border-radius: 14px;
          background: #9f2f34;
          color: white;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          white-space: nowrap;
        }

        .labAccount div {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #c91f3f;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
        }

        .labContent {
          flex: 1 1 auto;
          min-width: 0;
          width: 100%;
          padding: 28px clamp(22px, 2.4vw, 42px);
        }

        .labContent .page {
          width: 100% !important;
          min-height: auto !important;
          padding: 0 !important;
          margin: 0 !important;
          background: transparent !important;
        }

        .labContent .shell,
        .labContent .listeningDashboardContent {
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .labContent .hero,
        .labContent .dashboardHero,
        .labContent .tablePanel,
        .labContent .guestControlPanel,
        .labContent .guestCountPanel {
          width: 100% !important;
        }

        .labContent .topScrollWrap {
          max-width: 100%;
          overflow-x: auto;
        }

        .labContent table {
          min-width: 100%;
        }

        @media (min-width: 1600px) {
          .labContent {
            padding-left: 48px;
            padding-right: 48px;
          }
        }

        @media (max-width: 1100px) {
          .labTopbar {
            grid-template-columns: 1fr auto;
          }

          .labTopNav {
            display: none;
          }
        }

        @media (max-width: 900px) {
          .labLikeShell {
            flex-direction: column;
          }

          .labSidebar {
            width: 100%;
            height: auto;
            flex: none;
            position: relative;
            border-right: none;
            border-bottom: 1px solid #ffc0cc;
          }

          .labRight {
            width: 100%;
            min-height: auto;
          }

          .labTopbar {
            height: auto;
            grid-template-columns: 1fr;
          }

          .labAccount {
            justify-content: flex-start;
            flex-wrap: wrap;
          }

          .labContent {
            padding: 18px;
          }
        }
      `}</style>
    </main>
  );
}
