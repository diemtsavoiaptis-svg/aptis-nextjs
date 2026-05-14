"use client";

const questions = [
  {
    id: 1,
    question: "What is the main purpose of the talk?",
    options: ["To describe a problem", "To advertise a service", "To give instructions"],
  },
  {
    id: 2,
    question: "What should listeners do before joining the event?",
    options: ["Buy a ticket", "Register online", "Call the office"],
  },
];

export default function ListeningPart4Preview() {
  return (
    <main className="min-h-screen bg-[#fff7f7] px-6 py-8 text-[#3f1d1d]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-[32px] bg-gradient-to-r from-[#ffe1e5] to-[#fff4f1] p-8 shadow-sm border border-[#ffd3d9]">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#c95461]">
            Listening Practice
          </p>
          <h1 className="text-4xl font-bold text-[#7f1d2d]">
            Part 4 — Monologue / Summary
          </h1>
          <p className="mt-3 max-w-2xl text-base text-[#7c4a4a]">
            Listen to a longer talk and answer multiple-choice questions based on the main ideas and details.
          </p>
        </div>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[28px] border border-[#ffd6dc] bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-[#7f1d2d]">Passage Panel</h2>
              <p className="text-sm text-[#8a5b5b]">One audio passage with grouped questions</p>
            </div>

            <div className="rounded-2xl border border-[#ffd6dc] bg-[#fffafa] p-5">
              <audio controls className="w-full">
                <source src="" />
              </audio>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-[#fff3f4] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c95461]">
                  Topic
                </p>
                <p className="mt-1 font-semibold text-[#7f1d2d]">
                  Community Event Announcement
                </p>
              </div>

              <button className="w-full rounded-2xl border border-[#f7c2ca] bg-white px-5 py-3 font-bold text-[#b64252] hover:bg-[#fff0f2]">
                Show Transcript
              </button>
            </div>
          </aside>

          <section className="rounded-[28px] border border-[#ffd6dc] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#7f1d2d]">Questions</h2>
                <p className="text-sm text-[#8a5b5b]">Choose A, B, or C for each question</p>
              </div>
              <span className="rounded-full bg-[#fff0f2] px-4 py-2 text-sm font-semibold text-[#b53f51]">
                2 Questions
              </span>
            </div>

            <div className="space-y-5">
              {questions.map((q) => (
                <div key={q.id} className="rounded-2xl border border-[#ffe0e4] bg-[#fffafa] p-5">
                  <p className="mb-4 font-bold text-[#7f1d2d]">
                    {q.id}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((option, index) => (
                      <button
                        key={option}
                        className="flex w-full items-center gap-3 rounded-xl border border-[#f7c2ca] bg-white px-4 py-3 text-left text-sm font-semibold text-[#6f4444] hover:bg-[#fff0f2]"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff0f2] text-[#b64252]">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-6 w-full rounded-2xl bg-[#c94f5f] px-5 py-3 font-bold text-white shadow-sm hover:bg-[#b64252]">
              Submit Practice
            </button>
          </section>
        </section>
      </div>
    </main>
  );
}
