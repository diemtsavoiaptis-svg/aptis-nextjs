'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function StudentAccessGate({ children }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [ready, setReady] = useState(false)
  const [student, setStudent] = useState(null)

  const mode = searchParams.get('mode')
  const isStudentMode = mode === 'student'
  const isListeningPage = pathname?.startsWith('/listening')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('aptis_student')
      setStudent(saved ? JSON.parse(saved) : null)
    } catch {
      setStudent(null)
    }

    setReady(true)
  }, [])

  function logout() {
    localStorage.removeItem('aptis_student')
    localStorage.removeItem('aptis_admin')
    window.location.href = '/login'
  }

  if (!ready) {
    return (
      <main style={styles.loadingPage}>
        <div style={styles.loadingBox}>Checking account...</div>
      </main>
    )
  }

  const isApprovedStudent =
    student?.role === 'student' &&
    student?.status === 'approved'

  if (isListeningPage && isStudentMode && !isApprovedStudent) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <div style={styles.lock}>🔒</div>
          <h1 style={styles.title}>Khu vực học viên đang bị khóa</h1>
          <p style={styles.desc}>
            Vui lòng đăng nhập bằng tài khoản học viên đã được quản trị viên duyệt.
          </p>

          <div style={styles.actions}>
            <a href="/login" style={styles.primary}>Đăng nhập</a>
            <a href="/register" style={styles.secondary}>Tạo tài khoản</a>
          </div>
        </section>
      </main>
    )
  }

  return (
    <>
      {children}

      {isApprovedStudent && (
        <button onClick={logout} style={styles.logout}>
          <span style={styles.logoutIcon}>↩</span>
          <span>Đăng xuất</span>
        </button>
      )}
    </>
  )
}

const styles = {
  loadingPage: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: '#fff5f7',
    fontFamily: 'Arial, sans-serif'
  },
  loadingBox: {
    padding: '18px 24px',
    borderRadius: 18,
    background: '#fff',
    border: '1px solid #fecdd3',
    color: '#be123c',
    fontWeight: 900
  },
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: '#fff5f7',
    fontFamily: 'Arial, sans-serif',
    padding: 24
  },
  card: {
    width: '100%',
    maxWidth: 520,
    background: '#fff',
    border: '1px solid #fecdd3',
    borderRadius: 32,
    padding: 34,
    textAlign: 'center',
    boxShadow: '0 24px 60px rgba(190,18,60,.14)'
  },
  lock: {
    width: 88,
    height: 88,
    margin: '0 auto 22px',
    borderRadius: 28,
    display: 'grid',
    placeItems: 'center',
    background: '#fff1f2',
    fontSize: 42
  },
  title: {
    margin: '0 0 12px',
    fontSize: 32,
    color: '#4a0017',
    fontWeight: 900
  },
  desc: {
    margin: '0 auto 24px',
    maxWidth: 420,
    color: '#be123c',
    lineHeight: 1.6,
    fontSize: 16
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap'
  },
  primary: {
    padding: '14px 20px',
    borderRadius: 16,
    background: '#f00446',
    color: '#fff',
    fontWeight: 900,
    textDecoration: 'none'
  },
  secondary: {
    padding: '14px 20px',
    borderRadius: 16,
    background: '#fff1f2',
    color: '#be123c',
    border: '1px solid #fecdd3',
    fontWeight: 900,
    textDecoration: 'none'
  },
  logout: {
    position: 'fixed',
    left: 22,
    bottom: 22,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    border: '1px solid #fecdd3',
    background: 'rgba(255,255,255,.92)',
    color: '#4a0017',
    padding: '12px 16px',
    borderRadius: 18,
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 18px 35px rgba(190,18,60,.16)',
    backdropFilter: 'blur(8px)'
  },
  logoutIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    display: 'grid',
    placeItems: 'center',
    background: '#ffe4e6',
    color: '#e11d48'
  }
}
