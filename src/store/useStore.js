import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // Auth
  userId: localStorage.getItem('mc_uid') || null,
  loggedIn: !!localStorage.getItem('mc_token'),
  setLoggedIn: (userId) => set({ loggedIn: true, userId }),
  setLoggedOut: () => set({ loggedIn: false, userId: null }),

  // Navigation
  screen: 'home',   // home | chat | circles | circle | mygene | search
  prevScreen: null,
  screenParam: null,
  navigate: (screen, param = null) => set(s => ({ screen, prevScreen: s.screen, screenParam: param })),
  goBack: () => set(s => ({ screen: s.prevScreen || 'home', prevScreen: null, screenParam: null })),

  // Nav tab
  activeTab: 'chats',
  setTab: (tab) => set({ activeTab: tab }),

  // Rooms
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
