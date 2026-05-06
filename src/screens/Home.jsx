import { useStore } from '../store/useStore';
import { roomDisplayName, isCirclePlus, myUserId } from '../lib/matrix';
import { formatTime } from '../lib/actions';
import { IconSearch, IconPlus, IconChevron } from '../components/Icons';
import './Home.css';

const CTX = [
  { key: 'people',   label: 'People',    sub: 'One-on-one chats',    bg: '#1877F2', color: '#fff',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { key: 'circles',  label: 'Circles',   sub: 'Family, friends, groups', bg: '#AF52DE', color: '#fff',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg> },
  { key: 'business', label: 'Businesses',sub: 'Merchants & services', bg: '#5856D6', color: '#fff',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg> },
  { key: 'mygene',   label: 'myGENE',    sub: 'Message yourself',    bg: '#34C759', color: '#fff',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="18" y1="2" x2="18" y2="6"/><line x1="16" y1="4" x2="20" y2="4"/></svg> },
];

function avatar(name) {
  return (name || '?')[0].toUpperCase();
}

function avatarColor(name) {
  const colors = ['#e8f0fd','#fde8e8','#e9f8ee','#fff4e5','#f7effe','#ffeeed'];
  let h = 0;
  for (const c of (name||'')) h = (h * 31 + c.charCodeAt(0)) % colors.length;
  return colors[h];
}

export default function HomeScreen() {
  const { navigate, setActiveRoom, rooms, openSheet, setTab } = useStore();

  function openRoom(room) {
    setActiveRoom(room.roomId);
    navigate('chat', room.roomId);
    setTab('chats');
  }

  function ctxTap(key) {
    if (key === 'mygene') { setTab('mygene'); navigate('mygene'); return; }
    if (key === 'circles') { setTab('circles'); navigate('circles'); return; }
    navigate('chat', null);
  }

  const recent = [...rooms]
    .sort((a, b) => {
      const tA = a.getLastActiveTimestamp?.() ?? 0;
      const tB = b.getLastActiveTimestamp?.() ?? 0;
      return tB - tA;
    })
    .slice(0, 6);

  return (
    <div className="home-screen">
      {/* Header */}
      <div className="home-hdr">
        <span className="home-title">my<span>CHAT</span></span>
        <button className="home-plus" onClick={openSheet}>
          <IconPlus color="var(--p)" size={15} />
        </button>
      </div>

      {/* Search */}
      <div className="home-search" onClick={() => navigate('search')}>
        <div className="search-row">
          <div className="s-ico"><IconSearch /></div>
          <span>Search contacts or myGENE</span>
        </div>
      </div>

      {/* Context list */}
      <div className="ctx-list">
        {CTX.map(c => (
          <div key={c.key} className="ctx-row" onClick={() => ctxTap(c.key)}>
            <div className="ctx-ico" style={{ background: c.bg }}>{c.icon}</div>
            <div className="ctx-info">
              <div className="ctx-name">{c.label}</div>
              <div className="ctx-sub">{c.sub}</div>
            </div>
            <IconChevron />
          </div>
        ))}
      </div>

      {/* Recent chats */}
      <div className="recent-section">
        <div className="recent-hdr">
          <span className="rh-label">Recent Chats</span>
          <span className="rh-view" onClick={() => navigate('circles')}>View all</span>
        </div>
        <div className="recent-list">
          {recent.length === 0 && (
            <div className="no-chats">No chats yet. Tap a context above to begin.</div>
          )}
          {recent.map(room => {
            const name = roomDisplayName(room);
            const lastEvent = room.timeline?.[room.timeline.length - 1];
            const preview = lastEvent?.getContent?.()?.body || '—';
            const ts = lastEvent?.getTs?.() || 0;
            const plus = isCirclePlus(room);
            return (
              <div key={room.roomId} className="rec-row" onClick={() => openRoom(room)}>
                <div className="rec-av" style={{ background: avatarColor(name) }}>
                  {avatar(name)}
                </div>
                <div className="rec-info">
                  <div className="rec-name">
                    {name}
                    {plus && <span className="rec-plus">(+)</span>}
                  </div>
                  <div className="rec-prev">{preview}</div>
                </div>
                <div className="rec-time">{ts ? formatTime(ts) : ''}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
