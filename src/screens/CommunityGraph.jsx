import { useState } from 'react';
import { useStore } from '../store/useStore';
import { IconBack } from '../components/Icons';
import TrustModal from '../components/TrustModal';
import './CommunityGraph.css';

const CX = 158, CY = 132;

const FILTERS = ['All', 'Verified', 'Trusted', 'Unverified', 'My Circles'];

const CLUSTERS = [
  {
    id: 'family',
    label: 'Family',
    status: 'Confirmed',
    color: '#34C759', bg: '#e9f9ee',
    cx: 112, cy: 65,
    labelX: 112, labelY: 49, anchor: 'middle',
    dots: [{ x:109,y:63 },{ x:116,y:59 },{ x:107,y:69 },{ x:118,y:67 },{ x:113,y:73 }],
    detail: { name: 'Maria S.', role: 'Family member', since: 'Jan 2024', mutual: 3 },
  },
  {
    id: 'business',
    label: 'Business',
    status: 'Pending',
    color: '#FF9500', bg: '#fff4e5',
    cx: 236, cy: 96,
    labelX: 254, labelY: 91, anchor: 'start',
    dots: [{ x:233,y:93 },{ x:239,y:99 },{ x:232,y:102 },{ x:241,y:90 }],
    detail: { name: 'Jun R.', role: 'Business contact', since: 'Mar 2024', mutual: 1 },
  },
  {
    id: 'barangay',
    label: 'Barangay',
    status: 'Circle Verified',
    color: '#1877F2', bg: '#e8f0fd',
    cx: 178, cy: 210,
    labelX: 178, labelY: 225, anchor: 'middle',
    dots: [{ x:174,y:207 },{ x:181,y:213 },{ x:176,y:202 },{ x:183,y:209 },{ x:178,y:215 }],
    detail: { name: 'Brgy. San Jose', role: 'Community circle', since: 'Feb 2024', mutual: 8 },
  },
  {
    id: 'mygene',
    label: 'myGENE',
    status: 'Personal Record',
    color: '#AF52DE', bg: '#f7effe',
    cx: 58, cy: 150,
    labelX: 40, labelY: 145, anchor: 'end',
    dots: [{ x:54,y:147 },{ x:61,y:153 },{ x:56,y:158 },{ x:63,y:143 }],
    detail: { name: 'Personal Vault', role: 'Identity record', since: 'May 2024', mutual: null },
  },
  {
    id: 'unverified',
    label: 'Unverified',
    status: 'Unverified',
    color: '#8E8E93', bg: '#F2F2F7',
    cx: 245, cy: 185,
    labelX: 262, labelY: 180, anchor: 'start',
    dots: [{ x:242,y:182 },{ x:248,y:188 },{ x:241,y:191 }],
    detail: { name: 'New Contact', role: 'Not yet verified', since: null, mutual: 0 },
  },
];

const AMBIENT = [
  { x:34,y:42 },{ x:290,y:48 },{ x:305,y:140 },{ x:25,y:190 },
  { x:148,y:22 },{ x:208,y:15 },{ x:292,y:72 },{ x:308,y:178 },
  { x:100,y:248 },{ x:32,y:110 },{ x:310,y:112 },{ x:190,y:258 },
  { x:46,y:68 },{ x:270,y:168 },{ x:130,y:248 },{ x:280,y:245 },
  { x:20,y:240 },{ x:158,y:258 },
];

function clusterOpacity(cluster, filter) {
  if (filter === 'All') return 1;
  if (filter === 'Verified') return ['Confirmed', 'Circle Verified', 'Personal Record'].includes(cluster.status) ? 1 : 0.15;
  if (filter === 'Trusted')  return ['Confirmed', 'Pending'].includes(cluster.status) ? 1 : 0.15;
  if (filter === 'Unverified') return cluster.status === 'Unverified' ? 1 : 0.15;
  if (filter === 'My Circles') return cluster.status === 'Circle Verified' ? 1 : 0.15;
  return 1;
}

