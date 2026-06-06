# myCHAT + myGENE Kabayan — Chat-App-First Minimal Architecture

## Goal

The MVP must read as a chat app first, not as a dashboard or generic architecture board. The core product surface is a mobile conversation between the OFW and `myGENE Kabayan`, with SOS, documents, benefits, remittance, and country guidance exposed as quick replies and chat cards.

## Product Architecture

```text
OFW user
  ↓ types / taps quick reply
myCHAT mobile shell
  ↓ routes UI state
Zustand app store
  ↓ renders chat-first modules
myGENE Kabayan screen
  ↓ future production integrations
Matrix rooms + Hermes / official OFW services
```

## Chat-First Component Map

```text
src/App.jsx
├─ App frame
├─ BottomNav                       # Chats / Circles / + / myGENE / Profile
├─ ActionSheet                     # create/send/request shortcuts
└─ Screens
   ├─ HomeScreen                   # chat list
   ├─ ChatScreen                   # Matrix room conversation
   ├─ CirclesScreen                # circle list
   ├─ CircleDetailScreen           # circle members/profile
   ├─ GeneScreen                   # Kabayan assistant conversation
   ├─ SearchScreen
   └─ ProfileScreen

GeneScreen
├─ Chat header                     # myGENE Kabayan identity
├─ Search/ask affordance
├─ Quick reply chips               # Kabayan / SOS / Docs / Benefits / Remit / Countries
├─ Message thread                  # primary surface
├─ Inline cards                    # SOS, docs, benefits, remit, countries
└─ Composer                        # fixed message input
```

## State Model

`src/store/useStore.js`

- `isDemoMode`: local demo session without Matrix credentials
- `loggedIn`, `userId`: auth/session state
- `screen`, `screenParam`, `prevScreen`: navigation state
- `activeTab`: bottom nav state
- `rooms`, `activeRoomId`, `messages`: Matrix-ready chat state
- `sheetOpen`, `pendingAction`: action-sheet state
- `geneRecords`: local myGENE records
- `searchQuery`: search state

## Design Correction

The architecture visual should look like this product:

```text
Phone frame
┌───────────────────────────────┐
│ myCHAT                 🇵🇭    │
│ Ask Kabayan...                │
│ Kabayan  SOS  Docs  Remit     │
├───────────────────────────────┤
│ myGENE Kabayan card           │
│                               │
│ 🇵🇭 Kumusta, Kabayan...        │
│       Unpaid salary →         │
│ 🇵🇭 Save payslips/contracts... │
│ [OWWA 1348] [DMW] [Embassy]   │
├───────────────────────────────┤
│ Message Kabayan...        ➜   │
│ Chats Circles + myGENE Profile│
└───────────────────────────────┘
```

## Integration Boundaries

| Boundary | Current MVP | Future Production |
|---|---|---|
| AI assistant | Local deterministic chat replies | Hermes Agent / myGENE service |
| Chat transport | Matrix SDK available | Matrix rooms + event cards |
| OFW contacts | Static emergency/contact cards | DMW/OWWA/DFA/Embassy directory APIs |
| Documents | UI-only checklist/vault | encrypted storage + Matrix/Drive link |
| Remittance | UI-only 50-30-20 tracker | MannyPay / remittance provider APIs |
| Logistics | roadmap only | Imerex / cargo provider API |

## Quality Gate

1. `npm run build`
2. `npm run lint`
3. Browser smoke test:
   - opens to myGENE in demo mode
   - looks like a messenger
   - quick replies/tabs render
   - chat input generates a Kabayan reply
   - bottom nav works
   - action sheet opens
   - console has no runtime errors
