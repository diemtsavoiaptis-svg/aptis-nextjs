"use client";

import Link from "next/link";

const parts = [
  {
    id: 1,
    title: "Phần 1",
    subtitle: "Hội thoại ngắn",
    description: "Quản lý câu hỏi nghe ngắn với lựa chọn A, B, C.",
    adminHref: "/dashboard/listening/part-1",
    studentHref: "/listening/part-1?mode=student",
    status: "Đang hoạt động",
  },
  {
    id: 2,
    title: "Phần 2",
    subtitle: "Nối thông tin",
    description: "Quản lý audio, chủ đề, người 1-4, kho đáp án và dữ liệu voice.",
    adminHref: "/dashboard/listening/part-2",
    studentHref: "/listening/part-2",
    status: "Đang thiết kế",
  },
  {
    id: 3,
    title: "Phần 3",
    subtitle: "Ý kiến / Nhân vật",
    description: "Quản lý audio, topic, câu hỏi và đáp án Man / Woman / Both.",
    adminHref: "/dashboard/listening/part-3",
    studentHref: "/listening/part-3",
    status: "Đang thiết kế",
  },
  {
    id: 4,
    title: "Phần 4",
    subtitle: "Bài nói dài / Tóm tắt",
    description: "Quản lý đoạn nghe dài, câu hỏi, đáp án và dữ liệu paraphrase.",
    adminHref: "/dashboard/listening/part-4",
    studentHref: "/listening/part-4",
    status: "Đang thiết kế",
  },
];

export default function Page() {
  return (
    <section className="listeningBảng điều khiểnContent">
      <header className="dashboardHero">
        <div>
          <p>QUẢN LÝ LISTENING</p>
          <h1>Bảng điều khiển Listening</h1>
          <span>Quản lý toàn bộ 4 phần Listening trong một khu vực quản trị.</span>
        </div>

        <Link href="/listening" className="studentPreviewBtn">
          Xem giao diện học viên
        </Link>
      </header>

      <section className="summaryGrid">
        <div className="summaryCard">
          <span>Tổng số phần</span>
          <strong>4</strong>
        </div>

        <div className="summaryCard">
          <span>Dữ liệu chính</span>
          <strong>Part 1</strong>
        </div>

        <div className="summaryCard">
          <span>Đang thiết kế</span>
          <strong>3 phần</strong>
        </div>

        <div className="summaryCard">
          <span>Giao diện</span>
          <strong>Đỏ pastel</strong>
        </div>
      </section>

      <section className="partsGrid">
        {parts.map((part) => (
          <article key={part.id} className="partCard">
            <div className="partTop">
              <div className="partNumber">{part.id}</div>
              <span>{part.status}</span>
            </div>

            <h2>{part.title}</h2>
            <p className="partSubtitle">{part.subtitle}</p>
            <p className="partDescription">{part.description}</p>

            <div className="partActions">
              <Link href={part.adminHref} className="primaryAction">
                Mở trang quản trị
              </Link>

              <Link href={part.studentHref} className="secondaryAction">
                Xem học viên
              </Link>
            </div>
          </article>
        ))}
      </section>

      <style jsx global>{`
        .listeningBảng điều khiểnContent {
          width: 100%;
          max-width: none;
          margin: 0;
          padding: 0;
          color: #3d0810;
          font-family: Arial, sans-serif;
        }

        .dashboardHero {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: clamp(24px, 3vw, 38px);
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid #ffc0cc;
          box-shadow: 0 14px 34px rgba(190, 18, 60, 0.12);
          margin-bottom: 22px;
        }

        .dashboardHero p {
          margin: 0 0 10px;
          color: #e6003f;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .dashboardHero h1 {
          margin: 0 0 10px;
          font-size: clamp(42px, 5vw, 76px);
          line-height: 1;
          font-weight: 500;
          color: #3d0810;
        }

        .dashboardHero span {
          color: #7a2d38;
          font-size: 18px;
        }

        .studentPreviewBtn {
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
          width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 22px;
        }

        .summaryCard {
          min-height: 130px;
          padding: 22px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.94);
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
          width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 18px;
        }

        .partCard {
          min-height: 320px;
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
          flex-shrink: 0;
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

        .partCard h2 {
          margin: 0 0 8px;
          font-size: 30px;
          color: #3d0810;
        }

        .partSubtitle {
          margin: 0 0 14px;
          color: #e6003f;
          font-weight: 900;
          font-size: 17px;
        }

        .partDescription {
          margin: 0;
          color: #7a2d38;
          font-size: 15px;
          line-height: 1.55;
        }

        .partActions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: auto;
          padding-top: 24px;
        }

        .partActions a {
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

        @media (max-width: 900px) {
          .dashboardHero {
            flex-direction: column;
            align-items: flex-start;
          }

          .studentPreviewBtn {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
