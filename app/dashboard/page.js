"use client";

import Link from "next/link";

const cards = [
  {
    icon: "L",
    title: "Listening",
    desc: "Quản lý Listening Part 1 → 4.",
    href: "/dashboard/listening",
    active: true,
    button: "Mở quản lý",
  },
  {
    icon: "HV",
    title: "Duyệt học viên",
    desc: "Kiểm tra và duyệt tài khoản học viên đăng ký.",
    href: "/dashboard/students/approval",
    active: true,
    button: "Mở duyệt",
  },
  {
    icon: "R",
    title: "Reading",
    desc: "Chưa có dữ liệu, sẽ mở sau.",
    href: "#",
    active: false,
    button: "Sắp có",
  },
  {
    icon: "S",
    title: "Speaking",
    desc: "Chưa có dữ liệu, sẽ mở sau.",
    href: "#",
    active: false,
    button: "Sắp có",
  },
  {
    icon: "W",
    title: "Writing",
    desc: "Chưa có dữ liệu, sẽ mở sau.",
    href: "#",
    active: false,
    button: "Sắp có",
  },
  {
    icon: "G&V",
    title: "G&V",
    desc: "Chưa có dữ liệu, sẽ mở sau.",
    href: "#",
    active: false,
    button: "Sắp có",
  },
];

export default function DashboardPage() {
  return (
    <main className="dashboardPage">
      <section className="heroCard">
        <div>
          <h1>Bảng điều khiển</h1>
          <p>Quản lý 5 kỹ năng chính của hệ thống Aptis.</p>
        </div>
      </section>

      <section className="cardGrid">
        {cards.map((card) => {
          const content = (
            <article className={card.active ? "dashCard active" : "dashCard"}>
              <div className="cardIcon">{card.icon}</div>
              <h2>{card.title}</h2>
              <p>{card.desc}</p>
              <span className={card.active ? "cardBtn activeBtn" : "cardBtn"}>
                {card.button}
              </span>
            </article>
          );

          return card.active ? (
            <Link key={card.title} href={card.href} className="cardLink">
              {content}
            </Link>
          ) : (
            <div key={card.title}>{content}</div>
          );
        })}
      </section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #fff6f8;
        }

        .dashboardPage {
          min-height: 100vh;
          width: 100%;
          padding: 24px;
          color: #3d0810;
          font-family: Arial, sans-serif;
        }

        .heroCard {
          width: 100%;
          border: 1px solid #ffc0cc;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 14px 34px rgba(190, 18, 60, 0.12);
          padding: 24px 28px;
          margin-bottom: 24px;
        }

        .heroCard h1 {
          margin: 0 0 10px;
          font-size: 34px;
          line-height: 1;
          font-weight: 900;
          color: #3d0810;
        }

        .heroCard p {
          margin: 0;
          color: #e6003f;
          font-size: 16px;
          font-weight: 800;
        }

        .cardGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 22px;
          width: 100%;
        }

        .cardLink {
          text-decoration: none;
          color: inherit;
        }

        .dashCard {
          min-height: 260px;
          border: 1px solid #ffe1e7;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.62);
          box-shadow: 0 16px 32px rgba(61, 8, 16, 0.08);
          padding: 28px;
          transition: 0.2s ease;
        }

        .dashCard.active:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 38px rgba(217, 4, 41, 0.14);
          border-color: #ffc0cc;
        }

        .cardIcon {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          background: #fff0f3;
          color: #f35f85;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 900;
          margin-bottom: 24px;
        }

        .dashCard.active .cardIcon {
          background: #e6003f;
          color: white;
          box-shadow: 0 14px 26px rgba(217, 4, 41, 0.2);
        }

        .dashCard h2 {
          margin: 0 0 12px;
          color: #3d0810;
          font-size: 30px;
          font-weight: 900;
        }

        .dashCard:not(.active) h2 {
          color: #8f5b68;
        }

        .dashCard p {
          margin: 0 0 28px;
          color: #e6003f;
          font-size: 16px;
          line-height: 1.45;
        }

        .dashCard:not(.active) p {
          color: #f35f85;
        }

        .cardBtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          border-radius: 16px;
          padding: 0 20px;
          background: #fff0f3;
          color: #f35f85;
          font-weight: 900;
        }

        .activeBtn {
          background: #e6003f;
          color: white;
          box-shadow: 0 10px 20px rgba(217, 4, 41, 0.18);
        }
      `}</style>
    </main>
  );
}
