# myGENE Kabayan KSA Live Beta Runbook — First 100 OFWs

**Scope:** controlled live beta for the first 100 OFWs in the Kingdom of Saudi Arabia using myCHAT / myGENE Kabayan.

**Beta rule:** this is a human-supported pilot, not an autonomous emergency service. The app routes, records, redacts and reminds; human operators remain responsible for review and escalation.

---

## 1. Launch Gate

Do not invite live OFWs until all required items below are confirmed by the launch owner.

Companion documents:

- User onboarding and FAQs: `docs/KSA_BETA_USER_ONBOARDING_FAQ.md`
- Staff beta playbook: `docs/KSA_BETA_STAFF_PLAYBOOK.md`

| Gate | Required | Owner | Status in app |
|---|---:|---|---|
| KSA Embassy / Consulate / MWO contacts verified for Riyadh, Jeddah, Al Khobar | Yes | Ops lead | Ready for official verification |
| Consent + privacy + emergency boundary shown before enrollment | Yes | Product | Implemented |
| First 100 roster cap | Yes | Product | Implemented |
| P1 operator coverage | Yes | Ops lead | Requires staffing |
| Sensitive-data minimization / redacted export | Yes | Engineering | Implemented |
| Manual escalation runbook | Yes | Ops lead | Documented |

---

## 2. What Was Added for Live KSA Beta Readiness

- `Beta` tab
  - Consent gate: privacy, emergency boundary, data processing, family notification choice.
  - Enrolls only up to 100 OFWs.
  - Generates beta codes: `KSA-BETA-001` through `KSA-BETA-100`.

- `SOS` + `Cases`
  - Defaults to KSA case creation.
  - Case records route passport/abuse/forced-work indicators to `Embassy/MWO + OWWA + 1343`.
  - P1 target in domain logic: 15 minutes.

- `Countries`
  - Saudi Arabia guide includes Riyadh, Jeddah, Al Khobar post coverage and Saudi emergency numbers.
  - Marked as requiring official verification before launch day.

- `Ops` tab
  - Capacity dashboard.
  - Required-readiness checklist.
  - Redacted JSON export for daily operator review.

---

## 3. Operator Coverage Model for First 100

Minimum staffing for beta:

1. **Primary operator** — reviews new P1 cases and roster daily.
2. **Backup operator** — covers missed P1 or unavailable primary.
3. **Escalation owner** — confirms official contact path and logs outcome.

Suggested SLA:

| Severity | Trigger | Response target |
|---|---|---:|
| P1 | passport confiscation, locked in, abuse, detention, forced labor, trafficking indicators, medical danger | 15 minutes |
| P2 | unpaid salary, contract substitution, document issue, benefit/repatriation planning | 4 hours |
| P3 | benefits, remittance, docs, country guide, provider directory | next business day |

---

## 4. Emergency Boundary Text

Show this during onboarding and whenever a P1 case is detected:

> myCHAT / myGENE Kabayan is a beta support and routing tool. It is not a police, ambulance, embassy, DMW, OWWA, MWO, or emergency authority. If you are in immediate danger in Saudi Arabia, contact local emergency services first: 999 Police, 997 Ambulance, 998 Fire. Then contact the Philippine Embassy / Consulate / MWO, OWWA 1348, DMW, or 1343 for trafficking indicators.

---

## 5. Daily Beta Operations

Every day during the first-100 beta:

1. Open the `Ops` tab.
2. Copy redacted ops export JSON.
3. Save the export to the operator log.
4. Review all P1/P2 cases.
5. Verify follow-up owner and due date.
6. Record what official contact path was used.
7. Update stale cases or close resolved cases.
8. Check roster count remains `<= 100`.

---

## 6. Data Handling Rules

- Do not paste passport numbers, employer private addresses, agency documents, or full phone numbers into public chats.
- Use masked phone numbers where possible.
- Use the redacted export for daily reporting.
- Keep original sensitive details only in the secure case system once backend storage exists.
- For this client-only beta shell, treat localStorage as temporary device-local state only.

---

## 7. Commands for Release Verification

Run before packaging:

```bash
npm test
npm run lint
npm run build
```

Expected current result:

```text
13 tests passing
eslint clean
vite production build succeeds
```

---

## 8. Known Remaining External Dependencies

These cannot be solved in code alone and must be completed before inviting real OFWs:

- Official KSA contact numbers/links verified with current Embassy/MWO/DMW/OWWA sources.
- Human operators assigned with names, schedules and escalation phone numbers.
- Privacy notice reviewed by legal/compliance owner.
- Production hosting, telemetry, backup, incident report process and secure backend selected.

---

## 9. Release Positioning

Use this wording:

**KSA closed beta for first 100 OFWs. Human-supported pilot. Not an emergency authority.**

Do not market it as a fully automated emergency service.
