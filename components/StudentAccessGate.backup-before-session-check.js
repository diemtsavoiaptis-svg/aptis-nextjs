'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const WATERMARKS = [
  { left: '4%', top: '8%', rotate: -8, delay: '0s', duration: '15s', opacity: 0.19 },
  { left: '22%', top: '13%', rotate: 3, delay: '-3s', duration: '17s', opacity: 0.17 },
  { left: '48%', top: '9%', rotate: -4, delay: '-5s', duration: '19s', opacity: 0.16 },
  { left: '72%', top: '15%', rotate: 6, delay: '-2s', duration: '16s', opacity: 0.18 },

  { left: '10%', top: '27%', rotate: 5, delay: '-4s', duration: '18s', opacity: 0.18 },
  { left: '34%', top: '31%', rotate: -6, delay: '-7s', duration: '20s', opacity: 0.17 },
  { left: '58%', top: '28%', rotate: 2, delay: '-9s', duration: '21s', opacity: 0.16 },
  { left: '80%', top: '34%', rotate: -7, delay: '-6s', duration: '18s', opacity: 0.18 },

  { left: '5%', top: '48%', rotate: -3, delay: '-8s', duration: '22s', opacity: 0.16 },
  { left: '25%', top: '53%', rotate: 7, delay: '-10s', duration: '17s', opacity: 0.19 },
  { left: '50%', top: '49%', rotate: -5, delay: '-11s', duration: '20s', opacity: 0.17 },
  { left: '74%', top: '55%', rotate: 4, delay: '-12s', duration: '19s', opacity: 0.18 },

  { left: '14%', top: '72%', rotate: 4, delay: '-13s', duration: '21s', opacity: 0.16 },
  { left: '38%', top: '78%', rotate: -7, delay: '-14s', duration: '18s', opacity: 0.18 },
  { left: '62%', top: '73%', rotate: 5, delay: '-15s', duration: '23s', opacity: 0.17 },
  { left: '84%', top: '80%', rotate: -4, delay: '-16s', duration: '20s', opacity: 0.19 },

  { left: '2%', top: '91%', rotate: -5, delay: '-17s', duration: '24s', opacity: 0.15 },
  { left: '29%', top: '92%', rotate: 3, delay: '-18s', duration: '18s', opacity: 0.16 },
  { left: '55%', top: '90%', rotate: -6, delay: '-19s', duration: '22s', opacity: 0.15 },
  { left: '78%', top: '93%', rotate: 5, delay: '-20s', duration: '19s', opacity: 0.16 }
]
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

  const watermarkId = useMemo(() => {
    return `ID: ${student?.studentCode || 'N/A'}`
  }, [student])

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

      {isApprovedStudent && isListeningPage && isStudentMode && (
        <div style={styles.watermarkViewport} aria-hidden="true">
          {WATERMARKS.map((item, index) => (
            <div
              key={index}
              style={{
                ...styles.watermarkLine,
                left: item.left,
                top: item.top,
                opacity: item.opacity,
                animationDelay: item.delay,
                animationDuration: item.duration,
                '--wm-rotate': `${item.rotate}deg`
              }}
            >
              <span style={styles.watermarkText}>{watermarkId}</span>
            </div>
          ))}
        </div>
      )}

      {isApprovedStudent && (
        <button onClick={logout} style={styles.logout}>
          <span style={styles.logoutIcon}>↩</span>
          <span>Đăng xuất</span>
        </button>
      )}

      <style jsx global>{`
        @keyframes aptisRandomWatermark {
          0% {
            transform: translate3d(-18px, -8px, 0) rotate(var(--wm-rotate));
          }
          50% {
            transform: translate3d(18px, 10px, 0) rotate(var(--wm-rotate));
          }
          100% {
            transform: translate3d(-18px, -8px, 0) rotate(var(--wm-rotate));
          }
        }
      `}</style>
    </>
  )
}

const styles = {
  loadingPage: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: '#fff5f7',
    fontFamily: '"Segoe UI", Arial, sans-serif'
  },
  loadingBox: {
    padding: '18px 24px',
    borderRadius: 18,
    background: '#fff',
    border: '1px solid #fecdd3',
    color: '#be123c',
    fontWeight: 800
  },
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: '#fff5f7',
    fontFamily: '"Segoe UI", Arial, sans-serif',
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
    fontWeight: 800
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
  watermarkViewport: {
    position: 'fixed',
    inset: 0,
    zIndex: 9997,
    pointerEvents: 'none',
    overflow: 'hidden'
  },
  watermarkLine: {
    position: 'absolute',
    minWidth: 150,
    height: 40,
    animationName: 'aptisRandomWatermark',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
    animationDirection: 'alternate',
    transformOrigin: 'center'
  },
  watermarkText: {
    position: 'absolute',
    left: 0,
    top: 0,
    color: '#7f1d1d',
    fontSize: 17,
    fontWeight: 900,
    letterSpacing: '0.4px',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    textShadow: '0 1px 0 rgba(255,255,255,.55)'
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


