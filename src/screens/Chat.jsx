import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { sendMessage, sendActionCard, getClient, myUserId, displayName } from '../lib/matrix';
import { ACTION_TYPES, formatTime, genRefNo } from '../lib/actions';
import { ActionCard, ReceiptCard } from '../components/ActionCard';
import { IconBack, IconPhone, IconVideo, IconPlus, IconCamera, IconMic, IconEmoji, IconSend } from '../components/Icons';
import './Chat.css';

function MsgBubble({ event, isOwn }) {
  const type = event.getType?.() || event.type;
  const content = event.getContent?.() || event.content || {};
  const ts = event.getTs?.() || event.ts || 0;
  const sender = event.getSender?.() || event.sender || '';
  const body = content.body || '';

  if (type === 'xyz.mychat.action') {
    return <ActionCard event={event} roomId={event.getRoomId?.()} isOwn={isOwn} />;
  }
  if (type === 'xyz.mychat.receipt') {
    return <ReceiptCard data={content} />;
  }
  if (type !== 'm.room.message') return null;
  if (content.msgtype === 'm.text' && body) {
    return (
      <div className={`mrow ${isOwn ? 'out' : 'in'}`}>
        {!isOwn && <div className="msg-sender">{displayName(sender)}</div>}
        <div className={`bubble ${isOwn ? 'out' : 'in'}`}>{body}</div>
        <div className="mtime">{ts ? formatTime(ts) : ''}</div>
      </div>
    );
  }
  return null;
}

export default function ChatScreen() {
  const { screenParam, goBack, messages, pendingAction, setPendingAction, openSheet, appendMessage, saveToGene } = useStore();
  const roomId = screenParam;
  const client = getClient();
  const room = client?.getRoom(roomId);
  const myId = myUserId();
  const bottomRef = useRef(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [showActionForm, setShowActionForm] = useState(false);
  const [actionDraft, setActionDraft] = useState({ title: '', amount: '', note: '', recipient: '' });

  const msgs = messages[roomId] || (room ? room.getLiveTimeline().getEvents() : []);
  const roomName = room?.name || 'Chat';
  const online = true;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs.length]);

  useEffect(() => {
    if (pendingAction) { setShowActionForm(true); }
  }, [pendingAction]);

  async function handleSend() {
    const val = text.trim();
    if (!val || !roomId) return;
    setText('');
    setSending(true);
    try {
      await sendMessage(roomId, val);
    } catch (e) {
      // offline: add local optimistic message
      appendMessage(roomId, { type: 'm.room.message', content: { msgtype: 'm.text', body: val }, sender: myId, ts: Date.now(), getId: () => null, getType: () => 'm.room.message', getContent: () => ({ msgtype: 'm.text', body: val }), getSender: () => myId, getTs: () => Date.now() });
    }
    setSending(false);
  }

  async function submitAction() {
    const type = pendingAction?.type || 'send_money';
    const meta = ACTION_TYPES[type];
    const card = {
      type,
      title: actionDraft.title || meta.label,
      amount: actionDraft.amount || null,
      note: actionDraft.note || '',
      fields: actionDraft.recipient ? [{ label: 'To', name: actionDraft.recipient, avatar: actionDraft.recipient[0]?.toUpperCase() }] : [],
    };
    setShowActionForm(false);
    setPendingAction(null);
    setActionDraft({ title: '', amount: '', note: '', recipient: '' });
    if (roomId) {
      try {
        await sendActionCard(roomId, card);
      } catch (e) {
        const fakeEvent = {
          type: 'xyz.mychat.action',
          content: { ...card, action_type: card.type, status: 'pending' },
          sender: myId, ts: Date.now(),
          getId: () => null,
          getType: () => 'xyz.mychat.action',
          getContent: () => ({ ...card, action_type: card.type, status: 'pending' }),
          getSender: () => myId,
          getTs: () => Date.now(),
          getRoomId: () => roomId,
        };
        appendMessage(roomId, fakeEvent);
      }
    }
  }

  const meta = pendingAction ? ACTION_TYPES[pendingAction.type] : null;

  return (
    <div className="chat-screen">
      {/* Header */}
      <div className="chat-hdr">
        <button className="chat-back" onClick={goBack}><IconBack /></button>
        <div className="chat-av-sm" style={{ background: '#e8f0fd' }}>
          {roomName[0]?.toUpperCase()}
        </div>
        <div className="chat-hdr-info">
          <div className="chat-hdr-name">{roomName}</div>
          {online && <div className="chat-hdr-status">Online</div>}
        </div>
        <div className="chat-hdr-acts">
          <button><IconPhone /></button>
          <button><IconVideo /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-body">
        {msgs.length === 0 && (
          <div className="chat-empty">
            <p>Start a conversation or tap + to create an action.</p>
          </div>
        )}
        {msgs.map((event, i) => {
          const sender = event.getSender?.() || event.sender || '';
          const isOwn = sender === myId;
          return <MsgBubble key={i} event={event} isOwn={isOwn} />;
        })}
        <div ref={bottomRef} />
      </div>

      {/* Action compose form */}
      {showActionForm && meta && (
        <div className="action-form">
          <div className="af-hdr">
            <span className="af-title" style={{ color: meta.color }}>{meta.label}</span>
            <button className="af-close" onClick={() => { setShowActionForm(false); setPendingAction(null); }}>✕</button>
          </div>
          <input className="af-inp" placeholder="Title (e.g. Padala sa Mama)" value={actionDraft.title} onChange={e => setActionDraft(d => ({...d, title: e.target.value}))} />
          <input className="af-inp" placeholder="Recipient / To" value={actionDraft.recipient} onChange={e => setActionDraft(d => ({...d, recipient: e.target.value}))} />
          {['send_money','request_payment','split_bill','track_expense'].includes(pendingAction?.type) && (
            <input className="af-inp" placeholder="Amount (e.g. 5000)" type="number" value={actionDraft.amount} onChange={e => setActionDraft(d => ({...d, amount: e.target.value}))} />
          )}
          <input className="af-inp" placeholder="Note (optional)" value={actionDraft.note} onChange={e => setActionDraft(d => ({...d, note: e.target.value}))} />
          <button className="af-submit" onClick={submitAction}>Send Action Card</button>
        </div>
      )}

      {/* Input bar */}
      <div className="chat-bar">
        <button className="bar-plus" onClick={openSheet}><IconPlus color="var(--t3)" size={14} /></button>
        <button className="bar-icon"><IconCamera /></button>
        <button className="bar-icon"><IconMic /></button>
        <button className="bar-icon"><IconEmoji /></button>
        <input
          className="bar-inp"
          placeholder="Type a message…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button className="bar-send" onClick={handleSend} disabled={!text.trim() || sending}>
          <IconSend />
        </button>
      </div>
    </div>
  );
}
