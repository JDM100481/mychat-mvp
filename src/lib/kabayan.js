const HOTLINES = [
  { label: 'OWWA 24/7 Hotline', value: '1348', category: 'Welfare / repatriation / crisis' },
  { label: 'DMW Central Office', value: '(02) 8722-1144 / 8722-1155', category: 'Labor dispute / deployment / illegal recruitment' },
  { label: 'DMW Assistance Email', value: 'repat@dmw.gov.ph · connect@dmw.gov.ph', category: 'Repatriation / assistance' },
  { label: '1343 Actionline', value: '1343', category: 'Human trafficking / illegal recruitment' },
];

const BETA_LIMIT = 100;
const CASE_COUNTER_KEY = 'mc_kabayan_case_counter';

export const countryGuides = [
  {
    country: 'UAE',
    flag: '🇦🇪',
    localEmergency: '999 Police · 998 Ambulance · 997 Fire',
    posts: ['Philippine Embassy Abu Dhabi', 'Philippine Consulate General Dubai', 'MWO Dubai / Abu Dhabi'],
    tips: ['Keep passport copy in phone and myDocs', 'Save employer trade license details', 'Use official remittance channels'],
  },
  {
    country: 'Saudi Arabia',
    aliases: ['KSA', 'Saudi', 'Kingdom of Saudi Arabia', 'Riyadh', 'Jeddah', 'Al Khobar'],
    flag: '🇸🇦',
    betaStatus: 'pilot-ready-pending-official-verification',
    officialVerificationRequired: true,
    localEmergency: '999 Police · 997 Ambulance · 998 Fire · 937 Health hotline',
    posts: ['Philippine Embassy Riyadh', 'Philippine Consulate General Jeddah', 'MWO Riyadh / Jeddah / Al Khobar'],
    cityPosts: {
      Riyadh: ['Philippine Embassy Riyadh', 'MWO Riyadh'],
      Jeddah: ['Philippine Consulate General Jeddah', 'MWO Jeddah'],
      'Al Khobar': ['MWO Al Khobar / Eastern Province referral'],
    },
    tips: ['Know worksite and iqama details', 'Document contract substitutions', 'Save embassy and MWO city-specific hotlines', 'For immediate danger, contact Saudi emergency services first, then Embassy/MWO/OWWA/1343.'],
  },
  {
    country: 'Hong Kong',
    flag: '🇭🇰',
    localEmergency: '999 Emergency',
    posts: ['Philippine Consulate General Hong Kong', 'MWO Hong Kong'],
    tips: ['Track rest days and wage payments', 'Keep signed receipts', 'Save agency and employer address'],
  },
  {
    country: 'Singapore',
    flag: '🇸🇬',
    localEmergency: '999 Police · 995 Ambulance/Fire',
    posts: ['Philippine Embassy Singapore', 'MWO Singapore'],
    tips: ['Save work permit details', 'Know MOM and embassy reporting channels', 'Keep digital copies of salary records'],
  },
];

export const benefitPrograms = [
  { agency: 'OWWA', name: 'Welfare Assistance', use: 'Crisis response, family support, repatriation, education and social benefits.', eligibility: 'Active/qualified OWWA member or family dependent depending on benefit.' },
  { agency: 'DMW', name: 'AKSYON Fund', use: 'Legal, medical, financial, repatriation and emergency help for distressed OFWs.', eligibility: 'Distressed OFWs subject to DMW assessment and documentation.' },
  { agency: 'NRCO', name: 'Reintegration Services', use: 'Counseling, job search, skills training and enterprise development.', eligibility: 'Returning OFWs and families preparing reintegration.' },
  { agency: 'OWWA', name: 'Scholarships & Training', use: 'Dependent scholarships, skills upgrading and education support.', eligibility: 'OWWA member/dependent requirements vary by program.' },
];

export const serviceProviders = [
  { name: 'MannyPay', category: 'Remittance', use: 'Send money, verify recipients, family wallet and goals', status: 'Partner-ready' },
  { name: 'GCash', category: 'Remittance', use: 'Philippines wallet cash-in and family support', status: 'Directory' },
  { name: 'Maya', category: 'Remittance', use: 'Wallet, bills and family payments', status: 'Directory' },
  { name: 'Wise', category: 'Remittance', use: 'International transfers and exchange-rate comparison', status: 'Directory' },
  { name: 'Imerex', category: 'Cargo', use: 'Balikbayan box booking, pickup and tracking', status: 'Partner-ready' },
  { name: 'OWWA', category: 'Government', use: 'Benefits, welfare, repatriation and membership guidance', status: 'Official link' },
  { name: 'DMW', category: 'Government', use: 'Recruitment verification, labor cases, deployment and AKSYON support', status: 'Official link' },
  { name: 'Embassy / MWO', category: 'Government', use: 'Country-specific emergency, shelter and labor assistance', status: 'Official link' },
  { name: 'Mental Health Support', category: 'Wellness', use: 'Counselor directory, crisis support and community referral', status: 'Directory' },
];

