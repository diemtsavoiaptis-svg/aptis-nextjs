"use client";

import { useEffect, useMemo, useState } from "react";

const skills = [
  {
    key: "listening",
    label: "Listening",
    href: "/listening/part-1",
    studentHref: "/listening/part-1?mode=student",
    available: true,
  },
  {
    key: "reading",
    label: "Reading",
    href: "#",
    studentHref: "#",
    available: false,
  },
  {
    key: "speaking",
    label: "Speaking",
    href: "#",
    studentHref: "#",
    available: false,
  },
  {
    key: "writing",
    label: "Writing",
    href: "#",
    studentHref: "#",
    available: false,
  },
  {
    key: "g-v",
    label: "G&V",
    href: "#",
    studentHref: "#",
    available: false,
  },
];

const listeningParts = [
  { label: "Part 1", href: "/listening/part-1?mode=student" },
  { label: "Part 2", href: "/listening/part-2?mode=student" },
  { label: "Part 3", href: "/listening/part-3?mode=student" },
  { label: "Part 4", href: "/listening/part-4?mode=student" },
];

function clean(value) {
  return String(value ?? "").trim();
}

export default function HomePage() {
  const [student, setStudent] = useState(null);
  const [modal, setModal] = useState("");
  const [registerForm, setRegisterForm] = useState({
    student_code: "",
    full_name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loginForm, setLoginForm] = useState({
    account: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aptis_student");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.status === "approved") setStudent(parsed);
      }
    } catch {}
  }, []);

  const isApproved = student?.status === "approved";

  const heroText = useMemo(() => {
    if (isApproved) {
      return `Chào ${student.full_name || "học viên"}, bắt đầu luyện tập hôm nay nhé.`;
    }

    return "Luyện Aptis hiệu quả hơn mỗi ngày";
  }, [isApproved, student]);

  function closeModal() {
    setModal("");
    setMessage("");
  }

  async function submitRegister(event) {
    event.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerForm),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Register failed.");
      }

      setMessage("Registration sent. Please wait for admin approval.");
      setRegisterForm({
        student_code: "",
        full_name: "",
        phone: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setMessage(error.message || "Register failed. Please try again.");
    }
  }

  async function submitLogin(event) {
    event.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("aptis_student", JSON.stringify(data.student));
      setStudent(data.student);
      setLoginForm({ account: "", password: "" });
      closeModal();
    } catch (error) {
      setMessage(error.message || "Login failed. Please try again.");
    }
  }

  function logout() {
    localStorage.removeItem("aptis_student");
    setStudent(null);
  }

  function goSkill(skill) {
    if (isApproved && skill.available) {
      window.location.href = skill.studentHref;
      return;
    }

    if (skill.available) {
      window.location.href = skill.href;
      return;
    }

    setMessage("This skill is coming soon.");
  }

  return (
    <main className="homePage">
      <section className="homeShell">
        <header className="topBar">
          <div className="brand">
            <div className="brandIcon">A</div>
            <div>
              <h1>Điểm TSA với APTIS</h1>
              <p>Nền tảng luyện tập</p>
            </div>
          </div>

          <nav className="skillNav">
            {skills.map((skill) => (
              <button
                key={skill.key}
                type="button"
                className={skill.available ? "skillBtn active" : "skillBtn"}
                onClick={() => goSkill(skill)}
              >
                <span>{skill.label}</span>
                <b>{isApproved && skill.available ? "🔓" : "🔒"}</b>
              </button>
            ))}
          </nav>

          <div className="authActions">
            {isApproved ? (
              <>
                <div className="studentPill">
                  <span>🔓</span>
                  <div>
                    <strong>{student.full_name}</strong>
                    <small>Approved student</small>
                  </div>
                </div>

                <button type="button" className="ghostBtn" onClick={logout}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <button type="button" className="primaryBtn" onClick={() => setModal("register")}>
                  Đăng ký
                </button>

                <button type="button" className="primaryBtn" onClick={() => setModal("login")}>
                  Đăng nhập
                </button>
              </>
            )}
          </div>
        </header>

        <section className="heroCard">
          <div className="heroContent">
            <div className="miniBadge">
              {isApproved ? "🔓 Student access unlocked" : "✨ Luyện tập thông minh mỗi ngày"}
            </div>

            <h2>{heroText}</h2>

            {isApproved ? (
              <div className="partGrid">
                {listeningParts.map((part) => (
                  <a key={part.label} href={part.href} className="partCard">
                    <span>Listening</span>
                    <strong>{part.label}</strong>
                    <em>Vào học →</em>
                  </a>
                ))}
              </div>
            ) : (
              <p className="lockNote">
                Khách sẽ thấy biểu tượng khóa. Khi tài khoản được quản trị viên duyệt, khóa sẽ mở và học viên có thể vào toàn bộ giao diện học tập.
              </p>
            )}
          </div>

          <div className={isApproved ? "heroShape unlocked" : "heroShape"}>
            {isApproved ? "🔓" : "🔒"}
          </div>
        </section>

        {message ? <div className="pageMessage">{message}</div> : null}
      </section>

      {modal ? (
        <div className="modalLayer">
          <div className="modalCard">
            <button type="button" className="closeBtn" onClick={closeModal}>
              ×
            </button>

            <div className="modalIcon">A</div>

            {modal === "register" ? (
              <>
                <h3>Tạo tài khoản</h3>
                <p>Đăng ký trước. Cần quản trị viên duyệt để mở khóa toàn bộ bài học.</p>

                <form onSubmit={submitRegister}>
                  <input
                    value={registerForm.student_code}
                    onChange={(event) =>
                      setRegisterForm((old) => ({ ...old, student_code: event.target.value }))
                    }
                    placeholder="Mật khẩu"
                    required
                  />

                  <input
                    value={registerForm.full_name}
                    onChange={(event) =>
                      setRegisterForm((old) => ({ ...old, full_name: event.target.value }))
                    }
                    placeholder="Họ và tên"
                    required
                  />

                  <input
                    value={registerForm.phone}
                    onChange={(event) =>
                      setRegisterForm((old) => ({ ...old, phone: event.target.value }))
                    }
                    placeholder="Số điện thoại"
                  />

                  <input
                    value={registerForm.email}
                    onChange={(event) =>
                      setRegisterForm((old) => ({ ...old, email: event.target.value }))
                    }
                    placeholder="Email"
                    type="email"
                    required
                  />

                  <input
                    value={registerForm.password}
                    onChange={(event) =>
                      setRegisterForm((old) => ({ ...old, password: event.target.value }))
                    }
                    placeholder="Mật khẩu"
                    type="password"
                    required
                  />

                  {message ? <div className="modalMessage">{message}</div> : null}

                  <button type="submit">Gửi đăng ký</button>
                </form>

                <button type="button" className="switchBtn" onClick={() => { setModal("login"); setMessage(""); }}>
                  Đã có tài khoản? Đăng nhập →
                </button>
              </>
            ) : (
              <>
                <h3>Đăng nhập học viên</h3>
                <p>Chỉ tài khoản đã được quản trị viên duyệt mới mở khóa được bài học.</p>

                <form onSubmit={submitLogin}>
                  <input
                    value={loginForm.account}
                    onChange={(event) =>
                      setLoginForm((old) => ({ ...old, account: event.target.value }))
                    }
                    placeholder="Mật khẩu, số điện thoại hoặc email"
                    required
                  />

                  <input
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((old) => ({ ...old, password: event.target.value }))
                    }
                    placeholder="Mật khẩu"
                    type="password"
                    required
                  />

                  {message ? <div className="modalMessage">{message}</div> : null}

                  <button type="submit">Đăng nhập</button>
                </form>

                <button type="button" className="switchBtn" onClick={() => { setModal("register"); setMessage(""); }}>
                  Chưa có tài khoản? Đăng ký →
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #fff6f8;
          color: #3d0810;
          font-family: Arial, sans-serif;
        }

        .homePage {
          min-height: 100vh;
          padding: 32px;
          background:
            radial-gradient(circle at right bottom, rgba(244, 63, 94, 0.14), transparent 34%),
            linear-gradient(135deg, #fff, #fff0f4);
        }

        .homeShell {
          width: min(1320px, 100%);
          margin: 0 auto;
          border: 1px solid #ffc0cc;
          border-radius: 34px;
          background: rgba(255, 255, 255, 0.86);
          box-shadow: 0 20px 50px rgba(190, 18, 60, 0.14);
          padding: 26px;
        }

        .topBar {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brandIcon,
        .modalIcon {
          width: 66px;
          height: 66px;
          border-radius: 20px;
          background: #e6003f;
          color: white;
          display: grid;
          place-items: center;
          font-size: 34px;
          font-weight: 900;
          box-shadow: 0 14px 26px rgba(230, 0, 63, 0.2);
        }

        .brand h1 {
          margin: 0 0 4px;
          font-size: 30px;
          font-weight: 900;
        }

        .brand p {
          margin: 0;
          color: #e6003f;
          font-weight: 900;
        }

        .skillNav,
        .authActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }

        .skillBtn,
        .primaryBtn,
        .ghostBtn {
          min-height: 56px;
          border-radius: 16px;
          padding: 0 26px;
          font-size: 16px;
          font-weight: 900;
          cursor: pointer;
          border: 1px solid #ffc0cc;
        }

        .skillBtn {
          min-width: 132px;
          background: white;
          color: #ff7c9b;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 8px 16px rgba(61, 8, 16, 0.08);
        }

        .skillBtn.active {
          color: #3d0810;
        }

        .primaryBtn {
          border-color: #e6003f;
          background: #e6003f;
          color: white;
          box-shadow: 0 10px 20px rgba(230, 0, 63, 0.18);
        }

        .ghostBtn {
          background: #fff4f6;
          color: #9f001f;
        }

        .studentPill {
          min-height: 58px;
          border: 1px solid #ffc0cc;
          border-radius: 18px;
          background: #fff4f6;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          color: #9f001f;
        }

        .studentPill span {
          font-size: 24px;
        }

        .studentPill div {
          display: grid;
          line-height: 1.15;
        }

        .studentPill strong {
          font-size: 15px;
          font-weight: 900;
        }

        .studentPill small {
          margin-top: 4px;
          color: #e6003f;
          font-weight: 900;
        }

        .heroCard {
          position: relative;
          min-height: 390px;
          margin-top: 56px;
          border: 1px solid #ffd0d9;
          border-radius: 30px;
          background: white;
          overflow: hidden;
          padding: 70px;
        }

        .heroContent {
          position: relative;
          z-index: 2;
          max-width: 760px;
        }

        .miniBadge {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          border-radius: 999px;
          background: white;
          color: #e6003f;
          font-weight: 900;
          padding: 0 28px;
          box-shadow: 0 14px 26px rgba(61, 8, 16, 0.12);
          margin-bottom: 42px;
        }

        .heroCard h2 {
          margin: 0;
          font-size: clamp(46px, 6vw, 74px);
          line-height: 1.12;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .lockNote {
          margin: 24px 0 0;
          max-width: 720px;
          color: #7b2835;
          font-size: 18px;
          line-height: 1.7;
          font-weight: 800;
        }

        .heroShape {
          position: absolute;
          right: -80px;
          bottom: 38px;
          width: 310px;
          height: 260px;
          border-radius: 160px 0 0 160px;
          background: #f9d1e7;
          display: grid;
          place-items: center;
          font-size: 78px;
          opacity: 0.9;
        }

        .heroShape.unlocked {
          background: #dcfce7;
        }

        .partGrid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .partCard {
          min-height: 120px;
          border: 1px solid #ffc0cc;
          border-radius: 22px;
          background: #fff6f8;
          color: #3d0810;
          text-decoration: none;
          padding: 18px;
          display: grid;
          align-content: center;
          gap: 6px;
          transition: 0.2s ease;
        }

        .partCard:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 26px rgba(230, 0, 63, 0.14);
        }

        .partCard span {
          color: #e6003f;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .partCard strong {
          font-size: 28px;
          font-weight: 900;
        }

        .partCard em {
          color: #9f001f;
          font-style: normal;
          font-weight: 900;
        }

        .pageMessage {
          margin-top: 18px;
          border: 1px solid #ffc0cc;
          border-radius: 18px;
          background: #fff4f6;
          color: #9f001f;
          padding: 16px 20px;
          font-weight: 900;
        }

        .modalLayer {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(61, 8, 16, 0.28);
          backdrop-filter: blur(8px);
          display: grid;
          place-items: center;
          padding: 20px;
        }

        .modalCard {
          position: relative;
          width: min(520px, 100%);
          border: 1px solid #ffc0cc;
          border-radius: 32px;
          background: white;
          box-shadow: 0 24px 60px rgba(61, 8, 16, 0.2);
          padding: 38px;
        }

        .closeBtn {
          position: absolute;
          top: 22px;
          right: 22px;
          width: 48px;
          height: 48px;
          border: 0;
          border-radius: 999px;
          background: #fff0f3;
          color: #9f001f;
          font-size: 24px;
          font-weight: 900;
          cursor: pointer;
        }

        .modalCard h3 {
          margin: 28px 0 12px;
          font-size: 42px;
          line-height: 1;
          font-weight: 900;
        }

        .modalCard p {
          margin: 0 0 26px;
          color: #e6003f;
          font-size: 17px;
          line-height: 1.6;
        }

        .modalCard form {
          display: grid;
          gap: 14px;
        }

        .modalCard input {
          width: 100%;
          min-height: 64px;
          border: 1px solid #ffc0cc;
          border-radius: 18px;
          padding: 0 22px;
          color: #3d0810;
          font-size: 17px;
          font-weight: 900;
          outline: none;
        }

        .modalCard input:focus {
          border-color: #e6003f;
          box-shadow: 0 0 0 4px rgba(230, 0, 63, 0.08);
        }

        .modalCard form button {
          min-height: 66px;
          border: 0;
          border-radius: 18px;
          background: #e6003f;
          color: white;
          font-size: 18px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 12px 24px rgba(230, 0, 63, 0.2);
        }

        .modalMessage {
          border-radius: 16px;
          background: #ffe1e7;
          color: #9f001f;
          padding: 14px 16px;
          font-weight: 900;
          line-height: 1.4;
        }

        .switchBtn {
          margin-top: 18px;
          padding: 0;
          border: 0;
          background: transparent;
          color: #9f001f;
          font-size: 16px;
          font-weight: 900;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .homePage {
            padding: 14px;
          }

          .homeShell {
            padding: 16px;
          }

          .heroCard {
            padding: 32px 24px;
          }

          .partGrid {
            grid-template-columns: 1fr;
          }

          .heroShape {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}





