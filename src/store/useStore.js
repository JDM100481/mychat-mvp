import { create } from 'zustand';

const DEMO_USER_ID = '@kabayan:mychat.ph';
const hasMatrixToken = Boolean(localStorage.getItem('mc_token'));
const demoEnabled = import.meta.env.VITE_DEMO_MODE !== 'false' && localStorage.getItem('mc_demo_disabled') !== '1';
const startsInDemo = demoEnabled && !hasMatrixToken;
const initialUserId = hasMatrixToken ? localStorage.getItem('mc_uid') : startsInDemo ? DEMO_USER_ID : null;

export const useStore = create((set) => ({
  // Auth
  // Demo mode is explicit and can be disabled with VITE_DEMO_MODE=false or by logging out.
  isDemoMode: startsInDemo,
  userId: initialUserId,
  loggedIn: Boolean(hasMatrixToken || startsInDemo),
  setLoggedIn: (userId) => {
    localStorage.removeItem('mc_demo_disabled');
    set({ loggedIn: true, userId, isDemoMode: false });
  },
  setLoggedOut: () => {
    localStorage.setItem('mc_demo_disabled', '1');
    set({ loggedIn: false, userId: null, isDemoMode: false, screen: 'home', activeTab: 'chats' });
  },

  // Navigation
  screen: startsInDemo ? 'mygene' : 'home',   // home | chat | circles | circle | mygene | search
  prevScreen: null,
  screenParam: null,
  navigate: (screen, param = null) => set(s => ({ screen, prevScreen: s.screen, screenParam: param })),
  goBack: () => set(s => ({ screen: s.prevScreen || 'home', prevScreen: null, screenParam: null })),

  // Nav tab
  activeTab: startsInDemo ? 'mygene' : 'chats',
  setTab: (tab) => set({ activeTab: tab }),

  rooms: [],
  setRooms: (rooms) => set({ rooms }),

  // Active room
  activeRoomId: null,
  setActiveRoom: (id) => set({ activeRoomId: id }),

  // Messages per room { roomId: [events] }
  messages: {},
  appendMessage: (roomId, event) => set(s => ({
    messages: { ...s.messages, [roomId]: [...(s.messages[roomId] || []), event] }
  })),
  setMessages: (roomId, events) => set(s => ({
    messages: { ...s.messages, [roomId]: events }
  })),

  // Action sheet
  sheetOpen: false,
  openSheet: () => set({ sheetOpen: true }),
  closeSheet: () => set({ sheetOpen: false }),

  // Compose action
  pendingAction: null,
  setPendingAction: (a) => set({ pendingAction: a }),

  // myGENE records (local)
  geneRecords: JSON.parse(localStorage.getItem('mc_gene') || '[]'),
  saveToGene: (record) => set(s => {
    const records = [record, ...s.geneRecords];
    localStorage.setItem('mc_gene', JSON.stringify(records));
    return { geneRecords: records };
  }),

  // Search
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
