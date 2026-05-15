'use client'

import { useEffect, useState } from 'react'

const parts = [
  {
    title: 'Listening Part 1',
    subtitle: 'Short Conversations',
    desc: 'Practice short dialogues with multiple-choice questions.',
    href: '/listening/part-1',
    studentHref: '/listening/part-1?mode=student'
  },
  {
    title: 'Listening Part 2',
    subtitle: 'Information Matching',
    desc: 'Match information, speakers, places or opinions.',
    href: '/listening/part-2',
    studentHref: '/listening/part-2?mode=student'
  },
  {
    title: 'Listening Part 3',
    subtitle: 'Opinion / Identity',
    desc: 'Identify speakers, viewpoints and shared opinions.',
    href: '/listening/part-3',
    studentHref: '/listening/part-3?mode=student'
  },
  {
    title: 'Listening Part 4',
    subtitle: 'Monologue / Summary',
    desc: 'Listen to longer talks and answer detailed questions.',
    href: '/listening/part-4',
    studentHref: '/listening/part-4?mode=student'
  }
]

export default function ListeningHomePage() {
  const [student, setStudent] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const savedStudent = localStorage.getItem('aptis_student')
      const savedAdmin = localStorage.getItem('aptis_admin')

      setStudent(savedStudent ? JSON.parse(savedStudent) : null)
      setAdmin(savedAdmin ? JSON.parse(savedAdmin) : null)
    } catch {
      setStudent(null)
      setAdmin(null)
    }

    setReady(true)
  }, [])

  const isApprovedStudent =
    student?.role === 'student' &&
    student?.status === 'approved'

  function logout() {
    localStorage.removeItem('aptis_student')
    localStorage.removeItem('aptis_admin')
    window.location.href = '/listening'
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <p style={styles.badge}>Aptis Listening Practice</p>
          <h1 style={styles.title}>Choose your Listening part</h1>

          <p style={styles.desc}>
            Guest users can preview selected questions. Approved students can unlock the full practice set.
          </p>

          <div style={styles.statusBox}>
            {!ready ? (
              <span>Checking account...</span>
            ) : isApprovedStudent ? (
              <>
                <span style={styles.openLock}>🔓</span>
                <span>
                  Student unlocked: <b>{student.fullName || student.email}</b>
                </span>
              </>
            ) : (
              <>
                <span style={styles.closedLock}>🔒</span>
                <span>
                  Guest mode: only admin-selected questions are visible.
                </span>
              </>
            )}
          </div>
        </div>

        <div style={styles.actions}>
          {isApprovedStudent || admin ? (
            <button onClick={logout} style={styles.logoutButton}>Logout</button>
          ) : (
            <>
              <a href="/login" style={styles.primaryButton}>Login</a>
              <a href="/register" style={styles.secondaryButton}>Register</a>
            </>
          )}

          {admin && (
            <a href="/dashboard/admin/students" style={styles.adminButton}>
              Admin approvals
            </a>
          )}
        </div>
      </section>

      <section style={styles.grid}>
        {parts.map((part, index) => {
          const href = isApprovedStudent ? part.studentHref : part.href

          return (
            <a key={part.title} href={href} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.partNumber}>P{index + 1}</div>

                <div style={{
                  ...styles.lockIcon,
                  background: isApprovedStudent ? '#dcfce7' : '#fff1f2',
                  color: isApprovedStudent ? '#166534' : '#e11d48'
                }}>
                  {isApprovedStudent ? '🔓' : '🔒'}
                </div>
              </div>

              <p style={styles.subtitle}>{part.subtitle}</p>
              <h2 style={styles.cardTitle}>{part.title}</h2>
              <p style={styles.cardDesc}>{part.desc}</p>

              <div style={styles.cardFooter}>
                <span>
                  {isApprovedStudent ? 'Full student access' : 'Guest preview'}
                </span>
                <span>→</span>
              </div>
            </a>
          )
        })}
      </section>

      {(isApprovedStudent || admin) && (
        <button onClick={logout} style={styles.floatingLogout}>
          ↩ Logout
        </button>
      )}
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff5f7, #ffe4e6)',
    color: '#3b0a12',
    fontFamily: 'Arial, sans-serif',
    padding: 28
  },
  hero: {
    maxWidth: 1180,
    margin: '0 auto 28px',
    background: 'rgba(255,255,255,.92)',
    border: '1px solid #fecdd3',
    borderRadius: 34,
    padding: 32,
    boxShadow: '0 24px 70px rgba(190,18,60,.13)',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 24,
    alignItems: 'flex-start'
  },
  badge: {
    display: 'inline-block',
    margin: 0,
    background: '#ffe4e6',
    color: '#be123c',
    borderRadius: 999,
    padding: '8px 14px',
    fontWeight: 900
  },
  title: {
    margin: '18px 0 10px',
    fontSize: 44,
    lineHeight: 1.05,
    color: '#4a0017',
    fontWeight: 900
  },
  desc: {
    margin: 0,
    color: '#be123c',
    fontSize: 17,
    lineHeight: 1.65,
    maxWidth: 650
  },
  statusBox: {
    marginTop: 20,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    background: '#fff1f2',
    border: '1px solid #fecdd3',
    color: '#4a0017',
    borderRadius: 18,
    padding: '12px 16px',
    fontWeight: 800
  },
  openLock: {
    fontSize: 24
  },
  closedLock: {
    fontSize: 24
  },
  actions: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'flex-end'
  },
  primaryButton: {
    padding: '14px 20px',
    borderRadius: 16,
    background: '#f00446',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 900,
    boxShadow: '0 14px 28px rgba(225,29,72,.22)'
  },
  secondaryButton: {
    padding: '14px 20px',
    borderRadius: 16,
    background: '#fff',
    color: '#be123c',
    border: '1px solid #fecdd3',
    textDecoration: 'none',
    fontWeight: 900
  },
  adminButton: {
    padding: '14px 20px',
    borderRadius: 16,
    background: '#4a0017',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 900
  },
  logoutButton: {
    padding: '14px 20px',
    borderRadius: 16,
    background: '#fff',
    color: '#be123c',
    border: '1px solid #fecdd3',
    fontWeight: 900,
    cursor: 'pointer'
  },
  grid: {
    maxWidth: 1180,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 18
  },
  card: {
    background: 'rgba(255,255,255,.96)',
    border: '1px solid #fecdd3',
    borderRadius: 28,
    padding: 24,
    textDecoration: 'none',
    color: '#3b0a12',
    boxShadow: '0 18px 45px rgba(190,18,60,.1)',
    transition: 'transform .18s ease, box-shadow .18s ease'
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26
  },
  partNumber: {
    width: 54,
    height: 54,
    borderRadius: 18,
    display: 'grid',
    placeItems: 'center',
    background: '#f00446',
    color: '#fff',
    fontWeight: 900,
    fontSize: 20,
    boxShadow: '0 14px 26px rgba(225,29,72,.25)'
  },
  lockIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    display: 'grid',
    placeItems: 'center',
    fontSize: 24,
    fontWeight: 900
  },
  subtitle: {
    margin: '0 0 8px',
    color: '#be123c',
    fontWeight: 900
  },
  cardTitle: {
    margin: '0 0 12px',
    fontSize: 25,
    color: '#4a0017'
  },
  cardDesc: {
    margin: 0,
    lineHeight: 1.6,
    color: '#6b2737'
  },
  cardFooter: {
    marginTop: 24,
    paddingTop: 18,
    borderTop: '1px solid #ffe4e6',
    display: 'flex',
    justifyContent: 'space-between',
    color: '#be123c',
    fontWeight: 900
  },
  floatingLogout: {
    position: 'fixed',
    left: 22,
    bottom: 22,
    zIndex: 9999,
    border: '1px solid #fecdd3',
    background: 'rgba(255,255,255,.94)',
    color: '#4a0017',
    padding: '12px 16px',
    borderRadius: 18,
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 18px 35px rgba(190,18,60,.16)',
    backdropFilter: 'blur(8px)'
  }
}
