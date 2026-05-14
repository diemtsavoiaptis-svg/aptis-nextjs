const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "dashboard", "students", "page.jsx");

if (fs.existsSync(file)) {
  const backup = file + ".backup-fix-invalid-vietnamese-setter-" + Date.now();
  fs.copyFileSync(file, backup);
  console.log("Backup:", backup);
}

fs.mkdirSync(path.dirname(file), { recursive: true });

const content = `"use client";

import Link from "next/link";

export default function StudentsPage() {
  return (
    <main className="studentsPage">
      <section className="hero">
        <div>
          <p>QUẢN LÝ HỌC VIÊN</p>
          <h1>Học viên</h1>
          <span>Đi tới trang duyệt học viên đăng ký tài khoản.</span>
        </div>

        <Link href="/dashboard" className="backBtn">
          ← Quay lại
        </Link>
      </section>

      <section className="card">
        <h2>Duyệt học viên đăng ký</h2>
        <p>Tra cứu theo ID học viên, số điện thoại hoặc email và xử lý tài khoản chờ duyệt.</p>

        <Link href="/dashboard/students/approval" className="primaryBtn">
          Mở trang duyệt học viên
        </Link>
      </section>

      <style jsx global>{\`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #fff6f8;
        }

        .studentsPage {
          min-height: 100vh;
          padding: 24px;
          color: #3d0810;
          font-family: Arial, sans-serif;
        }

        .hero,
        .card {
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid #ffc0cc;
          box-shadow: 0 14px 34px rgba(190, 18, 60, 0.12);
        }

        .hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-radius: 30px;
          padding: 32px;
          margin-bottom: 20px;
        }

        .hero p {
          margin: 0 0 10px;
          color: #e6003f;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .hero h1 {
          margin: 0 0 12px;
          font-size: clamp(42px, 5vw, 68px);
          line-height: 1;
          font-weight: 500;
        }

        .hero span,
        .card p {
          color: #6f2732;
          font-size: 18px;
        }

        .backBtn,
        .primaryBtn {
          min-height: 56px;
          padding: 0 26px;
          border-radius: 18px;
          border: 1px solid #ffc0cc;
          text-decoration: none;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .backBtn {
          background: #fff4f6;
          color: #9f001f;
        }

        .card {
          border-radius: 24px;
          padding: 28px;
        }

        .card h2 {
          margin: 0 0 10px;
          font-size: 30px;
        }

        .card p {
          margin: 0 0 24px;
          line-height: 1.5;
        }

        .primaryBtn {
          background: #e6003f;
          color: white;
          border-color: #e6003f;
          box-shadow: 0 12px 22px rgba(217, 4, 41, 0.18);
        }

        @media (max-width: 900px) {
          .hero {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      \`}</style>
    </main>
  );
}
`;

fs.writeFileSync(file, content, "utf8");

console.log("Fixed app/dashboard/students/page.jsx");
