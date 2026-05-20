import { useState } from 'react';
import { useStore } from '../store/useStore';
import { roomDisplayName, isCirclePlus, getClient, createCircle, addMembersToRoom, setRoomMemberRole, myUserId } from '../lib/matrix';
import { IconBack, IconPlus, IconChevron } from '../components/Icons';
import './Circles.css';

function av(name) { return (name||'?')[0].toUpperCase(); }
const BG = ['#e8f0fd','#fde8e8','#e9f8ee','#fff4e5','#f7effe','#ffeeed'];
function avBg(name) { let h=0; for(const c of (name||'')) h=(h*31+c.charCodeAt(0))%BG.length; return BG[h]; }

const CIRCLE_TYPES = {
  general: { label: 'General', icon: '👥', roles: ['member', 'moderator', 'admin'] },
  family: { label: 'Family', icon: '👨‍👩‍👧‍👦', roles: ['father', 'mother', 'son', 'daughter', 'grandfather', 'grandmother', 'uncle', 'aunt', 'cousin', 'sibling', 'spouse', 'child'] },
};

const FAMILY_ROLE_COLORS = {
  father: '#3B82F6',
  mother: '#EC4899',
  son: '#8B5CF6',
  daughter: '#D946EF',
  grandfather: '#1E40AF',
  grandmother: '#BE185D',
  uncle: '#6366F1',
  aunt: '#C2185B',
  cousin: '#059669',
  sibling: '#7C3AED',
  spouse: '#DB2777',
  child: '#F59E0B',
};

