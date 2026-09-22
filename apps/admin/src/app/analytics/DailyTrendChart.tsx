'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Users, Eye, Sparkles } from 'lucide-react';

interface DailyTrendItem {
  date: string;
  unique_visitors: string;
  page_views: string;
}

interface DailyTrendChartProps {
  data: DailyTrendItem[];
  days: number;
}

export function DailyTrendChart({ data, days }: DailyTrendChartProps) {
  const [activeMetric, setActiveMetric] = useState<'visitors' | 'views' | 'both'>('both');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Compute stats
  const { maxVal, totalVisitors, totalViews, peakDay, avgVisitors } = useMemo(() => {
    let maxV = 1;
    let totVis = 0;
    let totVw = 0;
    let peak = { date: '', count: 0 };

    for (const d of data) {
      const vis = parseInt(d.unique_visitors, 10) || 0;
      const vw = parseInt(d.page_views, 10) || 0;
      totVis += vis;
      totVw += vw;
      if (vis > maxV) maxV = vis;
      if (vw > maxV) maxV = vw;
      if (vis > peak.count) {
        peak = { date: d.date, count: vis };
      }
    }

    // Round maxVal up to a neat ceiling
    const ceiling = Math.max(Math.ceil(maxV * 1.25), 4);
    const avg = data.length > 0 ? (totVis / data.length).toFixed(1) : '0';

    return {
      maxVal: ceiling,
      totalVisitors: totVis,
      totalViews: totVw,
      peakDay: peak,
      avgVisitors: avg,
    };
  }, [data]);

  // SVG Chart dimensions
  const SVG_WIDTH = 800;
  const SVG_HEIGHT = 220;
  const PAD_LEFT = 40;
  const PAD_RIGHT = 24;
  const PAD_TOP = 20;
  const PAD_BOTTOM = 36;
  const PLOT_WIDTH = SVG_WIDTH - PAD_LEFT - PAD_RIGHT;
  const PLOT_HEIGHT = SVG_HEIGHT - PAD_TOP - PAD_BOTTOM;

  // Coordinate mapper
  const points = useMemo(() => {
    if (data.length === 0) return [];
    const step = data.length > 1 ? PLOT_WIDTH / (data.length - 1) : PLOT_WIDTH;

    return data.map((d, i) => {
      const x = PAD_LEFT + (data.length > 1 ? i * step : PLOT_WIDTH / 2);
      const vis = parseInt(d.unique_visitors, 10) || 0;
      const vw = parseInt(d.page_views, 10) || 0;
      const yVis = PAD_TOP + PLOT_HEIGHT - (vis / maxVal) * PLOT_HEIGHT;
      const yVw = PAD_TOP + PLOT_HEIGHT - (vw / maxVal) * PLOT_HEIGHT;
      return { x, yVis, yVw, vis, vw, date: d.date, index: i };
    });
  }, [data, maxVal, PLOT_WIDTH, PLOT_HEIGHT]);

  // Generate SVG path strings
  const { lineVis, areaVis, lineVw, areaVw } = useMemo(() => {
    if (points.length === 0) return { lineVis: '', areaVis: '', lineVw: '', areaVw: '' };

    const visLinePts = points.map((p) => `${p.x},${p.yVis}`).join(' L ');
    const vwLinePts = points.map((p) => `${p.x},${p.yVw}`).join(' L ');
    const bottomY = PAD_TOP + PLOT_HEIGHT;

    const lineV = `M ${visLinePts}`;
    const areaV = `M ${points[0].x},${bottomY} L ${visLinePts} L ${points[points.length - 1].x},${bottomY} Z`;

    const lineW = `M ${vwLinePts}`;
    const areaW = `M ${points[0].x},${bottomY} L ${vwLinePts} L ${points[points.length - 1].x},${bottomY} Z`;

    return { lineVis: lineV, areaVis: areaV, lineVw: lineW, areaVw: areaW };
  }, [points, PLOT_HEIGHT]);

  // Y-axis grid ticks (4 ticks)
  const yTicks = useMemo(() => {
    const ticks = [];
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const val = Math.round((maxVal / steps) * i);
      const y = PAD_TOP + PLOT_HEIGHT - (val / maxVal) * PLOT_HEIGHT;
      ticks.push({ val, y });
    }
    return ticks;
  }, [maxVal, PLOT_HEIGHT]);

  // Format date helper
  const formatTickDate = (iso: string) => {
    try {
      const parts = iso.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      }
    } catch {
      // fallback
    }
    return iso;
  };

  const formatFullDate = (iso: string) => {
    try {
      const parts = iso.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-US', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }
    } catch {
      // fallback
    }
    return iso;
  };

  const hoveredPoint = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;

  return (
    <div
      style={{
        gridColumn: '1 / -1',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '24px 28px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* Top Header & Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
              Daily Visitor Trend
            </h2>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#3079bd',
                backgroundColor: '#eff6ff',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              Last {days} Days
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '4px 0 0' }}>
            Daily breakdown of unique visitors and total pageviews (internal bots excluded)
          </p>
        </div>

        {/* Metric Switcher Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f1f5f9',
            padding: '3px',
            borderRadius: '10px',
            gap: '2px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveMetric('both')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeMetric === 'both' ? '#ffffff' : 'transparent',
              color: activeMetric === 'both' ? '#0f172a' : '#64748b',
              boxShadow: activeMetric === 'both' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            All Metrics
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('visitors')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeMetric === 'visitors' ? '#ffffff' : 'transparent',
              color: activeMetric === 'visitors' ? '#004E35' : '#64748b',
              boxShadow: activeMetric === 'visitors' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#004E35',
              }}
            />
            Unique Visitors
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('views')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeMetric === 'views' ? '#ffffff' : 'transparent',
              color: activeMetric === 'views' ? '#3079bd' : '#64748b',
              boxShadow: activeMetric === 'views' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#3079bd',
              }}
            />
            Page Views
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
          padding: '12px 16px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 78, 53, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#004E35',
            }}
          >
            <Users size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>TOTAL VISITORS</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{totalVisitors}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(48, 121, 189, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3079bd',
            }}
          >
            <Eye size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>TOTAL PAGEVIEWS</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{totalViews}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d97706',
            }}
          >
            <TrendingUp size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>DAILY AVERAGE</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{avgVisitors}/day</div>
          </div>
        </div>

        {peakDay.count > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
              }}
            >
              <Sparkles size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>PEAK TRAFFIC</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                {peakDay.count} on {formatTickDate(peakDay.date)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SVG Chart Container */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          style={{ width: '100%', height: 'auto', display: 'block', minWidth: '550px' }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            {/* Unique visitors gradient */}
            <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#004E35" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#004E35" stopOpacity="0.01" />
            </linearGradient>

            {/* Pageviews gradient */}
            <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3079bd" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#3079bd" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          {yTicks.map((t, idx) => (
            <g key={idx}>
              <line
                x1={PAD_LEFT}
                y1={t.y}
                x2={SVG_WIDTH - PAD_RIGHT}
                y2={t.y}
                stroke="#f1f5f9"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={PAD_LEFT - 10}
                y={t.y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#94a3b8"
                fontFamily="system-ui, sans-serif"
              >
                {t.val}
              </text>
            </g>
          ))}

          {/* Area Fills */}
          {(activeMetric === 'both' || activeMetric === 'views') && areaVw && (
            <path d={areaVw} fill="url(#viewsGrad)" />
          )}

          {(activeMetric === 'both' || activeMetric === 'visitors') && areaVis && (
            <path d={areaVis} fill="url(#visitorsGrad)" />
          )}

          {/* Lines */}
          {(activeMetric === 'both' || activeMetric === 'views') && lineVw && (
            <path
              d={lineVw}
              fill="none"
              stroke="#3079bd"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {(activeMetric === 'both' || activeMetric === 'visitors') && lineVis && (
            <path
              d={lineVis}
              fill="none"
              stroke="#004E35"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Hover Guides & Data Dots */}
          {points.map((p) => {
            const isHovered = hoveredIndex === p.index;
            return (
              <g key={p.index}>
                {/* Vertical Guideline on hover */}
                {isHovered && (
                  <line
                    x1={p.x}
                    y1={PAD_TOP}
                    x2={p.x}
                    y2={PAD_TOP + PLOT_HEIGHT}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Page views dot */}
                {(activeMetric === 'both' || activeMetric === 'views') && (
                  <circle
                    cx={p.x}
                    cy={p.yVw}
                    r={isHovered ? 6 : p.vw > 0 ? 4 : 2}
                    fill="#3079bd"
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    style={{ transition: 'all 0.15s ease' }}
                  />
                )}

                {/* Visitors dot */}
                {(activeMetric === 'both' || activeMetric === 'visitors') && (
                  <circle
                    cx={p.x}
                    cy={p.yVis}
                    r={isHovered ? 6 : p.vis > 0 ? 4.5 : 2}
                    fill="#004E35"
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    style={{ transition: 'all 0.15s ease' }}
                  />
                )}

                {/* Invisible broad hover trigger column */}
                <rect
                  x={p.x - PLOT_WIDTH / (points.length * 2)}
                  y={PAD_TOP}
                  width={PLOT_WIDTH / points.length}
                  height={PLOT_HEIGHT}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIndex(p.index)}
                />
              </g>
            );
          })}

          {/* X-Axis Dates */}
          {points.map((p, i) => {
            // Pick optimal interval so labels never overlap
            const interval =
              points.length <= 8 ? 1 : points.length <= 15 ? 2 : points.length <= 31 ? 4 : 7;
            const isFirst = i === 0;
            const isLast = i === points.length - 1;
            const showLabel = isFirst || isLast || i % interval === 0;

            if (!showLabel) return null;

            return (
              <text
                key={p.date}
                x={p.x}
                y={PAD_TOP + PLOT_HEIGHT + 20}
                textAnchor={isFirst ? 'start' : isLast ? 'end' : 'middle'}
                fontSize="11"
                fill="#64748b"
                fontFamily="system-ui, sans-serif"
                fontWeight="500"
              >
                {formatTickDate(p.date)}
              </text>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: `${Math.min(Math.max((hoveredPoint.x / SVG_WIDTH) * 100, 16), 84)}%`,
              transform: 'translateX(-50%)',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '10px 14px',
              borderRadius: '10px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
              fontSize: '0.78rem',
              pointerEvents: 'none',
              zIndex: 10,
              minWidth: '170px',
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 600, marginBottom: '6px' }}>
              {formatFullDate(hoveredPoint.date)}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '3px',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6ee7b7' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                Unique Visitors:
              </span>
              <strong style={{ fontSize: '0.85rem' }}>{hoveredPoint.vis}</strong>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#93c5fd' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
                Page Views:
              </span>
              <strong style={{ fontSize: '0.85rem' }}>{hoveredPoint.vw}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Privacy Footnote */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid #f1f5f9',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#475569' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#004E35' }} />
            <span>Unique Visitors</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#475569' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#3079bd' }} />
            <span>Total Pageviews</span>
          </div>
        </div>
        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
          Hover over any point along the timeline to inspect daily metrics
        </span>
      </div>
    </div>
  );
}
