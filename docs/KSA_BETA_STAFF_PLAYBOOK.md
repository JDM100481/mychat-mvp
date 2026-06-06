# myCHAT / myGENE Kabayan KSA Beta — Staff Playbook

**Program:** KSA closed beta for first 100 OFWs  
**Audience:** beta operators, support staff, escalation owners, product leads  
**Version:** v1 for controlled live beta  
**Core rule:** human-supported pilot; not an emergency authority.

---

## 1. Staff Mission

Your job is to keep the first-100 KSA beta safe, useful, and operationally controlled.

Staff are responsible for:

- Enrolling only eligible KSA beta users.
- Confirming consent before support handling.
- Monitoring urgent cases.
- Escalating high-risk cases through verified official channels.
- Protecting sensitive OFW data.
- Logging follow-ups and outcomes.
- Capturing feedback to improve the product.

The app does not replace emergency services, government offices, licensed legal advice, medical care, or social work case management.

---

## 2. Non-Negotiable Launch Gates

Do not invite live OFWs until the launch owner confirms all required gates.

| Gate | Required | Owner | Staff action |
|---|---:|---|---|
| Official KSA contact directory verified | Yes | Ops lead | Confirm current Embassy, Consulate, MWO, OWWA, DMW, 1343, and Saudi emergency paths. |
| Consent and privacy flow active | Yes | Product | Confirm users cannot enroll until consent is complete. |
| 100-seat roster cap active | Yes | Product | Confirm roster stops at 100. |
| P1 operator coverage assigned | Yes | Ops lead | Assign primary, backup, and escalation owner by shift. |
| Redacted ops export working | Yes | Engineering | Confirm exports remove sensitive fields before reporting. |
| Incident log ready | Yes | Ops lead | Prepare shared secure log with access limited to authorized staff. |
| Withdrawal process ready | Yes | Product/Ops | Staff can mark a participant withdrawn and stop non-essential follow-up. |

---

## 3. Staff Roles

### 3.1 Launch Owner

- Owns the decision to open or pause the beta.
- Confirms all launch gates.
- Approves user invitation message.
- Reviews daily risk summary.
- Decides whether to expand, pause, or close the beta.

### 3.2 Primary Operator

- Reviews new cases during assigned shift.
- Responds to P1 cases within target SLA.
- Checks the Ops dashboard daily.
- Logs actions taken and next follow-up.
- Escalates unclear or high-risk cases.

### 3.3 Backup Operator

- Covers missed P1 alerts or unavailable primary operator.
- Reviews end-of-shift handoff.
- Helps with case backlog.

### 3.4 Escalation Owner

- Maintains verified official contact paths.
- Advises which official channel is appropriate for P1/P2 cases.
- Confirms escalation outcome in the staff log.

### 3.5 Product / QA Owner

- Captures product issues and user feedback.
- Tracks bugs, confusing copy, missing guide content, and unsafe flows.
- Confirms test, lint, and build status before release updates.

---

## 4. Shift Setup Checklist

At the start of every shift:

1. Confirm you are the assigned operator or backup.
2. Open the app and go to **myGENE Kabayan → Ops**.
3. Check roster count remains `<= 100`.
4. Copy the redacted ops export JSON.
5. Save it to the secure staff log with timestamp and operator name.
6. Review open P1 and P2 cases.
7. Confirm official KSA contact sheet is available.
8. Confirm your safe callback/escalation phone is working.
9. Read the previous shift handoff.
10. Record shift start time.

---

## 5. Severity Classification

Use the app classification, then apply human judgment. When unsure, escalate upward.

| Severity | Examples | Target response | Staff action |
|---|---|---:|---|
| P1 — immediate safety risk | Passport confiscation with threat, locked in, abuse, forced work, trafficking indicators, detention, medical danger, no safe place | 15 minutes | Safety-first response, direct to Saudi emergency services if immediate danger, escalate to verified official channels. |
| P2 — serious welfare/labor issue | Unpaid salary, contract substitution, illegal deductions, repatriation planning, no documents but no immediate threat | 4 hours | Create/confirm case file, evidence checklist, route to appropriate MWO/DMW/OWWA path. |
| P3 — guidance and navigation | Benefits, remittance planning, docs checklist, country guide, provider directory | Next business day | Provide guidance, collect feedback, close or schedule follow-up. |

Escalate any case to P1 if the user mentions:

- Being locked in.
- Physical harm or threat.
- Employer holding passport plus intimidation.
- Sexual harassment or assault.
- Forced labor.
- Human trafficking indicators.
- Detention or arrest.
- Medical emergency.
- Suicidal ideation or self-harm risk.
- User says they are being watched and cannot talk freely.

