"use client";

import Link from "next/link";

const parts = [
  {
    href: "/dashboard/listening/part-1",
    number: "1",
    title: "Phần 1",
    subtitle: "Hội thoại ngắn",
    columns: "Audio, STT, Câu hỏi, Đáp án A, Đáp án B, Đáp án C, Dữ liệu voice",
  },
  {
    href: "/dashboard/listening/part-2",
    number: "2",
    title: "Phần 2",
    subtitle: "Nối thông tin",
    columns: "STT, Audio, Chủ đề, Người 1-4, Kho đáp án, Dữ liệu voice",
  },
  {
    href: "/dashboard/listening/part-3",
    number: "3",
    title: "Phần 3",
    subtitle: "Quan điểm / Nhận diện người nói",
    columns: "STT, Link Audio, Chủ đề, Câu hỏi 1-4, Đáp án 1-4, Paragraph voice",
  },
  {
    href: "/dashboard/listening/part-4",
    number: "4",
    title: "Phần 4",
    subtitle: "Độc thoại / Tóm tắt ý chính",
    columns: "Question, Chủ đề, Câu hỏi 16, Đáp án, Câu hỏi 17, Đáp án, Dữ liệu paraphrase",
  },
];

export default function ListeningAdminHome() {
  return (
    <main className="adminPage">
      <section className="adminShell">
        <header className="adminHero">
          <div>
            <p className="eyebrow">BẢNG QUẢN TRỊ</p>
            <h1>Quản lý dữ liệu Listening</h1>
            <p>
              Quản lý và nhập dữ liệu cho cả 4 phần Listening. Đây là giao diện thiết kế trước, chưa lưu dữ liệu thật vào database.
            </p>
          </div>

          <div className="adminBadge">
            <span>4</span>
            <strong>Phần</strong>
          </div>
        </header>

        <section className="adminGrid">
          {parts.map((part) => (
            <Link href={part.href} className="adminCard" key={part.number}>
              <div className="partIcon">
                <small>PHẦN</small>
                <strong>{part.number}</strong>
              </div>

              <div className="cardBody">
                <div className="cardTop">
                  <span>{part.subtitle}</span>
                  <b>Quản lý dữ liệu</b>
                </div>

                <h2>{part.title}</h2>
                <p>{part.columns}</p>

                <div className="cardFooter">
                  <strong>Mở trang quản lý</strong>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </section>

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #fff6f8; }

        .adminPage {
          min-height: 100vh;
          padding: 28px 12px;
          background:
            linear-gradient(rgba(255, 246, 248, 0.92), rgba(255, 246, 248, 0.92)),
            repeating-linear-gradient(-14deg, rgba(244, 63, 94, 0.075) 0, rgba(244, 63, 94, 0.075) 2px, transparent 2px, transparent 86px);
          color: #3d0810;
          font-family: Arial, sans-serif;
        }

        .adminShell {
          width: min(1180px, 100%);
          margin: 0 auto;
          padding: 28px;
          border-radius: 34px;
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(244,63,94,0.18);
          box-shadow: 0 24px 80px rgba(190,18,60,0.14);
        }

        .adminHero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 22px;
          padding: 30px;
          border-radius: 30px;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(244,63,94,0.14);
          margin-bottom: 22px;
        }

        .eyebrow {
          margin: 0 0 10px;
          color: #d90429;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .adminHero h1 {
          margin: 0 0 12px;
          color: #3d0810;
          font-size: clamp(36px, 6vw, 64px);
          line-height: 0.98;
          font-weight: 600;
        }

        .adminHero p {
          margin: 0;
          color: #70404a;
          font-size: 17px;
          line-height: 1.6;
        }

        .adminBadge {
          width: 132px;
          height: 132px;
          border-radius: 34px;
          background: linear-gradient(135deg, #ff315b, #d90429);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 44px rgba(217,4,41,0.22);
          flex: 0 0 auto;
        }

        .adminBadge span {
          font-size: 58px;
          line-height: 1;
          font-weight: 900;
        }

        .adminBadge strong {
          margin-top: 8px;
          font-size: 17px;
        }

        .adminGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .adminCard {
          display: grid;
          grid-template-columns: 104px 1fr;
          gap: 18px;
          min-height: 230px;
          padding: 20px;
          border-radius: 28px;
          background: rgba(255,255,255,0.92);
          border: 1px solid #ffc0cc;
          color: inherit;
          text-decoration: none;
          transition: 0.18s ease;
        }

        .adminCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 42px rgba(190,18,60,0.13);
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
          box-shadow: 0 18px 34px rgba(217,4,41,0.18);
        }

        .partIcon small { font-size: 13px; font-weight: 900; }
        .partIcon strong { margin-top: 8px; font-size: 46px; line-height: 1; }

        .cardBody {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .cardTop {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .cardTop span,
        .cardTop b {
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

        .cardBody h2 {
          margin: 0 0 10px;
          color: #3d0810;
          font-size: 30px;
          line-height: 1.1;
        }

        .cardBody p {
          margin: 0;
          color: #70404a;
          line-height: 1.55;
        }

        .cardFooter {
          margin-top: auto;
          padding-top: 18px;
          display: flex;
          justify-content: space-between;
          color: #d90429;
          font-weight: 900;
        }

        @media (max-width: 900px) {
          .adminGrid { grid-template-columns: 1fr; }
        }

        @media (max-width: 620px) {
          .adminShell { padding: 16px; border-radius: 24px; }
          .adminHero { flex-direction: column; align-items: flex-start; }
          .adminCard { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