export default function CommunityGraphScreen() {
  const { goBack, userId } = useStore();
  const [filter, setFilter] = useState('All');
  const [activeCluster, setActiveCluster] = useState(null);
  const [sheetOut, setSheetOut] = useState(false);
  const [showLines, setShowLines] = useState(false);
  const [trustOpen, setTrustOpen] = useState(false);

  const uid = userId || '';
  const initial = uid.split(':')[0].replace('@', '')[0]?.toUpperCase() || 'M';

  function openSheet(cluster) {
    setSheetOut(false);
    setActiveCluster(cluster);
  }

  function closeSheet() {
    setSheetOut(true);
    setTimeout(() => setActiveCluster(null), 230);
  }

  const listClusters = filter === 'All'
    ? CLUSTERS
    : CLUSTERS.filter(c => clusterOpacity(c, filter) === 1);

  return (
    <div className="cg-screen">

      {/* Header */}
      <div className="cg-hdr">
        <button className="cg-back" onClick={goBack}><IconBack /></button>
        <span className="cg-title">Community Graph</span>
      </div>

      {/* Filters */}
      <div className="cg-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`cg-pill${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="cg-body">

        {/* Map card */}
        <div className="cg-map-card">
          <svg viewBox="0 0 320 270" className="cg-svg">

            {/* Ambient dots */}
            {AMBIENT.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r="1.5" fill="var(--t4)" opacity="0.45" />
            ))}

            {/* Connection lines — toggled */}
            {showLines && CLUSTERS.map(c => (
              <line
                key={c.id}
                x1={CX} y1={CY} x2={c.cx} y2={c.cy}
                stroke={c.color}
                strokeWidth="0.8"
                strokeDasharray="3 4"
                opacity={clusterOpacity(c, filter) * 0.5}
              />
            ))}

            {/* Clusters */}
            {CLUSTERS.map(c => (
              <g key={c.id} style={{ opacity: clusterOpacity(c, filter), transition: 'opacity .2s' }}>
                {/* Dots */}
                {c.dots.map((d, i) => (
                  <circle key={i} cx={d.x} cy={d.y} r="2" fill={c.color} />
                ))}
                {/* Label */}
                <text
                  x={c.labelX} y={c.labelY}
                  textAnchor={c.anchor}
                  fontSize="9.5" fontWeight="700"
                  fill={c.color}
                  fontFamily="DM Sans, -apple-system, sans-serif"
                  letterSpacing="0.2"
                >
                  {c.label}
                </text>
                {/* Invisible tap target */}
                <circle
                  cx={c.cx} cy={c.cy} r="20"
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onClick={() => openSheet(c)}
                />
              </g>
            ))}

            {/* Center glow */}
            <circle cx={CX} cy={CY} r="14" fill="#1877F2" opacity="0.08" />
            <circle cx={CX} cy={CY} r="9"  fill="#1877F2" opacity="0.12" />
            <circle cx={CX} cy={CY} r="5"  fill="#1877F2" />
            <text
              x={CX} y={CY + 18}
              textAnchor="middle"
              fontSize="9" fontWeight="600"
              fill="var(--t3)"
              fontFamily="DM Sans, -apple-system, sans-serif"
            >
              {initial}
            </text>
          </svg>

          {/* Show Connections toggle */}
          <button
            className={`cg-show-btn${showLines ? ' active' : ''}`}
            onClick={() => setShowLines(v => !v)}
          >
            {showLines ? 'Hide Connections' : 'Show Connections'}
          </button>
        </div>

        {/* Explanation */}
        <p className="cg-explain">
          Your Community Graph helps myCHAT verify identity through real relationships, not only documents.
        </p>

        {/* Connection list */}
        <div className="cg-list">
          {listClusters.length === 0 ? (
            <div className="cg-empty">No connections in this category.</div>
          ) : listClusters.map((c, i) => (
            <button
              key={c.id}
              className={`cg-row${i < listClusters.length - 1 ? ' cg-row-border' : ''}`}
              onClick={() => openSheet(c)}
            >
              <div className="cg-row-left">
                <span className="cg-dot" style={{ background: c.color }} />
                <span className="cg-row-label">{c.label}</span>
              </div>
              <span className="cg-badge" style={{ background: c.bg, color: c.color }}>
                {c.status}
              </span>
            </button>
          ))}
        </div>

        {/* CTA */}
        <button className="cg-cta" onClick={() => setTrustOpen(true)}>
          Send Trust Request
        </button>

      </div>

      {/* Connection detail bottom sheet */}
      {activeCluster && (
        <div
          className={`cg-ov${sheetOut ? ' out' : ''}`}
          onClick={e => e.target === e.currentTarget && closeSheet()}
        >
          <div className={`cg-sheet${sheetOut ? ' out' : ''}`}>
            <div className="cg-sheet-handle" />

            <div className="cg-sheet-head">
              <div className="cg-sheet-av" style={{ background: activeCluster.bg, color: activeCluster.color }}>
                {activeCluster.label[0]}
              </div>
              <div className="cg-sheet-info">
                <div className="cg-sheet-name">{activeCluster.detail.name}</div>
                <div className="cg-sheet-role">{activeCluster.detail.role}</div>
              </div>
              <span className="cg-sheet-badge" style={{ background: activeCluster.bg, color: activeCluster.color }}>
                {activeCluster.status}
              </span>
            </div>

            <div className="cg-sheet-rows">
              <div className="cg-sheet-row">
                <span className="cg-sheet-key">Relationship</span>
                <span className="cg-sheet-val">{activeCluster.label}</span>
              </div>
              {activeCluster.detail.since && (
                <div className="cg-sheet-row">
                  <span className="cg-sheet-key">Connected since</span>
                  <span className="cg-sheet-val">{activeCluster.detail.since}</span>
                </div>
              )}
              {activeCluster.detail.mutual !== null && (
                <div className="cg-sheet-row">
                  <span className="cg-sheet-key">Mutual connections</span>
                  <span className="cg-sheet-val">{activeCluster.detail.mutual}</span>
                </div>
              )}
            </div>

            <div className="cg-sheet-actions">
              <button className="cg-sheet-primary">Send Message</button>
              <button className="cg-sheet-cancel" onClick={closeSheet}>Close</button>
            </div>
          </div>
        </div>
      )}

      {trustOpen && <TrustModal name="Mark" onClose={() => setTrustOpen(false)} />}
    </div>
  );
}
