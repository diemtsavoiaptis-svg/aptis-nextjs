"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const emptyRow = (index) => ({
  selected: false,
  guestVisible: false,
  stt: String(index + 1),
  audioLink: "",
  topic: "",
  question1: "",
  answer1: "",
  question2: "",
  answer2: "",
  question3: "",
  answer3: "",
  question4: "",
  answer4: "",
  voiceParagraph: "",
});

const starterRows = Array.from({ length: 12 }, (_, index) => ({
  ...emptyRow(index),
  audioLink: index === 0 ? "https://drive.google.com/file/d/example/view" : "",
  topic: ["Changes in the workplace", "Beauty", "Actors"][index] || "",
  question1: index === 0 ? "Continuity is important when changes happen." : "",
  answer1: "Man/Woman/Both",
  question2: index === 0 ? "Job security cannot be guaranteed." : "",
  answer2: "Man/Woman/Both",
  question3: "",
  answer3: "Man/Woman/Both",
  question4: "",
  answer4: "Man/Woman/Both",
  voiceParagraph: "",
}));

const columns = [
  { key: "selected", label: "Chọn", type: "checkbox" },
  { key: "stt", label: "STT" },
  { key: "audioLink", label: "Link Audio" },
  { key: "topic", label: "Topic" },
  { key: "question1", label: "Câu hỏi 1" },
  { key: "answer1", label: "Đáp án 1" },
  { key: "question2", label: "Câu hỏi 2" },
  { key: "answer2", label: "Đáp án 2" },
  { key: "question3", label: "Câu hỏi 3" },
  { key: "answer3", label: "Đáp án 3" },
  { key: "question4", label: "Câu hỏi 4" },
  { key: "answer4", label: "Đáp án 4" },
  { key: "voiceParagraph", label: "Paragraph dữ liệu voice" },
];

