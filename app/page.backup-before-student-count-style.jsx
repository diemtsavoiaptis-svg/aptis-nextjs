'use client'

import { useEffect, useState } from 'react'

export default function HomePage() {
  const [modal, setModal] = useState(null)
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: ''
  })
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [student, setStudent] = useState(null)
  const [admin, setAdmin] = useState(null)

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
  }, [])

  const isApprovedStudent = student?.role === 'student' && student?.status === 'approved'

  function openModal(type) {
    setMessage('')
    setModal(type)
  }

  function closeModal() {
    setMessage('')
    setModal(null)
  }

  function logout() {
    localStorage.removeItem('aptis_student')
    localStorage.removeItem('aptis_admin')
    setStudent(null)
    setAdmin(null)
    window.location.href = '/'
  }

  async function submitRegister(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerForm)
    })

    const data = await res.json()
    setMessage(data.message || 'Done.')
    setLoading(false)

    if (data.ok) {
      setRegisterForm({
        fullName: '',
        phone: '',
        email: '',
        password: ''
      })
    }
  }

  async function submitLogin(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    localStorage.removeItem('aptis_admin')
    localStorage.removeItem('aptis_student')

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm)
    })

    const data = await res.json()
    setMessage(data.message || 'Done.')
    setLoading(false)

    if (data.ok) {
      if (data.user?.role === 'admin') {
        localStorage.setItem('aptis_admin', JSON.stringify(data.user))
      } else {
        localStorage.setItem('aptis_student', JSON.stringify(data.user))
      }

      window.location.href = data.redirectTo || '/listening'
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <header style={styles.header}>
          <div style={styles.brand}>
            <div style={styles.logo}>A</div>
            <div>
              <h1 style={styles.brandTitle}>Điểm TSA với APTIS</h1>
              <p style={styles.brandSub}>Nền tảng luyện tập</p>
            </div>
          </div>

          <nav style={styles.nav}>
            <a style={styles.navButton} href="/listening">Listening</a>
            <button style={styles.lockedButton}>Reading 🔒</button>
            <button style={styles.lockedButton}>Speaking 🔒</button>
            <button style={styles.lockedButton}>Writing 🔒</button>
            <button style={styles.lockedButton}>G&amp;V 🔒</button>
          </nav>

          <div style={styles.authActions}>
            {admin || isApprovedStudent ? (
              <button style={styles.loginButton} onClick={logout}>Đăng xuất</button>
            ) : (
              <>
                <button style={styles.registerButton} onClick={() => openModal('register')}>Đăng ký</button>
                <button style={styles.loginButton} onClick={() => openModal('login')}>Đăng nhập</button>
              </>
            )}
          </div>
        </header>

        <section style={styles.hero}>
          <div style={styles.heroText}>
            <p style={styles.pill}>✨ Luyện tập thông minh mỗi ngày</p>
            <h2 style={styles.heroTitle}>Luyện Aptis hiệu quả hơn mỗi ngày</h2>
            <p style={styles.heroDesc}>
              Guest có thể xem phần được chọn. Học viên đã duyệt sẽ mở khóa toàn bộ bài học.
            </p>

            <div style={styles.heroActions}>
              <a style={styles.primaryCta} href="/listening">Vào luyện Listening</a>
              {admin && <a style={styles.secondaryCta} href="/dashboard/admin/students">Quản lý học viên</a>}
            </div>
          </div>

          <div style={styles.heroArt}>
            <div style={styles.studentCountCard}>
              <div style={styles.studentCountNumber}>21</div>
              <div style={styles.studentCountText}>học viên đã đăng ký</div>
              <div style={styles.studentCountSub}>Đang học cùng Điểm TSA với APTIS</div>
            </div>
          </div>
        </section>
      </section>

      {modal && (
        <div style={styles.modalLayer}>
          <section style={styles.modal}>
            <button style={styles.close} onClick={closeModal}>×</button>
            <div style={styles.modalLogo}>A</div>

            {modal === 'register' ? (
              <>
                <h2 style={styles.modalTitle}>Tạo tài khoản</h2>
                <p style={styles.modalDesc}>
                  Đăng ký trước. Cần quản trị viên duyệt để mở khóa toàn bộ bài học.
                </p>

                <form onSubmit={submitRegister} style={styles.form}>
                  <input
                    style={styles.input}
                    placeholder="Họ và tên"
                    value={registerForm.fullName}
                    onChange={e => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                  />

                  <input
                    style={styles.input}
                    placeholder="Số điện thoại"
                    value={registerForm.phone}
                    onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  />

                  <input
                    style={styles.input}
                    placeholder="Email"
                    type="email"
                    value={registerForm.email}
                    onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                  />

                  <input
                    style={styles.input}
                    placeholder="Mật khẩu"
                    type="password"
                    value={registerForm.password}
                    onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                  />

                  <button style={styles.submitButton} disabled={loading}>
                    {loading ? 'Đang gửi...' : 'Gửi đăng ký'}
                  </button>
                </form>

                {message && <p style={styles.message}>{message}</p>}

                <button style={styles.switchLink} onClick={() => openModal('login')}>
                  Đã có tài khoản? Đăng nhập →
                </button>
              </>
            ) : (
              <>
                <h2 style={styles.modalTitle}>Đăng nhập</h2>
                <p style={styles.modalDesc}>Đăng nhập để mở khu vực học Aptis.</p>

                <form onSubmit={submitLogin} style={styles.form}>
                  <input
                    style={styles.input}
                    placeholder="Số điện thoại hoặc Email"
                    value={loginForm.username}
                    onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                  />

                  <input
                    style={styles.input}
                    placeholder="Mật khẩu"
                    type="password"
                    value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  />

                  <button style={styles.submitButton} disabled={loading}>
                    {loading ? 'Đang kiểm tra...' : 'Đăng nhập'}
                  </button>
                </form>

                {message && <p style={styles.message}>{message}</p>}

                <button style={styles.switchLink} onClick={() => openModal('register')}>
                  Tạo tài khoản học viên →
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff5f7, #ffe4e6)',
    color: '#4a0017',
    fontFamily: '"Segoe UI", Arial, sans-serif',
    padding: 28
  },
  shell: {
    maxWidth: 1180,
    margin: '0 auto',
    background: 'rgba(255,255,255,.72)',
    border: '1px solid #fecdd3',
    borderRadius: 34,
    padding: 28,
    boxShadow: '0 28px 80px rgba(190,18,60,.12)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 18,
    marginBottom: 28,
    flexWrap: 'wrap'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    minWidth: 300,
    flexShrink: 0
  },
  logo: {
    width: 58,
    height: 58,
    minWidth: 58,
    borderRadius: 18,
    background: '#f00446',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontSize: 30,
    fontWeight: 800,
    boxShadow: '0 16px 32px rgba(225,29,72,.28)'
  },
  brandTitle: {
    margin: 0,
    fontSize: 25,
    lineHeight: 1.12,
    fontWeight: 800,
    color: '#4a0017',
    whiteSpace: 'nowrap'
  },
  brandSub: {
    margin: '5px 0 0',
    color: '#e11d48',
    fontWeight: 800,
    lineHeight: 1.25,
    whiteSpace: 'nowrap'
  },
  nav: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
    flex: 1
  },
  navButton: {
    padding: '13px 20px',
    borderRadius: 14,
    background: '#fff',
    border: '1px solid #fecdd3',
    color: '#4a0017',
    fontWeight: 800,
    textDecoration: 'none'
  },
  lockedButton: {
    padding: '13px 18px',
    borderRadius: 14,
    background: '#fff',
    border: '1px solid #fecdd3',
    color: '#c06b86',
    fontWeight: 800
  },
  authActions: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'flex-end'
  },
  registerButton: {
    border: 0,
    background: '#f00446',
    color: '#fff',
    borderRadius: 14,
    padding: '14px 20px',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 15px 30px rgba(225,29,72,.24)'
  },
  loginButton: {
    border: 0,
    background: '#be123c',
    color: '#fff',
    borderRadius: 14,
    padding: '14px 20px',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 15px 30px rgba(190,18,60,.18)'
  },
  hero: {
    minHeight: 360,
    background: '#fff',
    border: '1px solid #fecdd3',
    borderRadius: 28,
    display: 'grid',
    gridTemplateColumns: '1.2fr .8fr',
    overflow: 'hidden'
  },
  heroText: {
    padding: 56
  },
  pill: {
    display: 'inline-block',
    background: '#fff1f2',
    border: '1px solid #fecdd3',
    color: '#be123c',
    borderRadius: 999,
    padding: '12px 18px',
    fontWeight: 800
  },
  heroTitle: {
    fontSize: 58,
    lineHeight: 1.08,
    margin: '22px 0 16px',
    fontWeight: 800
  },
  heroDesc: {
    color: '#9f1239',
    lineHeight: 1.7,
    fontSize: 18,
    maxWidth: 620
  },
  heroActions: {
    display: 'flex',
    gap: 12,
    marginTop: 28,
    flexWrap: 'wrap'
  },
  primaryCta: {
    background: '#f00446',
    color: '#fff',
    borderRadius: 16,
    padding: '15px 22px',
    textDecoration: 'none',
    fontWeight: 800
  },
  secondaryCta: {
    background: '#fff1f2',
    color: '#be123c',
    border: '1px solid #fecdd3',
    borderRadius: 16,
    padding: '15px 22px',
    textDecoration: 'none',
    fontWeight: 800
  },
  heroArt: {
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, #fff1f2, #ffe4e6)',
    padding: 40
  },
  studentCountCard: {
    width: 260,
    height: 260,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f9a8d4, #fda4af)'
  },
  modalLayer: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'grid',
    placeItems: 'center',
    background: 'rgba(20,20,20,.24)',
    backdropFilter: 'blur(5px)',
    padding: 20
  },
  modal: {
    width: '100%',
    maxWidth: 420,
    background: 'rgba(255,255,255,.96)',
    border: '1px solid #fecdd3',
    borderRadius: 30,
    padding: 30,
    position: 'relative',
    boxShadow: '0 28px 90px rgba(76,5,25,.24)'
  },
  close: {
    position: 'absolute',
    right: 28,
    top: 22,
    width: 44,
    height: 44,
    borderRadius: 999,
    border: 0,
    background: '#fff1f2',
    color: '#e11d48',
    fontSize: 22,
    fontWeight: 800,
    cursor: 'pointer'
  },
  modalLogo: {
    width: 58,
    height: 58,
    borderRadius: 18,
    background: '#f00446',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontSize: 30,
    fontWeight: 800,
    marginBottom: 24,
    boxShadow: '0 16px 32px rgba(225,29,72,.28)'
  },
  modalTitle: {
    margin: '0 0 10px',
    fontSize: 34,
    lineHeight: 1.12,
    fontWeight: 800,
    color: '#4a0017',
    letterSpacing: '-0.8px'
  },
  modalDesc: {
    margin: '0 0 26px',
    color: '#e11d48',
    lineHeight: 1.6,
    fontWeight: 500,
    letterSpacing: '-0.1px'
  },
  form: {
    display: 'grid',
    gap: 14
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '17px 20px',
    borderRadius: 16,
    border: '1.5px solid #fda4af',
    background: 'rgba(255,255,255,.82)',
    color: '#4a0017',
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 1.35,
    letterSpacing: '-0.15px',
    outline: 'none'
  },
  submitButton: {
    marginTop: 2,
    width: '100%',
    padding: '18px 22px',
    border: 0,
    borderRadius: 16,
    background: '#f00446',
    color: '#fff',
    fontSize: 17,
    fontWeight: 800,
    letterSpacing: '-0.2px',
    cursor: 'pointer',
    boxShadow: '0 18px 32px rgba(225,29,72,.22)'
  },
  message: {
    marginTop: 14,
    padding: 13,
    borderRadius: 14,
    background: '#fff1f2',
    border: '1px solid #fecdd3',
    color: '#be123c',
    fontWeight: 800
  },
  switchLink: {
    marginTop: 18,
    border: 0,
    background: 'transparent',
    color: '#be123c',
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: '-0.2px',
    cursor: 'pointer',
    padding: 0
  }
}





