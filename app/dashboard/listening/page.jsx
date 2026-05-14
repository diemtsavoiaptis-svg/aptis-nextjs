"use client";

import Link from "next/link";

const parts = [
  {
    number: 1,
    title: "Part 1",
    description: "Quản lý các câu hỏi âm thanh ngắn, đáp án A/B/C, mã khóa đúng và bản ghi transcript.",
    status: "Sẵn sàng",
    adminHref: "/dashboard/listening/part-1",
    studentHref: "/listening/part-1",
  },
  {
    number: 2,
    title: "Part 2",
    description: "Quản lý các chủ đề nối người nói, giọng đọc và nội dung luyện tập của học sinh.",
    status: "Đang thiết lập",
    adminHref: "/dashboard/listening/part-2",
    studentHref: "/listening/part-2",
  },
  {
    number: 3,
    title: "Part 3",
    description: "Quản lý các câu hỏi liên quan đến Nam/Nữ/Cả hai và các tài liệu nghe.",
    status: "Đang thiết lập",
    adminHref: "/dashboard/listening/part-3",
    studentHref: "/listening/part-3",
  },
  {
    number: 4,
    title: "Part 4",
    description: "Quản lý các tài liệu âm thanh dài, các cặp câu hỏi và lựa chọn đáp án.",
    status: "Sẵn sàng",
    adminHref: "/dashboard/listening/part-4",
    studentHref: "/listening/part-4",
  },
];

export default function ListeningDashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-pink-100 px-5 py-6 text-rose-950">
      <section className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-rose-100 bg-white/80 px-5 py-4 shadow-lg">
          <div>
            <h1 className="text-2xl font-black text-rose-950">Quản lý Listening</h1>
            <p className="mt-1 font-bold text-rose-500">Admin Part 1 → 4</p>
          </div>

          <div className="flex gap-3">
            <Link href="/" className="rounded-2xl border border-rose-200 bg-white px-5 py-3 font-black text-rose-800 shadow-sm">
              Trang chính
            </Link>
            <Link href="/dashboard/students" className="rounded-2xl bg-rose-600 px-5 py-3 font-black text-white shadow-md">
              Duyệt học viên
            </Link>
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          {parts.map((part) => (
            <article
              key={part.number}
              className="group rounded-[32px] border border-rose-100 bg-white/90 p-7 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="mb-7 flex items-start justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="grid h-20 w-20 place-items-center rounded-3xl bg-rose-100 text-3xl font-black text-rose-700 transition group-hover:bg-rose-600 group-hover:text-white">
                    {part.number}
                  </div>

                  <div>
                    <p className="font-black uppercase tracking-wide text-rose-500">
                      LISTENING
                    </p>
                    <h2 className="mt-1 text-3xl font-black">
                      {part.title}
                    </h2>
                  </div>
                </div>

                <span className="rounded-full bg-rose-50 px-4 py-2 text-sm font-black text-rose-600">
                  {part.status}
                </span>
              </div>

              <p className="min-h-20 text-lg font-semibold leading-relaxed text-rose-800/75">
                {part.description}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link
                  href={part.adminHref}
                  className="rounded-2xl bg-rose-600 px-5 py-4 text-center font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-rose-700"
                >
                  Mở quản lý
                </Link>

                <Link
                  href={part.studentHref}
                  className="rounded-2xl border border-rose-200 bg-white px-5 py-4 text-center font-black text-rose-800 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Xem giao diện học viên
                </Link>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