function includesAny(text, words) {
  return words.some(word => text.includes(word));
}

export function classifyConcern(input = '') {
  const text = input.toLowerCase();
  const result = {
    module: 'myCHAT',
    urgency: 'normal',
    risk: 'general_guidance',
    route: ['Kabayan Guide Agent'],
    evidence: ['Passport/visa copy', 'Verified contract', 'Employer/agency details'],
  };

  if (includesAny(text, ['passport', 'abuse', 'threat', 'threaten', 'traffick', 'forced', 'locked', 'detained', 'detention', 'harass', 'help', 'sos', 'confiscat'])) {
    return {
      ...result,
      module: 'mySOS',
      urgency: 'high',
      risk: 'trafficking_or_abuse',
      route: ['Kabayan SOS Agent', 'Embassy/MWO', 'OWWA', '1343 Actionline'],
      evidence: ['Passport/visa copy', 'Employment contract', 'Chats/photos/audio', 'Last known location', 'Employer and agency details'],
    };
  }

  if (includesAny(text, ['salary', 'unpaid', 'wage', 'contract', 'deduction', 'overtime'])) {
    return {
      ...result,
      module: 'myWork',
      urgency: 'medium',
      risk: 'labor_dispute',
      route: ['Kabayan Legal Agent', 'DMW', 'MWO/Embassy'],
      evidence: ['Payslips', 'Verified contract', 'Attendance records', 'Employer messages', 'Remittance records'],
    };
  }

  if (includesAny(text, ['owwa', 'benefit', 'scholar', 'aksyon', 'livelihood', 'reintegrat'])) {
    return { ...result, module: 'myBenefits', risk: 'benefits_navigation', route: ['Kabayan Guide Agent', 'OWWA', 'DMW', 'NRCO'] };
  }

  if (includesAny(text, ['send', 'remit', 'padala', 'money', 'budget', 'save', 'fund'])) {
    return { ...result, module: 'myRemit', risk: 'family_finance', route: ['Kabayan Finance Agent', 'MannyPay'] };
  }

  if (includesAny(text, ['embassy', 'country', 'dubai', 'riyadh', 'jeddah', 'al khobar', 'hong kong', 'singapore', 'uae', 'ksa', 'saudi'])) {
    return { ...result, module: 'Country Guides', risk: 'country_lookup', route: ['Kabayan Guide Agent', 'Embassy/MWO directory'] };
  }

  if (includesAny(text, ['document', 'passport copy', 'oec', 'visa', 'receipt', 'vault'])) {
    return { ...result, module: 'myDocs', risk: 'records_management', route: ['Kabayan Guide Agent', 'myDocs Vault'] };
  }

  return result;
}

export function getCountryGuide(country = 'UAE') {
  const normalized = country.toLowerCase();
  return countryGuides.find(guide => {
    const names = [guide.country, ...(guide.aliases || [])].map(name => name.toLowerCase());
    return names.some(name => normalized === name || normalized.includes(name));
  }) || countryGuides[0];
}

export function getHotlines() {
  return HOTLINES;
}

