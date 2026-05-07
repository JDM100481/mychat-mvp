import { useState } from 'react';
import { useStore } from '../store/useStore';
import { IconBack } from '../components/Icons';
import TrustModal from '../components/TrustModal';
import './TrustGraph.css';

const CX = 160, CY = 130;
const R_OUT = 85;
const NODE_R = 24;
const CENTER_R = 32;

const NODES = [
  { id: 1, label: 'Family',   abbr: 'Fa', status: 'Confirmed',      color: '#e9f8ee', stroke: '#34C759', x: CX,         y: CY - R_OUT },
  { id: 2, label: 'Business', abbr: 'Bu', status: 'Pending',         color: '#fff4e5', stroke: '#FF9500', x: CX + R_OUT, y: CY         },
  { id: 3, label: 'Barangay', abbr: 'Br', status: 'Circle Verified', color: '#e8f0fd', stroke: '#1877F2', x: CX,         y: CY + R_OUT },
  { id: 4, label: 'myGENE',   abbr: 'G',  status: 'Personal Record', color: '#f7effe', stroke: '#AF52DE', x: CX - R_OUT, y: CY         },
];

const LEGEND = [
  { status: 'Confirmed',      color: '#34C759' },
  { status: 'Pending',        color: '#FF9500' },
  { status: 'Circle Verified',color: '#1877F2' },
  { status: 'Personal Record',color: '#AF52DE' },
];

export default function TrustGraphScreen() {
  const { goBack, userId } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  const uid = userId || '';
  const youInitial = uid.split(':')[0].replace('@', '')[0]?.toUpperCase() || 'M';

  return (
    <div className="tg-screen">
      <div className="tg-hdr">
        <button className="tg-back" onClick={goBack}><IconBack /></button>
        <span className="tg-title">Community Graph</span>
      </div>

      <div className="tg-body">
        {/* Graph */}
        <div className="tg-graph-wrap">
          <svg viewBox="0 0 320 280" className="tg-svg">
            {/* Dashed connection lines */}
            {NODES.map(n => (
              <line
                key={n.id}
                x1={CX} y1={CY} x2={n.x} y2={n.y}
                stroke={n.stroke}
                strokeWidth="1.5"
                strokeDasharray="5 4"
                opacity="0.4"
              />
            ))}

            {/* Outer nodes */}
            {NODES.map(n => {
              const lx = n.x;
              const ly = n.y + NODE_R + 13;
              const sx = n.x;
              const sy = n.y + NODE_R + 26;
              return (
                <g key={n.id}>
                  <circle cx={n.x} cy={n.y} r={NODE_R} fill={n.color} stroke={n.stroke} strokeWidth="1.8" />
                  <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="central"
                    fontSize="11" fontWeight="700" fill={n.stroke}
                    fontFamily="DM Sans, -apple-system, sans-serif">
                    {n.abbr}
                  </text>
                  <text x={lx} y={ly} textAnchor="middle"
                    fontSize="10" fontWeight="600" fill="#3A3A3C"
                    fontFamily="DM Sans, -apple-system, sans-serif">
                    {n.label}
                  </text>
                  <text x={sx} y={sy} textAnchor="middle"
                    fontSize="9" fill={n.stroke}
                    fontFamily="DM Sans, -apple-system, sans-serif">
                    {n.status}
                  </text>
                </g>
              );
            })}

            {/* Center — YOU */}
            <circle cx={CX} cy={CY} r={CENTER_R} fill="#e8f0fd" stroke="#1877F2" strokeWidth="2.2" />
            <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="central"
              fontSize="16" fontWeight="700" fill="#1877F2"
              fontFamily="DM Sans, -apple-system, sans-serif">
              {youInitial}
            </text>
            <text x={CX} y={CY + CENTER_R + 11} textAnchor="middle"
              fontSize="10" fontWeight="600" fill="#8E8E93"
              fontFamily="DM Sans, -apple-system, sans-serif">
              You
            </text>
          </svg>
        </div>

        {/* Explanation */}
        <div className="tg-explain">
          Your Community Graph helps myCHAT verify identity through real relationships, not only documents.
        </div>

        {/* Legend */}
        <div className="tg-legend">
          {LEGEND.map(l => (
            <div key={l.status} className="tg-leg-row">
              <span className="tg-leg-dot" style={{ background: l.color }} />
              <span className="tg-leg-label">{l.status}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="tg-cta" onClick={() => setModalOpen(true)}>
          Send Trust Request
        </button>
      </div>

      {modalOpen && <TrustModal name="Mark" onClose={() => setModalOpen(false)} />}
    </div>
  );
}
