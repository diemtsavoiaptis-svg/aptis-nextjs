"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const partConfigs = {
  1: {
    title: "Quản lý dữ liệu Phần 1",
    subtitle: "Hội thoại ngắn",
    description: "Quản lý audio, STT, câu hỏi, đáp án A/B/C và dữ liệu voice.",
    columns: [
      { key: "audio", label: "Audio" },
      { key: "stt", label: "STT" },
      { key: "question", label: "Câu hỏi" },
      { key: "answerA", label: "Đáp án A" },
      { key: "answerB", label: "Đáp án B" },
      { key: "answerC", label: "Đáp án C" },
      { key: "voiceData", label: "Dữ liệu voice" },
    ],
    sample: {
      audio: "",
      stt: "1",
      question: "Người nói khuyên gì cho những người thiếu động lực trong công việc?",
      answerA: "Furniture",
      answerB: "Home",
      answerC: "Bicycle",
      voiceData: "Dán nội dung transcript của audio vào đây.",
    },
  },
  2: {
    title: "Quản lý dữ liệu Phần 2",
    subtitle: "Nối thông tin",
    description: "Quản lý STT, audio, chủ đề, người 1-4, kho đáp án tổng và dữ liệu voice.",
    columns: [
      { key: "stt", label: "STT" },
      { key: "audio", label: "Audio" },
      { key: "topic", label: "Chủ đề" },
      { key: "person1", label: "Người 1" },
      { key: "person2", label: "Người 2" },
      { key: "person3", label: "Người 3" },
      { key: "person4", label: "Người 4" },
      { key: "answerPool", label: "Kho đáp án tổng" },
      { key: "voiceData", label: "Dữ liệu voice" },
    ],
    sample: {
      stt: "1",
      audio: "",
      topic: "Hoạt động cuối tuần",
      person1: "Người nói 1",
      person2: "Người nói 2",
      person3: "Người nói 3",
      person4: "Người nói 4",
      answerPool: "Planning a trip | Buying a gift | Joining a class | Visiting family",
      voiceData: "Dán toàn bộ nội dung voice vào đây.",
    },
  },
  3: {
    title: "Quản lý dữ liệu Phần 3",
    subtitle: "Quan điểm / Nhận diện người nói",
    description: "Quản lý STT, link audio, chủ đề, 4 câu hỏi, 4 đáp án và paragraph dữ liệu voice.",
    columns: [
      { key: "stt", label: "STT" },
      { key: "audioLink", label: "Link Audio" },
      { key: "topic", label: "Chủ đề" },
      { key: "question1", label: "Câu hỏi 1" },
      { key: "answer1", label: "Đáp án 1" },
      { key: "question2", label: "Câu hỏi 2" },
      { key: "answer2", label: "Đáp án 2" },
      { key: "question3", label: "Câu hỏi 3" },
      { key: "answer3", label: "Đáp án 3" },
      { key: "question4", label: "Câu hỏi 4" },
      { key: "answer4", label: "Đáp án 4" },
      { key: "voiceParagraph", label: "Paragraph dữ liệu voice" },
    ],
    sample: {
      stt: "1",
      audioLink: "",
      topic: "Học trực tuyến",
      question1: "Người nói nào nghĩ học online tiện hơn?",
      answer1: "Speaker A",
      question2: "Người nói nào thích học trực tiếp hơn?",
      answer2: "Speaker B",
      question3: "Người nói nào có quan điểm cân bằng?",
      answer3: "Speaker C",
      question4: "Người nói nào đưa ra ví dụ cá nhân?",
      answer4: "Speaker D",
      voiceParagraph: "Dán toàn bộ paragraph / transcript voice vào đây.",
    },
  },
  4: {
    title: "Quản lý dữ liệu Phần 4",
    subtitle: "Độc thoại / Tóm tắt ý chính",
    description: "Quản lý question, chủ đề, câu hỏi 16, câu hỏi 17, các đáp án chọn và dữ liệu paraphrase.",
    columns: [
      { key: "question", label: "Câu" },
      { key: "topic", label: "Chủ đề" },
      { key: "question16", label: "Câu hỏi 16" },
      { key: "answer16A", label: "Câu trả lời 1" },
      { key: "answer16B", label: "Câu trả lời 2" },
      { key: "answer16C", label: "Câu trả lời 3" },
      { key: "question17", label: "Câu hỏi 17" },
      { key: "answer17A", label: "Câu trả lời chọn 1" },
      { key: "answer17B", label: "Câu trả lời chọn 2" },
      { key: "answer17C", label: "Câu trả lời chọn 3" },
      { key: "paraphraseData", label: "Dữ liệu paraphrase" },
    ],
    sample: {
      question: "1",
      topic: "Một dự án địa phương",
      question16: "Chủ đề chính của đoạn nghe là gì?",
      answer16A: "A local project",
      answer16B: "A travel problem",
      answer16C: "A business idea",
      question17: "Ý cuối cùng của người nói là gì?",
      answer17A: "Start early",
      answer17B: "Ask for help",
      answer17C: "Check the details",
      paraphraseData: "Dán đoạn văn / dữ liệu paraphrase vào đây.",
    },
  },
};

