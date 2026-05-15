export default async function SupabaseTestPage() {
  let result = null

  try {
    const res = await fetch('http://localhost:3000/api/supabase-test', {
      cache: 'no-store'
    })
    result = await res.json()
  } catch (error) {
    result = {
      ok: false,
      message: error.message
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      padding: '40px',
      background: '#fff5f7',
      color: '#3b0a12',
      fontFamily: 'Arial, sans-serif'
    }}>
      <section style={{
        maxWidth: '760px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '24px',
        padding: '28px',
        boxShadow: '0 18px 45px rgba(190, 18, 60, 0.12)',
        border: '1px solid #fecdd3'
      }}>
        <p style={{
          display: 'inline-block',
          padding: '6px 12px',
          borderRadius: '999px',
          background: result?.ok ? '#dcfce7' : '#fee2e2',
          color: result?.ok ? '#166534' : '#991b1b',
          fontWeight: 700,
          marginBottom: '16px'
        }}>
          {result?.ok ? 'Connected' : 'Not connected yet'}
        </p>

        <h1 style={{
          fontSize: '32px',
          margin: '0 0 12px',
          color: '#be123c'
        }}>
          Supabase Connection Test
        </h1>

        <pre style={{
          whiteSpace: 'pre-wrap',
          background: '#fff1f2',
          padding: '18px',
          borderRadius: '16px',
          border: '1px solid #fecdd3',
          overflowX: 'auto'
        }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      </section>
    </main>
  )
}
