import { useState } from 'react';
import { useStore } from '../store/useStore';
import { roomDisplayName, isCirclePlus, getClient } from '../lib/matrix';
import { IconBack, IconPlus, IconChevron } from '../components/Icons';
import './Circles.css';

function av(name) { return (name||'?')[0].toUpperCase(); }
const BG = ['#e8f0fd','#fde8e8','#e9f8ee','#fff4e5','#f7effe','#ffeeed'];
function avBg(name) { let h=0; for(const c of (name||'')) h=(h*31+c.charCodeAt(0))%BG.length; return BG[h]; }

export function CirclesScreen() {
  const { navigate, setActiveRoom, rooms } = useStore();
  const circles = rooms.filter(() => true); // show all rooms as circles

  function openCircle(room) {
    setActiveRoom(room.roomId);
    navigate('circle', room.roomId);
  }

  return (
    <div className="circles-screen">
      <div className="std-hdr">
        <div className="std-hdr-title">Circles</div>
        <button className="std-hdr-plus" onClick={() => navigate('chat', null)}><IconPlus color="var(--t3)" size={14} /></button>
      </div>
      <div className="circles-body">
        {circles.length === 0 && <div className="circles-empty">No Circles yet. Create one or join a Circle.</div>}
        {circles.map(room => {
          const name = roomDisplayName(room);
          const plus = isCirclePlus(room);
          const lastEvent = room.timeline?.[room.timeline.length - 1];
          const preview = lastEvent?.getContent?.()?.body || '';
          return (
            <div key={room.roomId} className="cl-card" onClick={() => openCircle(room)}>
              <div className="cl-av" style={{ background: avBg(name) }}>{av(name)}</div>
              <div className="cl-info">
                <div className="cl-name">
                  {name}
                  {plus && <span className="cl-plus">Circle+</span>}
                </div>
                {preview && <div className="cl-prev">{preview}</div>}
              </div>
              <IconChevron />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CircleDetailScreen() {
  const { screenParam, goBack, navigate, setActiveRoom, rooms } = useStore();
  const roomId = screenParam;
  const client = getClient();
  const room = client?.getRoom(roomId) || rooms.find(r => r.roomId === roomId);
  const name = room ? roomDisplayName(room) : 'Circle';
  const members = room?.getMembers?.() || [];
  const [tab, setTab] = useState('Chat');

  function openChat() {
    setActiveRoom(roomId);
    navigate('chat', roomId);
  }

  return (
    <div className="circle-detail">
      <div className="cd-top">
        <div className="cd-back-row">
          <button className="cd-back" onClick={goBack}><IconBack /></button>
        </div>
        <div className="cd-avs">
          {members.slice(0,4).map((m,i) => (
            <div key={i} className="cd-av" style={{ background: avBg(m.name||m.userId) }}>
              {av(m.name||m.userId)}
            </div>
          ))}
          {members.length === 0 && <div className="cd-av" style={{ background: avBg(name) }}>{av(name)}</div>}
        </div>
        <div className="cd-name">{name}</div>
        <div className="cd-count">{members.length > 0 ? `${members.length} member${members.length !== 1 ? 's' : ''}` : 'Circle'}</div>
        <div className="cd-qa">
          {['Add','Search','Settings'].map(a => (
            <button key={a} className="qa-btn" onClick={() => {
              if (a === 'Add') navigate('chat', null);
              else if (a === 'Search') navigate('search');
            }}>
              <div className="qa-ico">
                {a === 'Add' && <svg viewBox="0 0 24 24" fill="none" stroke="var(--t2)" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}
                {a === 'Search' && <svg viewBox="0 0 24 24" fill="none" stroke="var(--t2)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>}
                {a === 'Settings' && <svg viewBox="0 0 24 24" fill="none" stroke="var(--t2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>}
              </div>
              <span>{a}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="cd-tabs">
        {['Chat','Tasks','Files','Wallet'].map(t => (
          <button key={t} className={`cd-tab ${tab===t ? 'active':''}`} onClick={() => { setTab(t); if(t==='Chat') openChat(); }}>{t}</button>
        ))}
      </div>
      <div className="cd-body">
        {tab === 'Chat' && <div className="cd-placeholder" onClick={openChat}>Tap Chat to open the conversation thread →</div>}
        {tab !== 'Chat' && <div className="cd-placeholder">Content for {tab} coming soon</div>}
      </div>
    </div>
  );
}
