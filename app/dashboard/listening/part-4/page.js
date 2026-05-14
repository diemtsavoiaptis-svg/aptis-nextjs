"use client";

import Link from "next/link";
import { useState } from "react";
import part4Rows from "./data.json";

function emptyRow(index) {
  return {
    selected: false,
    guestVisible: false,
    showInGuest: false,
    stt: String(index + 1),
    order: index + 1,
    audio: "",
    audioLink: "",
    audio_drive_file_id: "",
    topic: "",
    question16: "",
    answer1: "",
    answer2: "",
    answer3: "",
    question17: "",
    choice1: "",
    choice2: "",
    choice3: "",
    paraphrase: "",
    correct16: "",
    correct17: "",
  };
}

const columns = [
  { key: "selected", label: "Chọn", type: "checkbox" },
  { key: "showInGuest", label: "Giao diện khách", type: "guestStatus" },
  { key: "stt", label: "STT" },
  { key: "audioLink", label: "Link Audio" },
  { key: "topic", label: "Chủ đề" },
  { key: "question16", label: "Câu hỏi 16" },
  { key: "answer1", label: "Trả lời 1" },
  { key: "answer2", label: "Trả lời 2" },
  { key: "answer3", label: "Trả lời 3" },
  { key: "correct16", label: "Đáp án đúng 16", type: "letterSelect" },
  { key: "question17", label: "Câu hỏi 17" },
  { key: "choice1", label: "Lựa chọn 1" },
  { key: "choice2", label: "Lựa chọn 2" },
  { key: "choice3", label: "Lựa chọn 3" },
  { key: "correct17", label: "Đáp án đúng 17", type: "letterSelect" },
  { key: "paraphrase", label: "Dữ liệu paraphrase" },
];

