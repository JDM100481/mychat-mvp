import { useMemo, useState } from 'react';
import {
  benefitPrograms,
  buildKabayanReply,
  countryGuides,
  createCaseFile,
  createBetaParticipant,
  createOpsExport,
  getBetaReadinessChecklist,
  getHotlines,
  searchProviders,
  splitRemittance,
  validateBetaConsent,
} from '../lib/kabayan';
import { IconSearch, IconPlus } from '../components/Icons';
import './Gene.css';

const MODULES = ['Beta', 'Chat', 'SOS', 'Cases', 'Docs', 'Benefits', 'Remit', 'Countries', 'Providers', 'Ops'];
const STARTERS = [
  'Help, my employer took my passport in Dubai',
  'My salary has not been paid for 3 months',
  'How do I renew OWWA membership?',
  'Send 15000 to Nanay',
  'Where is the Philippine embassy in Dubai?',
];
const REQUIRED_DOCS = [
  { name: 'Passport', stage: 'Before leaving', required: true },
  { name: 'Visa / work permit', stage: 'Before leaving', required: true },
  { name: 'Verified employment contract', stage: 'Before leaving', required: true },
  { name: 'OEC / OFW Clearance', stage: 'Before leaving', required: true },
  { name: 'OWWA membership proof', stage: 'Before leaving', required: false },
  { name: 'Payslips / wage records', stage: 'While abroad', required: true },
  { name: 'Remittance receipts', stage: 'While abroad', required: false },
  { name: 'Medical records / insurance', stage: 'While abroad', required: false },
];

function peso(value) {
  return `₱${Number(value || 0).toLocaleString('en-PH')}`;
}

