"use client";

import Link from "next/link";
import { useState } from "react";

const emptyRow = (index) => ({
  selected: false,
  guestVisible: false,
  stt: String(index + 1),
  audio: "",
  topic: "",
  person1: "",
  person2: "",
  person3: "",
  person4: "",
  answerPool: "",
  voiceData: "",
});

const starterRows = [
  {
    ...emptyRow(0),
    audio: "",
    topic: "Hoạt động cuối tuần",
    person1: "",
    person2: "",
    person3: "",
    person4: "",
    answerPool: "",
    voiceData: "",
  },
];

const columns = [
  { key: "selected", label: "Chọn", type: "checkbox" },
  { key: "stt", label: "STT" },
  { key: "audio", label: "Audio" },
  { key: "topic", label: "Chủ đề" },
  { key: "person1", label: "Người 1" },
  { key: "person2", label: "Người 2" },
  { key: "person3", label: "Người 3" },
  { key: "person4", label: "Người 4" },
  { key: "answerPool", label: "Kho đáp án" },
  { key: "voiceData", label: "Dữ liệu voice" },
];

export default function AdminListeningPart2Page() {
  const [rows, setRows] = useState(starterRows);

  const selectedCount = rows.filter((row) => row.selected).length;
  const guestCount = rows.filter((row) => row.guestVisible).length;

  function updateCell(index, key, value) {
    setRows((oldRows) =>
      oldRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row
      )
    );
  }

  function addRow() {
    setRows((oldRows) => [...oldRows, emptyRow(oldRows.length)]);
  }

  function showGuestRows() {
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

  function hideGuestRows() {
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
    alert("Đã lưu bản thiết kế trên giao diện. Bước sau sẽ nối lưu dữ liệu thật.");
  }

  return (
    <main className="page">
      <section className="shell">
        <header className="hero">
          <div className="partBadge">
            <span>PHẦN</span>
            <strong>2</strong>
          </div>

          <div className="heroText">
            <p>TRÌNH QUẢN LÝ DỮ LIỆU</p>
            <h1>Quản lý dữ liệu Phần 2</h1>
            <span>Quản lý STT, audio, chủ đề, người 1-4, kho đáp án tổng và dữ liệu voice.</span>
          </div>

          <Link href="/dashboard/listening" className="backBtn">
            ← Quay lại
          </Link>
        </header>

        <section className="guestControlPanel">
          <div className="guestToolbar">
            <button type="button" className="primaryBtn" onClick={showGuestRows}>
              Chọn câu hiển thị giao diện khách
            </button>

            <button type="button" onClick={hideGuestRows}>
              Ẩn câu khỏi giao diện khách
            </button>

            <button type="button" onClick={addRow}>
              + Thêm dòng
            </button>

            <button type="button" className="primaryBtn" onClick={saveAll}>
              Lưu toàn bộ
            </button>
          </div>
        </section>

        <section className="guestCountPanel">
          <div>Đang tick: {selectedCount} câu</div>
          <div>Hiện khách: {guestCount} câu</div>
        </section>

        <section className="tablePanel">
          <div className="panelTitle">
            <h2>Nối thông tin</h2>
            <span>Có thể kéo ngang bảng</span>
          </div>

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
                            onChange={(event) =>
                              updateCell(rowIndex, "selected", event.target.checked)
                            }
                          />
                        ) : (
                          <textarea
                            value={row[column.key]}
                            onChange={(event) =>
                              updateCell(rowIndex, column.key, event.target.value)
                            }
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
          padding: 28px 18px;
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
          width: min(1420px, 100%);
          margin: 0 auto;
        }

        .hero,
        .guestControlPanel,
        .guestCountPanel,
        .tablePanel {
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid #ffc0cc;
          box-shadow: 0 14px 34px rgba(190, 18, 60, 0.12);
        }

        .hero {
          display: grid;
          grid-template-columns: 130px 1fr auto;
          gap: 24px;
          align-items: center;
          padding: 32px;
          border-radius: 32px;
          margin-bottom: 18px;
        }

        .partBadge {
          width: 110px;
          height: 110px;
          border-radius: 28px;
          background: linear-gradient(135deg, #ff315b, #d90429);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 16px 30px rgba(217, 4, 41, 0.22);
        }

        .partBadge span {
          font-size: 18px;
          font-weight: 900;
        }

        .partBadge strong {
          font-size: 52px;
          line-height: 1;
        }

        .heroText p {
          margin: 0 0 10px;
          color: #e6003f;
          font-size: 16px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .heroText h1 {
          margin: 0 0 10px;
          color: #3d0810;
          font-size: clamp(38px, 5vw, 64px);
          line-height: 1;
          font-weight: 500;
        }

        .heroText span {
          color: #6f2732;
          font-size: 18px;
        }

        .backBtn {
          min-height: 58px;
          padding: 0 28px;
          border-radius: 22px;
          border: 1px solid #ffc0cc;
          background: #fff4f6;
          color: #9f001f;
          font-weight: 900;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
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

        .guestToolbar .primaryBtn {
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
          padding: 18px;
          overflow: hidden;
        }

        .panelTitle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 14px;
        }

        .panelTitle h2 {
          margin: 0;
          font-size: 26px;
          font-weight: 500;
        }

        .panelTitle span {
          border: 1px solid #ffc0cc;
          border-radius: 999px;
          padding: 8px 16px;
          color: #e6003f;
          font-weight: 900;
          background: #fff4f6;
        }

        .topScrollWrap {
          width: 100%;
          overflow: auto;
        }

        table {
          width: max-content;
          min-width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 18px;
          overflow: hidden;
        }

        th {
          background: #fff0f3;
          color: #9f001f;
          padding: 14px;
          font-size: 14px;
          text-align: left;
          white-space: nowrap;
          border-bottom: 1px solid #ffc0cc;
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
          width: 170px;
          height: 70px;
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

        td:nth-child(9) textarea,
        td:nth-child(10) textarea {
          width: 320px;
          height: 100px;
        }

        textarea:focus {
          border-color: #d90429;
          box-shadow: 0 0 0 3px rgba(217, 4, 41, 0.08);
        }

        @media (max-width: 900px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .backBtn {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