---

## 6. P1 Response Procedure

For P1 cases, follow this exact sequence.

### Step 1 — Safety Boundary

Tell the user:

> If you are in immediate danger, contact Saudi emergency services now: 999 Police, 997 Ambulance, or 998 Fire. myCHAT is not an emergency authority. If you can safely continue, tell us your city and safe callback method.

### Step 2 — Confirm Minimum Safe Facts

Ask only what is needed:

- Current city or nearest landmark.
- Whether they are currently safe to message.
- Safe callback number or method.
- Type of danger.
- Whether passport/documents are held.
- Whether family notification is authorized.

Do not pressure the user to collect evidence if doing so increases risk.

### Step 3 — Create or Verify Case File

Confirm the case includes:

- Case ID.
- User beta code.
- City.
- Issue summary.
- Urgency: P1.
- Evidence checklist.
- Family notification choice.
- Next referral path.
- Operator owner.
- Next follow-up time.

### Step 4 — Escalate Through Verified Channels

Use only verified official contact paths from the staff contact sheet.

Possible paths:

- Saudi emergency services for immediate danger.
- Philippine Embassy Riyadh.
- Philippine Consulate General Jeddah.
- MWO Riyadh / Jeddah / Al Khobar.
- OWWA 1348.
- DMW assistance.
- 1343 Actionline for trafficking indicators.

Do not invent phone numbers. If a number is missing, mark the case as **blocked — contact verification needed** and alert the escalation owner immediately.

### Step 5 — Log Every Action

Record:

- Timestamp.
- Operator name.
- User beta code.
- Case ID.
- Severity.
- Channel contacted.
- Contact result.
- Next owner.
- Next follow-up time.
- Whether family notification was authorized.

### Step 6 — Handoff

If unresolved by shift end, hand off directly to backup or next operator. Do not leave P1 cases only in a passive log.

---

## 7. P2 Response Procedure

For labor, salary, contract, document, or welfare concerns without immediate danger:

1. Confirm city and beta code.
2. Create or review case file.
3. Gather evidence checklist:
   - Contract.
   - Payslips.
   - Attendance or work schedule records.
   - Employer or agency messages.
   - Deductions or unpaid salary details.
   - Remittance records if relevant.
4. Identify likely referral path:
   - MWO / DMW for labor issues.
   - OWWA for welfare support.
   - DMW AKSYON / repatriation for distressed OFWs.
   - NRCO for reintegration concerns.
5. Set follow-up within 4 hours or next available official-office window.
6. Log action and next owner.

---

## 8. P3 Response Procedure

For guidance cases:

1. Answer the user’s question clearly.
2. Direct them to the right app tab:
   - Chat for general questions.
   - Docs for checklist.
   - Benefits for OWWA/DMW/NRCO.
   - Remit for family finance planning.
   - Countries for KSA guidance.
   - Providers for directories.
3. Ask if the answer helped.
4. Capture product feedback.
5. Close the case or schedule a follow-up.

---

## 9. User Enrollment Procedure

When enrolling a user:

1. Confirm they are part of the KSA beta audience.
2. Ask them to read the onboarding instructions.
3. Ensure all consent boxes are checked.
4. Enroll them in the Beta tab.
5. Confirm their beta code.
6. Explain emergency boundary.
7. Ask them to save their beta code.
8. Add staff note if user has known safety concerns.

Do not manually bypass consent. If the user does not agree, do not enroll them.

---

## 10. Withdrawal Procedure

If a user asks to leave the beta:

1. Acknowledge immediately.
2. Confirm beta code or identity using minimum necessary information.
3. Mark participant as withdrawn in the staff log.
4. Stop non-essential follow-ups.
5. Keep only records required for safety, audit, or legal/compliance requirements.
6. Confirm withdrawal to user.

Suggested response:

> Confirmed, Kabayan. We will mark you as withdrawn from the KSA beta and stop non-essential beta follow-up. If you have an urgent safety issue, please contact Saudi emergency services or official assistance channels directly.

---

## 11. Data Handling Rules for Staff

Staff must follow these rules:

- Use redacted ops export for reporting.
- Do not paste passport numbers into open chats or shared documents.
- Do not share full phone numbers unless needed for authorized escalation.
- Do not share employer private addresses outside authorized staff channels.
- Do not screenshot sensitive user data into personal devices.
- Do not store case records in personal notebooks, personal email, or public drives.
- Do not use beta data for marketing without explicit approval and separate consent.
- Limit access to staff who need the data for support.
- Report suspected data exposure immediately to the launch owner.

---

## 12. Staff Communication Templates

### 12.1 Invitation Message