export default function AdminListeningPart3Page() {
  const [rows, setRows] = useState(starterRows);

  const totalRows = rows.length;
  const audioRows = rows.filter((row) => row.audioLink.trim()).length;
  const completedRows = rows.filter((row) =>
    row.audioLink.trim() &&
    row.topic.trim() &&
    row.question1.trim() &&
    row.answer1.trim() &&
    row.question2.trim() &&
    row.answer2.trim()
  ).length;
  const selectedCount = rows.filter((row) => row.selected).length;
  const guestCount = rows.filter((row) => row.guestVisible).length;

  const allSelected = useMemo(
    () => rows.length > 0 && rows.every((row) => row.selected),
    [rows]
  );

  function updateCell(index, key, value) {
    setRows((oldRows) =>
      oldRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row
      )
    );
  }

  function addRows(count) {
    setRows((oldRows) => [
      ...oldRows,
      ...Array.from({ length: count }, (_, index) => emptyRow(oldRows.length + index)),
    ]);
  }

  function toggleAll() {
    setRows((oldRows) => oldRows.map((row) => ({ ...row, selected: !allSelected })));
  }

  function deleteSelected() {
    setRows((oldRows) => {
      const nextRows = oldRows.filter((row) => !row.selected);
      return nextRows.length ? nextRows : [emptyRow(0)];
    });
  }

  function markGuestVisible() {
    const hasSelected = rows.some((row) => row.selected);

    if (!hasSelected) {
      alert("Vui lòng tick chọn các câu muốn hiển thị ở giao diện khách.");
      return;
    }

    setRows((oldRows) =>
      oldRows.map((row) =>
        row.selected ? { ...row, guestVisible: true, selected: false } : row
      )
    );
  }

  function hideGuestVisible() {
    const hasSelected = rows.some((row) => row.selected);

    if (!hasSelected) {
      alert("Vui lòng tick chọn các câu muốn ẩn khỏi giao diện khách.");
      return;
    }

    setRows((oldRows) =>
      oldRows.map((row) =>
        row.selected ? { ...row, guestVisible: false, selected: false } : row
      )
    );
  }

  function saveAll() {
    alert("Đã lưu bản thiết kế trên giao diện. Bước sau mình sẽ nối lưu database thật.");
  }

  return (
    <main className="page">
      <section className="shell">
        <header className="hero">
          <div className="partBadge">3</div>

          <div className="heroText">
            <p>QUẢN LÝ LISTENING</p>
            <h1>Admin Part 3</h1>
            <span>Quản lý audio, topic, 4 câu hỏi, 4 đáp án và paragraph phân tích ý nguyên.</span>

            <div className="heroActions">
              <Link href="/dashboard/listening">Về quản lý Listening</Link>
              <Link href="/listening/part-3" className="primaryLink">Xem giao diện học viên</Link>
            </div>
          </div>
        </header>

        <section className="statsGrid">
          <div className="statCard">
            <span>TỔNG DÒNG</span>
            <strong>{totalRows}</strong>
          </div>
          <div className="statCard">
            <span>CÓ AUDIO</span>
            <strong>{audioRows}</strong>
          </div>
          <div className="statCard">
            <span>HOÀN THIỆN</span>
            <strong>{completedRows}</strong>
          </div>
          <div className="statCard">
            <span>ĐÃ CHỌN</span>
            <strong>{selectedCount}</strong>
          </div>
          <div className="statCard">
            <span>HIỆN KHÁCH</span>
            <strong>{guestCount}</strong>
          </div>
        </section>

        <section className="guestControlPanel">
          <div className="guestToolbar">
            <button type="button" className="guestPrimaryBtn" onClick={markGuestVisible}>
              Chọn câu hiển thị giao diện khách
            </button>

            <button type="button" onClick={hideGuestVisible}>
              Ẩn câu khỏi giao diện khách
            </button>

            <button type="button" onClick={() => addRows(1)}>
              + Thêm dòng
            </button>

            <button type="button" className="saveBtn" onClick={saveAll}>
              Lưu toàn bộ
            </button>
          </div>
        </section>

        <section className="guestCountPanel">
          <div>Đang tick: {selectedCount} câu</div>
          <div>Hiện khách: {guestCount} câu</div>
        </section>

        <section className="tablePanel">
          <div className="topScrollWrap">
            <table>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={row.guestVisible ? "guestVisibleRow" : ""}>
                    {columns.map((column) => (
                      <td key={column.key}>
                        {column.type === "checkbox" ? (
                          <input
                            type="checkbox"
                            checked={row.selected}
                            onChange={(event) => updateCell(rowIndex, "selected", event.target.checked)}
                          />
                        ) : (
                          <textarea
                            value={row[column.key]}
                            onChange={(event) => updateCell(rowIndex, column.key, event.target.value)}
                            placeholder={column.label}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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
          padding: 24px 12px;
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

        .shell {
          width: min(1520px, 100%);
          margin: 0 auto;
        }

        .hero,
        .statCard,
        .guestControlPanel,
        .guestCountPanel,
        .tablePanel {
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid #ffc0cc;
          box-shadow: 0 14px 34px rgba(190, 18, 60, 0.12);
        }

        .hero {
          display: grid;
          grid-template-columns: 84px 1fr;
          gap: 20px;
          align-items: center;
          padding: 24px;
          border-radius: 28px;
          margin-bottom: 18px;
        }

        .partBadge {
          width: 68px;
          height: 68px;
          border-radius: 22px;
          background: linear-gradient(135deg, #ff315b, #d90429);
          color: white;
          font-size: 34px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 16px 30px rgba(217, 4, 41, 0.22);
        }

        .heroText p {
          margin: 0 0 6px;
          color: #e6003f;
          font-size: 14px;
          font-weight: 900;
        }

        .heroText h1 {
          margin: 0 0 8px;
          color: #3d0810;
          font-size: 32px;
          line-height: 1;
        }

        .heroText span {
          color: #d90429;
          font-size: 15px;
        }

        .heroActions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .heroActions a {
          min-height: 44px;
          padding: 0 18px;
          border-radius: 12px;
          border: 1px solid #ffc0cc;
          background: white;
          color: #9f001f;
          font-weight: 900;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }

        .heroActions .primaryLink {
          background: #e6003f;
          color: white;
          border-color: #e6003f;
        }

        .statsGrid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 18px;
        }

        .statCard {
          border-radius: 18px;
          padding: 18px;
        }

        .statCard span {
          display: block;
          color: #e6003f;
          font-size: 13px;
          font-weight: 900;
          margin-bottom: 10px;
        }

        .statCard strong {
          font-size: 28px;
          color: #3d0810;
        }

        .guestControlPanel {
          border-radius: 24px;
          padding: 18px;
          margin-bottom: 14px;
        }

        .guestToolbar {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .guestToolbar button {
          min-height: 48px;
          padding: 0 18px;
          border-radius: 16px;
          border: 1px solid #ffc0cc;
          background: white;
          color: #9f001f;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 8px 18px rgba(190, 18, 60, 0.1);
        }

        .guestToolbar .guestPrimaryBtn,
        .guestToolbar .saveBtn {
          background: #e6003f;
          color: white;
          border-color: #e6003f;
        }

        .guestCountPanel {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          border-radius: 24px;
          padding: 18px;
          margin-bottom: 18px;
        }

        .guestCountPanel div {
          border: 1px solid #ffc0cc;
          background: white;
          color: #9f001f;
          border-radius: 18px;
          padding: 14px 20px;
          font-weight: 900;
        }

        .tablePanel {
          border-radius: 24px;
          overflow: hidden;
        }

        .topScrollWrap {
          width: 100%;
          overflow: auto;
          transform: rotateX(180deg);
        }

        .topScrollWrap table {
          transform: rotateX(180deg);
        }

        table {
          width: max-content;
          min-width: 100%;
          border-collapse: collapse;
          background: white;
        }

        th {
          background: #e6003f;
          color: white;
          padding: 14px;
          font-size: 14px;
          text-align: left;
          white-space: nowrap;
        }

        td {
          padding: 14px;
          border-bottom: 1px solid #ffd4dc;
          vertical-align: top;
        }

        tr.guestVisibleRow td {
          background: #fff0f3;
          box-shadow: inset 0 0 0 9999px rgba(217, 4, 41, 0.035);
        }

        td input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #e6003f;
        }

        td textarea {
          width: 150px;
          height: 88px;
          border: 1px solid #ffc6d0;
          border-radius: 14px;
          padding: 12px;
          color: #3d0810;
          outline: none;
          resize: vertical;
          font-family: Arial, sans-serif;
          font-size: 14px;
          line-height: 1.35;
        }

        td:nth-child(1) {
          min-width: 64px;
          text-align: center;
        }

        td:nth-child(2) textarea {
          width: 72px;
          font-weight: 900;
          color: #e6003f;
        }

        td:nth-child(3) textarea {
          width: 170px;
        }

        td:nth-child(4) textarea {
          width: 140px;
        }

        td:nth-child(5) textarea,
        td:nth-child(7) textarea,
        td:nth-child(9) textarea,
        td:nth-child(11) textarea {
          width: 190px;
        }

        td:nth-child(13) textarea {
          width: 360px;
          height: 110px;
        }

        textarea:focus {
          border-color: #d90429;
          box-shadow: 0 0 0 3px rgba(217, 4, 41, 0.08);
        }

        @media (max-width: 900px) {
          .statsGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .hero {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
