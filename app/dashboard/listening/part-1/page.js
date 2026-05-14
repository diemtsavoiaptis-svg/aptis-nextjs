"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const columns = [
  { key: "selected", label: "Chọn", type: "checkbox" },
  { key: "audio", label: "audio", type: "text" },
  { key: "stt", label: "STT", type: "text" },
  { key: "question", label: "Câu hỏi", type: "text" },
  { key: "answerA", label: "Đáp án A", type: "text" },
  { key: "answerB", label: "Đáp án B", type: "text" },
  { key: "answerC", label: "Đáp án C", type: "text" },
  { key: "correctAnswer", label: "Đáp án đúng", type: "letterSelect" },

  { key: "voiceData", label: "dữ liệu voice", type: "textarea" },
  { key: "guestStatus", label: "Giao diện khách", type: "status" },
];

function createEmptyRow(index) {
  return {
    selected: false,
    showInKhách: false,
    audio: "",
    audio_drive_file_id: "",
    stt: String(index + 1),
    order: index + 1,
    question: "",
    answerA: "",
    answerB: "",
    answerC: "",
    options: ["", "", ""],
    voiceData: "",
  };
}

export default function AdminListeningPart1Page() {
  const [rows, setRows] = useState([createEmptyRow(0)]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch("/data/part1-admin.json", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setRows(data.map((row) => ({ ...row, selected: false })));
          setSelectedIndex(0);
        }
      })
      .catch((error) => {
        console.error(error);
        setNotice("Không tải được dữ liệu Part 1.");
      });
  }, []);

  const selectedRow = rows[selectedIndex] || rows[0] || createEmptyRow(0);
  const guestCount = useMemo(() => rows.filter((row) => row.showInKhách).length, [rows]);
  const selectedCount = useMemo(() => rows.filter((row) => row.selected).length, [rows]);

  function updateCell(rowIndex, key, value) {
    setRows((oldRows) =>
      oldRows.map((row, index) => {
        if (index !== rowIndex) return row;

        const next = { ...row, [key]: value };

        if (["answerA", "answerB", "answerC"].includes(key)) {
          next.options = [next.answerA || "", next.answerB || "", next.answerC || ""];
        }

        return next;
      })
    );
  }

  function pickKháchCâus() {
    const pickedCount = rows.filter((row) => row.selected).length;

    if (!pickedCount) {
      setNotice("Em cần tick chọn ít nhất 1 câu ở bảng bên dưới trước.");
      return;
    }

    setRows((oldRows) =>
      oldRows.map((row) =>
        row.selected
          ? { ...row, showInKhách: true, selected: false }
          : row
      )
    );

    setNotice(`Đã chọn ${pickedCount} câu để hiển thị ở giao diện khách. Nhớ bấm Lưu toàn bộ.`);
  }

  function hideKháchCâus() {
    const pickedCount = rows.filter((row) => row.selected).length;

    if (!pickedCount) {
      setNotice("Em cần tick chọn câu muốn ẩn khỏi giao diện khách.");
      return;
    }

    setRows((oldRows) =>
      oldRows.map((row) =>
        row.selected
          ? { ...row, showInKhách: false, selected: false }
          : row
      )
    );

    setNotice(`Đã ẩn ${pickedCount} câu khỏi giao diện khách. Nhớ bấm Lưu toàn bộ.`);
  }

  function addRow() {
    setRows((oldRows) => [...oldRows, createEmptyRow(oldRows.length)]);
    setSelectedIndex(rows.length);
  }

  async function saveAllRows() {
    try {
      const res = await fetch("/api/admin/part1/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rows),
      });

      const result = await res.json();

      if (!res.ok || !result.ok) {
        throw new Error(result.message || "Không lưu được dữ liệu.");
      }

      setRows((oldRows) => oldRows.map((row) => ({ ...row, selected: false })));
      setNotice(`Đã lưu toàn bộ ${result.count} câu. Có ${result.guestCount} câu hiện ở giao diện khách.`);
    } catch (error) {
      console.error(error);
      setNotice("Lưu thất bại. Kiểm tra terminal để xem lỗi.");
    }
  }

  return (
    <main className="page">
      <section className="shell">
        <header className="hero">
          <div className="partBadge">
            <span>PHẦN</span>
            <strong>1</strong>
          </div>

          <div className="heroText">
            <p>TRÌNH QUẢN LÝ DỮ LIỆU</p>
            <h1>Quản lý dữ liệu Listening Part 1</h1>
            <span>Tick câu muốn cho khách xem, bấm chọn hiển thị khách, sau đó bấm Lưu toàn bộ.</span>
          </div>

          <Link href="/dashboard/listening" className="backBtn">← Quay lại</Link>
        </header>

        <section className="layout">
          <div className="tablePanel">
            <div className="panelTitle">
              <h2>Bảng dữ liệu Part 1</h2>

              <div className="viewLinks">
                <a href="/listening/part-1" target="_blank">Giao diện khách</a>
                <a href="/listening/part-1?mode=student" target="_blank">Giao diện học viên</a>
                <span>{guestCount} câu hiện khách</span>
              </div>
            </div>

            <div className="guestActionBox">
              <button type="button" className="guestPickBtn" onClick={pickKháchCâus}>
                Chọn câu hiển thị giao diện khách
              </button>

              <button type="button" className="guestHideBtn" onClick={hideKháchCâus}>
                Ẩn câu khỏi giao diện khách
              </button>

              <button type="button" className="addRowBtn" onClick={addRow}>
                + Thêm dòng
              </button>

              <button type="button" className="saveAllBtn" onClick={saveAllRows}>
                Lưu toàn bộ
              </button>
            </div>

            <div className="miniStatus">
              <span>Đang tick: {selectedCount} câu</span>
              <span>Hiện khách: {guestCount} câu</span>
            </div>

            {notice ? <div className="noticeBox">{notice}</div> : null}

            <div className="tableWrap">
              <div className="topScrollWrap"><table>
                <thead>
                  <tr>
                    <th>#</th>
                    {columns.map((column) => <th key={column.key}>{column.label}</th>)}
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={`${rowIndex === selectedIndex ? "activeRow" : ""} ${row.showInKhách ? "guestVisibleRow" : ""}`}
                      onClick={() => setSelectedIndex(rowIndex)}
                    >
                      <td>{rowIndex + 1}</td>

                      {columns.map((column) => (
                        <td key={column.key}>
                          {column.type === "checkbox" ? (
                            <input
                              type="checkbox"
                              checked={Boolean(row.selected)}
                              onChange={(event) => updateCell(rowIndex, "selected", event.target.checked)}
                              onClick={(event) => event.stopPropagation()}
                            />
                          ) : column.type === "status" ? (
                            <span className={row.showInKhách ? "statusOn" : "statusOff"}>
                              {row.showInKhách ? "Hiện khách" : "Chưa hiện"}
                            </span>
                          ) : (
                            <input
                              value={row[column.key] || ""}
                              onChange={(event) => updateCell(rowIndex, column.key, event.target.value)}
                              placeholder={column.label}
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table></div>
            </div>
          </div>

          <aside className="detailPanel">
            <div className="panelTitle">
              <h2>Dòng đang chọn</h2>
              <span>Dòng {selectedIndex + 1} · {selectedRow.showInKhách ? "Đang hiện khách" : "Chưa hiện khách"}</span>
            </div>

            <div className="formGrid">
              {columns
                .filter((column) => !["selected", "guestStatus"].includes(column.key))
                .map((column) => (
                  <label key={column.key} className={column.type === "textarea" ? "largeField" : ""}>
                    <span>{column.label}</span>

                    {column.type === "textarea" ? (
                      <textarea
                        value={selectedRow[column.key] || ""}
                        onChange={(event) => updateCell(selectedIndex, column.key, event.target.value)}
                        placeholder="Dán nội dung voice/transcript của câu này vào đây..."
                      />
                    ) : (
                      <input
                        value={selectedRow[column.key] || ""}
                        onChange={(event) => updateCell(selectedIndex, column.key, event.target.value)}
                        placeholder={column.label}
                      />
                    )}
                  </label>
                ))}
            </div>
          </aside>
        </section>
      </section>

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #fff6f8; }

        .page {
          min-height: 100vh;
          padding: 24px 12px;
          background:
            linear-gradient(rgba(255, 246, 248, 0.92), rgba(255, 246, 248, 0.92)),
            repeating-linear-gradient(-14deg, rgba(244, 63, 94, 0.075) 0, rgba(244, 63, 94, 0.075) 2px, transparent 2px, transparent 86px);
          color: #3d0810;
          font-family: Arial, sans-serif;
        }

        .shell {
          width: min(1480px, 100%);
          margin: 0 auto;
          padding: 24px;
          border-radius: 34px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(244, 63, 94, 0.18);
          box-shadow: 0 24px 80px rgba(190, 18, 60, 0.14);
        }

        .hero {
          display: grid;
          grid-template-columns: 112px 1fr auto;
          align-items: center;
          gap: 22px;
          padding: 24px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.86);
          border: 1px solid rgba(244, 63, 94, 0.14);
          margin-bottom: 18px;
        }

        .partBadge {
          width: 108px;
          height: 108px;
          border-radius: 28px;
          background: linear-gradient(135deg, #ff315b, #d90429);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          box-shadow: 0 18px 36px rgba(217, 4, 41, 0.22);
        }

        .partBadge span { font-size: 15px; font-weight: 900; }
        .partBadge strong { font-size: 48px; line-height: 1; margin-top: 10px; }

        .heroText p {
          margin: 0 0 7px;
          color: #d90429;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .heroText h1 {
          margin: 0 0 10px;
          color: #3d0810;
          font-size: clamp(30px, 4vw, 52px);
          line-height: 1;
        }

        .heroText span {
          color: #70404a;
          font-size: 16px;
          line-height: 1.55;
        }

        .backBtn {
          min-height: 48px;
          padding: 0 18px;
          border-radius: 999px;
          background: #fff0f3;
          border: 1px solid #ffc6d0;
          color: #9f001f;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
        }

        .layout {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(360px, 0.55fr);
          gap: 14px;
        }

        .tablePanel,
        .detailPanel {
          min-width: 0;
          padding: 18px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #ffc0cc;
        }

        .panelTitle {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-bottom: 14px;
        }

        .panelTitle h2 {
          margin: 0;
          color: #3d0810;
          font-size: 22px;
        }

        .panelTitle span {
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

        .viewLinks {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
        }

        .viewLinks a {
          min-height: 38px;
          padding: 0 14px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ff315b, #d90429);
          border: 1px solid #d90429;
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        .viewLinks a:first-child {
          background: #fff0f3;
          border-color: #ffc6d0;
          color: #9f001f;
        }

        .guestActionBox,
        .miniStatus {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          padding: 12px;
          border-radius: 18px;
          background: #fff7f8;
          border: 1px solid #ffd4dc;
          margin-bottom: 12px;
        }

        .guestActionBox button {
          min-height: 42px;
          padding: 0 16px;
          border-radius: 999px;
          font-weight: 900;
          cursor: pointer;
          border: 1px solid #ffc0cc;
        }

        .guestPickBtn,
        .saveAllBtn {
          background: linear-gradient(135deg, #ff315b, #d90429);
          color: white;
          border-color: #d90429 !important;
        }

        .guestHideBtn,
        .addRowBtn {
          background: #fff0f3;
          color: #9f001f;
        }

        .miniStatus span,
        .noticeBox {
          padding: 10px 14px;
          border-radius: 999px;
          background: #fff0f3;
          border: 1px solid #ffc0cc;
          color: #9f001f;
          font-weight: 900;
        }

        .noticeBox {
          border-radius: 16px;
          margin-bottom: 12px;
        }

        .tableWrap {
          width: 100%;
          overflow: auto;
          border-radius: 18px;
          border: 1px solid #ffd4dc;
        }

        table {
          width: max-content;
          min-width: 100%;
          border-collapse: collapse;
          background: white;
        }

        th {
          position: sticky;
          top: 0;
          z-index: 1;
          background: #fff0f3;
          color: #9f001f;
          font-size: 13px;
          text-align: left;
          padding: 12px;
          border-bottom: 1px solid #ffc0cc;
          white-space: nowrap;
        }

        td {
          padding: 10px;
          border-bottom: 1px solid #ffe1e8;
          vertical-align: middle;
        }

        tr.activeRow td { background: #fff7f8; }

        tr.guestVisibleRow td {
          background: #fff0f3;
          box-shadow: inset 0 0 0 9999px rgba(217, 4, 41, 0.035);
        }

        td:first-child,
        th:first-child {
          position: sticky;
          left: 0;
          background: #fff0f3;
          z-index: 2;
          font-weight: 900;
          color: #9f001f;
        }

        td input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #d90429;
        }

        td input {
          width: 220px;
          min-height: 42px;
          border: 1px solid #ffd0da;
          border-radius: 12px;
          padding: 0 10px;
          color: #3d0810;
          outline: none;
          background: white;
        }

        td input:focus,
        .formGrid input:focus,
        .formGrid textarea:focus {
          border-color: #d90429;
          box-shadow: 0 0 0 3px rgba(217, 4, 41, 0.08);
        }

        .statusOn,
        .statusOff {
          min-height: 32px;
          padding: 0 12px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 900;
          white-space: nowrap;
        }

        .statusOn {
          background: #d90429;
          color: white;
        }

        .statusOff {
          background: #fff0f3;
          color: #9f001f;
          border: 1px solid #ffc6d0;
        }

        .formGrid {
          display: grid;
          gap: 12px;
          max-height: 66vh;
          overflow: auto;
          padding-right: 4px;
        }

        .formGrid label {
          display: grid;
          gap: 7px;
        }

        .formGrid label span {
          color: #9f001f;
          font-size: 13px;
          font-weight: 900;
        }

        .formGrid input,
        .formGrid textarea {
          width: 100%;
          border: 1px solid #ffd0da;
          border-radius: 14px;
          padding: 12px;
          color: #3d0810;
          background: #fff;
          outline: none;
          font-size: 14px;
        }

        .formGrid textarea {
          min-height: 190px;
          resize: vertical;
          line-height: 1.55;
        }

        .largeField {
          grid-column: 1 / -1;
        }

        @media (max-width: 1100px) {
          .layout { grid-template-columns: 1fr; }
        }

        @media (max-width: 700px) {
          .shell { padding: 16px; border-radius: 24px; }
          .hero { grid-template-columns: 1fr; }
          .panelTitle { align-items: flex-start; flex-direction: column; }
        }
      
        .topScrollWrap {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          transform: rotateX(180deg);
          border-top: 1px solid #ffd4dc;
          border-radius: 16px 16px 0 0;
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