function emptyRow(columns, index) {
  return columns.reduce((row, column) => {
    row[column.key] = column.key === "stt" || column.key === "question" ? String(index + 1) : "";
    return row;
  }, {});
}

export default function ListeningAdminManager({ part = 1 }) {
  const config = partConfigs[part] || partConfigs[1];
  const [rows, setRows] = useState([config.sample]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showPaste, setShowPaste] = useState(false);
  const [pasteText, setPasteText] = useState("");

  const selectedRow = rows[selectedIndex] || rows[0] || {};
  const totalFields = config.columns.length;
  const filledCells = useMemo(() => {
    return rows.reduce((sum, row) => {
      return sum + config.columns.filter((column) => String(row[column.key] || "").trim()).length;
    }, 0);
  }, [rows, config.columns]);

  function updateCell(rowIndex, key, value) {
    setRows((old) =>
      old.map((row, index) => (index === rowIndex ? { ...row, [key]: value } : row))
    );
  }

  function addRow() {
    const next = emptyRow(config.columns, rows.length);
    setRows((old) => [...old, next]);
    setSelectedIndex(rows.length);
  }

  function duplicateRow() {
    const copy = { ...selectedRow };
    setRows((old) => [...old, copy]);
    setSelectedIndex(rows.length);
  }

  function deleteRow() {
    if (rows.length <= 1) return;
    setRows((old) => old.filter((_, index) => index !== selectedIndex));
    setSelectedIndex(0);
  }

  function clearRows() {
    setRows([emptyRow(config.columns, 0)]);
    setSelectedIndex(0);
  }

  function importPasteData() {
    const lines = pasteText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) return;

    const imported = lines.map((line, rowIndex) => {
      const cells = line.split(/\t|,/);
      const row = {};
      config.columns.forEach((column, columnIndex) => {
        row[column.key] = cells[columnIndex]?.trim() || "";
      });

      if (row.stt === "") row.stt = String(rowIndex + 1);
      return row;
    });

    setRows(imported);
    setSelectedIndex(0);
    setPasteText("");
    setShowPaste(false);
  }
  function toggleKháchVisibility() {
    setRows((oldRows) =>
      oldRows.map((row, index) =>
        index === selectedIndex
          ? { ...row, showInKhách: !row.showInKhách }
          : row
      )
    );
  }



  function exportJson() {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `du-lieu-nghe-phan-${part}-ban-xem-truoc.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="managerPage">
      <section className="managerShell">
        <header className="managerHero">
          <div className="partBadge">
            <span>PHẦN</span>
            <strong>{part}</strong>
          </div>

          <div className="heroText">
            <p>TRÌNH QUẢN LÝ DỮ LIỆU</p>
            <h1>{config.title}</h1>
            <span>{config.description}</span>
          </div>

          <Link href="/dashboard/listening" className="backBtn">
            ← Quay lại
          </Link>
        </header>

        <section className="statsGrid">
          <div className="statCard">
            <span>Tổng số dòng</span>
            <strong>{rows.length}</strong>
          </div>
          <div className="statCard">
            <span>Tổng số cột</span>
            <strong>{totalFields}</strong>
          </div>
          <div className="statCard">
            <span>Ô đã nhập</span>
            <strong>{filledCells}</strong>
          </div>
          <div className="statCard">
            <span>Trạng thái</span>
            <strong>Thiết kế</strong>
          </div>
        </section>

        <section className="toolBar">
          <button type="button" onClick={addRow}>Thêm dòng</button>
          <button type="button" onClick={duplicateRow}>Nhân bản dòng</button>
          <button type="button" onClick={deleteRow}>Xóa dòng</button>
          <button type="button" onClick={() => setShowPaste(true)}>Dán hàng loạt</button>
          <button type="button" onClick={toggleKháchVisibility}>
            {selectedRow.showInKhách ? "Ẩn khỏi giao diện khách" : "Chọn câu để hiển thị ở giao diện khách"}
          </button>
          <button type="button" onClick={exportJson}>Xuất JSON</button>
          <button type="button" onClick={clearRows} className="dangerBtn">Xóa tất cả</button>
        </section>

        <section className="editorGrid">
          <div className="tablePanel">
            <div className="panelTitle">
              <h2>{config.subtitle}</h2>
              <span>Có thể kéo ngang bảng</span>
            </div>

            <div className="tableWrap topScrollbarWrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    {config.columns.map((column) => (
                      <th key={column.key}>{column.label}</th>
                    ))}
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
                      {config.columns.map((column) => (
                        <td key={column.key}>
                          <input
                            value={row[column.key] || ""}
                            onChange={(event) => updateCell(rowIndex, column.key, event.target.value)}
                            placeholder={column.label}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="detailPanel">
            <div className="panelTitle">
              <h2>Dòng đang chọn</h2>
              <span>
                Dòng {selectedIndex + 1} · {selectedRow.showInKhách ? "Đang hiển thị khách" : "Chưa hiển thị khách"}
              </span>
            </div>

            <div className="formGrid">
              {config.columns.map((column) => {
                const large =
                  column.key.toLowerCase().includes("voice") ||
                  column.key.toLowerCase().includes("paragraph") ||
                  column.key.toLowerCase().includes("paraphrase") ||
                  column.key.toLowerCase().includes("pool");

                return (
                  <label key={column.key} className={large ? "largeField" : ""}>
                    <span>{column.label}</span>
                    {large ? (
                      <textarea
                        value={selectedRow[column.key] || ""}
                        onChange={(event) => updateCell(selectedIndex, column.key, event.target.value)}
                        placeholder={column.label}
                      />
                    ) : (
                      <input
                        value={selectedRow[column.key] || ""}
                        onChange={(event) => updateCell(selectedIndex, column.key, event.target.value)}
                        placeholder={column.label}
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </aside>
        </section>
      </section>

      {showPaste ? (
        <div className="modalOverlay">
          <div className="pasteModal">
            <h2>Dán dữ liệu hàng loạt</h2>
            <p>
              Dán dữ liệu từ Excel hoặc Google Sheets. Thứ tự cột cần đúng theo bảng của Phần {part}.
            </p>
            <textarea
              value={pasteText}
              onChange={(event) => setPasteText(event.target.value)}
              placeholder="Dán các dòng dữ liệu, mỗi cột cách nhau bằng tab..."
            />
            <div className="modalActions">
              <button type="button" onClick={() => setShowPaste(false)}>Hủy</button>
              <button type="button" onClick={importPasteData}>Nhập bản xem trước</button>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #fff6f8; }

        .managerPage {
          min-height: 100vh;
          padding: 24px 12px;
          background:
            linear-gradient(rgba(255, 246, 248, 0.92), rgba(255, 246, 248, 0.92)),
            repeating-linear-gradient(-14deg, rgba(244, 63, 94, 0.075) 0, rgba(244, 63, 94, 0.075) 2px, transparent 2px, transparent 86px);
          color: #3d0810;
          font-family: Arial, sans-serif;
        }

        .managerShell {
          width: min(1480px, 100%);
          margin: 0 auto;
          padding: 24px;
          border-radius: 34px;
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(244,63,94,0.18);
          box-shadow: 0 24px 80px rgba(190,18,60,0.14);
        }

        .managerHero {
          display: grid;
          grid-template-columns: 112px 1fr auto;
          align-items: center;
          gap: 22px;
          padding: 24px;
          border-radius: 30px;
          background: rgba(255,255,255,0.86);
          border: 1px solid rgba(244,63,94,0.14);
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
          box-shadow: 0 18px 36px rgba(217,4,41,0.22);
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

        .statsGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 14px;
        }

        .statCard {
          padding: 18px;
          border-radius: 20px;
          background: rgba(255,255,255,0.9);
          border: 1px solid #ffc0cc;
        }

        .statCard span {
          display: block;
          color: #9f001f;
          font-size: 13px;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .statCard strong {
          color: #3d0810;
          font-size: 28px;
        }

        .toolBar {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding: 14px;
          border-radius: 22px;
          background: rgba(255,255,255,0.86);
          border: 1px solid rgba(244,63,94,0.14);
          margin-bottom: 14px;
        }

        .toolBar button,
        .modalActions button {
          min-height: 44px;
          padding: 0 16px;
          border: 1px solid #ffc0cc;
          border-radius: 999px;
          background: linear-gradient(135deg, #fff0f3, #ffe1e8);
          color: #9f001f;
          font-weight: 900;
          cursor: pointer;
        }

        .toolBar .dangerBtn {
          background: #d90429;
          color: white;
          border-color: #d90429;
        }

        .editorGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(360px, 0.55fr);
          gap: 14px;
        }

        .tablePanel,
        .detailPanel {
          min-width: 0;
          padding: 18px;
          border-radius: 24px;
          background: rgba(255,255,255,0.9);
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

        .tableWrap {
          width: 100%;
          overflow: auto;
          border-radius: 18px;
          border: 1px solid #ffd4dc;
}
        .topScrollbarWrap {
          transform: rotateX(180deg);
        }

        .topScrollbarWrap table {
          transform: rotateX(180deg);
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
          vertical-align: top;
        }

        tr.activeRow td {
          background: #fff7f8;
        }

        tr.guestVisibleRow td {
          background: #fff0f3;
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

        td input {
          width: 180px;
          min-height: 40px;
          border: 1px solid #ffd0da;
          border-radius: 12px;
          padding: 0 10px;
          color: #3d0810;
          outline: none;
          background: white;
        }

        td input:focus,
        .formGrid input:focus,
        .formGrid textarea:focus,
        .pasteModal textarea:focus {
          border-color: #d90429;
          box-shadow: 0 0 0 3px rgba(217,4,41,0.08);
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
          min-height: 130px;
          resize: vertical;
          line-height: 1.5;
        }

        .largeField {
          grid-column: 1 / -1;
        }

        .modalOverlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(45,5,12,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }

        .pasteModal {
          width: min(760px, 100%);
          padding: 24px;
          border-radius: 24px;
          background: white;
          box-shadow: 0 28px 80px rgba(45,5,12,0.24);
        }

        .pasteModal h2 {
          margin: 0 0 8px;
          color: #3d0810;
        }

        .pasteModal p {
          margin: 0 0 14px;
          color: #70404a;
        }

        .pasteModal textarea {
          width: 100%;
          min-height: 260px;
          border: 1px solid #ffd0da;
          border-radius: 16px;
          padding: 14px;
          outline: none;
          resize: vertical;
        }

        .modalActions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 14px;
        }

        .modalActions button:last-child {
          background: #d90429;
          color: white;
          border-color: #d90429;
        }

        @media (max-width: 1100px) {
          .editorGrid { grid-template-columns: 1fr; }
          .statsGrid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 700px) {
          .managerShell { padding: 16px; border-radius: 24px; }
          .managerHero { grid-template-columns: 1fr; }
          .statsGrid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}



