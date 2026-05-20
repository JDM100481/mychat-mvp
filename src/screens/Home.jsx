import { useState } from 'react';
import { useStore } from '../store/useStore';
import { roomDisplayName, isCirclePlus, myUserId } from '../lib/matrix';
import { formatTime } from '../lib/actions';
import { IconSearch, IconPlus } from '../components/Icons';
import './Home.css';

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
  const [filter, setFilter] = useState('all');

  function openRoom(room) {
    setActiveRoom(room.roomId);
    navigate('chat', room.roomId);
    setTab('chats');
  }

  const sorted = [...rooms]
    .sort((a, b) => {
      const tA = a.getLastActiveTimestamp?.() ?? 0;
      const tB = b.getLastActiveTimestamp?.() ?? 0;
      return tB - tA;
    });

  // Filter chats based on selected tab
  const filtered = sorted.filter(room => {
    if (filter === 'all') return true;
    if (filter === 'people') return room.getJoinedMemberCount?.() === 2;
    if (filter === 'circles') return room.getJoinedMemberCount?.() > 2 && isCirclePlus(room);
    if (filter === 'businesses') return room.getJoinedMemberCount?.() > 2 && !isCirclePlus(room);
    return true;
  });

  const tabs = [
    { key: 'all', label: 'View all' },
    { key: 'people', label: 'People' },
    { key: 'circles', label: 'Circles' },
    { key: 'businesses', label: 'Businesses' },
    { key: 'mygene', label: 'myGENE' },
  ];

  function handleTabClick(tabKey) {
    if (tabKey === 'mygene') {
      setTab('mygene');
      navigate('mygene');
    } else {
      setFilter(tabKey);
    }
  }

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

      {/* Tabs */}
      <div className="home-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`home-tab ${filter === tab.key || (tab.key === 'mygene' && filter === 'mygene') ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chats list */}
      <div className="chats-section">
        <div className="chats-list">
          {filtered.length === 0 && (
            <div className="no-chats">No chats in this category yet</div>
          )}
          {filtered.map(room => {
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
