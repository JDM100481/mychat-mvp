import { useState } from 'react';
import { login, startSync } from '../lib/matrix';
import { useStore } from '../store/useStore';
import './Login.css';

export default function LoginScreen() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { setLoggedIn, setRooms, appendMessage } = useStore();

  async function handleLogin(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const client = await login(user.trim(), pass);
      await startSync((event, room) => {
        if (event.getType() === 'm.room.message' || event.getType() === 'xyz.mychat.action') {
          appendMessage(room.roomId, event);
        }
      });
      setRooms(client.getRooms());
      setLoggedIn(client.getUserId());
    } catch (e) {
      setErr(e.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-brand">
          <span className="lb-box">my</span>
          <span className="lb-chat">CHAT</span>
        </div>
        <p className="login-tagline">Tap. Chat. Act.</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="lf-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="@you:mychat.ph"
              value={user}
              onChange={e => setUser(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="lf-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={e => setPass(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {err && <div className="lf-error">{err}</div>}
          <button type="submit" className="lf-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="login-server">matrix.mychat.ph</p>
      </div>
    </div>
  );
}
