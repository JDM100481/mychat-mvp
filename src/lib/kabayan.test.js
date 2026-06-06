import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyConcern,
  buildKabayanReply,
  createCaseFile,
  splitRemittance,
  getCountryGuide,
  searchProviders,
  createBetaParticipant,
  canAcceptBetaParticipant,
  buildCrisisEscalation,
  validateBetaConsent,
  redactSensitiveCase,
  createOpsExport,
  getBetaReadinessChecklist,
} from './kabayan.js';

test('classifies passport confiscation as urgent SOS trafficking risk', () => {
  const result = classifyConcern('Help, my employer took my passport in Dubai');

  assert.equal(result.module, 'mySOS');
  assert.equal(result.urgency, 'high');
  assert.equal(result.risk, 'trafficking_or_abuse');
  assert.ok(result.evidence.includes('Passport/visa copy'));
});

test('builds a practical chat reply with contacts and next steps', () => {
  const reply = buildKabayanReply('My salary has not been paid for 3 months', { country: 'UAE' });

  assert.match(reply.title, /salary/i);
  assert.ok(reply.steps.length >= 3);
  assert.ok(reply.contacts.some(contact => contact.label.includes('DMW')));
  assert.ok(reply.evidence.includes('Payslips'));
});

test('creates a trackable OFW case file from minimum help desk facts', () => {
  const kase = createCaseFile({
    name: 'Juan Dela Cruz',
    country: 'UAE',
    issue: 'Employer took passport',
    employer: 'ABC LLC',
    agency: 'Sample Agency',
  });

  assert.match(kase.id, /^OFW-UAE-/);
  assert.equal(kase.status, 'Open');
  assert.equal(kase.nextReferral, 'Embassy/MWO + OWWA + 1343');
  assert.ok(kase.followUps.length > 0);
});

test('splits remittance using the OFW 50-30-20 command center rule', () => {
  const split = splitRemittance(100000);

  assert.deepEqual(split, {
    familySupport: 50000,
    savingsInvestments: 30000,
    personalExpenses: 20000,
    funds: {
      emergency: 10000,
      reintegration: 8000,
      retirement: 6000,
      education: 4000,
      medical: 2000,
    },
  });
});

test('returns country-specific embassy, emergency, and MWO guide data', () => {
  const guide = getCountryGuide('UAE');

  assert.equal(guide.country, 'UAE');
  assert.ok(guide.localEmergency.includes('999'));
  assert.ok(guide.posts.some(post => post.includes('Dubai')));
});

test('finds trusted providers by service category', () => {
  const remit = searchProviders('remittance');

  assert.ok(remit.length >= 3);
  assert.ok(remit.every(provider => provider.category === 'Remittance'));
});

test('KSA guide includes official pilot-critical posts and Saudi emergency numbers', () => {
  const guide = getCountryGuide('KSA');

  assert.equal(guide.country, 'Saudi Arabia');
  assert.equal(guide.betaStatus, 'pilot-ready-pending-official-verification');
  assert.ok(guide.localEmergency.includes('999'));
  assert.ok(guide.localEmergency.includes('997'));
  assert.ok(guide.posts.some(post => post.includes('Riyadh')));
  assert.ok(guide.posts.some(post => post.includes('Jeddah')));
  assert.ok(guide.posts.some(post => post.includes('Al Khobar')));
  assert.ok(guide.officialVerificationRequired);
});

test('beta consent requires privacy, emergency boundary, data processing, and family notification choices', () => {
  assert.equal(validateBetaConsent({ privacy: true, emergencyBoundary: true, dataProcessing: true, familyNotify: true }).ok, true);

  const missing = validateBetaConsent({ privacy: true, emergencyBoundary: false, dataProcessing: true, familyNotify: true });
  assert.equal(missing.ok, false);
  assert.ok(missing.missing.includes('emergencyBoundary'));
});

test('first KSA beta is capped at 100 OFWs and creates participant codes', () => {
  const roster = Array.from({ length: 99 }, (_, i) => ({ betaCode: `KSA-BETA-${String(i + 1).padStart(3, '0')}` }));
  assert.equal(canAcceptBetaParticipant(roster).ok, true);

  const participant = createBetaParticipant({ name: 'Maria Santos', city: 'Riyadh', phone: '+966500000000' }, roster);
  assert.equal(participant.betaCode, 'KSA-BETA-100');
  assert.equal(participant.country, 'Saudi Arabia');
  assert.equal(participant.status, 'Active beta tester');

  assert.equal(canAcceptBetaParticipant([...roster, participant]).ok, false);
});

test('crisis escalation for KSA gives immediate official contacts and operator SLA', () => {
  const escalation = buildCrisisEscalation({ country: 'KSA', city: 'Riyadh', issue: 'Employer took passport and locked me inside' });

  assert.equal(escalation.level, 'P1');
  assert.equal(escalation.operatorSlaMinutes, 15);
  assert.ok(escalation.immediateActions.some(action => action.includes('Saudi emergency')));
  assert.ok(escalation.contacts.some(contact => contact.label.includes('1343')));
  assert.ok(escalation.contacts.some(contact => contact.label.includes('Embassy')));
});

test('redacts sensitive case data before beta ops export', () => {
  const kase = createCaseFile({ name: 'Maria Santos', country: 'KSA', issue: 'Unpaid salary', employer: 'Private Employer', agency: 'Agency X' });
  const redacted = redactSensitiveCase({ ...kase, phone: '+966512345678', passport: 'P1234567' });

  assert.equal(redacted.name, 'M*** S***');
  assert.equal(redacted.phone, '+966******678');
  assert.equal(redacted.passport, '[redacted]');
  assert.equal(redacted.employer, '[redacted]');
});

test('ops export summarizes KSA beta roster, cases, redacted cases, and readiness checklist', () => {
  const roster = [createBetaParticipant({ name: 'Maria Santos', city: 'Riyadh', phone: '+966500000000' }, [])];
  const cases = [createCaseFile({ name: 'Maria Santos', country: 'KSA', issue: 'Employer took passport', employer: 'Private Employer' })];
  const exportData = createOpsExport({ roster, cases });

  assert.equal(exportData.country, 'Saudi Arabia');
  assert.equal(exportData.capacity.used, 1);
  assert.equal(exportData.capacity.limit, 100);
  assert.equal(exportData.cases[0].name, 'M*** S***');
  assert.ok(exportData.readiness.every(item => item.required));
});

test('readiness checklist identifies non-negotiables for live KSA beta', () => {
  const checklist = getBetaReadinessChecklist();

  assert.ok(checklist.some(item => item.id === 'verified-ksa-contacts' && item.required));
  assert.ok(checklist.some(item => item.id === 'consent-and-privacy' && item.required));
  assert.ok(checklist.some(item => item.id === 'operator-coverage' && item.required));
  assert.ok(checklist.some(item => item.id === 'sensitive-data-minimization' && item.required));
});
