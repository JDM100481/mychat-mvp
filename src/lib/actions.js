export const ACTION_TYPES = {
  send_money:        { label: 'Send Money',        color: 'var(--green)',  icon: 'money' },
  request_payment:   { label: 'Request Payment',   color: 'var(--p)',      icon: 'request' },
  split_bill:        { label: 'Split Bill',         color: 'var(--orange)', icon: 'split' },
  track_expense:     { label: 'Track Expense',      color: 'var(--purple)', icon: 'expense' },
  document_request:  { label: 'Document Request',   color: 'var(--red)',    icon: 'doc' },
  decision_required: { label: 'Decision Required',  color: 'var(--teal)',   icon: 'decision' },
  save_note:         { label: 'Save Note',          color: '#C49B00',       icon: 'note' },
};

export const ACTION_LIST = [
  { type: 'send_money',       desc: 'Send to anyone' },
  { type: 'request_payment',  desc: 'Ask for payment' },
  { type: 'split_bill',       desc: 'Split expenses' },
  { type: 'track_expense',    desc: 'Add to Circle ledger' },
  { type: 'document_request', desc: 'Request a document' },
  { type: 'decision_required',desc: 'Get approval / confirmation' },
  { type: 'save_note',        desc: 'Save for later' },
];

export function statusLabel(status) {
  return { pending: 'Pending', confirmed: 'Confirmed', completed: 'Completed', declined: 'Declined' }[status] ?? status;
}

export function statusColor(status) {
  return { pending: 'var(--orange)', confirmed: 'var(--p)', completed: 'var(--green)', declined: 'var(--red)' }[status] ?? 'var(--t3)';
}

export function formatAmount(amount, currency = 'PHP') {
  if (!amount && amount !== 0) return '';
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return `₱${num.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}

export function genRefNo(prefix = 'MYC') {
  const d = new Date();
  return `${prefix}-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${Math.floor(Math.random()*9000+1000)}`;
}
