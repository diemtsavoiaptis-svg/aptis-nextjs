'use client'

import { useEffect, useMemo, useState } from 'react'

function toInputValue(value) {
  return String(value ?? '')
}

function createDraft(student) {
  return {
    id: student.id,
    studentCode: toInputValue(student.student_code),
    fullName: toInputValue(student.full_name),
    phone: toInputValue(student.phone),
    email: toInputValue(student.email),
    status: toInputValue(student.status || 'pending')
  }
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [draft, setDraft] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const selectedStudent = useMemo(() => {
    return students.find(student => student.id === selectedId) || null
  }, [students, selectedId])

  async function loadStudents() {
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/admin/students', { cache: 'no-store' })
    const data = await res.json()

    if (data.ok) {
      setStudents(data.students || [])

      if (selectedId) {
        const fresh = (data.students || []).find(student => student.id === selectedId)
        if (fresh) {
          setDraft(createDraft(fresh))
        }
      }
    } else {
      setMessage(data.message || 'Cannot load students.')
    }

    setLoading(false)
  }

  function openProfile(student) {
    setSelectedId(student.id)
    setDraft(createDraft(student))
    setMessage('')
  }

  function closeProfile() {
    setSelectedId('')
    setDraft(null)
    setMessage('')
  }

  function updateDraft(field, value) {
    setDraft(current => ({
      ...current,
      [field]: value
    }))
  }

  async function saveProfile() {
    if (!draft) return

    setSaving(true)
    setMessage('')

    const res = await fetch('/api/admin/students/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft)
    })

    const data = await res.json()
    setMessage(data.message || 'Done.')
    setSaving(false)

    if (data.ok) {
      await loadStudents()
    }
  }

  async function approveProfile() {
    if (!draft) return

    if (!String(draft.studentCode || '').trim()) {
      setMessage('Please enter student code before approval.')
      return
    }

    setSaving(true)
    setMessage('')

    const res = await fetch('/api/admin/students/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: draft.id,
        studentCode: draft.studentCode
      })
    })

    const data = await res.json()
    setMessage(data.message || 'Done.')
    setSaving(false)

    if (data.ok) {
      await loadStudents()
    }
  }

  async function deleteProfile() {
    if (!draft) return

    const ok = window.confirm('Delete this student profile? This action cannot be undone.')
    if (!ok) return

    setSaving(true)
    setMessage('')

    const res = await fetch('/api/admin/students/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: draft.id })
    })

    const data = await res.json()
    setMessage(data.message || 'Done.')
    setSaving(false)

    if (data.ok) {
      setSelectedId('')
      setDraft(null)
      await loadStudents()
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <aside style={styles.sidebar}>
          <div style={styles.brand}>
            <div style={styles.logo}>A</div>
            <div>
              <p style={styles.brandKicker}>HỆ THỐNG QUẢN TRỊ</p>
              <h2 style={styles.brandTitle}>Quản trị Aptis</h2>
            </div>
          </div>

          <a href="/dashboard/listening" style={styles.navItem}>
            <span style={styles.navIcon}>L</span>
            <span>Listening</span>
          </a>

          <a href="/login" style={styles.navItem}>
            <span style={styles.navIcon}>↩</span>
            <span>Đăng xuất</span>
          </a>
        </aside>

        <section style={styles.content}>
          <div style={styles.header}>
            <div>
              <p style={styles.badge}>Admin</p>
              <h1 style={styles.title}>Duyệt học viên</h1>
              <p style={styles.desc}>
                Mở hồ sơ học viên để nhập mã, chỉnh sửa thông tin, lưu lại, duyệt hoặc xoá hồ sơ.
              </p>
            </div>

            <button onClick={loadStudents} style={styles.refresh}>Refresh</button>
          </div>

          {message && <p style={styles.message}>{message}</p>}

          <div style={styles.layout}>
            <div style={styles.listCard}>
              <h2 style={styles.sectionTitle}>Danh sách hồ sơ</h2>

              {loading ? (
                <p style={styles.muted}>Loading students...</p>
              ) : students.length === 0 ? (
                <div style={styles.empty}>Chưa có học viên đăng ký.</div>
              ) : (
                <div style={styles.studentList}>
                  {students.map(student => (
                    <button
                      key={student.id}
                      onClick={() => openProfile(student)}
                      style={{
                        ...styles.studentItem,
                        borderColor: selectedId === student.id ? '#e11d48' : '#fecdd3',
                        background: selectedId === student.id ? '#fff1f2' : '#fff'
                      }}
                    >
                      <div>
                        <strong style={styles.studentName}>{student.full_name}</strong>
                        <p style={styles.studentMeta}>
                          {student.student_code || 'Chưa có mã'} · {student.email}
                        </p>
                      </div>

                      <span style={{
                        ...styles.status,
                        background: student.status === 'approved' ? '#dcfce7' : '#fff7ed',
                        color: student.status === 'approved' ? '#166534' : '#9a3412'
                      }}>
                        {student.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.profileCard}>
              {!draft ? (
                <div style={styles.placeholder}>
                  <div style={styles.placeholderIcon}>👤</div>
                  <h2 style={styles.sectionTitle}>Chưa mở hồ sơ</h2>
                  <p style={styles.muted}>Chọn một học viên bên trái rồi bấm mở hồ sơ để chỉnh sửa.</p>
                </div>
              ) : (
                <>
                  <div style={styles.profileHeader}>
                    <div>
                      <h2 style={styles.sectionTitle}>Hồ sơ học viên</h2>
                      <p style={styles.muted}>
                        Created: {selectedStudent?.created_at ? new Date(selectedStudent.created_at).toLocaleString() : '-'}
                      </p>
                    </div>

                    <button onClick={closeProfile} style={styles.closeButton}>Đóng</button>
                  </div>

                  <div style={styles.formGrid}>
                    <label style={styles.label}>
                      <span>Mã học viên</span>
                      <input
                        style={styles.input}
                        placeholder="VD: HV001"
                        value={draft.studentCode}
                        onChange={e => updateDraft('studentCode', e.target.value)}
                      />
                    </label>

                    <label style={styles.label}>
                      <span>Trạng thái</span>
                      <select
                        style={styles.input}
                        value={draft.status}
                        onChange={e => updateDraft('status', e.target.value)}
                      >
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="rejected">Từ chối</option>
                      </select>
                    </label>

                    <label style={styles.labelFull}>
                      <span>Họ và tên</span>
                      <input
                        style={styles.input}
                        placeholder="Họ và tên"
                        value={draft.fullName}
                        onChange={e => updateDraft('fullName', e.target.value)}
                      />
                    </label>

                    <label style={styles.label}>
                      <span>Số điện thoại</span>
                      <input
                        style={styles.input}
                        placeholder="Số điện thoại"
                        value={draft.phone}
                        onChange={e => updateDraft('phone', e.target.value)}
                      />
                    </label>

                    <label style={styles.label}>
                      <span>Email</span>
                      <input
                        style={styles.input}
                        placeholder="Email"
                        type="email"
                        value={draft.email}
                        onChange={e => updateDraft('email', e.target.value)}
                      />
                    </label>
                  </div>

                  <div style={styles.profileActions}>
                    <button onClick={saveProfile} disabled={saving} style={styles.saveButton}>
                      {saving ? 'Đang lưu...' : 'Lưu hồ sơ'}
                    </button>

                    <button onClick={approveProfile} disabled={saving} style={styles.approveButton}>
                      Duyệt
                    </button>

                    <button onClick={deleteProfile} disabled={saving} style={styles.deleteButton}>
                      Xoá hồ sơ
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff5f7, #ffe4e6)',
    color: '#3b0a12',
    fontFamily: 'Arial, sans-serif',
    padding: 26
  },
  shell: {
    maxWidth: 1400,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: 24
  },
  sidebar: {
    minHeight: 'calc(100vh - 52px)',
    background: 'rgba(255,255,255,.92)',
    border: '1px solid #fecdd3',
    borderRadius: 34,
    padding: 28,
    boxShadow: '0 24px 70px rgba(190,18,60,.1)'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    background: '#fff1f2',
    borderRadius: 26,
    padding: 18,
    marginBottom: 30
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 22,
    display: 'grid',
    placeItems: 'center',
    background: '#f00446',
    color: '#fff',
    fontSize: 34,
    fontWeight: 900,
    boxShadow: '0 16px 32px rgba(225,29,72,.25)'
  },
  brandKicker: {
    margin: 0,
    color: '#e11d48',
    fontSize: 13,
    fontWeight: 900
  },
  brandTitle: {
    margin: '5px 0 0',
    color: '#4a0017',
    fontSize: 22
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '15px 14px',
    marginBottom: 12,
    borderRadius: 18,
    color: '#4a0017',
    textDecoration: 'none',
    fontWeight: 900
  },
  navIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    display: 'grid',
    placeItems: 'center',
    background: '#ffe4e6',
    color: '#e11d48',
    fontWeight: 900
  },
  content: {
    background: 'rgba(255,255,255,.78)',
    borderRadius: 34,
    padding: 26
  },
  header: {
    background: '#fff',
    border: '1px solid #fecdd3',
    borderRadius: 28,
    padding: 26,
    display: 'flex',
    justifyContent: 'space-between',
    gap: 20,
    alignItems: 'flex-start',
    boxShadow: '0 18px 45px rgba(190,18,60,.08)',
    marginBottom: 20
  },
  badge: {
    display: 'inline-block',
    background: '#ffe4e6',
    color: '#be123c',
    padding: '7px 14px',
    borderRadius: 999,
    fontWeight: 900,
    margin: 0
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
    fontWeight: 900,
    cursor: 'pointer'
  },
  message: {
    background: '#fff1f2',
    border: '1px solid #fecdd3',
    padding: 14,
    borderRadius: 16,
    color: '#be123c',
    fontWeight: 800
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(320px, 420px) 1fr',
    gap: 20
  },
  listCard: {
    background: '#fff',
    border: '1px solid #fecdd3',
    borderRadius: 28,
    padding: 22,
    boxShadow: '0 18px 45px rgba(190,18,60,.08)'
  },
  profileCard: {
    background: '#fff',
    border: '1px solid #fecdd3',
    borderRadius: 28,
    padding: 24,
    minHeight: 420,
    boxShadow: '0 18px 45px rgba(190,18,60,.08)'
  },
  sectionTitle: {
    margin: '0 0 14px',
    color: '#4a0017',
    fontSize: 24
  },
  muted: {
    color: '#9f1239',
    lineHeight: 1.5
  },
  empty: {
    padding: 26,
    borderRadius: 20,
    background: '#fff1f2',
    color: '#be123c',
    textAlign: 'center',
    fontWeight: 800
  },
  studentList: {
    display: 'grid',
    gap: 12
  },
  studentItem: {
    width: '100%',
    border: '1px solid #fecdd3',
    borderRadius: 18,
    padding: 14,
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    textAlign: 'left',
    cursor: 'pointer',
    alignItems: 'center'
  },
  studentName: {
    color: '#4a0017',
    fontSize: 16
  },
  studentMeta: {
    margin: '6px 0 0',
    color: '#9f1239',
    fontSize: 13,
    lineHeight: 1.35
  },
  status: {
    padding: '7px 10px',
    borderRadius: 999,
    fontWeight: 900,
    whiteSpace: 'nowrap',
    fontSize: 13
  },
  placeholder: {
    minHeight: 360,
    display: 'grid',
    placeItems: 'center',
    textAlign: 'center'
  },
  placeholderIcon: {
    width: 84,
    height: 84,
    borderRadius: 28,
    background: '#fff1f2',
    display: 'grid',
    placeItems: 'center',
    fontSize: 36,
    margin: '0 auto 16px'
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'flex-start',
    marginBottom: 22
  },
  closeButton: {
    border: '1px solid #fecdd3',
    background: '#fff1f2',
    color: '#be123c',
    borderRadius: 14,
    padding: '11px 15px',
    fontWeight: 900,
    cursor: 'pointer'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16
  },
  label: {
    display: 'grid',
    gap: 8,
    color: '#be123c',
    fontWeight: 900
  },
  labelFull: {
    display: 'grid',
    gap: 8,
    color: '#be123c',
    fontWeight: 900,
    gridColumn: '1 / -1'
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #fda4af',
    borderRadius: 16,
    padding: '14px 16px',
    color: '#4a0017',
    fontWeight: 800,
    fontSize: 15,
    outline: 'none',
    background: '#fff'
  },
  profileActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24
  },
  saveButton: {
    border: 0,
    background: '#4a0017',
    color: '#fff',
    borderRadius: 14,
    padding: '13px 18px',
    fontWeight: 900,
    cursor: 'pointer'
  },
  approveButton: {
    border: 0,
    background: '#e11d48',
    color: '#fff',
    borderRadius: 14,
    padding: '13px 18px',
    fontWeight: 900,
    cursor: 'pointer'
  },
  deleteButton: {
    border: '1px solid #fecaca',
    background: '#fee2e2',
    color: '#991b1b',
    borderRadius: 14,
    padding: '13px 18px',
    fontWeight: 900,
    cursor: 'pointer'
  }
}