> Kabayan, you are invited to the myCHAT / myGENE Kabayan KSA closed beta for the first 100 OFWs. This is a human-supported pilot that helps with OFW questions, SOS case files, documents, benefits, remittance planning, and referrals. It is not an emergency hotline or government office. If you are in immediate danger, call Saudi emergency services first: 999 Police, 997 Ambulance, or 998 Fire. If you agree to join, please read the consent items and keep your beta code.

### 12.2 Consent Reminder

> Before we enroll you, please read and accept the beta consent items: privacy notice, emergency boundary, data processing, and family notification choice. You can choose not to join or withdraw later.

### 12.3 P1 Safety Response

> Kabayan, your safety comes first. If you are in immediate danger, contact Saudi emergency services now: 999 Police, 997 Ambulance, or 998 Fire. If it is safe to message, please send only your current city, safe callback method, and whether you can leave your location safely.

### 12.4 Evidence Checklist Message

> If it is safe, please keep copies of your contract, passport copy, employer/agency messages, salary records, photos/audio, and current location details. Do not collect evidence if it puts you in danger.

### 12.5 Family Notification Confirmation

> Do you authorize us to prepare a family notification for this case? We will not notify family unless you authorize it, except where required by safety, law, or the approved escalation process.

### 12.6 Wrong Information Report

> Thank you for flagging this. We will mark this information for verification and stop using it until the ops lead confirms the official source.

### 12.7 Case Follow-Up

> Update on your case: [short update]. Next action: [owner/action]. Next follow-up target: [date/time]. If your situation becomes urgent, contact Saudi emergency services first and message us when safe.

---

## 13. Daily Ops Report Template

Use this at the end of each day:

```text
KSA Beta Daily Ops Report
Date:
Operator:
Roster count:
New enrollments today:
Open cases:
P1 cases opened:
P1 cases resolved/escalated:
P2 cases opened:
P3 questions handled:
Users withdrawn:
Incorrect/missing KSA directory items:
Product bugs:
User feedback themes:
Data/privacy concerns:
Staffing gaps:
Decision needed from launch owner:
```

Attach or link the redacted ops export JSON. Do not attach unredacted sensitive case data to a broad report.

---

## 14. Case Log Template

```text
Case ID:
Beta code:
Date/time opened:
Operator:
Severity: P1 / P2 / P3
City:
Issue summary:
Immediate safety risk: yes/no/unknown
Family notification authorized: yes/no
Evidence available:
Referral path:
Official channel contacted:
Contact result:
Next owner:
Next follow-up time:
Status: open / pending official response / resolved / withdrawn / blocked
Notes:
```

---

## 15. Beta Feedback Template

```text
Beta code:
Date:
Feature used: Beta / Chat / SOS / Cases / Docs / Benefits / Remit / Countries / Providers / Ops
What user tried to do:
What worked:
What confused them:
Missing info:
Incorrect info:
Safety concern:
Suggested improvement:
Priority: high / medium / low
```

---

## 16. Pause or Stop Criteria

Pause invitations immediately if any of these occur:

- No active P1 operator coverage.
- Official KSA contact directory is found to be wrong or unverified.
- Roster cap fails or exceeds 100.
- Sensitive data is exposed to unauthorized people.
- Multiple users report unsafe guidance.
- App outage prevents operators from seeing cases.
- Launch owner or legal/compliance owner orders a pause.

Stop or redesign the beta if:

- P1 volume exceeds staff capacity.
- Users misunderstand the app as an emergency authority despite warnings.
- Contact verification cannot be maintained.
- Secure case handling is insufficient for real user data.

---

## 17. End-of-Beta Closeout

At the end of the first-100 beta:

1. Export final redacted ops summary.
2. Count enrolled, active, withdrawn, and unreachable users.
3. Summarize case volume by severity.
4. Summarize outcomes and unresolved cases.
5. Review all P1 incidents.
6. Review data/privacy incidents.
7. Summarize top user questions.
8. Summarize product bugs and missing content.
9. Decide whether to expand, repeat, or stop.
10. Notify users of the beta close or next phase.

---

## 18. Staff Quick Reference

**Emergency numbers in Saudi Arabia:**

```text
999 Police
997 Ambulance
998 Fire
937 Health hotline
```

**Philippine support paths to verify and use:**

```text
Philippine Embassy Riyadh
Philippine Consulate General Jeddah
MWO Riyadh / Jeddah / Al Khobar
OWWA 1348
DMW assistance
1343 Actionline for trafficking indicators
```

**Golden rule:**

> If the user is in immediate danger, direct them to Saudi emergency services first. Then organize the case, preserve evidence only if safe, and escalate through verified official channels.
