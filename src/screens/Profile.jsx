import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useStore } from '../store/useStore';
import { logout, myUserId } from '../lib/matrix';
import { IconChevron } from '../components/Icons';
import QRScanModal from '../components/QRScanModal';
import TrustModal from '../components/TrustModal';
import './Profile.css';

function initial(userId) {
  if (!userId) return '?';
  return userId.split(':')[0].replace('@', '')[0]?.toUpperCase() || '?';
}

function avatarColor(userId) {
  const colors = ['#e8f0fd', '#fde8e8', '#e9f8ee', '#fff4e5', '#f7effe', '#ffeeed'];
  const name = userId || '';
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % colors.length;
  return colors[h];
}

function shortName(userId) {
  if (!userId) return 'User';
  const raw = userId.split(':')[0].replace('@', '');
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

const SETTINGS = [
  {
    section: 'Account',
    rows: [
      { icon: '📛', label: 'Display Name', value: null },
      { icon: '🔔', label: 'Notifications', value: 'On' },
      { icon: '🔒', label: 'Privacy', value: null },
    ],
  },
  {
    section: 'Preferences',
    rows: [
      { icon: '🌙', label: 'Appearance', value: 'Light' },
      { icon: '🌐', label: 'Language', value: 'English' },
    ],
  },
  {
    section: 'Support',
    rows: [
      { icon: '❓', label: 'Help & FAQ', value: null },
      { icon: '📋', label: 'Terms & Privacy', value: null },
      { icon: 'ℹ️', label: 'About myCHAT', value: null },
    ],
  },
];

export default function ProfileScreen() {
  const { userId, setLoggedOut, navigate } = useStore();
  const uid = userId || myUserId();
  const [toast, setToast] = useState('');
  const [scanOpen, setScanOpen] = useState(false);
  const [trustOpen, setTrustOpen] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !uid) return;
    QRCode.toCanvas(canvasRef.current, `https://matrix.to/#/${uid}`, {
      width: 168,
      margin: 2,
      color: { dark: '#1C1C1E', light: '#FFFFFF' },
    }).catch(() => {});
  }, [uid]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  function saveQR() {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.download = `mychat-${shortName(uid)}.png`;
    a.href = canvasRef.current.toDataURL('image/png');
    a.click();
  }

  function shareQR() {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(blob => {
      if (navigator.share && blob) {
        const file = new File([blob], 'mychat-qr.png', { type: 'image/png' });
        navigator.share({ title: 'QR-Connect', files: [file] }).catch(() => {});
      } else {
        showToast('Share not supported on this browser');
      }
    });
  }

  function handleScanSendTrust() {
    setScanOpen(false);
    setTimeout(() => setTrustOpen(true), 260);
  }

  function handleSignOut() {
    if (!window.confirm('Sign out of myCHAT?')) return;
    logout();
    setLoggedOut();
  }

  return (
    <div className="prof-screen">
      <div className="prof-hdr">
        <span className="prof-title">Profile</span>
      </div>

      <div className="prof-body">
        {/* Hero */}
        <div className="prof-hero">
          <div className="prof-av" style={{ background: avatarColor(uid) }}>
            {initial(uid)}
          </div>
          <div className="prof-name">{shortName(uid)}</div>
          <div className="prof-uid">{uid}</div>
          <div className="prof-status">
            <span className="prof-dot" />
            <span>Active</span>
          </div>
        </div>

        {/* QR-Connect */}
        <div className="prof-section">
          <div className="prof-sec-label">QR-Connect</div>
          <div className="prof-qr-card">
            <div className="prof-qr-canvas-wrap">
              <canvas ref={canvasRef} className="prof-qr-canvas" />
            </div>
            <p className="prof-qr-hint">
              Use QR-Connect to create trusted connections in your Community Graph.
            </p>
            <button className="prof-qr-btn" onClick={() => setScanOpen(true)}>
              Scan QR-Connect
            </button>
            <div className="prof-qr-row">
              <button className="prof-qr-ghost" onClick={shareQR}>Share QR-Connect</button>
              <button className="prof-qr-ghost" onClick={saveQR}>Save QR</button>
            </div>
          </div>
        </div>

        {/* Community */}
        <div className="prof-section">
          <div className="prof-sec-label">Community</div>
          <div className="prof-card">
            <button
              className="prof-row"
              onClick={() => navigate('trust-graph')}
            >
              <span className="prof-row-icon">🔗</span>
              <div className="prof-row-info">
                <span className="prof-row-label">Community Graph</span>
                <span className="prof-row-sub">Verified people and Circles</span>
              </div>
              <div className="prof-row-right"><IconChevron /></div>
            </button>
          </div>
        </div>

        {/* Settings */}
        {SETTINGS.map(s => (
          <div key={s.section} className="prof-section">
            <div className="prof-sec-label">{s.section}</div>
            <div className="prof-card">
              {s.rows.map((row, i) => (
                <button
                  key={row.label}
                  className={`prof-row${i < s.rows.length - 1 ? ' has-border' : ''}`}
                  onClick={() => showToast(`${row.label} — coming soon`)}
                >
                  <span className="prof-row-icon">{row.icon}</span>
                  <span className="prof-row-label">{row.label}</span>
                  <div className="prof-row-right">
                    {row.value && <span className="prof-row-value">{row.value}</span>}
                    <IconChevron />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="prof-section">
          <div className="prof-card">
            <button className="prof-signout" onClick={handleSignOut}>Sign Out</button>
          </div>
        </div>

        <div className="prof-footer">
          myCHAT v0.1 MVP · matrix.mychat.ph
        </div>
      </div>

      {toast && <div className="prof-toast">{toast}</div>}
      {scanOpen && <QRScanModal onSendTrust={handleScanSendTrust} onClose={() => setScanOpen(false)} />}
      {trustOpen && <TrustModal name="Mark" onClose={() => setTrustOpen(false)} />}
    </div>
  );
}
