import { useState } from 'react';
import './QRScanModal.css';

export default function QRScanModal({ onSendTrust, onClose }) {
  const [phase, setPhase] = useState('scan');
  const [out, setOut] = useState(false);

  function close() {
    setOut(true);
    setTimeout(onClose, 230);
  }

  function send() {
    setOut(true);
    setTimeout(onSendTrust, 230);
  }

  return (
    <div className={`qrs-ov${out ? ' out' : ''}`} onClick={e => e.target === e.currentTarget && close()}>
      <div className={`qrs${out ? ' out' : ''}`}>
        <div className="qrs-handle" />

        {phase === 'scan' ? (
          <>
            <div className="qrs-title">Scan QR-Connect</div>
            <div className="qrs-body">
              Scan another person's QR-Connect to request a trusted connection.
            </div>
            <div className="qrs-finder" onClick={() => setPhase('result')}>
              <div className="qrs-corner qrs-tl" />
              <div className="qrs-corner qrs-tr" />
              <div className="qrs-corner qrs-bl" />
              <div className="qrs-corner qrs-br" />
              <div className="qrs-finder-inner">
                <div className="qrs-finder-icon">⬛</div>
                <div className="qrs-finder-hint">Tap to demo scan</div>
              </div>
            </div>
            <div className="qrs-note">
              Both users must confirm before a Trust Link is added.
            </div>
            <div className="qrs-actions">
              <button className="qrs-cancel" onClick={close}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div className="qrs-ready-icon">✓</div>
            <div className="qrs-ready-title">QR-Connect Request Ready</div>
            <div className="qrs-ready-person">
              <div className="qrs-av">M</div>
              <span className="qrs-ready-name">Mark</span>
            </div>
            <div className="qrs-actions">
              <button className="qrs-send" onClick={send}>Send Trust Request</button>
              <button className="qrs-cancel" onClick={close}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