export function buildKabayanReply(input, context = {}) {
  const concern = classifyConcern(input);
  const guide = getCountryGuide(context.country || input);

  if (concern.module === 'mySOS') {
    return {
      title: 'Urgent safety help',
      body: 'This can be a safety or trafficking risk. Move to a safe place if possible. If there is immediate danger, contact Saudi emergency services first, then OWWA/DMW/Embassy/MWO or 1343.',
      steps: ['Confirm your current city and safe callback number.', 'Save or upload passport, contract, chat screenshots, photos and last location.', 'Escalate to Embassy/MWO + OWWA 1348; use 1343 if trafficking indicators exist.', 'Notify family only if you authorize it.'],
      contacts: HOTLINES,
      evidence: concern.evidence,
      guide,
      concern,
    };
  }

  if (concern.module === 'myWork') {
    return {
      title: 'Salary or contract complaint',
      body: 'We can prepare a DMW/MWO complaint file and follow-up tracker for unpaid salary, deductions, substitution or contract abuse.',
      steps: ['Record unpaid months and promised salary.', 'Upload contract, payslips, time records and employer messages.', 'Route to DMW/MWO and schedule follow-up date.', 'Keep family informed through the case tracker.'],
      contacts: HOTLINES.filter(contact => contact.label.includes('DMW') || contact.label.includes('OWWA')),
      evidence: concern.evidence,
      guide,
      concern,
    };
  }

  if (concern.module === 'myRemit') {
    return {
      title: 'Family finance command center',
      body: 'Use 50-30-20 as a starting point: family support, savings/investments, and personal expenses, then split savings into five OFW funds.',
      steps: ['Enter monthly salary/remittance amount.', 'Verify recipient and purpose.', 'Save recurring family, tuition, medical and debt obligations.', 'Track emergency, education, medical, retirement and reintegration funds.'],
      contacts: serviceProviders.filter(provider => provider.category === 'Remittance'),
      evidence: ['Recipient name', 'Amount', 'Purpose', 'Receipt/reference number'],
      guide,
      concern,
    };
  }

  if (concern.module === 'myBenefits') {
    return {
      title: 'Benefits navigator',
      body: 'I can match your situation to OWWA, DMW AKSYON, NRCO, scholarships, repatriation or livelihood programs.',
      steps: ['Choose current status: before deployment, abroad, distressed, returning, or family dependent.', 'Confirm OWWA membership and deployment records.', 'Prepare IDs, contract, proof of issue and dependent documents.', 'Save program checklist and follow-up reminder.'],
      contacts: benefitPrograms,
      evidence: ['OWWA membership proof', 'OFW IDs', 'Contract', 'Proof of need/incident'],
      guide,
      concern,
    };
  }

  return {
    title: 'Kabayan guide',
    body: 'Tell me your country and concern. I can help with SOS, legal recruitment, documents, benefits, remittance, country guides, providers and return-home planning.',
    steps: ['Pick a module or type naturally.', 'Kabayan classifies urgency and routes the case.', 'Save documents, contacts and follow-ups in one record.'],
    contacts: HOTLINES,
    evidence: concern.evidence,
    guide,
    concern,
  };
}

function nextCaseNumber() {
  if (typeof localStorage === 'undefined') return 1;
  const next = Number(localStorage.getItem(CASE_COUNTER_KEY) || '0') + 1;
  localStorage.setItem(CASE_COUNTER_KEY, String(next));
  return next;
}

export function createCaseFile({ name = 'OFW User', country = 'UAE', issue = 'General assistance', employer = '', agency = '', authorizedFamilyNotify = false } = {}) {
  const guide = getCountryGuide(country);
  const concern = classifyConcern(issue);
  const number = String(nextCaseNumber()).padStart(4, '0');
  const code = guide.country === 'Saudi Arabia' ? 'KSA' : guide.country.replace(/[^A-Z]/gi, '').slice(0, 3).toUpperCase();
  const now = new Date();
  const followUp = new Date(now.getTime() + 1000 * 60 * 60 * 24);

  let nextReferral = 'DMW / OWWA help desk';
  if (concern.module === 'mySOS') nextReferral = 'Embassy/MWO + OWWA + 1343';
  if (concern.module === 'myWork') nextReferral = 'DMW + MWO labor desk';
  if (concern.module === 'myBenefits') nextReferral = 'OWWA / DMW / NRCO';

  return {
    id: `OFW-${code}-${number}`,
    createdAt: now.toISOString(),
    status: 'Open',
    name,
    country: guide.country,
    issue,
    employer,
    agency,
    module: concern.module,
    urgency: concern.urgency,
    nextReferral,
    evidence: concern.evidence,
    familyNotification: authorizedFamilyNotify ? 'Ready to send' : 'Not authorized',
    followUps: [{ label: 'First follow-up', dueAt: followUp.toISOString(), owner: 'Kabayan Case Tracker' }],
  };
}

export function splitRemittance(amount) {
  const value = Math.max(0, Number(amount) || 0);
  const familySupport = Math.round(value * 0.5);
  const savingsInvestments = Math.round(value * 0.3);
  const personalExpenses = value - familySupport - savingsInvestments;
  return {
    familySupport,
    savingsInvestments,
    personalExpenses,
    funds: {
      emergency: Math.round(savingsInvestments * 0.3333333333),
      reintegration: Math.round(savingsInvestments * 0.2666666667),
      retirement: Math.round(savingsInvestments * 0.2),
      education: Math.round(savingsInvestments * 0.1333333333),
      medical: savingsInvestments - Math.round(savingsInvestments * 0.3333333333) - Math.round(savingsInvestments * 0.2666666667) - Math.round(savingsInvestments * 0.2) - Math.round(savingsInvestments * 0.1333333333),
    },
  };
}

export function searchProviders(query = '') {
  const q = query.toLowerCase();
  if (!q) return serviceProviders;
  return serviceProviders.filter(provider =>
    provider.category.toLowerCase().includes(q) ||
    provider.name.toLowerCase().includes(q) ||
    provider.use.toLowerCase().includes(q)
  );
}

