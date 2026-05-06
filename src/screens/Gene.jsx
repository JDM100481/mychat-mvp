import { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatTime, ACTION_TYPES } from '../lib/actions';
import { IconSearch, IconPlus } from '../components/Icons';
import './Gene.css';

const FILTERS = ['All','Notes','Receipts','Files'];

export default function GeneScreen() {
  const { geneRecords, navigate, openSheet } = useStore();
  const [filter, setFilter] = useState('All');

  const filtered = geneRecords.filter(r => {
    if (filter === 'All') return true;
    if (filter === 'Receipts') return ['send_money','request_payment'].includes(r.type);
    if (filter === 'Notes') return r.type === 'save_note';
    return true;
  });

  // Built-in pinned items
  const pinned = [
    { id: 'p1', type: 'doc', title: 'Passport renewal docs', sub: 'Updated May 10', icon: '📄' },
  ];

  function typeIcon(type) {
    const icons = { send_money:'💸', request_payment:'📨', split_bill:'🧾', track_expense:'📊', document_request:'📄', decision_required:'✅', save_note:'📝' };
    return icons[type] || '📋';
  }
  function typeBg(type) {
    const meta = ACTION_TYPES[type];
    return meta?.color ? meta.color + '22' : 'var(--pbg)';
  }

  return (
    <div className="gene-screen">
      <div className="gene-hdr">
        <div>
          <div className="gene-title">myGENE</div>
          <div className="gene-sub">Message yourself</div>
        </div>
      </div>

      <div className="gene-search" onClick={() => navigate('search')}>
        <div className="gs-row">
          <div className="gs-ico"><IconSearch /></div>
          <span>Search myGENE</span>
        </div>
      </div>

      <div className="gene-pills">
        {FILTERS.map(f => (
          <button key={f} className={`gpill ${filter===f ? 'active':''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="gene-body">
        {pinned.length > 0 && filter === 'All' && (
          <>
            <div className="gene-sec">Pinned</div>
            {pinned.map(p => (
              <div key={p.id} className="gene-row">
                <div className="gene-ico" style={{ background: 'var(--pbg)' }}>{p.icon}</div>
                <div className="gene-info">
                  <div className="gene-name">{p.title}</div>
                  <div className="gene-sub-t">{p.sub}</div>
                </div>
                <div style={{ fontSize:'16px' }}>📌</div>
              </div>
            ))}
          </>
        )}

        {filtered.length > 0 ? (
          <>
            <div className="gene-sec">{filter === 'All' ? 'Recent Activity' : filter}</div>
            {filtered.map(r => (
              <div key={r.id} className="gene-row">
                <div className="gene-ico" style={{ background: typeBg(r.type) }}>
                  <span style={{ fontSize:'16px' }}>{typeIcon(r.type)}</span>
                </div>
                <div className="gene-info">
                  <div className="gene-name">{r.title || ACTION_TYPES[r.type]?.label || r.type}</div>
                  {r.amount && <div className="gene-sub-t">₱{parseFloat(r.amount).toLocaleString()}</div>}
                  {r.note && !r.amount && <div className="gene-sub-t">{r.note}</div>}
                </div>
                <div className="gene-date">{formatTime(r.ts)}</div>
              </div>
            ))}
          </>
        ) : (
          <div className="gene-empty">
            {filter === 'All'
              ? 'No records yet. Complete actions in chat to build your myGENE vault.'
              : `No ${filter.toLowerCase()} yet.`}
          </div>
        )}
      </div>

      <button className="gene-fab" onClick={openSheet}>
        <IconPlus size={22} />
      </button>
    </div>
  );
}
