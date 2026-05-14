"use client";

const people = ["Speaker A", "Speaker B", "Speaker C", "Speaker D"];
const items = [
  "wants to study abroad",
  "needs more speaking practice",
  "prefers learning vocabulary with apps",
  "finds grammar the most difficult",
];

export default function ListeningPart2Preview() {
  return (
    <main className="min-h-screen bg-[#fff7f7] px-6 py-8 text-[#3f1d1d]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-[32px] bg-gradient-to-r from-[#ffe1e5] to-[#fff4f1] p-8 shadow-sm border border-[#ffd3d9]">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#c95461]">
            Listening Practice
          </p>
          <h1 className="text-4xl font-bold text-[#7f1d2d]">
            Part 2 — Information Matching
          </h1>
          <p className="mt-3 max-w-2xl text-base text-[#7c4a4a]">
            Listen to several speakers and match each statement to the correct speaker.
          </p>
        </div>

        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="rounded-[28px] border border-[#ffd6dc] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#7f1d2d]">Audio</h2>
            <p className="mt-1 text-sm text-[#8a5b5b]">Multiple short speakers in one recording</p>

            <div className="mt-5 rounded-2xl border border-[#ffd6dc] bg-[#fffafa] p-5">
              <audio controls className="w-full">
                <source src="" />
              </audio>
            </div>

            <div className="mt-5 rounded-2xl bg-[#fff3f4] p-5 text-sm text-[#6f4444]">
              <strong className="text-[#9f2f42]">Instruction:</strong> Select the correct speaker for each statement.
              This layout is designed for fast matching and easy review.
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {people.map((person) => (
                <div key={person} className="rounded-2xl border border-[#ffe0e4] bg-[#fffafa] p-4 text-center font-bold text-[#9f2f42]">
                  {person}
                </div>
              ))}
            </div>
          </aside>

          <section className="rounded-[28px] border border-[#ffd6dc] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#7f1d2d]">Matching Table</h2>
                <p className="text-sm text-[#8a5b5b]">Choose one speaker for each item</p>
              </div>
              <span className="rounded-full bg-[#fff0f2] px-4 py-2 text-sm font-semibold text-[#b53f51]">
                4 Items
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#ffd6dc]">
              <table className="w-full border-collapse bg-white text-sm">
                <thead className="bg-[#fff0f2] text-[#7f1d2d]">
                  <tr>
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Statement</th>
                    <th className="px-4 py-3 text-left">Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item} className="border-t border-[#ffe0e4]">
                      <td className="px-4 py-4 font-bold text-[#b64252]">{index + 1}</td>
                      <td className="px-4 py-4 text-[#6f4444]">{item}</td>
                      <td className="px-4 py-4">
                        <select className="w-full rounded-xl border border-[#f7c2ca] bg-white px-3 py-2 font-semibold text-[#7f1d2d]">
                          <option>Select speaker</option>
                          {people.map((person) => (
                            <option key={person}>{person}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button className="mt-6 w-full rounded-2xl bg-[#c94f5f] px-5 py-3 font-bold text-white shadow-sm hover:bg-[#b64252]">
              Check Matching
            </button>
          </section>
        </section>
      </div>
    </main>
  );
}
