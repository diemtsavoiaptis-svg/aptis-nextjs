"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function createEmptyRow(index) {
  return {
    id: Date.now() + index,
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
    paragraph: "",
    locked: false,
  };
}

const initialRows = [];

export default function Part3AdminPage() {
  const [rows, setRows] = useState(initialRows);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    async function loadPart3Data() {
      try {
        const res = await fetch("/data/part3-full.json", { cache: "no-store" });
        const data = await res.json();

        const loadedRows = Array.isArray(data)
          ? data.map((item, index) => ({
              id: item.id || index + 1,
              audioLink: item.audioLink || "",
              topic: item.topic || "",
              question1: item.question1 || "",
              answer1: item.answer1 || "",
              question2: item.question2 || "",
              answer2: item.answer2 || "",
              question3: item.question3 || "",
              answer3: item.answer3 || "",
              question4: item.question4 || "",
              answer4: item.answer4 || "",
              paragraph: item.paragraph || "",
              locked: false,
            }))
          : [];

        setRows(loadedRows.length ? loadedRows : Array.from({ length: 6 }, (_, index) => createEmptyRow(index)));
      } catch (error) {
        console.error(error);
        setRows(Array.from({ length: 6 }, (_, index) => createEmptyRow(index)));
      }
    }

    loadPart3Data();
  }, []);

  const selectedCount = selectedIds.length;

  const stats = useMemo(() => {
    const total = rows.length;
    const withAudio = rows.filter((row) => row.audioLink.trim()).length;
    const completed = rows.filter((row) =>
      row.topic.trim() &&
      row.audioLink.trim() &&
      row.question1.trim() &&
      row.answer1.trim() &&
      row.question2.trim() &&
      row.answer2.trim() &&
      row.question3.trim() &&
      row.answer3.trim() &&
      row.question4.trim() &&
      row.answer4.trim() &&
      row.paragraph.trim()
    ).length;

    return { total, withAudio, completed };
  }, [rows]);

  function updateRow(id, field, value) {
    setRows((current) =>
      current.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  }

  function addRows(count = 1) {
    setRows((current) => [
      ...current,
      ...Array.from({ length: count }, (_, index) => createEmptyRow(index)),
    ]);
  }

  function toggleSelect(id) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function toggleSelectAll() {
    if (selectedIds.length === rows.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(rows.map((row) => row.id));
    }
  }

  function deleteSelected() {
    if (!selectedIds.length) return;
    setRows((current) => current.filter((row) => !selectedIds.includes(row.id)));
    setSelectedIds([]);
  }

  function toggleLockAll() {
    const shouldLock = rows.some((row) => !row.locked);
    setRows((current) => current.map((row) => ({ ...row, locked: shouldLock })));
  }

  function toggleLockRow(id) {
    setRows((current) =>
      current.map((row) =>
        row.id === id ? { ...row, locked: !row.locked } : row
      )
    );
  }

  function saveAll() {
    const payload = rows.map((row, index) => ({
      stt: index + 1,
      audioLink: row.audioLink,
      topic: row.topic,
      question1: row.question1,
      answer1: row.answer1,
      question2: row.question2,
      answer2: row.answer2,
      question3: row.question3,
      answer3: row.answer3,
      question4: row.question4,
      answer4: row.answer4,
      paragraph: row.paragraph,
    }));

    console.log("PART 3 DATA:", payload);
    alert("Đã chuẩn bị dữ liệu Part 3. Bước tiếp theo sẽ nối nút này với API/database.");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-pink-100 px-5 py-6 text-rose-950">
      <section className="mx-auto max-w-[1800px]">
        <header className="mb-5 rounded-[30px] border border-rose-100 bg-white/90 p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-rose-600 text-4xl font-black text-white shadow-xl">
                3
              </div>

              <div>
                <p className="font-black uppercase tracking-wide text-rose-600">
                  Quản lý Listening
                </p>
                <h1 className="mt-1 text-4xl font-black tracking-tight">
                  Admin Part 3
                </h1>
                <p className="mt-2 font-semibold text-rose-700">
                  Quản lý audio, topic, 4 câu hỏi, 4 đáp án và paragraph phân tích y nguyên.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/listening"
                className="rounded-2xl border border-rose-200 bg-white px-5 py-3 font-black text-rose-800 shadow-sm"
              >
                Về quản lý Listening
              </Link>

              <Link
                href="/listening/part-3"
                className="rounded-2xl bg-rose-600 px-5 py-3 font-black text-white shadow-md"
              >
                Xem giao diện học viên
              </Link>
            </div>
          </div>
        </header>

        <section className="mb-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-[24px] border border-rose-100 bg-white/85 p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-rose-500">Tổng dòng</p>
            <h2 className="mt-2 text-3xl font-black">{stats.total}</h2>
          </div>

          <div className="rounded-[24px] border border-rose-100 bg-white/85 p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-rose-500">Có audio</p>
            <h2 className="mt-2 text-3xl font-black">{stats.withAudio}</h2>
          </div>

          <div className="rounded-[24px] border border-rose-100 bg-white/85 p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-rose-500">Hoàn thiện</p>
            <h2 className="mt-2 text-3xl font-black">{stats.completed}</h2>
          </div>

          <div className="rounded-[24px] border border-rose-100 bg-white/85 p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-rose-500">Đã chọn</p>
            <h2 className="mt-2 text-3xl font-black">{selectedCount}</h2>
          </div>
        </section>

        <section className="mb-5 rounded-[26px] border border-rose-100 bg-white/85 p-5 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black">Bảng cập nhật hàng loạt</h2>
              <p className="mt-1 font-semibold text-rose-600">
                Có thể nhập trực tiếp từng dòng. Cột Paragraph dùng để dán phân tích y nguyên.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => addRows(1)}
                className="rounded-2xl border border-rose-200 bg-white px-5 py-3 font-black text-rose-800 shadow-sm"
              >
                + Thêm 1 dòng
              </button>

              <button
                type="button"
                onClick={() => addRows(5)}
                className="rounded-2xl border border-rose-200 bg-white px-5 py-3 font-black text-rose-800 shadow-sm"
              >
                + Thêm 5 dòng
              </button>

              <button
                type="button"
                onClick={toggleLockAll}
                className="rounded-2xl border border-rose-200 bg-white px-5 py-3 font-black text-rose-800 shadow-sm"
              >
                Khóa / Mở tất cả
              </button>

              <button
                type="button"
                onClick={deleteSelected}
                className="rounded-2xl border border-rose-200 bg-white px-5 py-3 font-black text-rose-800 shadow-sm"
              >
                Xóa dòng đã chọn
              </button>

              <button
                type="button"
                onClick={saveAll}
                className="rounded-2xl bg-rose-600 px-6 py-3 font-black text-white shadow-md"
              >
                Lưu toàn bộ
              </button>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-rose-100 bg-white/90 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-[2200px] border-collapse text-left">
              <thead>
                <tr className="bg-rose-600 text-white">
                  <th className="w-14 px-4 py-4">
                    <input
                      type="checkbox"
                      checked={rows.length > 0 && selectedIds.length === rows.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="w-20 px-4 py-4">STT</th>
                  <th className="w-[260px] px-4 py-4">Link Audio</th>
                  <th className="w-[220px] px-4 py-4">Topic</th>
                  <th className="w-[260px] px-4 py-4">Câu hỏi 1</th>
                  <th className="w-[180px] px-4 py-4">Đáp án 1</th>
                  <th className="w-[260px] px-4 py-4">Câu hỏi 2</th>
                  <th className="w-[180px] px-4 py-4">Đáp án 2</th>
                  <th className="w-[260px] px-4 py-4">Câu hỏi 3</th>
                  <th className="w-[180px] px-4 py-4">Đáp án 3</th>
                  <th className="w-[260px] px-4 py-4">Câu hỏi 4</th>
                  <th className="w-[180px] px-4 py-4">Đáp án 4</th>
                  <th className="w-[520px] px-4 py-4">Paragraph (Phân tích y nguyên)</th>
                  <th className="w-[120px] px-4 py-4">Khóa</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id} className="border-b border-rose-100 align-top">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => toggleSelect(row.id)}
                      />
                    </td>

                    <td className="px-4 py-4 font-black text-rose-700">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4">
                      <textarea
                        disabled={row.locked}
                        value={row.audioLink}
                        onChange={(e) => updateRow(row.id, "audioLink", e.target.value)}
                        placeholder="Dán link audio..."
                        className="h-24 w-full resize-none rounded-2xl border border-rose-100 bg-white px-4 py-3 font-semibold outline-none focus:border-rose-500 disabled:bg-rose-50"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <textarea
                        disabled={row.locked}
                        value={row.topic}
                        onChange={(e) => updateRow(row.id, "topic", e.target.value)}
                        placeholder="Topic..."
                        className="h-24 w-full resize-none rounded-2xl border border-rose-100 bg-white px-4 py-3 font-semibold outline-none focus:border-rose-500 disabled:bg-rose-50"
                      />
                    </td>

                    {[
                      ["question1", "Câu hỏi 1"],
                      ["answer1", "Đáp án 1"],
                      ["question2", "Câu hỏi 2"],
                      ["answer2", "Đáp án 2"],
                      ["question3", "Câu hỏi 3"],
                      ["answer3", "Đáp án 3"],
                      ["question4", "Câu hỏi 4"],
                      ["answer4", "Đáp án 4"],
                    ].map(([field, label]) => (
                      <td key={field} className="px-4 py-4">
                        <textarea
                          disabled={row.locked}
                          value={row[field]}
                          onChange={(e) => updateRow(row.id, field, e.target.value)}
                          placeholder={label}
                          className="h-24 w-full resize-none rounded-2xl border border-rose-100 bg-white px-4 py-3 font-semibold outline-none focus:border-rose-500 disabled:bg-rose-50"
                        />
                      </td>
                    ))}

                    <td className="px-4 py-4">
                      <textarea
                        disabled={row.locked}
                        value={row.paragraph}
                        onChange={(e) => updateRow(row.id, "paragraph", e.target.value)}
                        placeholder="Dán paragraph phân tích y nguyên..."
                        className="h-36 w-full resize-none rounded-2xl border border-rose-100 bg-white px-4 py-3 font-semibold leading-relaxed outline-none focus:border-rose-500 disabled:bg-rose-50"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => toggleLockRow(row.id)}
                        className={row.locked
                          ? "rounded-2xl bg-rose-100 px-4 py-3 font-black text-rose-600"
                          : "rounded-2xl bg-rose-600 px-4 py-3 font-black text-white"
                        }
                      >
                        {row.locked ? "Mở" : "Khóa"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