export function CirclesScreen() {
  const { navigate, setActiveRoom, rooms } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [step, setStep] = useState(1); // 1: type, 2: name, 3: add members, 4: assign roles
  const [circleType, setCircleType] = useState('general');
  const [circleName, setCircleName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [memberRoles, setMemberRoles] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Filter to only rooms with more than 2 members (actual groups/circles)
  const circles = rooms.filter(room => room.getJoinedMemberCount?.() > 2);

  function openCircle(room) {
    setActiveRoom(room.roomId);
    navigate('circle', room.roomId);
  }

  function getMockContacts() {
    // TODO: Replace with actual contacts from server
    return [
      { userId: '@john:mychat.ph', name: 'John Doe' },
      { userId: '@jane:mychat.ph', name: 'Jane Smith' },
      { userId: '@bob:mychat.ph', name: 'Bob Johnson' },
      { userId: '@alice:mychat.ph', name: 'Alice Brown' },
      { userId: '@charlie:mychat.ph', name: 'Charlie Wilson' },
    ];
  }

  function toggleMember(userId) {
    setSelectedMembers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  }

  function setMemberRole(userId, role) {
    setMemberRoles(prev => ({ ...prev, [userId]: role }));
  }

  async function handleCreateCircle() {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (circleName.trim()) {
        setStep(3);
      }
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      try {
        setLoading(true);
        // Create circle and add members with roles
        const roomId = await createCircle(`${circleName}${circleType === 'family' ? ' (Family)' : ''}`, selectedMembers);
        console.log('Circle created:', roomId, 'Type:', circleType);
        
        // Set roles for selected members
        for (const userId of selectedMembers) {
          const role = memberRoles[userId] || (circleType === 'family' ? 'sibling' : 'member');
          if (role !== (circleType === 'family' ? 'sibling' : 'member')) {
            await setRoomMemberRole(roomId, userId, role);
          }
        }
        
        // Reset and close
        setCircleType('general');
        setCircleName('');
        setSelectedMembers([]);
        setMemberRoles({});
        setStep(1);
        setShowCreate(false);
        setLoading(false);
      } catch (err) {
        console.error('Failed to create circle:', err);
        setLoading(false);
      }
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setShowCreate(false);
    }
  }

  function handleClose() {
    setCircleType('general');
    setCircleName('');
    setSelectedMembers([]);
    setMemberRoles({});
    setStep(1);
    setShowCreate(false);
  }

  return (
    <div className="circles-screen">
      <div className="std-hdr">
        <div className="std-hdr-title">Circles</div>
        <button className="std-hdr-plus" onClick={() => setShowCreate(true)}><IconPlus color="var(--t3)" size={14} /></button>
      </div>
      <div className="circles-body">
        {circles.length === 0 && <div className="circles-empty">No Circles yet. Tap + to create one.</div>}
        {circles.map(room => {
          const name = roomDisplayName(room);
          const plus = isCirclePlus(room);
          const memberCount = room.getJoinedMemberCount?.() || 0;
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
                <div className="cl-meta">{memberCount} members{preview && ` • ${preview}`}</div>
              </div>
              <IconChevron />
            </div>
          );
        })}
      </div>

      {/* Create Circle Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <button className="modal-back" onClick={handleBack}>←</button>
              <h2>{step === 1 ? 'Circle Type' : step === 2 ? 'Circle Name' : step === 3 ? 'Add Members' : 'Assign Roles'}</h2>
              <button className="modal-close" onClick={handleClose}>×</button>
            </div>
            <div className="modal-body">
              {step === 1 && (
                <div className="circle-type-selector">
                  {Object.entries(CIRCLE_TYPES).map(([type, config]) => (
                    <button
                      key={type}
                      className={`type-option ${circleType === type ? 'active' : ''}`}
                      onClick={() => setCircleType(type)}
                    >
                      <div className="type-icon">{config.icon}</div>
                      <div className="type-label">{config.label}</div>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <input
                  type="text"
                  placeholder="Circle name (e.g., Family, Work Friends)"
                  value={circleName}
                  onChange={e => setCircleName(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleCreateCircle()}
                  autoFocus
                  className="circle-input"
                />
              )}
              
              {step === 3 && (
                <div className="members-picker">
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    className="circle-input search-input"
                  />
                  <div className="contacts-list">
                    {getMockContacts()
                      .filter(c => c.name.toLowerCase().includes(searchInput.toLowerCase()))
                      .map(contact => (
                        <div key={contact.userId} className="contact-item">
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(contact.userId)}
                            onChange={() => toggleMember(contact.userId)}
                            id={contact.userId}
                          />
                          <label htmlFor={contact.userId} className="contact-label">
                            <div className="contact-av" style={{ background: avBg(contact.name) }}>
                              {av(contact.name)}
                            </div>
                            <div className="contact-name">{contact.name}</div>
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              
              {step === 4 && (
                <div className="role-assign">
                  <div className="circle-info-display">{circleName}</div>
                  {selectedMembers.length === 0 ? (
                    <div className="no-members">No members selected</div>
                  ) : (
                    <div className="roles-list">
                      {selectedMembers.map(userId => {
                        const contact = getMockContacts().find(c => c.userId === userId);
                        const availableRoles = CIRCLE_TYPES[circleType].roles;
                        const defaultRole = circleType === 'family' ? 'sibling' : 'member';
                        return (
                          <div key={userId} className="role-row">
                            <div className="role-member">
                              <div className="role-av" style={{ background: avBg(contact?.name) }}>
                                {av(contact?.name)}
                              </div>
                              <div className="role-name">{contact?.name}</div>
                            </div>
                            <select
                              className={`role-select ${circleType === 'family' ? 'family-role-select' : ''}`}
                              value={memberRoles[userId] || defaultRole}
                              onChange={e => setMemberRole(userId, e.target.value)}
                              style={circleType === 'family' ? { borderColor: FAMILY_ROLE_COLORS[memberRoles[userId] || defaultRole] } : {}}
                            >
                              {availableRoles.map(role => (
                                <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                              ))}
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="modal-btn-cancel" onClick={handleClose}>Cancel</button>
              <button 
                className="modal-btn-create" 
                onClick={handleCreateCircle} 
                disabled={
                  loading ||
                  (step === 2 && !circleName.trim()) ||
                  (step === 3 && selectedMembers.length === 0)
                }
              >
                {loading ? 'Creating...' : step === 4 ? 'Create Circle' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
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
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [selectedNewMembers, setSelectedNewMembers] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  function openChat() {
    setActiveRoom(roomId);
    navigate('chat', roomId);
  }

  function isCircleFamily() {
    return name?.includes('(Family)');
  }

  function getMemberRole(member) {
    const powerLevel = member.powerLevel || 0;
    if (isCircleFamily()) {
      // For family circles, return the actual role name instead of deriving from power level
      // This would need to be stored in room state or custom user data
      return 'sibling'; // Default, would need custom implementation
    }
    if (powerLevel >= 100) return 'admin';
    if (powerLevel >= 50) return 'moderator';
    return 'member';
  }

  function getGenerationLevel(role) {
    const generations = {
      'grandfather': 0, 'grandmother': 0,
      'father': 1, 'mother': 1, 'uncle': 1, 'aunt': 1,
      'sibling': 2, 'spouse': 2,
      'son': 3, 'daughter': 3, 'cousin': 3,
      'child': 4,
    };
    return generations[role] || 2;
  }

  function getMockContacts() {
    return [
      { userId: '@john:mychat.ph', name: 'John Doe' },
      { userId: '@jane:mychat.ph', name: 'Jane Smith' },
      { userId: '@bob:mychat.ph', name: 'Bob Johnson' },
      { userId: '@alice:mychat.ph', name: 'Alice Brown' },
      { userId: '@charlie:mychat.ph', name: 'Charlie Wilson' },
    ];
  }

  function toggleNewMember(userId) {
    setSelectedNewMembers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  }

  async function handleAddMembers() {
    if (selectedNewMembers.length > 0) {
      try {
        await addMembersToRoom(roomId, selectedNewMembers);
        console.log('Members added:', selectedNewMembers);
        setSelectedNewMembers([]);
        setSearchInput('');
        setShowAddMembers(false);
      } catch (err) {
        console.error('Failed to add members:', err);
      }
    }
  }

  async function handleChangeRole(userId, newRole) {
    try {
      await setRoomMemberRole(roomId, userId, newRole);
      console.log('Role changed for', userId, 'to', newRole);
    } catch (err) {
      console.error('Failed to change role:', err);
    }
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
          {['Add Members','Members','Settings'].map(a => (
            <button key={a} className="qa-btn" onClick={() => {
              if (a === 'Add Members') setShowAddMembers(true);
              else if (a === 'Members') setTab('Members');
              else if (a === 'Settings') console.log('Circle settings');
            }}>
              <div className="qa-ico">
                {a === 'Add Members' && <svg viewBox="0 0 24 24" fill="none" stroke="var(--t2)" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}
                {a === 'Members' && <svg viewBox="0 0 24 24" fill="none" stroke="var(--t2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                {a === 'Settings' && <svg viewBox="0 0 24 24" fill="none" stroke="var(--t2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>}
              </div>
              <span>{a}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="cd-tabs">
        {['Chat','Members','Details'].map(t => (
          <button key={t} className={`cd-tab ${tab===t ? 'active':''}`} onClick={() => { setTab(t); if(t==='Chat') openChat(); }}>{t}</button>
        ))}
      </div>
      <div className="cd-body">
        {tab === 'Chat' && <div className="cd-placeholder" onClick={openChat}>Tap Chat to open the conversation thread →</div>}
        {tab === 'Members' && (
          <div className="members-list">
            {isCircleFamily() ? (
              // Family Tree View
              <div className="family-tree">
                {['grandfather', 'grandmother', 'father', 'mother', 'uncle', 'aunt'].length > 0 && (
                  <div className="generation gen-0">
                    <div className="gen-label">Grandparents</div>
                    {members.filter(m => ['grandfather', 'grandmother'].some(r => r)).map((m, i) => (
                      <div key={i} className="family-member">
                        <div className="member-av" style={{ background: avBg(m.name||m.userId) }}>
                          {av(m.name||m.userId)}
                        </div>
                        <div className="family-member-info">
                          <div className="member-name">{m.name || m.userId.split(':')[0].replace('@', '')}</div>
                          <div className="member-role" style={{ color: FAMILY_ROLE_COLORS['grandfather'] }}>Grandparent</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="generation gen-1">
                  <div className="gen-label">Parents & Aunts/Uncles</div>
                  {members.filter(m => ['father', 'mother', 'uncle', 'aunt'].some(r => r)).map((m, i) => (
                    <div key={i} className="family-member">
                      <div className="member-av" style={{ background: avBg(m.name||m.userId) }}>
                        {av(m.name||m.userId)}
                      </div>
                      <div className="family-member-info">
                        <div className="member-name">{m.name || m.userId.split(':')[0].replace('@', '')}</div>
                        <div className="member-role" style={{ color: FAMILY_ROLE_COLORS['father'] }}>Parent</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="generation gen-2">
                  <div className="gen-label">You & Siblings</div>
                  {members.filter(m => ['sibling', 'spouse'].some(r => r)).map((m, i) => (
                    <div key={i} className="family-member">
                      <div className="member-av" style={{ background: avBg(m.name||m.userId) }}>
                        {av(m.name||m.userId)}
                      </div>
                      <div className="family-member-info">
                        <div className="member-name">{m.name || m.userId.split(':')[0].replace('@', '')}</div>
                        <div className="member-role" style={{ color: FAMILY_ROLE_COLORS['sibling'] }}>Sibling/Spouse</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="generation gen-3">
                  <div className="gen-label">Children</div>
                  {members.filter(m => ['son', 'daughter', 'child'].some(r => r)).map((m, i) => (
                    <div key={i} className="family-member">
                      <div className="member-av" style={{ background: avBg(m.name||m.userId) }}>
                        {av(m.name||m.userId)}
                      </div>
                      <div className="family-member-info">
                        <div className="member-name">{m.name || m.userId.split(':')[0].replace('@', '')}</div>
                        <div className="member-role" style={{ color: FAMILY_ROLE_COLORS['son'] }}>Child</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Regular Members List
              members.map((m, i) => {
                const role = getMemberRole(m);
                const isCurrentUser = m.userId === myUserId();
                return (
                  <div key={i} className="member-row">
                    <div className="member-av" style={{ background: avBg(m.name||m.userId) }}>
                      {av(m.name||m.userId)}
                    </div>
                    <div className="member-info">
                      <div className="member-name">{m.name || m.userId.split(':')[0].replace('@', '')}</div>
                      <div className="member-role">{role}</div>
                    </div>
                    {!isCurrentUser && (
                      <select
                        className="member-role-select"
                        value={role}
                        onChange={e => handleChangeRole(m.userId, e.target.value)}
                      >
                        <option value="member">Member</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Add Members Modal */}
        {showAddMembers && (
          <div className="modal-overlay" onClick={() => setShowAddMembers(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add Members</h2>
                <button className="modal-close" onClick={() => setShowAddMembers(false)}>×</button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="circle-input search-input"
                />
                <div className="contacts-list">
                  {getMockContacts()
                    .filter(c => c.name.toLowerCase().includes(searchInput.toLowerCase()))
                    .map(contact => (
                      <div key={contact.userId} className="contact-item">
                        <input
                          type="checkbox"
                          checked={selectedNewMembers.includes(contact.userId)}
                          onChange={() => toggleNewMember(contact.userId)}
                          id={`add-${contact.userId}`}
                        />
                        <label htmlFor={`add-${contact.userId}`} className="contact-label">
                          <div className="contact-av" style={{ background: avBg(contact.name) }}>
                            {av(contact.name)}
                          </div>
                          <div className="contact-name">{contact.name}</div>
                        </label>
                      </div>
                    ))}
                </div>
              </div>
              <div className="modal-footer">
                <button className="modal-btn-cancel" onClick={() => setShowAddMembers(false)}>Cancel</button>
                <button 
                  className="modal-btn-create" 
                  onClick={handleAddMembers}
                  disabled={selectedNewMembers.length === 0}
                >
                  Add {selectedNewMembers.length > 0 ? selectedNewMembers.length : ''} Member{selectedNewMembers.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        )}
        {tab === 'Details' && <div className="cd-placeholder">Circle details coming soon</div>}
      </div>
    </div>
  );
}