function storageRead(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function storageWrite(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ChatMessage({ message }) {
  if (message.from === 'user') return <div className="kmsg user">{message.text}</div>;
  return (
    <div className="kmsg kabayan rich-reply">
      <div className="reply-title">{message.reply.title}</div>
      <p>{message.reply.body}</p>
      <ol>
        {message.reply.steps.map(step => <li key={step}>{step}</li>)}
      </ol>
      <div className="reply-mini">
        <b>{message.reply.concern.module}</b>
        <span>{message.reply.concern.urgency.toUpperCase()} urgency</span>
      </div>
    </div>
  );
}

export default function GeneScreen() {
  const [module, setModule] = useState('Beta');
  const [country, setCountry] = useState('Saudi Arabia');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(() => storageRead('mc_kabayan_messages', [
    {
      from: 'kabayan',
      reply: buildKabayanReply('hello', { country: 'Saudi Arabia' }),
    },
  ]));
  const [cases, setCases] = useState(() => storageRead('mc_kabayan_cases', []));
  const [docs, setDocs] = useState(() => storageRead('mc_kabayan_docs', REQUIRED_DOCS.map(doc => ({ ...doc, stored: false }))));
  const [salary, setSalary] = useState(100000);
  const [providerQuery, setProviderQuery] = useState('');
  const [caseDraft, setCaseDraft] = useState({ name: 'Maria Santos', country: 'KSA', issue: 'Employer took passport', employer: 'Private Employer', agency: 'Sample Agency', authorizedFamilyNotify: true });
  const [roster, setRoster] = useState(() => storageRead('mc_ksa_beta_roster', []));
  const [participantDraft, setParticipantDraft] = useState({ name: 'Maria Santos', city: 'Riyadh', phone: '+966****0000' });
  const [consent, setConsent] = useState(() => storageRead('mc_ksa_beta_consent', { privacy: false, emergencyBoundary: false, dataProcessing: false, familyNotify: false }));
  const [enrollError, setEnrollError] = useState('');

  const guide = countryGuides.find(item => item.country === country) || countryGuides[0];
  const split = useMemo(() => splitRemittance(salary), [salary]);
  const providers = useMemo(() => searchProviders(providerQuery), [providerQuery]);
  const storedDocs = docs.filter(doc => doc.stored).length;
  const latestCase = cases[0];
  const consentStatus = validateBetaConsent(consent);
  const readiness = getBetaReadinessChecklist();
  const opsExport = useMemo(() => createOpsExport({ roster, cases }), [roster, cases]);
  const betaRemaining = 100 - roster.length;

  const dashboard = [
    ['Country', 'KSA'],
    ['Beta seats', `${roster.length}/100`],
    ['P1 SLA', '15 min'],
    ['Ops mode', consentStatus.ok ? 'Live gate open' : 'Consent needed'],
  ];

  function persistMessages(next) {
    setMessages(next);
    storageWrite('mc_kabayan_messages', next);
  }

  function send(text = draft) {
    const clean = text.trim();
    if (!clean) return;
    const reply = buildKabayanReply(clean, { country });
    const next = [...messages, { from: 'user', text: clean }, { from: 'kabayan', reply }];
    persistMessages(next);
    setDraft('');
    setModule('Chat');
  }

  function submit(e) {
    e.preventDefault();
    send();
  }

  function createCaseFromDraft() {
    const nextCase = createCaseFile(caseDraft);
    const next = [nextCase, ...cases];
    setCases(next);
    storageWrite('mc_kabayan_cases', next);
    setModule('Cases');
  }

  function toggleDoc(name) {
    const next = docs.map(doc => doc.name === name ? { ...doc, stored: !doc.stored } : doc);
    setDocs(next);
    storageWrite('mc_kabayan_docs', next);
  }

  function toggleConsent(key) {
    const next = { ...consent, [key]: !consent[key] };
    setConsent(next);
    storageWrite('mc_ksa_beta_consent', next);
  }

  function enrollParticipant() {
    setEnrollError('');
    try {
      const participant = createBetaParticipant({ ...participantDraft, consent }, roster);
      const next = [...roster, participant];
      setRoster(next);
      storageWrite('mc_ksa_beta_roster', next);
    } catch (error) {
      setEnrollError(error.message);
    }
  }

  function copyOpsExport() {
    navigator.clipboard?.writeText(JSON.stringify(opsExport, null, 2));
  }

  return (
    <div className="gene-screen kabayan-screen">
      <header className="gene-hdr kabayan-hdr">
        <div>
          <div className="gene-title">myGENE <span>Kabayan</span></div>
          <div className="gene-sub">Actual OFW MVP inside myCHAT</div>
        </div>
        <div className="kabayan-avatar">🇵🇭</div>
      </header>

      <button className="gene-search kabayan-search" onClick={() => setModule('Chat')}>
        <div className="gs-row">
          <div className="gs-ico"><IconSearch /></div>
          <span>Ask: passport, salary, OWWA, remittance, embassy...</span>
        </div>
      </button>

      <div className="gene-pills">
        {MODULES.map(item => (
          <button key={item} className={`gpill ${module === item ? 'active' : ''}`} onClick={() => setModule(item)}>{item}</button>
        ))}
      </div>

      <main className={`gene-body kabayan-body ${module === 'Chat' ? 'with-compose' : 'without-compose'}`}>
        <section className="kabayan-card mvp-hero">
          <div>
            <div className="kicker">KSA live beta · first 100 OFWs</div>
            <h1>Saudi beta gate, SOS routing, consent and ops export.</h1>
            <p>Built for a controlled KSA live beta: 100-seat roster, consent/privacy gate, emergency boundary, human-operator SLA, KSA city guide, redacted ops export and daily runbook.</p>
          </div>
          <button className="sos-button" onClick={() => setModule('SOS')}>SOS</button>
        </section>

        <section className="dash-grid">
          {dashboard.map(([label, value]) => (
            <div className="dash-tile" key={label}><span>{label}</span><b>{value}</b></div>
          ))}
        </section>

        <section className="mvp-status">
          <div><b>{roster.length}/100</b><span>Beta OFWs</span></div>
          <div><b>{cases.length}</b><span>Cases</span></div>
          <div><b>{consentStatus.ok ? 'Ready' : betaRemaining}</b><span>{consentStatus.ok ? 'Consent' : 'Seats left'}</span></div>
        </section>

        {module === 'Beta' && (
          <section className="mvp-panel beta-panel">
            <div className="gene-sec">KSA Beta Launch Gate</div>
            <div className="beta-banner">
              <b>Controlled live beta for first 100 OFWs in Saudi Arabia</b>
              <span>Use only after official KSA contact verification and human operator coverage are confirmed.</span>
            </div>
            <div className="consent-list">
              {[
                ['privacy', 'I understand the privacy notice and what data is stored for the beta.'],
                ['emergencyBoundary', 'I understand myCHAT is not an emergency authority; immediate danger goes to Saudi emergency services first.'],
                ['dataProcessing', 'I consent to processing my beta profile, cases and support notes for this pilot.'],
                ['familyNotify', 'I choose whether family notification may be prepared for case follow-up.'],
              ].map(([key, label]) => (
                <label className="check-line consent-row" key={key}>
                  <input type="checkbox" checked={consent[key]} onChange={() => toggleConsent(key)} />
                  {label}
                </label>
              ))}
            </div>
            {!consentStatus.ok && <div className="case-route">Missing consent: <b>{consentStatus.missing.join(', ')}</b></div>}
            <div className="kabayan-card form-card">
              <h3>Enroll beta OFW</h3>
              <input value={participantDraft.name} onChange={e => setParticipantDraft(d => ({ ...d, name: e.target.value }))} placeholder="OFW name" />
              <div className="form-two">
                <input value={participantDraft.city} onChange={e => setParticipantDraft(d => ({ ...d, city: e.target.value }))} placeholder="KSA city" />
                <input value={participantDraft.phone} onChange={e => setParticipantDraft(d => ({ ...d, phone: e.target.value }))} placeholder="Safe callback / masked phone" />
              </div>
              {enrollError && <div className="case-ok danger">{enrollError}</div>}
              <button className="full-primary" onClick={enrollParticipant} disabled={!consentStatus.ok || roster.length >= 100}>Enroll slot {roster.length + 1}/100</button>
            </div>
            <div className="roster-list">
              {roster.slice(-5).reverse().map(person => (
                <div className="provider-row" key={person.betaCode}>
                  <b>{person.betaCode}</b><span>{person.city} · {person.status}</span><small>{person.name}</small>
                </div>
              ))}
            </div>
          </section>
        )}

        {module === 'Chat' && (
          <section className="mvp-panel chat-panel">
            <div className="gene-sec">OFW Help Chatbot</div>
            <div className="chat-stack">
              {messages.map((message, index) => <ChatMessage key={index} message={message} />)}
            </div>
            <div className="starter-row">
              {STARTERS.map(starter => <button key={starter} onClick={() => send(starter)}>{starter}</button>)}
            </div>
          </section>
        )}

        {module === 'SOS' && (
          <section className="mvp-panel">
            <div className="gene-sec">Emergency Contact Directory</div>
            <div className="contact-list">
              {getHotlines().map(contact => (
                <div key={contact.label} className="contact-row redline">
                  <span>{contact.label}<small>{contact.category}</small></span>
                  <b>{contact.value}</b>
                </div>
              ))}
            </div>
            <div className="kabayan-card form-card">
              <h3>Create emergency case file</h3>
              <input value={caseDraft.name} onChange={e => setCaseDraft(d => ({ ...d, name: e.target.value }))} placeholder="OFW name" />
              <input value={caseDraft.country} onChange={e => setCaseDraft(d => ({ ...d, country: e.target.value }))} placeholder="Country" />
              <textarea value={caseDraft.issue} onChange={e => setCaseDraft(d => ({ ...d, issue: e.target.value }))} placeholder="Issue summary" />
              <div className="form-two">
                <input value={caseDraft.employer} onChange={e => setCaseDraft(d => ({ ...d, employer: e.target.value }))} placeholder="Employer" />
                <input value={caseDraft.agency} onChange={e => setCaseDraft(d => ({ ...d, agency: e.target.value }))} placeholder="Agency" />
              </div>
              <label className="check-line"><input type="checkbox" checked={caseDraft.authorizedFamilyNotify} onChange={e => setCaseDraft(d => ({ ...d, authorizedFamilyNotify: e.target.checked }))} /> Family notification authorized</label>
              <button className="full-primary" onClick={createCaseFromDraft}>Create case file</button>
            </div>
          </section>
        )}

        {module === 'Cases' && (
          <section className="mvp-panel">
            <div className="gene-sec">Family Case Tracker</div>
            {!latestCase && <div className="empty-card">No case yet. Use SOS to create one.</div>}
            {cases.map(kase => (
              <article className="case-card" key={kase.id}>
                <div className="case-top"><b>{kase.id}</b><span>{kase.status}</span></div>
                <h3>{kase.issue}</h3>
                <p>{kase.name} · {kase.country} · {kase.module} · {kase.urgency} urgency</p>
                <div className="case-route">Next referral: <b>{kase.nextReferral}</b></div>
                <ul>{kase.evidence.map(item => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </section>
        )}

        {module === 'Docs' && (
          <section className="mvp-panel">
            <div className="gene-sec">myDocs Vault</div>
            <div className="doc-progress"><span style={{ width: `${(storedDocs / docs.length) * 100}%` }} /></div>
            <div className="doc-list">
              {docs.map(doc => (
                <button className={`doc-row ${doc.stored ? 'stored' : ''}`} key={doc.name} onClick={() => toggleDoc(doc.name)}>
                  <span>{doc.stored ? '✓' : '+'}</span>
                  <b>{doc.name}</b>
                  <small>{doc.stage}{doc.required ? ' · required' : ' · optional'}</small>
                </button>
              ))}
            </div>
          </section>
        )}

        {module === 'Benefits' && (
          <section className="mvp-panel">
            <div className="gene-sec">Benefits Navigator</div>
            <div className="info-stack">
              {benefitPrograms.map(program => (
                <div className="info-card" key={`${program.agency}-${program.name}`}>
                  <b>{program.agency} · {program.name}</b>
                  <span>{program.use}</span>
                  <small>{program.eligibility}</small>
                </div>
              ))}
            </div>
          </section>
        )}

        {module === 'Remit' && (
          <section className="mvp-panel">
            <div className="gene-sec">Remittance Tracker</div>
            <div className="kabayan-card remit-card">
              <h3>50-30-20 family command center</h3>
              <label><span>Monthly salary / remittance pool</span><b>{peso(salary)}</b><input type="range" min="0" max="250000" step="5000" value={salary} onChange={e => setSalary(Number(e.target.value))} /></label>
              <div className="split-grid">
                <div><span>Family support</span><b>{peso(split.familySupport)}</b></div>
                <div><span>Savings</span><b>{peso(split.savingsInvestments)}</b></div>
                <div><span>Personal</span><b>{peso(split.personalExpenses)}</b></div>
              </div>
              <div className="fund-list">
                {Object.entries(split.funds).map(([name, value]) => <div key={name}><span>{name}</span><b>{peso(value)}</b></div>)}
              </div>
            </div>
          </section>
        )}

        {module === 'Countries' && (
          <section className="mvp-panel">
            <div className="gene-sec">Country Guide Pages</div>
            <div className="country-tabs">
              {countryGuides.map(item => <button className={country === item.country ? 'active' : ''} key={item.country} onClick={() => setCountry(item.country)}>{item.flag} {item.country}</button>)}
            </div>
            <article className="country-detail">
              <h3>{guide.flag} {guide.country}</h3>
              <b>{guide.localEmergency}</b>
              {guide.posts.map(post => <p key={post}>{post}</p>)}
              <ul>{guide.tips.map(tip => <li key={tip}>{tip}</li>)}</ul>
            </article>
          </section>
        )}

        {module === 'Providers' && (
          <section className="mvp-panel">
            <div className="gene-sec">Service Provider Directory</div>
            <input className="provider-search" value={providerQuery} onChange={e => setProviderQuery(e.target.value)} placeholder="Search remittance, cargo, government..." />
            <div className="provider-list">
              {providers.map(provider => (
                <div className="provider-row" key={`${provider.category}-${provider.name}`}>
                  <b>{provider.name}</b><span>{provider.category} · {provider.status}</span><small>{provider.use}</small>
                </div>
              ))}
            </div>
          </section>
        )}

        {module === 'Ops' && (
          <section className="mvp-panel ops-panel">
            <div className="gene-sec">KSA Beta Ops Dashboard</div>
            <div className="split-grid">
              <div><span>Roster</span><b>{opsExport.capacity.used}/{opsExport.capacity.limit}</b></div>
              <div><span>Cases</span><b>{opsExport.cases.length}</b></div>
              <div><span>Remaining</span><b>{opsExport.capacity.remaining}</b></div>
            </div>
            <div className="checklist-list">
              {readiness.map(item => (
                <div className="provider-row" key={item.id}>
                  <b>{item.required ? 'Required' : 'Optional'} · {item.label}</b>
                  <span>{item.owner} · {item.status}</span>
                </div>
              ))}
            </div>
            <button className="full-primary" onClick={copyOpsExport}>Copy redacted ops export JSON</button>
            <pre className="ops-json">{JSON.stringify(opsExport, null, 2).slice(0, 1200)}...</pre>
          </section>
        )}
      </main>

      {module === 'Chat' && (
        <form className="kabayan-compose" onSubmit={submit}>
          <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Message Kabayan..." />
          <button aria-label="Send"><IconPlus size={18} /></button>
        </form>
      )}
    </div>
  );
}
