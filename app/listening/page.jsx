"use client";

import Link from "next/link";

const parts = [
  {
    number: 1,
    title: "Part 1",
    desc: "Nghe audio ngắn và chọn đáp án đúng A/B/C.",
    status: "Sẵn sàng",
    href: "/listening/part-1",
    ready: true,
  },
  {
    number: 2,
    title: "Part 2",
    desc: "Nối người nói với thông tin phù hợp.",
    status: "Đang thiết lập",
    href: "/listening/part-2",
    ready: false,
  },
  {
    number: 3,
    title: "Part 3",
    desc: "Câu hỏi Nam / Nữ / Cả hai theo nội dung bài nghe.",
    status: "Đang thiết lập",
    href: "/listening/part-3",
    ready: false,
  },
  {
    number: 4,
    title: "Part 4",
    desc: "Nghe đoạn hội thoại dài và trả lời các cặp câu hỏi.",
    status: "Sẵn sàng",
    href: "/listening/part-4",
    ready: true,
  },
];

export default function ListeningPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-pink-100 px-5 py-7 text-rose-950">
      <section className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[34px] border border-rose-100 bg-white/90 p-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-rose-600 text-4xl font-black text-white shadow-xl">
                A
              </div>

              <div>
                <p className="font-black uppercase tracking-wide text-rose-600">
                  Listening Practice
                </p>
                <h1 className="mt-1 text-4xl font-black tracking-tight md:text-5xl">
                  Luyện nghe Aptis
                </h1>
                <p className="mt-3 max-w-2xl font-semibold text-rose-700">
                  Chọn từng Part để luyện nghe. Học viên chưa được duyệt chỉ được xem giới hạn.
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="rounded-2xl bg-rose-600 px-6 py-4 font-black text-white shadow-xl"
            >
              Trang chính
            </Link>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {parts.map((part) => {
            const locked = !part.ready;

            const card = (
              <article
                className={[
                  "min-h-[260px] rounded-[34px] border border-rose-100 bg-white/90 p-7 shadow-xl transition duration-300",
                  locked ? "opacity-60" : "hover:-translate-y-1 hover:shadow-2xl",
                ].join(" ")}
              >
                <div className="mb-7 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <div className="grid h-20 w-20 place-items-center rounded-3xl bg-rose-600 text-3xl font-black text-white shadow-lg">
                      {part.number}
                    </div>

                    <div>
                      <p className="font-black uppercase tracking-wide text-rose-500">
                        Listening
                      </p>
                      <h2 className="mt-1 text-4xl font-black">{part.title}</h2>
                    </div>
                  </div>

                  <span className="rounded-full bg-rose-50 px-4 py-2 text-sm font-black text-rose-600">
                    {locked ? "Đã khóa" : part.status}
                  </span>
                </div>

                <p className="min-h-16 text-lg font-semibold leading-relaxed text-rose-800/75">
                  {part.desc}
                </p>

                <div className="mt-8">
                  <span className={locked
                    ? "rounded-2xl bg-rose-50 px-6 py-4 font-black text-rose-300"
                    : "rounded-2xl bg-rose-600 px-6 py-4 font-black text-white shadow-lg"
                  }>
                    {locked ? "Cần mở khóa" : "Bắt đầu luyện tập"}
                  </span>
                </div>
              </article>
            );

            return locked ? (
              <div key={part.number}>{card}</div>
            ) : (
              <Link key={part.number} href={part.href} className="no-underline">
                {card}
              </Link>
            );
          })}
        </section>
      </section>
    </main>
  );
}
