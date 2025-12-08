import { useState } from 'react';

export default function DashboardDev() {
  const [email, setEmail] = useState('');
  const [otps, setOtps] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  const fetchOtps = async () => {
    setMessage('');
    setOtps(null);
    try {
      const url = `${apiBase}/debug/otps?email=${encodeURIComponent(email)}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch (err) { throw new Error('Unexpected response (not JSON): ' + text.slice(0,200)); }
      if (!data.success) {
        setMessage(data.message || 'Failed');
        return;
      }
      setOtps(data.data.otps);
    } catch (e) {
      setMessage(e.message);
    }
  };

  const verify = async (otp) => {
    setMessage('');
    try {
      const res = await fetch(`${apiBase}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!data.success) {
        setMessage(data.message || 'Verification failed');
        return;
      }
      setMessage('Verified successfully');
      setOtps(null);
    } catch (e) {
      setMessage(e.message);
    }
  };

  const resetDb = async () => {
    if (!confirm('Reset the dev DB? This will remove all users and OTPs.')) return;
    setBusy(true);
    setMessage('');
    try {
      const res = await fetch(`${apiBase}/debug/reset-db`, { method: 'POST' });
      const data = await res.json();
      if (!data.success) {
        setMessage(data.message || 'Reset failed');
      } else {
        setMessage('Database cleared (dev).');
        setOtps(null);
      }
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>
      <h1>Dev Dashboard - OTPs</h1>
      <p>This page is for development only. It fetches OTPs stored on the backend and lets you verify them.</p>

      <div style={{ marginBottom: 12 }}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" style={{ padding: 8, width: 320 }} />
        <button onClick={fetchOtps} style={{ marginLeft: 8, padding: '8px 12px' }}>Fetch OTPs</button>

        <button
          onClick={resetDb}
          style={{ marginLeft: 12, padding: '8px 12px', background: '#c92a2a', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          disabled={busy}
        >
          {busy ? 'Resetting...' : 'Reset DB'}
        </button>
      </div>

      {message && <div style={{ marginBottom: 12, color: message.toLowerCase().includes('failed') ? 'crimson' : 'green', fontWeight: 'bold' }}>{message}</div>}

      {otps && otps.length === 0 && <div>No OTPs found for this email</div>}

      {otps && otps.length > 0 && (
        <div>
          <h3>OTPs</h3>
          <ul>
            {otps.map((o, i) => (
              <li key={i} style={{ marginBottom: 8 }}>
                <strong>{o.otp}</strong>
                <div>Expires At: {new Date(o.expiresAt).toLocaleString()}</div>
                <button onClick={() => verify(o.otp)} style={{ marginTop: 6 }}>Verify</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
