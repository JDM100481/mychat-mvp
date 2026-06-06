# myCHAT + myGENE Kabayan — Minimal Chat App Design

## North Star

This must look and feel like a messaging app. The dashboard is supporting context only; the conversation is the product.

## Design Principle

> Conversation first. Everything else is a chat card, quick reply, or bottom-sheet action.

## Screen Anatomy

```text
Header:        myCHAT / myGENE Kabayan identity
Ask row:       search-like prompt for intent
Quick chips:   Kabayan, SOS, Docs, Benefits, Remit, Countries
Thread:        bubbles + inline cards
Composer:      fixed message input
Bottom nav:    Chats, Circles, +, myGENE, Profile
```

## Visual Rules

1. The main vertical space is always a message thread.
2. Assistant responses are left-aligned bubbles with a small Kabayan avatar.
3. User messages are right-aligned blue bubbles.
4. SOS, Docs, Benefits, Remit, and Countries render as inline chat cards, not separate dashboard pages.
5. The composer is always visible above the bottom nav.
6. Use cards sparingly; cards should feel like rich messages.
7. Keep Filipino warmth in microcopy: `Kabayan`, `Kumusta`, `OFW support chat`.

## Token Use

Use existing `src/styles/tokens.css` tokens.

| Token | Chat-app role |
|---|---|
| `--p` | user bubbles, active chips, send button |
| `--bg` | thread background |
| `--surf` | bot bubbles, cards, header, composer |
| `--bdr` | bubble/card borders |
| `--t1` | message text |
| `--t3` | timestamps/helper copy |
| `--red` | SOS/emergency |
| `--green` | verified/safe states |

## myGENE Kabayan Conversation Model

### First screen

- Header: `myGENE Kabayan`
- Ask row: `Ask Kabayan: salary, docs, benefits...`
- Quick chips: `Kabayan / SOS / Docs / Benefits / Remit / Countries`
- Thread starts with:
  - bot greeting
  - quick prompts
  - optional one compact status card
- Composer: `Message Kabayan...`

### Example flow

```text
🇵🇭 Kumusta, Kabayan. What do you need help with?
[Employer took passport] [Unpaid salary] [Renew OWWA]

You: Unpaid salary for two months

🇵🇭 Save payslips, contract, attendance records and employer chats.
I can prepare a DMW/MWO complaint checklist.

[Create case file] [Find Embassy/MWO] [Notify family]
```

## What Not To Do

- Do not lead with a system diagram.
- Do not make the first view feel like a finance/admin dashboard.
- Do not bury the composer below cards.
- Do not use large blocks of explanatory text.
- Do not make architecture visuals look like backend docs when the product is a chat app.

## Deliverable Files

- `docs/MINIMAL_ARCHITECTURE.md` — chat-first architecture explanation
- `docs/MINIMAL_DESIGN.md` — this design spec
- `docs/mychat-kabayan-architecture.html` — visual chat-app-first architecture/mockup
