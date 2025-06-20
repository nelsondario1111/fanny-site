export default function CancelPage() {
  return (
    <main style={{ background: '#F5F2EA', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: 40, borderRadius: 24, boxShadow: '0 2px 16px #DDD', border: '1px solid #FFD700', textAlign: 'center', maxWidth: 400 }}>
        <h1 style={{ color: '#7D9A7E', fontFamily: 'serif', fontWeight: 700, marginBottom: 16 }}>Transaction Canceled</h1>
        <p style={{ color: '#333', marginBottom: 24 }}>
          Your payment was canceled or not completed.<br />No worries! You can try again or contact us if you have questions.
        </p>
        <a
          href="/en/investment"
          style={{ padding: '12px 32px', background: '#FFD700', color: '#7D9A7E', borderRadius: 99, fontWeight: 600, textDecoration: 'none', boxShadow: '0 2px 6px #EEE' }}
        >
          Return to Packages
        </a>
      </div>
    </main>
  );
}
