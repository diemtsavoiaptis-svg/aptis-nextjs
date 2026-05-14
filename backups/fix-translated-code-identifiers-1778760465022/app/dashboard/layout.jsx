import Link from "next/link";

const skills = [
  {
    badge: "L",
    title: "Listening",
    desc: "Admin 1 → 4",
    href: "/dashboard/listening",
    active: true,
  },
  {
    badge: "R",
    title: "Reading",
    desc: "Sắp có",
    href: "#",
    active: false,
  },
  {
    badge: "S",
    title: "Speaking",
    desc: "Sắp có",
    href: "#",
    active: false,
  },
  {
    badge: "W",
    title: "Writing",
    desc: "Sắp có",
    href: "#",
    active: false,
  },
  {
    badge: "G&V",
    title: "G&V",
    desc: "Sắp có",
    href: "#",
    active: false,
  },
];

export default function Bảng điều khiểnLayout({ children }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-pink-100 text-rose-950">
      <div className="mx-auto grid min-h-screen max-w-[1500px] gap-6 p-5 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-[36px] border border-rose-100 bg-white/90 p-5 shadow-2xl">
          <Link
            href="/dashboard/listening"
            className="mb-8 flex items-center gap-4 rounded-[30px] bg-rose-50 p-5 text-rose-950 no-underline"
          >
            <span className="grid h-16 w-16 place-items-center rounded-3xl bg-rose-600 text-3xl font-black text-white shadow-xl">
              A
            </span>

            <span>
              <span className="block text-sm font-black uppercase tracking-wide text-rose-600">
                HỆ THỐNG QUẢN TRỊ
              </span>
              <span className="block text-2xl font-black">
                Quản trị Aptis
              </span>
            </span>
          </Link>

          <nav className="space-y-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-4 rounded-3xl px-4 py-4 text-rose-900 no-underline transition hover:bg-rose-50"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-100 text-xl font-black text-rose-600">
                D
              </span>
              <strong className="text-lg font-black">Bảng điều khiển</strong>
            </Link>

            <div className="my-5 h-px bg-rose-100" />

            {skills.map((skill) =>
              skill.active ? (
                <Link
                  key={skill.title}
                  href={skill.href}
                  className="flex items-center gap-4 rounded-3xl px-4 py-4 text-rose-900 no-underline transition hover:bg-rose-50"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-100 text-lg font-black text-rose-600">
                    {skill.badge}
                  </span>
                  <span>
                    <strong className="block text-lg font-black tracking-wide">
                      {skill.title}
                    </strong>
                    <small className="mt-1 block font-black text-rose-400">
                      {skill.desc}
                    </small>
                  </span>
                </Link>
              ) : (
                <div
                  key={skill.title}
                  className="flex cursor-not-allowed items-center gap-4 rounded-3xl px-4 py-4 text-rose-900 opacity-60"
                  title={`${skill.title} chưa có dữ liệu`}
                >
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-100 text-lg font-black text-rose-600">
                    {skill.badge}
                  </span>
                  <span>
                    <strong className="block text-lg font-black tracking-wide">
                      {skill.title}
                    </strong>
                    <small className="mt-1 block font-black text-rose-400">
                      {skill.desc}
                    </small>
                  </span>
                </div>
              )
            )}
          </nav>
        </aside>

        <section className="min-w-0">
          {children}
        </section>
      </div>
    </main>
  );
}

