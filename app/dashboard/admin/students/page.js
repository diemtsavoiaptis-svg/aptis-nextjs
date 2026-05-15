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
    status: toInputValue(student.status || 'pending'),
    password: ''
  }
}

function statusText(status) {
  if (status === 'approved') return 'Đã duyệt'
  if (status === 'rejected') return 'Từ chối'
  return 'Chờ duyệt'
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

  const approvedCount = students.filter(student => student.status === 'approved').length
  const pendingCount = students.filter(student => student.status !== 'approved').length

  const sortedStudents = [...students].sort((a, b) => {
    if (a.status === 'approved' && b.status !== 'approved') return -1
    if (a.status !== 'approved' && b.status === 'approved') return 1
    return new Date(b.created_at || 0) - new Date(a.created_at || 0)
  })

  async function loadStudents() {
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/admin/students', { cache: 'no-store' })
    const data = await res.json()

    if (data.ok) {
      setStudents(data.students || [])

      if (selectedId) {
        const fresh = (data.students || []).find(student => student.id === selectedId)
        if (fresh) setDraft(createDraft(fresh))
      }
    } else {
      setMessage(data.message || 'Không thể tải danh sách học viên.')
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
    setMessage(data.message || 'Đã xử lý xong.')
    setSaving(false)

    if (data.ok) {
      await loadStudents()
      setDraft(current => current ? { ...current, password: '' } : current)
    }
  }

  async function approveProfile() {
    if (!draft) return

    if (!String(draft.studentCode || '').trim()) {
      setMessage('Vui lòng nhập mã học viên trước khi duyệt.')
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
    setMessage(data.message || 'Đã xử lý xong.')
    setSaving(false)

    if (data.ok) {
      await loadStudents()
    }
  }

  async function deleteProfile() {
    if (!draft) return

    const ok = window.confirm('Bạn có chắc muốn xoá hồ sơ học viên này không?')
    if (!ok) return

    setSaving(true)
    setMessage('')

    const res = await fetch('/api/admin/students/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: draft.id })
    })

    const data = await res.json()
    setMessage(data.message || 'Đã xử lý xong.')
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
      <section style={styles.header}>
        <div style={styles.headerLeft}>
          <p style={styles.badge}>Admin</p>
          <h1 style={styles.title}>Duyệt học viên</h1>
          <p style={styles.desc}>
            Mở hồ sơ học viên để nhập mã, chỉnh sửa thông tin, lưu lại, duyệt hoặc xoá hồ sơ.
          </p>
        </div>

        <div style={styles.statsWrap}>
          <div style={styles.statCard}>
            <strong style={styles.statNumber}>{approvedCount}</strong>
            <span style={styles.statLabel}>Học viên đã duyệt</span>
          </div>

          <div style={styles.statCard}>
            <strong style={styles.statNumber}>{pendingCount}</strong>
            <span style={styles.statLabel}>Chờ duyệt</span>
          </div>
        </div>

        <button onClick={loadStudents} style={styles.refresh}>Làm mới</button>
      </section>

      {message && <p style={styles.message}>{message}</p>}

      <section style={styles.mainGrid}>
        <aside style={styles.listPanel}>
          <div style={styles.panelHeader}>
            <h2 style={styles.panelTitle}>Danh sách hồ sơ</h2>
            <span style={styles.smallCount}>{students.length} hồ sơ</span>
          </div>

          {loading ? (
            <div style={styles.empty}>Đang tải danh sách...</div>
          ) : sortedStudents.length === 0 ? (
            <div style={styles.empty}>Chưa có học viên đăng ký.</div>
          ) : (
            <div style={styles.studentList}>
              {sortedStudents.map(student => (
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
                    <strong style={styles.studentName}>{student.full_name || 'Chưa có tên'}</strong>
                    <p style={styles.studentMeta}>
                      ID: {student.student_code || 'Chưa nhập'} · {student.email || '-'}
                    </p>
                  </div>

                  <span
                    style={{
                      ...styles.statusPill,
                      background: student.status === 'approved' ? '#dcfce7' : '#fff1f2',
                      color: student.status === 'approved' ? '#166534' : '#be123c'
                    }}
                  >
                    {statusText(student.status)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section style={styles.profilePanel}>
          {!draft ? (
            <div style={styles.placeholder}>
              <div style={styles.placeholderIcon}>👤</div>
              <h2 style={styles.profileTitle}>Chưa mở hồ sơ</h2>
              <p style={styles.placeholderText}>
                Chọn một học viên trong danh sách bên trái để xem và chỉnh sửa hồ sơ.
              </p>
            </div>
          ) : (
            <>
              <div style={styles.profileTop}>
                <div>
                  <h2 style={styles.profileTitle}>Hồ sơ học viên</h2>
                  <p style={styles.createdText}>
                    Created: {selectedStudent?.created_at ? new Date(selectedStudent.created_at).toLocaleString('vi-VN') : '-'}
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

                <label style={styles.labelFull}>
                  <span>Mật khẩu mới</span>
                  <input
                    style={styles.input}
                    placeholder="Để trống nếu không đổi mật khẩu"
                    type="password"
                    value={draft.password || ''}
                    onChange={e => updateDraft('password', e.target.value)}
                  />
                </label>
              </div>

              <div style={styles.actions}>
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
        </section>
      </section>
    </main>
  )
}

const styles = {
  page: {
    width: '100%',
    minHeight: '100vh',
    padding: 26,
    background: 'transparent',
    color: '#3b0a12',
    fontFamily: '"Segoe UI", Arial, sans-serif'
  },
  header: {
    background: '#fff',
    border: '1px solid #fecdd3',
    borderRadius: 28,
    padding: 24,
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    alignItems: 'center',
    gap: 18,
    boxShadow: '0 18px 45px rgba(190,18,60,.08)',
    marginBottom: 18
  },
  headerLeft: {
    minWidth: 0
  },
  badge: {
    display: 'inline-block',
    margin: '0 0 14px',
    background: '#ffe4e6',
    color: '#be123c',
    padding: '7px 14px',
    borderRadius: 999,
    fontWeight: 900
  },
  title: {
    margin: 0,
    color: '#be123c',
    fontSize: 40,
    lineHeight: 1.05,
    fontWeight: 500,
    letterSpacing: '-1px'
  },
  desc: {
    margin: '18px 0 0',
    color: '#6b2737',
    lineHeight: 1.55,
    fontSize: 16
  },
  statsWrap: {
    display: 'flex',
    gap: 12,
    flexWrap: 'nowrap'
  },
  statCard: {
    minWidth: 160,
    padding: '16px 18px',
    borderRadius: 18,
    background: '#fff1f2',
    border: '1px solid #fecdd3',
    display: 'grid',
    gap: 4
  },
  statNumber: {
    color: '#be123c',
    fontSize: 34,
    lineHeight: 1,
    fontWeight: 900
  },
  statLabel: {
    color: '#4a0017',
    fontSize: 15,
    fontWeight: 900
  },
  refresh: {
    border: '1px solid #fecdd3',
    background: '#fff1f2',
    color: '#be123c',
    borderRadius: 16,
    padding: '14px 20px',
    fontWeight: 900,
    fontSize: 15,
    cursor: 'pointer'
  },
  message: {
    margin: '0 0 18px',
    background: '#fff1f2',
    border: '1px solid #fecdd3',
    padding: 14,
    borderRadius: 16,
    color: '#be123c',
    fontWeight: 800
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(320px, 420px) 1fr',
    gap: 18,
    alignItems: 'start'
  },
  listPanel: {
    background: '#fff',
    border: '1px solid #fecdd3',
    borderRadius: 28,
    padding: 20,
    boxShadow: '0 18px 45px rgba(190,18,60,.08)',
    minHeight: 420
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16
  },
  panelTitle: {
    margin: 0,
    color: '#4a0017',
    fontSize: 24,
    fontWeight: 800
  },
  smallCount: {
    color: '#be123c',
    fontWeight: 900,
    background: '#fff1f2',
    borderRadius: 999,
    padding: '7px 11px',
    fontSize: 13
  },
  empty: {
    padding: 24,
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
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer',
    textAlign: 'left'
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
  statusPill: {
    padding: '7px 10px',
    borderRadius: 999,
    fontWeight: 900,
    whiteSpace: 'nowrap',
    fontSize: 12
  },
  profilePanel: {
    background: '#fff',
    border: '1px solid #fecdd3',
    borderRadius: 28,
    padding: 26,
    boxShadow: '0 18px 45px rgba(190,18,60,.08)',
    minHeight: 420
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
  placeholderText: {
    color: '#9f1239',
    lineHeight: 1.5,
    maxWidth: 360
  },
  profileTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'flex-start',
    marginBottom: 22
  },
  profileTitle: {
    margin: 0,
    color: '#4a0017',
    fontSize: 30,
    fontWeight: 500,
    letterSpacing: '-.5px'
  },
  createdText: {
    margin: '14px 0 0',
    color: '#be123c',
    fontSize: 16
  },
  closeButton: {
    border: '1px solid #fecdd3',
    background: '#fff1f2',
    color: '#be123c',
    borderRadius: 16,
    padding: '13px 18px',
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
    fontWeight: 900,
    fontSize: 16
  },
  labelFull: {
    display: 'grid',
    gap: 8,
    color: '#be123c',
    fontWeight: 900,
    fontSize: 16,
    gridColumn: '1 / -1'
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #fda4af',
    borderRadius: 16,
    padding: '14px 18px',
    color: '#4a0017',
    fontWeight: 800,
    fontSize: 15,
    outline: 'none',
    background: '#fff',
    minHeight: 52
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 22
  },
  saveButton: {
    border: 0,
    background: '#4a0017',
    color: '#fff',
    borderRadius: 14,
    padding: '14px 22px',
    fontWeight: 900,
    cursor: 'pointer'
  },
  approveButton: {
    border: 0,
    background: '#e11d48',
    color: '#fff',
    borderRadius: 14,
    padding: '14px 22px',
    fontWeight: 900,
    cursor: 'pointer'
  },
  deleteButton: {
    border: '1px solid #fecaca',
    background: '#fee2e2',
    color: '#991b1b',
    borderRadius: 14,
    padding: '14px 22px',
    fontWeight: 900,
    cursor: 'pointer'
  }
}
