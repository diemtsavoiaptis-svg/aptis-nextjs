"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [modal, setModal] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    studentId: "",
    name: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function closeModal() {
    if (loading) return;
    setModal(null);
    setMessage("");
  }

  function openModal(type) {
    setModal(type);
    setMessage("");
  }

  function login(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    setTimeout(() => {
      const username = loginForm.username.trim();
      const password = loginForm.password.trim();

      if (username === "admin" && password === "1") {
        localStorage.setItem("aptis_role", "admin");
        localStorage.setItem("aptis_student_id", "admin");
        router.push("/dashboard/listening");
        return;
      }

      if (username && password) {
        localStorage.setItem("aptis_role", "student");
        localStorage.setItem("aptis_student_id", username);
        router.push("/listening");
        return;
      }

      setLoading(false);
      setMessage("Vui lòng nhập tên đăng nhập và mật khẩu.");
    }, 450);
  }

  async function register(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    setTimeout(async () => {
      try {
        const res = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registerForm),
        });

        const data = await res.json();

        if (data.student?.id) {
          localStorage.setItem("aptis_student_id", data.student.id);
        }

        setLoading(false);
        setMessage("Đã gửi đăng ký. Vui lòng chờ quản trị viên duyệt.");
      } catch {
        setLoading(false);
        setMessage("Đăng ký thất bại. Vui lòng thử lại.");
      }
    }, 450);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-pink-100 px-4 py-8 text-rose-950">
      <section className={modal ? "mx-auto max-w-7xl scale-[0.99] transition duration-300 ease-out" : "mx-auto max-w-7xl transition duration-300 ease-out"}>
        <div className="rounded-[36px] border border-rose-100 bg-white/80 p-6 shadow-2xl">
          <header className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-rose-500 to-pink-700 text-3xl font-black text-white shadow-xl">
                A
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight md:text-3xl">
                  Điểm TSA với APTIS
                </h1>
                <p className="mt-1 font-bold text-rose-700">Nền tảng luyện tập</p>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/listening")}
                className="rounded-2xl border border-rose-200 bg-white px-7 py-4 font-black text-rose-950 shadow-md"
              >
                Listening
              </button>

              <button type="button" disabled className="cursor-not-allowed rounded-2xl border border-rose-200 bg-white/70 px-7 py-4 font-black text-rose-400 shadow-md opacity-70">
                Reading 🔒
              </button>

              <button type="button" disabled className="cursor-not-allowed rounded-2xl border border-rose-200 bg-white/70 px-7 py-4 font-black text-rose-400 shadow-md opacity-70">
                Speaking 🔒
              </button>

              <button type="button" disabled className="cursor-not-allowed rounded-2xl border border-rose-200 bg-white/70 px-7 py-4 font-black text-rose-400 shadow-md opacity-70">
                Writing 🔒
              </button>

              <button type="button" disabled className="pointer-events-none cursor-not-allowed rounded-2xl border border-rose-200 bg-white/70 px-7 py-4 font-black text-rose-400 shadow-md opacity-70">
                G&V 🔒
              </button>

              <button
                type="button"
                onClick={() => openModal("register")}
                className="rounded-2xl bg-rose-600 px-8 py-4 font-black text-white shadow-xl"
              >
                Đăng ký
              </button>

              <button
                type="button"
                onClick={() => openModal("login")}
                className="rounded-2xl bg-rose-600 px-8 py-4 font-black text-white shadow-xl"
              >
                Đăng nhập
              </button>
            </nav>
          </header>

          <section className="mt-14 overflow-hidden rounded-[32px] border border-rose-100 bg-white shadow-inner">
            <div className="relative min-h-[380px] p-10 md:p-16">
              <div className="absolute right-0 top-20 h-72 w-72 rounded-l-full bg-pink-200/70" />

              <div className="relative z-10 max-w-4xl">
                <div className="mb-10 inline-flex rounded-full bg-white px-7 py-4 font-black text-rose-700 shadow-xl">
                  ✨ Luyện tập thông minh mỗi ngày
                </div>

                <h2 className="max-w-3xl text-5xl font-black leading-tight tracking-tight text-rose-950 md:text-7xl">
                  Luyện Aptis hiệu quả hơn mỗi ngày
                </h2>
              </div>
            </div>
          </section>
        </div>
      </section>

      {modal && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 grid place-items-center bg-black/20 px-4 backdrop-blur-[2px] animate-modalFade"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-[32px] border border-rose-200 bg-white/95 p-8 shadow-2xl animate-modalPop"
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-rose-50 font-black text-rose-700"
            >
              ×
            </button>

            <div className="mb-6 grid h-16 w-16 place-items-center rounded-3xl bg-rose-600 text-3xl font-black text-white shadow-lg">
              A
            </div>

            {modal === "login" ? (
              <>
                <h2 className="text-4xl font-black">Đăng nhập</h2>
                <p className="mt-3 text-rose-700">Đăng nhập để mở khu vực học Aptis.</p>

                <form onSubmit={login} className="mt-8 grid gap-4">
                  <input
                    required
                    placeholder="Tên đăng nhập hoặc Mật khẩu"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    className="rounded-2xl border border-rose-200 px-5 py-4 font-bold outline-none focus:border-rose-500"
                  />

                  <input
                    required
                    type="password"
                    placeholder="Mật khẩu"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="rounded-2xl border border-rose-200 px-5 py-4 font-bold outline-none focus:border-rose-500"
                  />

                  {message && (
                    <div className="rounded-2xl bg-rose-100 px-5 py-3 font-bold text-rose-700">
                      {message}
                    </div>
                  )}

                  <button className="rounded-2xl bg-rose-600 px-6 py-4 font-black text-white shadow-lg">
                    Đăng nhập
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => openModal("register")}
                  className="mt-5 font-black text-rose-700"
                >
                  Tạo tài khoản học viên →
                </button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-black">Tạo tài khoản</h2>
                <p className="mt-3 text-rose-700">
                  Đăng ký trước. Cần quản trị viên duyệt để mở khóa toàn bộ bài học.
                </p>

                <form onSubmit={register} className="mt-8 grid gap-4">
                  <input
                    required
                    placeholder="Mật khẩu"
                    value={registerForm.studentId}
                    onChange={(e) => setRegisterForm({ ...registerForm, studentId: e.target.value })}
                    className="rounded-2xl border border-rose-200 px-5 py-4 font-bold outline-none focus:border-rose-500"
                  />

                  <input
                    required
                    placeholder="Họ và tên"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    className="rounded-2xl border border-rose-200 px-5 py-4 font-bold outline-none focus:border-rose-500"
                  />

                  <input
                    placeholder="Số điện thoại"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    className="rounded-2xl border border-rose-200 px-5 py-4 font-bold outline-none focus:border-rose-500"
                  />

                  <input
                    placeholder="Email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="rounded-2xl border border-rose-200 px-5 py-4 font-bold outline-none focus:border-rose-500"
                  />

                  {message && (
                    <div className="rounded-2xl bg-rose-100 px-5 py-3 font-bold text-rose-700">
                      {message}
                    </div>
                  )}

                  <button className="rounded-2xl bg-rose-600 px-6 py-4 font-black text-white shadow-lg">
                    Gửi đăng ký
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => openModal("login")}
                  className="mt-5 font-black text-rose-700"
                >
                  Đã có tài khoản? Đăng nhập →
                </button>
              </>
            )}

            {loading && (
              <div className="absolute inset-0 z-10 grid place-items-center rounded-[32px] bg-white/35 backdrop-blur-[2px] animate-modalFade">
                <div className="grid h-36 w-36 place-items-center rounded-full border-[10px] border-rose-100 border-t-rose-600 bg-white text-4xl font-black text-rose-700 shadow-2xl">
                  40%
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes modalFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalPop {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-modalFade {
          animation: modalFade 180ms ease-out both;
        }

        .animate-modalPop {
          animation: modalPop 220ms cubic-bezier(.2, .8, .2, 1) both;
        }
      `}</style>
    </main>
  );
}


