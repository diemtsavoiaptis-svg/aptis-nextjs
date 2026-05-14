import Link from "next/link";

const skills = [
  {
    badge: "L",
    title: "Listening",
    desc: "Quản lý Listening Part 1 → 4.",
    href: "/dashboard/listening",
    active: true,
  },
  {
    badge: "R",
    title: "Reading",
    desc: "Chưa có dữ liệu, sẽ mở sau.",
    href: "#",
    active: false,
  },
  {
    badge: "S",
    title: "Speaking",
    desc: "Chưa có dữ liệu, sẽ mở sau.",
    href: "#",
    active: false,
  },
  {
    badge: "W",
    title: "Writing",
    desc: "Chưa có dữ liệu, sẽ mở sau.",
    href: "#",
    active: false,
  },
  {
    badge: "G&V",
    title: "G&V",
    desc: "Chưa có dữ liệu, sẽ mở sau.",
    href: "#",
    active: false,
  },
];

export default function DashboardPage() {
  return (
    <main className="text-rose-950">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-[28px] border border-rose-100 bg-white/85 px-6 py-5 shadow-lg">
          <h1 className="text-3xl font-black">Bảng điều khiển</h1>
          <p className="mt-2 font-bold text-rose-500">
            Quản lý 5 kỹ năng chính của hệ thống Aptis.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {skills.map((skill) =>
            skill.active ? (
              <Link
                key={skill.title}
                href={skill.href}
                className="rounded-[30px] border border-rose-100 bg-white/90 p-7 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-rose-600 text-2xl font-black text-white shadow-lg">
                  {skill.badge}
                </div>

                <h2 className="text-3xl font-black">{skill.title}</h2>
                <p className="mt-3 font-semibold text-rose-700">{skill.desc}</p>

                <div className="mt-6 inline-flex rounded-2xl bg-rose-600 px-5 py-3 font-black text-white shadow-md">
                  Mở quản lý
                </div>
              </Link>
            ) : (
              <div
                key={skill.title}
                className="cursor-not-allowed rounded-[30px] border border-rose-100 bg-white/70 p-7 opacity-65 shadow-lg"
                title={`${skill.title} chưa có dữ liệu`}
              >
                <div className="mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-rose-100 text-xl font-black text-rose-500 shadow-sm">
                  {skill.badge}
                </div>

                <h2 className="text-3xl font-black">{skill.title}</h2>
                <p className="mt-3 font-semibold text-rose-500">{skill.desc}</p>

                <div className="mt-6 inline-flex rounded-2xl bg-rose-50 px-5 py-3 font-black text-rose-400">
                  Sắp có
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
}
