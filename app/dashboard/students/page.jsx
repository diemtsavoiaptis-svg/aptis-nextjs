"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Page() {
  const [students, setHọc viêns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchPhone, setSearchPhone] = useState("");

  async function loadHọc viêns() {
    try {
      const res = await fetch("/api/students", { cache: "no-store" });
      const data = await res.json();
      setHọc viêns(data.students || []);
    } catch (error) {
      console.error(error);
      setHọc viêns([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    await fetch("/api/students/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    await loadHọc viêns();
  }

  useEffect(() => {
    loadHọc viêns();
  }, []);

  const filteredHọc viêns = students.filter((student) => {
    const phone = String(student.phone || "").replace(/\s+/g, "");
    const keyword = searchPhone.trim().replace(/\s+/g, "");
    return !keyword || phone.includes(keyword);
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-pink-100 px-5 py-6 text-rose-950">
      <section className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-rose-100 bg-white/85 px-5 py-4 shadow-lg">
          <div>
            <h1 className="text-3xl font-black">Duyệt học viên</h1>
            <p className="mt-1 font-bold text-rose-500">
              Quản lý tài khoản học viên đăng ký và mở khóa bài học.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-2xl border border-rose-200 bg-white px-5 py-3 font-black text-rose-800 shadow-sm"
            >
              Bảng điều khiển
            </Link>

            <Link
              href="/dashboard/listening"
              className="rounded-2xl bg-rose-600 px-5 py-3 font-black text-white shadow-md"
            >
              Quản lý Listening
            </Link>
          </div>
        </div>

        <div className="mb-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-rose-100 bg-white/85 p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-rose-500">Tổng học viên</p>
            <h2 className="mt-2 text-3xl font-black">{students.length}</h2>
          </div>

          <div className="rounded-[24px] border border-rose-100 bg-white/85 p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-rose-500">Đang chờ duyệt</p>
            <h2 className="mt-2 text-3xl font-black">
              {students.filter((student) => student.status !== "approved").length}
            </h2>
          </div>

          <div className="rounded-[24px] border border-rose-100 bg-white/85 p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-rose-500">Đã duyệt</p>
            <h2 className="mt-2 text-3xl font-black">
              {students.filter((student) => student.status === "approved").length}
            </h2>
          </div>
        </div>

        <section className="mb-5 rounded-[26px] border border-rose-100 bg-white/85 p-5 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">Tra cứu học viên</h2>
              <p className="mt-1 font-semibold text-rose-600">
                Nhập số điện thoại để tìm nhanh học viên đã đăng ký.
              </p>
            </div>

            <div className="flex min-w-[320px] flex-1 flex-wrap gap-3 md:max-w-xl">
              <input
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="Nhập số điện thoại..."
                className="min-w-[240px] flex-1 rounded-2xl border border-rose-200 bg-white px-5 py-4 font-bold outline-none focus:border-rose-500"
              />

              <button
                type="button"
                onClick={() => setSearchPhone("")}
                className="rounded-2xl border border-rose-200 bg-white px-5 py-4 font-black text-rose-700 shadow-sm"
              >
                Xóa tìm kiếm
              </button>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-rose-100 bg-white/90 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-collapse text-left">
              <thead>
                <tr className="bg-rose-600 text-white">
                  <th className="px-5 py-4">Mã học viên</th>
                  <th className="px-5 py-4">Họ và tên</th>
                  <th className="px-5 py-4">Số điện thoại</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Trạng thái</th>
                  <th className="px-5 py-4">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-10 text-center font-black text-rose-500">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : filteredHọc viêns.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-10 text-center font-black text-rose-500">
                      Không tìm thấy học viên phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredHọc viêns.map((student) => (
                    <tr key={student.id} className="border-b border-rose-100">
                      <td className="px-5 py-4 font-black text-rose-700">{student.id}</td>
                      <td className="px-5 py-4 font-bold">{student.name || "-"}</td>
                      <td className="px-5 py-4 font-bold">{student.phone || "-"}</td>
                      <td className="px-5 py-4 font-bold">{student.email || "-"}</td>
                      <td className="px-5 py-4">
                        <span
                          className={
                            student.status === "approved"
                              ? "rounded-full bg-green-50 px-4 py-2 font-black text-green-700"
                              : "rounded-full bg-amber-50 px-4 py-2 font-black text-amber-700"
                          }
                        >
                          {student.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {student.status === "approved" ? (
                          <button
                            type="button"
                            onClick={() => updateStatus(student.id, "pending")}
                            className="rounded-2xl border border-rose-200 bg-white px-4 py-3 font-black text-rose-700 shadow-sm"
                          >
                            Khóa lại
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updateStatus(student.id, "approved")}
                            className="rounded-2xl bg-rose-600 px-4 py-3 font-black text-white shadow-md"
                          >
                            Duyệt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

