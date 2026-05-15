'use client'

import { useState } from 'react'

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function submitRegister(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    const data = await res.json()
    setMessage(data.message || 'Done.')
    setLoading(false)

    if (data.ok) {
      setForm({
        fullName: '',
        phone: '',
        email: '',
        password: ''
      })
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.backgroundText}>Aptis Listening Practice</div>
      <div style={styles.overlay}></div>

      <section style={styles.modal}>
        <a href="/" style={styles.close}>×</a>

        <div style={styles.logo}>A</div>

        <h1 style={styles.title}>Tạo tài khoản</h1>
        <p style={styles.desc}>Đăng ký trước. Cần quản trị viên duyệt để mở khóa toàn bộ bài học.</p>

        <form onSubmit={submitRegister} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Họ và tên"
            value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })}
          />

          <input
            style={styles.input}
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />

          <input
            style={styles.input}
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <input
            style={styles.input}
            placeholder="Mật khẩu"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />

          <button style={styles.button} disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi đăng ký'}
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        <a href="/login" style={styles.link}>Đã có tài khoản? Đăng nhập →</a>
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: '#f7e7ea',
    fontFamily: 'Arial, sans-serif',
    color: '#4a0017',
    padding: 22,
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundText: {
    position: 'absolute',
    left: -30,
    top: '28%',
    fontSize: 88,
    lineHeight: 1.05,
    fontWeight: 900,
    color: 'rgba(74,0,23,.13)',
    filter: 'blur(2px)',
    maxWidth: 900
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(20,20,20,.22)',
    backdropFilter: 'blur(4px)'
  },
  modal: {
    width: '100%',
    maxWidth: 505,
    background: 'rgba(255,255,255,.96)',
    border: '1px solid #fecdd3',
    borderRadius: 34,
    padding: 36,
    boxShadow: '0 28px 90px rgba(76,5,25,.24)',
    position: 'relative',
    zIndex: 1
  },
  close: {
    position: 'absolute',
    right: 30,
    top: 26,
    width: 48,
    height: 48,
    borderRadius: 999,
    display: 'grid',
    placeItems: 'center',
    background: '#fff1f2',
    color: '#e11d48',
    fontSize: 24,
    fontWeight: 900,
    textDecoration: 'none'
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    display: 'grid',
    placeItems: 'center',
    background: '#f00446',
    color: '#fff',
    fontSize: 38,
    fontWeight: 900,
    boxShadow: '0 18px 35px rgba(225,29,72,.3)',
    marginBottom: 28
  },
  title: {
    margin: '0 0 12px',
    fontSize: 40,
    lineHeight: 1.1,
    fontWeight: 900,
    color: '#4a0017'
  },
  desc: {
    color: '#e11d48',
    fontSize: 17,
    lineHeight: 1.65,
    marginBottom: 30
  },
  form: {
    display: 'grid',
    gap: 16
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '18px 24px',
    borderRadius: 18,
    border: '1.5px solid #fda4af',
    background: 'rgba(255,255,255,.76)',
    color: '#4a0017',
    fontSize: 17,
    fontWeight: 800,
    outline: 'none'
  },
  button: {
    marginTop: 2,
    width: '100%',
    padding: '20px 24px',
    border: 0,
    borderRadius: 18,
    background: '#f00446',
    color: '#fff',
    fontSize: 18,
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 18px 32px rgba(225,29,72,.22)'
  },
  message: {
    marginTop: 18,
    padding: 14,
    borderRadius: 16,
    background: '#fff1f2',
    border: '1px solid #fecdd3',
    color: '#be123c',
    fontWeight: 800
  },
  link: {
    display: 'inline-block',
    marginTop: 22,
    color: '#be123c',
    fontSize: 17,
    fontWeight: 900,
    textDecoration: 'none'
  }
}


