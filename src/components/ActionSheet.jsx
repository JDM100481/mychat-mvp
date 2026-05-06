import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ACTION_LIST, ACTION_TYPES } from '../lib/actions';
import './ActionSheet.css';

const ICONS = {
  money: (c) => <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>,
  request: (c) => <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="8" x2="21" y2="12"/><line x1="21" y1="8" x2="17" y2="12"/></svg>,
  split: (c) => <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  expense: (c) => <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  doc: (c) => <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  decision: (c) => <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  note: (c) => <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
};

const BG = {
  money: 'var(--gbg)', request: 'var(--pbg)', split: 'var(--obg)',
  expense: 'var(--purpbg)', doc: 'var(--rbg)', decision: '#e0f5fb', note: '#fffde7',
};

export default function ActionSheet() {
  const { sheetOpen, closeSheet, setPendingAction, navigate, activeRoomId } = useStore();
  const [visible, setVisible] = useState(false);
  const [out, setOut] = useState(false);

  useEffect(() => {
    if (sheetOpen) {
      setOut(false);
      setVisible(true);
    } else if (visible) {
      setOut(true);
      const t = setTimeout(() => setVisible(false), 240);
      return () => clearTimeout(t);
    }
  }, [sheetOpen]);

  function handleClose() {
    setOut(true);
    setTimeout(closeSheet, 230);
  }

  function pick(type) {
    setOut(true);
    setTimeout(() => {
      setPendingAction({ type });
      closeSheet();
      if (!activeRoomId) navigate('chat', null);
    }, 200);
  }

  if (!visible) return null;

  return (
    <div className={`sheet-ov${out ? ' out' : ''}`} onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className={`sheet${out ? ' out' : ''}`}>
        <div className="sheet-handle" />
        <div className="sheet-title">What would you like to do?</div>
        {ACTION_LIST.map(a => {
          const meta = ACTION_TYPES[a.type];
          return (
            <button key={a.type} className="sheet-row" onClick={() => pick(a.type)}>
              <div className="sico" style={{ background: BG[meta.icon] }}>
                {ICONS[meta.icon](meta.color)}
              </div>
              <div className="sact">
                <div className="sact-n">{meta.label}</div>
                <div className="sact-d">{a.desc}</div>
              </div>
            </button>
          );
        })}
        <button className="sheet-cancel" onClick={handleClose}>Cancel</button>
      </div>
    </div>
  );
}
