"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function StudentApprovalPage() {
  const [students, setStudents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadStudents() {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(`/api/students?q=${encodeURIComponent(searchText)}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Không tải được danh sách học viên.");
      }

      setStudents(data.students || []);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Không tải được danh sách học viên.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(loadStudents, 250);
    return () => clearTimeout(timer);
  }, [searchText]);

  const counts = useMemo(() => {
    return {
      pending: students.filter((x) => x.status === "pending").length,
      approved: students.filter((x) => x.status === "approved").length,
      rejected: students.filter((x) => x.status === "rejected").length,
    };
  }, [students]);

  async function updateStatus(student, status) {
    try {
      setMessage("");

      const res = await fetch("/api/students/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: student.id,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Không cập nhật được học viên.");
      }

      setMessage(status === "approved" ? "Đã duyệt học viên." : "Đã từ chối học viên.");
      await loadStudents();
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Không cập nhật được học viên.");
    }
  }

  return (
    <main className="approvalPage">
      <section className="approvalHero">
        <div>
          <p>QUẢN LÝ HỌC VIÊN</p>
          <h1>Duyệt học viên đăng ký</h1>
          <span>Kiểm tra danh sách học viên chờ duyệt tài khoản.</span>
        </div>

        <Link href="/dashboard" className="backBtn">
          ← Quay lại
        </Link>
      </section>

      <section className="statsGrid">
        <div className="statCard">
          <span>CHỜ DUYỆT</span>
          <strong>{counts.pending}</strong>
        </div>

        <div className="statCard">
          <span>ĐÃ DUYỆT</span>
          <strong>{counts.approved}</strong>
        </div>

        <div className="statCard">
          <span>TỪ CHỐI</span>
          <strong>{counts.rejected}</strong>
        </div>
      </section>

      <section className="searchPanel">
        <div className="searchBox">
          <label htmlFor="studentSearch">Tra cứu học viên</label>
          <input
            id="studentSearch"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Nhập ID học viên, số điện thoại hoặc email..."
          />
        </div>

        <button type="button" onClick={() => setSearchText("")}>
          Xóa tìm kiếm
        </button>
      </section>

      {message ? <div className="messageBox">{message}</div> : null}

      <section className="tablePanel">
        <div className="tableHeader">
          <h2>Danh sách học viên</h2>
          <span>{loading ? "Đang tải..." : `Tìm thấy: ${students.length} học viên`}</span>
        </div>

        {students.length ? (
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>ID học viên</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.id || student.email}>
                    <td>{student.student_id || student.id}</td>
                    <td>{student.full_name || student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td>
                      <span className={`status ${student.status}`}>
                        {student.status === "approved"
                          ? "Đã duyệt"
                          : student.status === "rejected"
                            ? "Từ chối"
                            : "Chờ duyệt"}
                      </span>
                    </td>
                    <td>
                      <button type="button" onClick={() => updateStatus(student, "approved")}>
                        Duyệt
                      </button>

                      <button
                        type="button"
                        className="dangerBtn"
                        onClick={() => updateStatus(student, "rejected")}
                      >
                        Từ chối
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="emptyBox">
            {loading
              ? "Đang tải danh sách học viên..."
              : "Chưa có học viên phù hợp. Hãy thử đăng ký một tài khoản mới rồi quay lại kiểm tra."}
          </div>
        )}
      </section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #fff6f8;
        }

        .approvalPage {
          min-height: 100vh;
          padding: 24px;
          color: #3d0810;
          font-family: Arial, sans-serif;
        }

        .approvalHero,
        .statCard,
        .searchPanel,
        .messageBox,
        .tablePanel {
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid #ffc0cc;
          box-shadow: 0 14px 34px rgba(190, 18, 60, 0.12);
        }

        .approvalHero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-radius: 30px;
          padding: 32px;
          margin-bottom: 20px;
        }

        .approvalHero p {
          margin: 0 0 10px;
          color: #e6003f;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .approvalHero h1 {
          margin: 0 0 12px;
          font-size: clamp(42px, 5vw, 68px);
          line-height: 1;
          font-weight: 500;
        }

        .approvalHero span {
          color: #6f2732;
          font-size: 18px;
        }

        .backBtn {
          min-height: 56px;
          padding: 0 26px;
          border-radius: 18px;
          border: 1px solid #ffc0cc;
          background: #fff4f6;
          color: #9f001f;
          text-decoration: none;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .statsGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 20px;
        }

        .statCard {
          border-radius: 20px;
          padding: 20px;
        }

        .statCard span {
          display: block;
          color: #e6003f;
          font-size: 13px;
          font-weight: 900;
          margin-bottom: 10px;
        }

        .statCard strong {
          font-size: 34px;
        }

        .searchPanel {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 14px;
          border-radius: 24px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .searchBox label {
          display: block;
          margin-bottom: 8px;
          color: #e6003f;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .searchBox input {
          width: 100%;
          height: 58px;
          border: 1px solid #ffc0cc;
          border-radius: 18px;
          background: white;
          color: #3d0810;
          outline: none;
          padding: 0 18px;
          font-size: 17px;
          font-weight: 800;
        }

        .searchPanel button {
          min-height: 58px;
          border: 1px solid #ffc0cc;
          border-radius: 18px;
          background: #fff4f6;
          color: #9f001f;
          font-weight: 900;
          padding: 0 22px;
          cursor: pointer;
        }

        .messageBox {
          border-radius: 18px;
          color: #9f001f;
          font-weight: 900;
          padding: 16px 20px;
          margin-bottom: 20px;
        }

        .tablePanel {
          border-radius: 24px;
          padding: 22px;
        }

        .tableHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }

        .tableHeader h2 {
          margin: 0;
          font-size: 26px;
        }

        .tableHeader span {
          border: 1px solid #ffc0cc;
          border-radius: 999px;
          padding: 10px 16px;
          color: #e6003f;
          font-weight: 900;
          background: #fff4f6;
        }

        .emptyBox {
          border: 1px dashed #ffc0cc;
          border-radius: 20px;
          background: #fff6f8;
          color: #9f001f;
          font-weight: 800;
          line-height: 1.6;
          padding: 28px;
        }

        .tableWrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 18px;
          overflow: hidden;
        }

        th {
          background: #e6003f;
          color: white;
          padding: 14px;
          text-align: left;
          white-space: nowrap;
        }

        td {
          padding: 14px;
          border-bottom: 1px solid #ffd4dc;
        }

        .status {
          display: inline-flex;
          border-radius: 999px;
          padding: 8px 12px;
          font-weight: 900;
          border: 1px solid #ffc0cc;
          background: #fff4f6;
          color: #9f001f;
          white-space: nowrap;
        }

        .status.approved {
          background: #e9fff0;
          border-color: #a7f3d0;
          color: #047857;
        }

        .status.rejected {
          background: #fff0f3;
          border-color: #ffc0cc;
          color: #be123c;
        }

        td button {
          min-height: 40px;
          border: 1px solid #ffc0cc;
          border-radius: 12px;
          background: #e6003f;
          color: white;
          font-weight: 900;
          padding: 0 14px;
          margin-right: 8px;
          cursor: pointer;
        }

        td .dangerBtn {
          background: white;
          color: #9f001f;
        }

        @media (max-width: 900px) {
          .approvalHero {
            flex-direction: column;
            align-items: flex-start;
          }

          .statsGrid,
          .searchPanel {
            grid-template-columns: 1fr;
          }

          .tableHeader {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
