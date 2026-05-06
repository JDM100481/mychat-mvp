import { useState } from 'react';
import './TrustModal.css';

const RELATIONSHIPS = ['Family', 'Business', 'Barangay', 'Friend'];

export default function TrustModal({ name = 'Mark', onClose }) {
  const [selected, setSelected] = useState(null);
  const [sent, setSent] = useState(false);
  const [out, setOut] = useState(false);

  function handleClose() {
    setOut(true);
    setTimeout(onClose, 230);
  }

  function handleSend() {
    if (!selected) return;
    setSent(true);
  }

  return (
    <div className={`tmod-ov${out ? ' out' : ''}`} onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className={`tmod${out ? ' out' : ''}`}>
        <div className="tmod-handle" />

        {sent ? (
          /* Confirmation state */
          <div className="tmod-sent">
            <div className="tmod-sent-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="tmod-sent-title">Trust Request Sent</div>
            <div className="tmod-sent-sub">
              Waiting for the other person to confirm.
            </div>
            <div className="tmod-sent-badge">⏳ Pending</div>
            <button className="tmod-done" onClick={handleClose}>Done</button>
          </div>
        ) : (
          /* Request form */
          <>
            <div className="tmod-hdr">
              <div className="tmod-title">Send Trust Request</div>
              <div className="tmod-to">to <strong>{name}</strong></div>
            </div>

            <div className="tmod-label">Relationship</div>
            <div className="tmod-rels">
              {RELATIONSHIPS.map(r => (
                <button
                  key={r}
                  className={`tmod-rel${selected === r ? ' active' : ''}`}
                  onClick={() => setSelected(r)}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="tmod-actions">
              <button
                className={`tmod-send${!selected ? ' disabled' : ''}`}
                onClick={handleSend}
                disabled={!selected}
              >
                Send Trust Request
              </button>
              <button className="tmod-cancel" onClick={handleClose}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
