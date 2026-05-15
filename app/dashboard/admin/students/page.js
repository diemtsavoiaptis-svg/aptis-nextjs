'use client'

import { useEffect, useState } from 'react'

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([])
  const [codes, setCodes] = useState({})
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  async function loadStudents() {
    setLoading(true)
    const res = await fetch('/api/admin/students', { cache: 'no-store' })
    const data = await res.json()

    if (data.ok) {
      setStudents(data.students || [])
      const nextCodes = {}
      ;(data.students || []).forEach(student => {
        nextCodes[student.id] = student.student_code || ''
      })
      setCodes(nextCodes)
    } else {
      setMessage(data.message || 'Cannot load students.')
    }

    setLoading(false)
  }

  async function approveStudent(id) {
    setMessage('')

    const studentCode = String(codes[id] || '').trim()

    const res = await fetch('/api/admin/students/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, studentCode })
    })

    const data = await res.json()
    setMessage(data.message || 'Done.')
    await loadStudents()
  }

  useEffect(() => {
    loadStudents()
  }, [])

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.header}>
          <div>
            <p style={styles.badge}>Admin</p>
            <h1 style={styles.title}>Duyệt học viên</h1>
            <p style={styles.desc}>Nhập mã học viên rồi duyệt để mở khóa tài khoản.</p>
          </div>

          <div style={styles.actions}>
            <a href="/login" style={styles.linkButton}>Login</a>
            <button onClick={loadStudents} style={styles.refresh}>Refresh</button>
          </div>
        </div>

        {message && <p style={styles.message}>{message}</p>}

        {loading ? (
          <p>Loading students...</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Mã học viên</th>
                  <th style={styles.th}>Họ tên</th>
                  <th style={styles.th}>Số điện thoại</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Trạng thái</th>
                  <th style={styles.th}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={styles.empty}>Chưa có học viên đăng ký.</td>
                  </tr>
                ) : students.map(student => (
                  <tr key={student.id}>
                    <td style={styles.td}>
                      <input
                        style={styles.codeInput}
                        placeholder="VD: HV001"
                        value={codes[student.id] || ''}
                        disabled={student.status === 'approved'}
                        onChange={e => setCodes({ ...codes, [student.id]: e.target.value })}
                      />
                    </td>
                    <td style={styles.td}>{student.full_name}</td>
                    <td style={styles.td}>{student.phone || '-'}</td>
                    <td style={styles.td}>{student.email}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.status,
                        background: student.status === 'approved' ? '#dcfce7' : '#fff7ed',
                        color: student.status === 'approved' ? '#166534' : '#9a3412'
                      }}>
                        {student.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {student.status === 'approved' ? (
                        <span style={styles.done}>Approved</span>
                      ) : (
                        <button onClick={() => approveStudent(student.id)} style={styles.approve}>
                          Duyệt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#fff5f7',
    fontFamily: 'Arial, sans-serif',
    color: '#3b0a12',
    padding: 28
  },
  card: {
    maxWidth: 1180,
    margin: '0 auto',
    background: '#fff',
    border: '1px solid #fecdd3',
    borderRadius: 28,
    padding: 28,
    boxShadow: '0 24px 60px rgba(190,18,60,.12)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 20,
    alignItems: 'start',
    marginBottom: 24
  },
  actions: {
    display: 'flex',
    gap: 10
  },
  badge: {
    display: 'inline-block',
    background: '#ffe4e6',
    color: '#be123c',
    padding: '7px 14px',
    borderRadius: 999,
    fontWeight: 700
  },
  title: {
    fontSize: 34,
    color: '#be123c',
    margin: '14px 0 8px'
  },
  desc: {
    lineHeight: 1.6,
    color: '#6b2737',
    margin: 0
  },
  refresh: {
    border: '1px solid #fecdd3',
    background: '#fff1f2',
    color: '#be123c',
    borderRadius: 14,
    padding: '12px 16px',
    fontWeight: 800,
    cursor: 'pointer'
  },
  linkButton: {
    border: '1px solid #fecdd3',
    background: '#fff',
    color: '#be123c',
    borderRadius: 14,
    padding: '12px 16px',
    fontWeight: 800,
    textDecoration: 'none'
  },
  message: {
    background: '#fff1f2',
    border: '1px solid #fecdd3',
    padding: 14,
    borderRadius: 16
  },
  tableWrap: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: 14,
    borderBottom: '1px solid #fecdd3',
    color: '#be123c'
  },
  td: {
    padding: 14,
    borderBottom: '1px solid #ffe4e6'
  },
  codeInput: {
    width: 120,
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid #fda4af',
    fontWeight: 800,
    color: '#4a0017',
    outline: 'none'
  },
  empty: {
    padding: 24,
    textAlign: 'center',
    color: '#9f1239'
  },
  status: {
    padding: '6px 10px',
    borderRadius: 999,
    fontWeight: 800
  },
  approve: {
    border: 0,
    background: '#e11d48',
    color: '#fff',
    borderRadius: 12,
    padding: '10px 14px',
    fontWeight: 800,
    cursor: 'pointer'
  },
  done: {
    color: '#166534',
    fontWeight: 800
  }
}
