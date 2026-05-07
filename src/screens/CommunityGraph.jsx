import { useState } from 'react';
import { useStore } from '../store/useStore';
import { IconBack } from '../components/Icons';
import TrustModal from '../components/TrustModal';
import './CommunityGraph.css';

const CX = 158, CY = 132;

const CLUSTERS = [
  {
    id: 'family',
    label: 'Family',
    status: 'Confirmed',
    color: '#34C759',
    bg: '#e9f9ee',
    cx: 112, cy: 65,
    labelX: 112, labelY: 49, anchor: 'middle',
    dots: [{ x:109,y:63 },{ x:116,y:59 },{ x:107,y:69 },{ x:118,y:67 },{ x:113,y:73 }],
  },
  {
    id: 'business',
    label: 'Business',
    status: 'Pending',
    color: '#FF9500',
    bg: '#fff4e5',
    cx: 236, cy: 96,
    labelX: 255, labelY: 91, anchor: 'start',
    dots: [{ x:233,y:93 },{ x:239,y:99 },{ x:232,y:102 },{ x:241,y:90 }],
  },
  {
    id: 'barangay',
    label: 'Barangay',
    status: 'Circle Verified',
    color: '#1877F2',
    bg: '#e8f0fd',
    cx: 178, cy: 208,
    labelX: 178, labelY: 223, anchor: 'middle',
    dots: [{ x:174,y:205 },{ x:181,y:211 },{ x:176,y:200 },{ x:183,y:207 },{ x:178,y:214 }],
  },
  {
    id: 'mygene',
    label: 'myGENE',
    status: 'Personal Record',
    color: '#AF52DE',
    bg: '#f7effe',
    cx: 58, cy: 152,
    labelX: 40, labelY: 147, anchor: 'end',
    dots: [{ x:54,y:149 },{ x:61,y:155 },{ x:56,y:160 },{ x:63,y:145 }],
  },
];

const AMBIENT = [
  { x:34,y:42 },{ x:285,y:52 },{ x:305,y:145 },{ x:262,y:230 },
  { x:76,y:240 },{ x:22,y:190 },{ x:148,y:24 },{ x:204,y:18 },
  { x:292,y:78 },{ x:310,y:185 },{ x:238,y:252 },{ x:96,y:252 },
  { x:28,y:112 },{ x:308,y:118 },{ x:188,y:256 },{ x:46,y:70 },
  { x:270,y:175 },{ x:130,y:246 },
];

export default function CommunityGraphScreen() {
  const { goBack, userId } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  const uid = userId || '';
  const initial = uid.split(':')[0].replace('@','')[0]?.toUpperCase() || 'M';

  return (
    <div className="cg-screen">
      <div className="cg-hdr">
        <button className="cg-back" onClick={goBack}><IconBack /></button>
        <span className="cg-title">Community Graph</span>
      </div>

      <div className="cg-body">

        {/* Map */}
        <div className="cg-map-card">
          <svg viewBox="0 0 320 270" className="cg-svg">

            {/* Ambient community dots */}
            {AMBIENT.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r="1.5" fill="var(--t4)" opacity="0.5" />
            ))}

            {/* Connection lines */}
            {CLUSTERS.map(c => (
              <line
                key={c.id}
                x1={CX} y1={CY}
                x2={c.cx} y2={c.cy}
                stroke={c.color}
                strokeWidth="0.75"
                strokeDasharray="3 4"
                opacity="0.22"
              />
            ))}

            {/* Cluster dots */}
            {CLUSTERS.map(c =>
              c.dots.map((d, i) => (
                <circle key={`${c.id}-${i}`} cx={d.x} cy={d.y} r="2" fill={c.color} />
              ))
            )}

            {/* Cluster labels */}
            {CLUSTERS.map(c => (
              <text
                key={c.id}
                x={c.labelX} y={c.labelY}
                textAnchor={c.anchor}
                fontSize="9.5"
                fontWeight="700"
                fill={c.color}
                fontFamily="DM Sans, -apple-system, sans-serif"
                letterSpacing="0.2"
              >
                {c.label}
              </text>
            ))}

            {/* Center glow */}
            <circle cx={CX} cy={CY} r="14" fill="#1877F2" opacity="0.08" />
            <circle cx={CX} cy={CY} r="9" fill="#1877F2" opacity="0.12" />

            {/* Center dot */}
            <circle cx={CX} cy={CY} r="5" fill="#1877F2" />

            {/* You label */}
            <text
              x={CX} y={CY + 18}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill="var(--t3)"
              fontFamily="DM Sans, -apple-system, sans-serif"
            >
              {initial}
            </text>
          </svg>
        </div>

        {/* Explanation */}
        <p className="cg-explain">
          Your Community Graph helps myCHAT verify identity through real relationships, not only documents.
        </p>

        {/* Connection list */}
        <div className="cg-list">
          {CLUSTERS.map((c, i) => (
            <div key={c.id} className={`cg-row${i < CLUSTERS.length - 1 ? ' cg-row-border' : ''}`}>
              <div className="cg-row-left">
                <span className="cg-dot" style={{ background: c.color }} />
                <span className="cg-row-label">{c.label}</span>
              </div>
              <span className="cg-badge" style={{ background: c.bg, color: c.color }}>
                {c.status}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="cg-cta" onClick={() => setModalOpen(true)}>
          Send Trust Request
        </button>

      </div>

      {modalOpen && <TrustModal name="Mark" onClose={() => setModalOpen(false)} />}
    </div>
  );
}