export default function AdminListeningPart4Page() {
  const [rows, setRows] = useState(() =>
    Array.isArray(part4Rows) && part4Rows.length
      ? part4Rows.map((row, index) => ({
          ...emptyRow(index),
          ...row,
          selected: false,
          guestVisible: Boolean(row.guestVisible || row.showInGuest),
          showInGuest: Boolean(row.guestVisible || row.showInGuest),
        }))
      : [emptyRow(0)]
  );

  const [saving, setSaving] = useState(false);

  const totalRows = rows.length;
  const audioRows = rows.filter((row) => String(row.audioLink || row.audio || "").trim()).length;
  const completedRows = rows.filter(
    (row) =>
      String(row.audioLink || row.audio || "").trim() &&
      String(row.topic || "").trim() &&
      String(row.question16 || "").trim() &&
      String(row.question17 || "").trim()
  ).length;

  const selectedCount = rows.filter((row) => row.selected).length;
  const guestCount = rows.filter((row) => row.showInGuest || row.guestVisible).length;

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
      alert("Vui lòng tick chọn các bài muốn hiển thị ở giao diện khách.");
      return;
    }

    setRows((oldRows) =>
      oldRows.map((row) =>
        row.selected
          ? {
              ...row,
              selected: false,
              guestVisible: true,
              showInGuest: true,
            }
          : row
      )
    );
  }

  function hideGuestRows() {
    const hasSelected = rows.some((row) => row.selected);

    if (!hasSelected) {
      alert("Vui lòng tick chọn các bài muốn ẩn khỏi giao diện khách.");
      return;
    }

    setRows((oldRows) =>
      oldRows.map((row) =>
        row.selected
          ? { ...row, selected: false, guestVisible: false, showInGuest: false }
          : row
      )
    );
  }

  async function saveAll() {
    try {
      setSaving(true);

      const rowsToSave = rows.map((row) =>
        row.selected
          ? {
              ...row,
              selected: false,
              guestVisible: true,
              showInGuest: true,
            }
          : {
              ...row,
              guestVisible: Boolean(row.guestVisible || row.showInGuest),
              showInGuest: Boolean(row.guestVisible || row.showInGuest),
            }
      );

      setRows(rowsToSave);

      const res = await fetch("/api/admin/part4/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rows: rowsToSave }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Save failed");
      }

      alert(`Đã lưu Part 4 thành công. Hiện khách: ${data.guestCount}/${data.count} bài.`);
    } catch (error) {
      console.error(error);
      alert("Không lưu được Part 4. Vui lòng xem lỗi trong terminal.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page">
      <section className="shell">
        <header className="hero">
          <div className="partBadge">
            <span>PHẦN</span>
            <strong>4</strong>
          </div>

          <div className="heroText">
            <p>TRÌNH QUẢN LÝ DỮ LIỆU</p>
            <h1>Quản lý dữ liệu Phần 4</h1>
            <span>Quản lý question, chủ đề, câu hỏi 16, câu hỏi 17, các đáp án chọn và dữ liệu paraphrase.</span>
          </div>

          <Link href="/dashboard/listening" className="backBtn">
            ← Quay lại
          </Link>
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
            <button type="button" className="primaryBtn" onClick={showGuestRows}>
              Chọn câu hiển thị giao diện khách
            </button>

            <button type="button" onClick={hideGuestRows}>
              Ẩn câu khỏi giao diện khách
            </button>

            <button type="button" onClick={addRow}>
              + Thêm dòng
            </button>

            <button type="button" className="primaryBtn" onClick={saveAll} disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu toàn bộ"}
            </button>
          </div>
        </section>

        <section className="guestCountPanel">
          <div className="countPills">
            <div>Đang tick: {selectedCount} bài</div>
            <div>Hiện khách: {guestCount} bài</div>
          </div>

          <div className="viewButtons">
            <Link href="/listening/part-4?mode=student">Giao diện học viên</Link>
            <Link href="/listening/part-4">Giao diện khách</Link>
          </div>
        </section>

        <section className="tablePanel">
          <div className="tableTitle">
            <h2>Độc thoại / Tóm tắt ý chính</h2>
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
                  <tr
                    key={rowIndex}
                    className={row.showInGuest || row.guestVisible ? "guestVisibleRow" : ""}
                  >
                    {columns.map((column) => (
                      <td key={column.key}>
                        {column.type === "checkbox" ? (
                          <input
                            type="checkbox"
                            checked={Boolean(row.selected)}
                            onChange={(event) =>
                              updateCell(rowIndex, "selected", event.target.checked)
                            }
                          />
                        ) : column.type === "guestStatus" ? (
                          <span className={row.showInGuest || row.guestVisible ? "guestBadge on" : "guestBadge"}>
                            {row.showInGuest || row.guestVisible ? "Hiện khách" : "Ẩn"}
                          </span>
                        ) : column.type === "letterSelect" ? (
                          <select
                            className="letterSelect"
                            value={row[column.key] || ""}
                            onChange={(event) => {
                              updateCell(rowIndex, column.key, event.target.value);

                              if (column.key === "correct16") {
                                updateCell(rowIndex, "answer16", event.target.value);
                                updateCell(rowIndex, "correctAnswer16", event.target.value);
                              }

                              if (column.key === "correct17") {
                                updateCell(rowIndex, "answer17", event.target.value);
                                updateCell(rowIndex, "correctAnswer17", event.target.value);
                              }
                            }}
                          >
                            <option value="">-- Chọn --</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                          </select>
                        ) : (
                          <textarea
                            value={row[column.key] || ""}
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
          font-size: clamp(40px, 5vw, 66px);
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

        .guestToolbar .primaryBtn {
          background: #e6003f;
          color: white;
          border-color: #e6003f;
        }

        .guestToolbar button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .guestCountPanel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          border-radius: 24px;
          padding: 18px;
          margin-bottom: 18px;
        }

        .countPills,
        .viewButtons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .countPills div {
          border: 1px solid #ffc0cc;
          background: white;
          color: #9f001f;
          border-radius: 18px;
          padding: 14px 20px;
          font-weight: 900;
        }

        .viewButtons a {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          padding: 0 18px;
          border: 1px solid #ffc0cc;
          background: white;
          color: #9f001f;
          font-weight: 900;
          text-decoration: none;
          box-shadow: 0 8px 18px rgba(190, 18, 60, 0.1);
        }

        .viewButtons a:first-child {
          background: #e6003f;
          color: white;
          border-color: #e6003f;
        }

        .tablePanel {
          border-radius: 24px;
          overflow: hidden;
          padding: 18px;
        }

        .tableTitle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 14px;
        }

        .tableTitle h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 500;
        }

        .tableTitle span {
          border: 1px solid #ffc0cc;
          border-radius: 999px;
          padding: 8px 16px;
          color: #e6003f;
          font-weight: 900;
          background: #fff4f6;
        }

        .topScrollWrap {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          transform: rotateX(180deg);
          border-top: 1px solid #ffd4dc;
          border-radius: 16px 16px 0 0;
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

        .guestBadge {
          display: inline-flex;
          min-width: 86px;
          justify-content: center;
          border-radius: 999px;
          padding: 8px 12px;
          background: #fff6f8;
          border: 1px solid #ffc0cc;
          color: #9f001f;
          font-weight: 900;
          white-space: nowrap;
        }

        .guestBadge.on {
          background: #e6003f;
          border-color: #e6003f;
          color: white;
        }

        td textarea {
          width: 150px;
          height: 76px;
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

        td:nth-child(2) {
          min-width: 120px;
        }

        td:nth-child(3) textarea {
          width: 72px;
          font-weight: 900;
          color: #e6003f;
        }

        td:nth-child(4) textarea {
          width: 190px;
        }

        td:nth-child(5) textarea {
          width: 170px;
        }

        td:nth-child(6) textarea,
        td:nth-child(10) textarea {
          width: 230px;
        }

        td:nth-child(14) textarea {
          width: 420px;
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

          .backBtn {
            width: 100%;
          }
        }
      
        .topScrollWrap > table,
        .topScrollWrap > div,
        .topScrollWrap .tableInner {
          transform: rotateX(180deg);
        }

        .topScrollWrap::-webkit-scrollbar {
          height: 14px;
        }

        .topScrollWrap::-webkit-scrollbar-track {
          background: #fff0f3;
          border-radius: 999px;
        }

        .topScrollWrap::-webkit-scrollbar-thumb {
          background: #b8b8b8;
          border-radius: 999px;
          border: 3px solid #fff0f3;
        }

        .topScrollWrap::-webkit-scrollbar-thumb:hover {
          background: #8f8f8f;
        }

`}</style>
    </main>
  );
}
