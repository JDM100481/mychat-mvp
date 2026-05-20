import { useState } from 'react';
import { useStore } from '../store/useStore';
import { roomDisplayName } from '../lib/matrix';
import { IconSearch } from '../components/Icons';
import './Gene.css';

const TABS = ['All','Chats','Records','Notes'];

export default function SearchScreen() {
  const { goBack, navigate, setActiveRoom, rooms, geneRecords } = useStore();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState('All');

  const lq = q.toLowerCase();

  const chatResults = (tab === 'All' || tab === 'Chats') && q
    ? rooms.filter(r => roomDisplayName(r).toLowerCase().includes(lq))
    : [];

  const recordResults = (tab === 'All' || tab === 'Records') && q
    ? geneRecords.filter(r => (r.title||'').toLowerCase().includes(lq) || (r.note||'').toLowerCase().includes(lq))
    : [];

  const hasResults = chatResults.length > 0 || recordResults.length > 0;

  return (
    <div className="search-screen">
      <div className="srch-hdr">
        <div className="srch-inp-wrap">
          <IconSearch color="var(--t3)" />
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search…"
          />
        </div>
        <button className="srch-cancel" onClick={goBack}>Cancel</button>
      </div>
      <div className="srch-pills">
        {TABS.map(t => (
          <button key={t} className={`gpill ${tab===t?'active':''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="srch-body">
        {!q && <div className="sr-empty">Type to search across chats, records, and notes.</div>}
        {q && !hasResults && <div className="sr-empty">No results for "{q}"</div>}

        {chatResults.length > 0 && (
          <>
            <div className="sr-sec">Chats</div>
            {chatResults.map(r => (
              <div key={r.roomId} className="sr-row" onClick={() => {
                setActiveRoom(r.roomId);
                navigate('chat', r.roomId);
              }} style={{ cursor: 'pointer' }}>
                <div className="sr-ico" style={{ background: 'var(--pbg)' }}>
                  {roomDisplayName(r)[0]?.toUpperCase()}
                </div>
                <div className="sr-info">
                  <div className="sr-name">{roomDisplayName(r)}</div>
                </div>
              </div>
            ))}
          </>
        )}

        {recordResults.length > 0 && (
          <>
            <div className="sr-sec">Records</div>
            {recordResults.map(r => (
              <div key={r.id} className="sr-row">
                <div className="sr-ico" style={{ background: 'var(--gbg)' }}>✓</div>
                <div className="sr-info">
                  <div className="sr-name">{r.title}</div>
                  {r.amount && <div className="sr-sub">₱{parseFloat(r.amount).toLocaleString()}</div>}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
