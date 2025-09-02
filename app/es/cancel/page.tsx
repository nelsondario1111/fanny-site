export default function CancelPageEs() {
  return (
    <main style={{
      background: '#F5F2EA',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff',
        padding: 40,
        borderRadius: 24,
        boxShadow: '0 2px 16px #DDD',
        border: '1px solid #FFD700',
        textAlign: 'center',
        maxWidth: 420
      }}>
        <h1 style={{
          color: '#7D9A7E',
          fontFamily: 'serif',
          fontWeight: 700,
          marginBottom: 16
        }}>
          Transacción Cancelada
        </h1>
        <p style={{ color: '#333', marginBottom: 20, fontSize: 17 }}>
          Tu pago fue cancelado o no se completó.<br />
          No te preocupes—no se realizó ningún cargo.<br />
          Si necesitas ayuda, Fanny y su equipo están aquí para apoyarte.
        </p>
        <a
          href="/es/servicios"
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: '#FFD700',
            color: '#7D9A7E',
            borderRadius: 99,
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 2px 6px #EEE',
            fontSize: 17
          }}
        >
          Volver a Servicios
        </a>
      </div>
    </main>
  );
}
