"use client";

export default function ListeningPart2PreviewPage() {
  return (
    <main style={{
      minHeight: "100vh",
      padding: "32px",
      background: "#fff6f8",
      color: "#3d0810",
      fontFamily: "Arial, sans-serif"
    }}>
      <section style={{
        border: "1px solid #ffc0cc",
        borderRadius: "28px",
        background: "white",
        padding: "32px",
        boxShadow: "0 16px 36px rgba(190,18,60,.12)"
      }}>
        <p style={{
          color: "#e6003f",
          fontWeight: 900,
          letterSpacing: ".14em",
          margin: "0 0 12px"
        }}>
          PREVIEW PART 2
        </p>

        <h1 style={{
          fontSize: "56px",
          margin: "0 0 20px",
          fontWeight: 500
        }}>
          Listening Part 2 Preview
        </h1>

        <div style={{
          border: "1px solid #ffc0cc",
          borderRadius: "22px",
          padding: "22px",
          background: "#fffafb"
        }}>
          <p style={{
            color: "#e6003f",
            fontWeight: 900,
            letterSpacing: ".14em",
            margin: "0 0 16px"
          }}>
            LỜI THOẠI
          </p>

          {[
            ["Person A", "I find the act of giving away old or secondhand items a bit hypocritical."],
            ["Person B", "I often don't have time to think about how to reuse my belongings or clothes."],
            ["Person C", "A good way to protect the environment is by not using plastic bags."],
            ["Person D", "I see that too many people are wasting food containers."]
          ].map(([speaker, text]) => (
            <div key={speaker} style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "16px",
              alignItems: "start",
              border: "1px solid #ffe0e6",
              borderRadius: "18px",
              background: "white",
              padding: "14px 16px",
              marginBottom: "12px"
            }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "999px",
                background: "#e6003f",
                color: "white",
                fontWeight: 900,
                padding: "8px 12px"
              }}>
                {speaker}
              </span>

              <p style={{
                margin: 0,
                color: "#4b465f",
                fontSize: "18px",
                lineHeight: 1.6,
                fontWeight: 700
              }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
