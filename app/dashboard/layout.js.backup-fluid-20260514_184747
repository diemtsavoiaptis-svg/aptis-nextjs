"use client";

import Link from "next/link";

const navItems = [
  {
    label: "Bảng điều khiển",
    subtitle: "Tổng quan",
    href: "/dashboard",
    icon: "D",
    activeMatch: "/dashboard",
  },
  {
    label: "Listening",
    subtitle: "Admin 1 → 4",
    href: "/dashboard/listening",
    icon: "L",
    activeMatch: "/dashboard/listening",
  },
  {
    label: "Reading",
    subtitle: "Sắp có",
    href: "#",
    icon: "R",
    disabled: true,
  },
  {
    label: "Speaking",
    subtitle: "Sắp có",
    href: "#",
    icon: "S",
    disabled: true,
  },
  {
    label: "Writing",
    subtitle: "Sắp có",
    href: "#",
    icon: "W",
    disabled: true,
  },
  {
    label: "G&V",
    subtitle: "Sắp có",
    href: "#",
    icon: "G&V",
    disabled: true,
  },
];

export default function DashboardLayout({ children }) {
  return (
    <main className="dashboardFluidLayout">
      <aside className="dashboardStickySidebar">
        <div className="dashboardBrand">
          <div className="dashboardBrandIcon">A</div>
          <div>
            <p>HỆ THỐNG QUẢN TRỊ</p>
            <h1>Quản trị Aptis</h1>
          </div>
        </div>

        <nav className="dashboardNav">
          {navItems.map((item) =>
            item.disabled ? (
              <div key={item.label} className="dashboardNavItem dashboardNavDisabled">
                <span>{item.icon}</span>
                <div>
                  <strong>{item.label}</strong>
                  <small>{item.subtitle}</small>
                </div>
              </div>
            ) : (
              <Link key={item.label} href={item.href} className="dashboardNavItem">
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

      <section className="dashboardMainContent">{children}</section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          width: 100%;
          min-height: 100%;
          background: #fff6f8;
          overflow-x: hidden;
        }

        .dashboardFluidLayout {
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: stretch;
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
          font-family: Arial, sans-serif;
        }

        .dashboardStickySidebar {
          width: 288px;
          flex: 0 0 288px;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          padding: 24px 18px;
          background: rgba(255, 255, 255, 0.94);
          border-right: 1px solid #ffc0cc;
          box-shadow: 16px 0 40px rgba(190, 18, 60, 0.08);
          z-index: 10;
        }

        .dashboardBrand {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px;
          border-radius: 26px;
          background: #fff0f3;
          margin-bottom: 28px;
        }

        .dashboardBrandIcon {
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
          flex-shrink: 0;
        }

        .dashboardBrand p {
          margin: 0 0 4px;
          color: #e6003f;
          font-size: 11px;
          font-weight: 900;
        }

        .dashboardBrand h1 {
          margin: 0;
          font-size: 21px;
          color: #3d0810;
        }

        .dashboardNav {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dashboardNavItem {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          border-radius: 20px;
          color: #9f001f;
          text-decoration: none;
        }

        .dashboardNavItem:hover {
          background: #fff0f3;
        }

        .dashboardNavItem span {
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

        .dashboardNavItem strong {
          display: block;
          font-size: 15px;
        }

        .dashboardNavItem small {
          display: block;
          margin-top: 3px;
          color: #e46b82;
          font-weight: 800;
        }

        .dashboardNavDisabled {
          opacity: 0.62;
          cursor: not-allowed;
        }

        .dashboardMainContent {
          flex: 1 1 0%;
          min-width: 0;
          width: 100%;
          height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 24px clamp(18px, 2vw, 36px);
        }

        /*
          Fluid fix cho các trang con:
          - Không căn giữa bằng margin auto.
          - Không giới hạn max-width.
          - Nội dung tự tràn đều theo phần còn lại bên phải sidebar.
        */
        .dashboardMainContent .page {
          width: 100% !important;
          min-height: auto !important;
          padding: 0 !important;
          background: transparent !important;
        }

        .dashboardMainContent .shell,
        .dashboardMainContent .listeningDashboardContent {
          width: 100% !important;
          max-width: none !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        .dashboardMainContent .hero,
        .dashboardMainContent .dashboardHero,
        .dashboardMainContent .tablePanel,
        .dashboardMainContent .guestControlPanel,
        .dashboardMainContent .guestCountPanel {
          width: 100% !important;
        }

        .dashboardMainContent table {
          min-width: 100%;
        }

        .dashboardMainContent .topScrollWrap {
          max-width: 100%;
          overflow-x: auto;
        }

        @media (max-width: 900px) {
          .dashboardFluidLayout {
            flex-direction: column;
          }

          .dashboardStickySidebar {
            width: 100%;
            flex: none;
            height: auto;
            position: relative;
            border-right: none;
            border-bottom: 1px solid #ffc0cc;
          }

          .dashboardMainContent {
            height: auto;
            min-height: 100vh;
            overflow-y: visible;
            padding: 18px;
          }
        }
      `}</style>
    </main>
  );
}