export function getBetaReadinessChecklist() {
  return [
    { id: 'verified-ksa-contacts', label: 'KSA Embassy/MWO/hotline directory verified before launch day', required: true, owner: 'Ops lead', status: 'ready-for-verification' },
    { id: 'consent-and-privacy', label: 'Consent, privacy notice, emergency boundary and family-notification choice shown before enrollment', required: true, owner: 'Product', status: 'implemented' },
    { id: 'operator-coverage', label: 'Named human operator coverage for first 100 OFWs with P1 response target', required: true, owner: 'Ops lead', status: 'requires staffing' },
    { id: 'sensitive-data-minimization', label: 'Case export redacts passport, employer, agency and phone details by default', required: true, owner: 'Engineering', status: 'implemented' },
    { id: 'capacity-gate', label: 'KSA beta roster capped at first 100 OFWs', required: true, owner: 'Product', status: 'implemented' },
    { id: 'manual-escalation-runbook', label: 'Manual escalation and daily review runbook available to operators', required: true, owner: 'Ops lead', status: 'documented' },
  ];
}

export function validateBetaConsent(consent = {}) {
  const required = ['privacy', 'emergencyBoundary', 'dataProcessing', 'familyNotify'];
  const missing = required.filter(key => consent[key] !== true);
  return { ok: missing.length === 0, missing };
}

export function canAcceptBetaParticipant(roster = []) {
  const used = roster.length;
  return {
    ok: used < BETA_LIMIT,
    used,
    remaining: Math.max(0, BETA_LIMIT - used),
    limit: BETA_LIMIT,
    reason: used >= BETA_LIMIT ? 'KSA beta is capped at the first 100 OFWs.' : null,
  };
}

export function createBetaParticipant({ name = 'OFW Beta Tester', city = 'Riyadh', phone = '', consent = { privacy: true, emergencyBoundary: true, dataProcessing: true, familyNotify: true } } = {}, roster = []) {
  const capacity = canAcceptBetaParticipant(roster);
  if (!capacity.ok) throw new Error(capacity.reason);
  const consentStatus = validateBetaConsent(consent);
  if (!consentStatus.ok) throw new Error(`Missing beta consent: ${consentStatus.missing.join(', ')}`);
  const slot = String(roster.length + 1).padStart(3, '0');
  return {
    betaCode: `KSA-BETA-${slot}`,
    name,
    city,
    phone,
    country: 'Saudi Arabia',
    status: 'Active beta tester',
    enrolledAt: new Date().toISOString(),
    consent: { ...consent, acceptedAt: new Date().toISOString(), version: 'ksa-beta-v1' },
  };
}

function maskName(name = '') {
  return name.split(/\s+/).filter(Boolean).map(part => `${part[0] || ''}***`).join(' ') || '[redacted]';
}

function maskPhone(phone = '') {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  const last = digits.slice(-3);
  const prefix = phone.trim().startsWith('+966') ? '+966' : '+***';
  return `${prefix}******${last}`;
}

export function redactSensitiveCase(kase = {}) {
  return {
    ...kase,
    name: maskName(kase.name),
    phone: maskPhone(kase.phone),
    passport: kase.passport ? '[redacted]' : kase.passport,
    employer: kase.employer ? '[redacted]' : kase.employer,
    agency: kase.agency ? '[redacted]' : kase.agency,
  };
}

export function buildCrisisEscalation({ country = 'KSA', city = 'Riyadh', issue = '' } = {}) {
  const guide = getCountryGuide(country);
  const concern = classifyConcern(issue);
  const cityPosts = guide.cityPosts?.[city] || guide.posts || [];
  const p1 = concern.urgency === 'high';
  return {
    level: p1 ? 'P1' : 'P2',
    country: guide.country,
    city,
    operatorSlaMinutes: p1 ? 15 : 240,
    immediateActions: [
      'If there is immediate danger, contact Saudi emergency services now: 999 Police / 997 Ambulance / 998 Fire.',
      'Move to a safe public location if possible and keep phone charged.',
      'Preserve evidence: passport copy, contract, chats/photos/audio, last known location.',
      'Escalate to Embassy/MWO, OWWA 1348, DMW and 1343 for trafficking indicators.',
    ],
    contacts: [
      { label: 'Saudi emergency services', value: guide.localEmergency, category: 'Immediate danger' },
      ...cityPosts.map(post => ({ label: post, value: 'Verify official hotline before live launch', category: 'KSA post' })),
      ...HOTLINES,
    ],
    concern,
  };
}

export function createOpsExport({ roster = [], cases = [] } = {}) {
  return {
    generatedAt: new Date().toISOString(),
    country: 'Saudi Arabia',
    capacity: { used: roster.length, limit: BETA_LIMIT, remaining: Math.max(0, BETA_LIMIT - roster.length) },
    roster: roster.map(participant => ({ betaCode: participant.betaCode, city: participant.city, status: participant.status, enrolledAt: participant.enrolledAt })),
    cases: cases.map(redactSensitiveCase),
    readiness: getBetaReadinessChecklist(),
  };
}
