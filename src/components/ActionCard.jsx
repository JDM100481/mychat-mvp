import { useState } from 'react';
import { ACTION_TYPES, formatAmount, statusLabel, statusColor, genRefNo, formatTime } from '../lib/actions';
import { updateActionStatus } from '../lib/matrix';
import { useStore } from '../store/useStore';
import { IconCheck } from './Icons';
import './ActionCard.css';

// ── ACTION CARD (pre-confirm) ──────────────────────────────────────
export function ActionCard({ event, roomId, isOwn }) {
  const { saveToGene } = useStore();
  const content = event.getContent ? event.getContent() : event;
  const [status, setStatus] = useState(content.status || 'pending');
  const [loading, setLoading] = useState(false);
  const meta = ACTION_TYPES[content.action_type] || { label: content.action_type, color: 'var(--p)' };

  async function confirm() {
    setLoading(true);
    try {
      const eventId = event.getId ? event.getId() : null;
      if (eventId && roomId) await updateActionStatus(roomId, eventId, 'confirmed');
      setStatus('confirmed');
      saveToGene({
        id: genRefNo(),
        type: content.action_type,
        title: content.title,
        amount: content.amount,
        note: content.note,
        ts: Date.now(),
      });
    } catch (e) {
      console.warn('Update failed (offline mode):', e.message);
      setStatus('confirmed');
      saveToGene({ id: genRefNo(), type: content.action_type, title: content.title, amount: content.amount, note: content.note, ts: Date.now() });
    } finally {
      setLoading(false);
    }
  }

  async function decline() {
    setStatus('declined');
    const eventId = event.getId ? event.getId() : null;
    if (eventId && roomId) updateActionStatus(roomId, eventId, 'declined').catch(() => {});
  }

  const confirmed = status === 'confirmed' || status === 'completed';
  const declined  = status === 'declined';

  return (
    <div className={`acard ${isOwn ? 'own' : ''}`}>
      <div className="ac-title-row">
        <div className="ac-type-dot" style={{ background: meta.color }} />
        <span className="ac-type-lbl" style={{ color: meta.color }}>{meta.label}</span>
      </div>
      <div className="ac-title">{content.title}</div>

      {(content.fields || []).map((f, i) => (
        <div className="ac-field" key={i}>
          <div className="ac-fl">{f.label || f.l}</div>
          <div className="ac-fv">
            {f.avatar && <div className="ac-av" style={{ background: f.avBg || 'var(--pbg)' }}>{f.avatar}</div>}
            <div>
              <div className="ac-fv-name">{f.name || f.value || f.v}</div>
              {(f.sub || f.s) && <div className="ac-fv-sub">{f.sub || f.s}</div>}
            </div>
          </div>
        </div>
      ))}

      {content.amount && (
        <div className="ac-field">
          <div className="ac-fl">Amount</div>
          <div className="ac-amount">{formatAmount(content.amount)}</div>
        </div>
      )}

      {content.note && (
        <div className="ac-field">
          <div className="ac-fl">Note</div>
          <div className="ac-note">{content.note}</div>
        </div>
      )}

      <div className="ac-status-row">
        <span className="ac-badge" style={{ background: statusColor(status) + '22', color: statusColor(status) }}>
          ● {statusLabel(status)}
        </span>
      </div>

      {!confirmed && !declined && (
        <div className="ac-btns">
          <button className="ac-confirm" onClick={confirm} disabled={loading}>
            {loading ? 'Processing…' : 'Review & Confirm'}
          </button>
          <button className="ac-cancel" onClick={decline}>Cancel</button>
        </div>
      )}

      {confirmed && (
        <div className="ac-confirmed-state">
          <div className="ac-check-circle"><IconCheck /></div>
          <span>Confirmed — saved to myGENE</span>
        </div>
      )}

      {declined && (
        <div className="ac-declined-state">Declined</div>
      )}
    </div>
  );
}

// ── RECEIPT CARD (completed record) ───────────────────────────────
export function ReceiptCard({ data }) {
  const amount = formatAmount(data.amount);
  return (
    <div className="rcpt">
      <div className="rcpt-top">
        <div className="rcpt-circle"><IconCheck /></div>
        <div className="rcpt-label">{data.title || 'Payment Sent'}</div>
      </div>
      {amount && <div className="rcpt-amount">{amount}</div>}
      <div className="rcpt-rows">
        {(data.rows || []).map((r, i) => (
          <div className="rcpt-row" key={i}>
            <span className="rcpt-rl">{r.l || r.label}</span>
            <span className="rcpt-rv">{r.v || r.value}</span>
          </div>
        ))}
      </div>
      {data.ref && <div className="rcpt-ref">Ref: {data.ref}</div>}
      {data.ts && <div className="rcpt-ts">{formatTime(data.ts)}</div>}
    </div>
  );
}
