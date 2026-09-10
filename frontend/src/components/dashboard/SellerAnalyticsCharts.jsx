import React, { useState } from 'react';
import { TrendingUp, BarChart3, IndianRupee, ShoppingBag, Calendar, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatCurrency';

export function SellerAnalyticsCharts() {
  const [period, setPeriod] = useState('30d'); // '7d' | '30d' | '6m' | '1y'

  // Dynamic Dataset for Sales Volume & Sales Revenue based on selected period
  const getChartData = () => {
    switch (period) {
      case '7d':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          salesVolume: [12, 18, 14, 25, 32, 45, 38],
          revenue: [14400, 21600, 16800, 30000, 38400, 54000, 45600],
          totalUnits: 184,
          totalRev: 220800,
          avgDailyUnits: 26,
          growthRate: '+14.2%',
        };
      case '6m':
        return {
          labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
          salesVolume: [120, 185, 240, 310, 290, 410],
          revenue: [150000, 230000, 310000, 420000, 390000, 560000],
          totalUnits: 1555,
          totalRev: 2060000,
          avgDailyUnits: 259,
          growthRate: '+28.6%',
        };
      case '1y':
        return {
          labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'],
          salesVolume: [450, 680, 890, 1250, 1100, 1420],
          revenue: [580000, 890000, 1150000, 1680000, 1450000, 1890000],
          totalUnits: 5790,
          totalRev: 7640000,
          avgDailyUnits: 482,
          growthRate: '+35.8%',
        };
      case '30d':
      default:
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          salesVolume: [48, 72, 95, 124],
          revenue: [62000, 94000, 128000, 172000],
          totalUnits: 339,
          totalRev: 456000,
          avgDailyUnits: 11,
          growthRate: '+22.4%',
        };
    }
  };

  const data = getChartData();
  const [activeHoverIdx, setActiveHoverIdx] = useState(null);

  // SVG dimensions for Sales Volume Bar Chart
  const maxVolume = Math.max(...data.salesVolume, 1);
  const maxRevenue = Math.max(...data.revenue, 1);

  return (
    <div className="space-y-6">
      {/* Header and Period Filter Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" /> Store Sales & Revenue Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive real-time charts tracking units sold and gross earnings over time.
          </p>
        </div>

        {/* Dynamic Period Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {[
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '6m', label: '6 Months' },
            { id: '1y', label: '1 Year' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setPeriod(btn.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                period === btn.id
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Two Dynamic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Sales Volume (Units Sold) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Sales Volume (Units Sold)
                  </h3>
                  <span className="text-[11px] text-slate-500">Number of orders fulfilled</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-amber-600 block">{data.totalUnits} Units</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> {data.growthRate}
                </span>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="mt-6 h-48 relative flex items-end justify-between gap-2 px-2 pb-6 border-b border-slate-200">
              {data.salesVolume.map((val, idx) => {
                const heightPercent = Math.max(12, (val / maxVolume) * 100);
                const isHovered = activeHoverIdx === idx;

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setActiveHoverIdx(idx)}
                    onMouseLeave={() => setActiveHoverIdx(null)}
                  >
                    {/* Tooltip on Hover */}
                    {isHovered && (
                      <div className="absolute -top-10 bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold z-20 shadow-md whitespace-nowrap animate-fade-in">
                        {data.labels[idx]}: <span className="text-amber-400 font-black">{val} Units</span>
                      </div>
                    )}

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-xl transition-all duration-300 ${
                        isHovered
                          ? 'bg-amber-500 shadow-md scale-x-105'
                          : 'bg-gradient-to-t from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between px-2 pt-2 text-[11px] font-bold text-slate-500">
              {data.labels.map((lbl, idx) => (
                <span key={idx} className="flex-1 text-center line-clamp-1">
                  {lbl}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Average: <strong className="text-slate-800 font-bold">{data.avgDailyUnits} units / period</strong></span>
            <span className="text-amber-600 font-bold">Peak: {maxVolume} units</span>
          </div>
        </div>

        {/* CHART 2: Sales Revenue (Revenue in ₹) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Sales Revenue Trend (₹)
                  </h3>
                  <span className="text-[11px] text-slate-500">Gross completed sales revenue</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-emerald-700 block" title={formatCurrency(data.totalRev)}>
                  {formatCompactCurrency(data.totalRev)}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> {data.growthRate}
                </span>
              </div>
            </div>

            {/* Custom SVG Area Line Chart */}
            <div className="mt-6 h-48 relative px-2 pb-6 border-b border-slate-200 flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160">
                <defs>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="40" x2="400" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="80" x2="400" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="120" x2="400" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

                {/* Calculate Area and Path Coordinates */}
                {(() => {
                  const points = data.revenue.map((val, idx) => {
                    const x = (idx / (data.revenue.length - 1)) * 390 + 5;
                    const y = 140 - (val / maxRevenue) * 120;
                    return { x, y, val };
                  });

                  const pathD = points.reduce(
                    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
                    ''
                  );

                  const areaD = `${pathD} L ${points[points.length - 1].x} 150 L ${points[0].x} 150 Z`;

                  return (
                    <>
                      {/* Gradient Fill */}
                      <path d={areaD} fill="url(#emeraldGradient)" />

                      {/* Smooth Line */}
                      <path d={pathD} fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" />

                      {/* Data Dots */}
                      {points.map((p, idx) => (
                        <g key={idx} className="group cursor-pointer">
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r="5"
                            className="fill-white stroke-emerald-600 stroke-2 transition-all group-hover:r-7 group-hover:fill-emerald-500"
                          />
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between px-2 pt-2 text-[11px] font-bold text-slate-500">
              {data.labels.map((lbl, idx) => (
                <span key={idx} className="flex-1 text-center line-clamp-1">
                  {lbl}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Avg Order Value: <strong className="text-slate-800 font-bold">{formatCurrency(data.totalRev / data.totalUnits)}</strong></span>
            <span className="text-emerald-700 font-bold">Highest: {formatCurrency(maxRevenue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerAnalyticsCharts;
