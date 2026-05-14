"use client";

const questions = [
  {
    id: 1,
    statement: "The speaker thinks online courses are more flexible than classroom courses.",
    options: ["Man", "Woman", "Both"],
  },
  {
    id: 2,
    statement: "The speaker prefers learning with a teacher in the same room.",
    options: ["Man", "Woman", "Both"],
  },
  {
    id: 3,
    statement: "The speaker says technology can make studying easier.",
    options: ["Man", "Woman", "Both"],
  },
];

export default function ListeningPart3Preview() {
  return (
    <main className="min-h-screen bg-[#fff7f7] px-6 py-8 text-[#3f1d1d]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-[32px] bg-gradient-to-r from-[#ffe1e5] to-[#fff4f1] p-8 shadow-sm border border-[#ffd3d9]">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#c95461]">
            Listening Practice
          </p>
          <h1 className="text-4xl font-bold text-[#7f1d2d]">
            Part 3 — Opinion / Identity
          </h1>
          <p className="mt-3 max-w-2xl text-base text-[#7c4a4a]">
            Listen to two speakers and identify who expresses each opinion: Man, Woman, or Both.
          </p>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-[#ffd6dc] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#7f1d2d]">Audio</h2>
                <p className="text-sm text-[#8a5b5b]">Conversation between two speakers</p>
              </div>
              <span className="rounded-full bg-[#fff0f2] px-4 py-2 text-sm font-semibold text-[#b53f51]">
                Sample Set 01
              </span>
            </div>

            <div className="rounded-2xl border border-[#ffd6dc] bg-[#fffafa] p-5">
              <audio controls className="w-full">
                <source src="" />
              </audio>
            </div>

            <div className="mt-5 rounded-2xl bg-[#fff3f4] p-5 text-sm text-[#6f4444]">
              <strong className="text-[#9f2f42]">Instruction:</strong> Choose the correct speaker for each statement.
              This layout keeps the audio area separate from the answer table so students can focus clearly.
            </div>
          </div>

          <div className="rounded-[28px] border border-[#ffd6dc] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-[#7f1d2d]">Answer Sheet</h2>
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="rounded-2xl border border-[#ffe0e4] bg-[#fffafa] p-4">
                  <p className="mb-3 text-sm font-semibold text-[#7f1d2d]">
                    {q.id}. {q.statement}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {q.options.map((option) => (
                      <button
                        key={option}
                        className="rounded-xl border border-[#f7c2ca] bg-white px-3 py-2 text-sm font-semibold text-[#9f2f42] hover:bg-[#fff0f2]"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-6 w-full rounded-2xl bg-[#c94f5f] px-5 py-3 font-bold text-white shadow-sm hover:bg-[#b64252]">
              Check Answers
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
