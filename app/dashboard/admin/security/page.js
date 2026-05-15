'use client'

import { useEffect, useState } from 'react'

function translateEventType(type) {
  const map = {
    student_login: 'Học viên đăng nhập',
    blocked_third_device: 'Chặn thiết bị thứ 3',
    blocked_parallel_login: 'Chặn đăng nhập song song',
    blocked_pending_login: 'Chặn tài khoản chưa duyệt',
    session_revoked: 'Đã đăng xuất thiết bị'
  }

  return map[type] || type || 'Sự kiện'
}

function translateMessage(message) {
  const text = String(message || '')

  if (text.includes('already has 2 active devices')) {
    return 'Tài khoản này đã có 2 thiết bị đang hoạt động.'
  }

  if (text.includes('already active in another session')) {
    return 'Tài khoản này đang online ở một nơi khác.'
  }

  if (text.includes('logged in successfully')) {
    return 'Học viên đã đăng nhập thành công.'
  }

  if (text.includes('before admin approval')) {
    return 'Học viên cố đăng nhập khi tài khoản chưa được duyệt.'
  }

  return text || 'Không có nội dung.'
}

function translateDevice(device) {
  const text = String(device || '')

  const map = {
    'Windows PC': 'Máy tính Windows',
    iPhone: 'iPhone',
    iPad: 'iPad',
    Android: 'Thiết bị Android',
    Mac: 'Máy Mac',
    'Unknown device': 'Thiết bị không xác định'
  }

  return map[text] || text || 'Thiết bị không xác định'
}

export default function AdminSecurityPage() {
  const [sessions, setSessions] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  async function loadSecurity() {
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/admin/security', { cache: 'no-store' })
    const data = await res.json()

    if (data.ok) {
      setSessions(data.sessions || [])
      setEvents(data.events || [])
    } else {
      setMessage(data.message || 'Không thể tải dữ liệu bảo mật.')
    }

    setLoading(false)
  }

  async function revokeSession(sessionId) {
    const ok = window.confirm('Bạn có chắc muốn đăng xuất thiết bị này không?')
    if (!ok) return

    const res = await fetch('/api/admin/security', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    })

    const data = await res.json()
    setMessage(data.message || 'Đã xử lý xong.')
    await loadSecurity()
  }

  useEffect(() => {
    loadSecurity()
  }, [])

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.badge}>Bảo mật tài khoản</p>
          <h1 style={styles.title}>Cảnh báo đăng nhập</h1>
          <p style={styles.desc}>
            Theo dõi thiết bị đăng nhập, chặn đăng nhập song song và đăng xuất thiết bị nghi ngờ.
          </p>
        </div>

        <button onClick={loadSecurity} style={styles.refresh}>Làm mới</button>
      </section>

      {message && <p style={styles.message}>{message}</p>}

      <section style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Thiết bị đăng nhập</h2>

          {loading ? (
            <p style={styles.muted}>Đang tải dữ liệu...</p>
          ) : sessions.length === 0 ? (
            <p style={styles.empty}>Chưa có phiên đăng nhập nào.</p>
          ) : (
            <div style={styles.list}>
              {sessions.map(session => (
                <div key={session.id} style={styles.sessionItem}>
                  <div>
                    <strong style={styles.name}>
                      {session.student_accounts?.full_name || 'Không rõ học viên'}
                    </strong>

                    <p style={styles.meta}>
                      ID: {session.student_accounts?.student_code || '-'} · Email: {session.student_accounts?.email || '-'}
                    </p>

                    <p style={styles.meta}>
                      {translateDevice(session.device_label)} · IP: {session.ip_address || '-'}
                    </p>

                    <p style={styles.meta}>
                      Hoạt động gần nhất: {session.last_seen_at ? new Date(session.last_seen_at).toLocaleString('vi-VN') : '-'}
                    </p>
                  </div>

                  <div style={styles.rightBox}>
                    <span style={{
                      ...styles.status,
                      background: session.is_active ? '#dcfce7' : '#fee2e2',
                      color: session.is_active ? '#166534' : '#991b1b'
                    }}>
                      {session.is_active ? 'Đang hoạt động' : 'Đã đăng xuất'}
                    </span>

                    {session.is_active && (
                      <button onClick={() => revokeSession(session.id)} style={styles.revoke}>
                        Đăng xuất
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Nhật ký cảnh báo</h2>

          {loading ? (
            <p style={styles.muted}>Đang tải dữ liệu...</p>
          ) : events.length === 0 ? (
            <p style={styles.empty}>Chưa có cảnh báo nào.</p>
          ) : (
            <div style={styles.list}>
              {events.map(event => (
                <div key={event.id} style={styles.eventItem}>
                  <div style={styles.eventTop}>
                    <strong style={styles.name}>{translateEventType(event.event_type)}</strong>
                    <span style={styles.time}>
                      {event.created_at ? new Date(event.created_at).toLocaleString('vi-VN') : '-'}
                    </span>
                  </div>

                  <p style={styles.meta}>
                    ID: {event.student_code || '-'} · Email: {event.email || '-'}
                  </p>

                  <p style={styles.meta}>
                    {translateMessage(event.message)}
                  </p>

                  <p style={styles.meta}>
                    {translateDevice(event.device_label)} · IP: {event.ip_address || '-'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

const styles = {
  page: {
    width: '100%',
    minHeight: '100vh',
    background: 'transparent',
    color: '#3b0a12',
    fontFamily: '"Segoe UI", Arial, sans-serif',
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
    fontWeight: 800,
    margin: 0
  },
  title: {
    fontSize: 34,
    color: '#be123c',
    margin: '14px 0 8px',
    fontWeight: 800
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
  message: {
    background: '#fff1f2',
    border: '1px solid #fecdd3',
    padding: 14,
    borderRadius: 16,
    color: '#be123c',
    fontWeight: 700
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20
  },
  card: {
    background: '#fff',
    border: '1px solid #fecdd3',
    borderRadius: 28,
    padding: 22,
    boxShadow: '0 18px 45px rgba(190,18,60,.08)',
    minHeight: 420
  },
  sectionTitle: {
    margin: '0 0 18px',
    color: '#4a0017',
    fontSize: 24,
    fontWeight: 800
  },
  muted: {
    color: '#9f1239'
  },
  empty: {
    padding: 24,
    background: '#fff1f2',
    borderRadius: 18,
    color: '#be123c',
    textAlign: 'center',
    fontWeight: 700
  },
  list: {
    display: 'grid',
    gap: 12
  },
  sessionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 14,
    padding: 14,
    border: '1px solid #fecdd3',
    borderRadius: 18,
    background: '#fffafa'
  },
  eventItem: {
    padding: 14,
    border: '1px solid #fecdd3',
    borderRadius: 18,
    background: '#fffafa'
  },
  eventTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10
  },
  name: {
    color: '#4a0017',
    fontSize: 16
  },
  meta: {
    margin: '6px 0 0',
    color: '#9f1239',
    fontSize: 13,
    lineHeight: 1.4
  },
  time: {
    color: '#be123c',
    fontSize: 12,
    fontWeight: 700
  },
  rightBox: {
    display: 'grid',
    gap: 8,
    justifyItems: 'end',
    alignContent: 'start'
  },
  status: {
    padding: '6px 10px',
    borderRadius: 999,
    fontWeight: 800,
    fontSize: 12
  },
  revoke: {
    border: 0,
    background: '#e11d48',
    color: '#fff',
    borderRadius: 12,
    padding: '9px 12px',
    fontWeight: 800,
    cursor: 'pointer'
  }
}
