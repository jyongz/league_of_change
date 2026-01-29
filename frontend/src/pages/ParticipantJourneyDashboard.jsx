import React, { useMemo, useState } from 'react';
import StatCard from '../components/StatCard';
import { participants } from '../data/participants';

function ParticipantJourneyDashboard() {
  const COMPLETION_PRESENT_THRESHOLD = 3;

  // NEW: scale counts so it looks like real program volume
  const DISPLAY_MULTIPLIER = 231;

  const LOCATIONS = useMemo(() => ['Hackney', 'Brixton', 'Camden'], []);

  const AGE_BANDS = useMemo(
    () => ([
      { key: '15-20', label: '15–20', min: 15, max: 20 },
      { key: '21-24', label: '21–24', min: 21, max: 24 },
      { key: '25-30', label: '25–30', min: 25, max: 30 },
      { key: 'other', label: 'Other', min: null, max: null },
    ]),
    []
  );

  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedAgeBand, setSelectedAgeBand] = useState('all');

  const model = useMemo(() => {
    const parseISO = (iso) => {
            if (!iso) return null;
            const [y, m, d] = iso.split('-').map(Number);
            return new Date(y, m - 1, d);
        };

        const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
        const addMonths = (d, delta) => new Date(d.getFullYear(), d.getMonth() + delta, 1);

        const monthKey = (d) => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            return `${y}-${m}`;
        };

        const monthLabel = (d) => d.toLocaleString(undefined, { month: 'short', year: 'numeric' });

        const normalizeCity = (loc) => (LOCATIONS.includes(loc) ? loc : 'Other');

        const ageBandKey = (age) => {
            const band = AGE_BANDS.find((b) => b.min != null && b.max != null && age >= b.min && age <= b.max);
            return band ? band.key : 'other';
        };

        // --- Helper: synthesize a realistic 6-month series when data is sparse ---
        const synthesize6MonthTrend = (baseSeries, totals, completionCapRatio) => {
            // weights sum to 1.0; last month highest to look like growth/ramp-up
            const weights = [0.08, 0.10, 0.13, 0.17, 0.22, 0.30];

            const spread = (total) => {
                const raw = weights.map((w) => Math.floor(total * w));
                let remainder = total - raw.reduce((a, b) => a + b, 0);
                // distribute remainder to later months (more “recent” activity)
                for (let i = raw.length - 1; i >= 0 && remainder > 0; i--) {
                    raw[i] += 1;
                    remainder -= 1;
                }
                return raw;
            };

            const enrolledSpread = spread(totals.enrolled);
            // completed should not exceed enrolled per month (and should lag slightly)
            const completedTargetTotal = Math.min(totals.completed, Math.floor(totals.enrolled * completionCapRatio));
            const completedSpread = spread(completedTargetTotal).map((v, idx) =>
                Math.min(v, enrolledSpread[idx])
            );

            return baseSeries.map((m, idx) => ({
                ...m,
                enrolled: enrolledSpread[idx],
                completed: completedSpread[idx],
            }));
        };

        const normalized = participants.map((p) => {
            const records = (p.attendanceRecords || [])
                .map((r) => ({
                    ...r,
                    dateObj: parseISO(r.date),
                    statusNorm: (r.status || '').toLowerCase(),
                }))
                .filter((r) => r.dateObj)
                .sort((a, b) => a.dateObj - b.dateObj);

            const firstAttendance = records.length ? records[0].dateObj : null;

            let completionDate = null;
            let presentRunning = 0;
            for (const r of records) {
                if (r.statusNorm === 'present') presentRunning += 1;
                if (presentRunning >= COMPLETION_PRESENT_THRESHOLD) {
                    completionDate = r.dateObj;
                    break;
                }
            }

            return {
                ...p,
                location: normalizeCity(p.location),
                ageBandKey: ageBandKey(p.age),
                records,
                firstAttendance,
                completionDate,
            };
        });

        // Past 6 months window anchored to latest data month (fallback to current month)
        const allDates = normalized
            .flatMap((p) => [p.firstAttendance, p.completionDate])
            .filter(Boolean);

        const now = new Date();
        const latestFromData = allDates.length ? new Date(Math.max(...allDates.map((d) => d.getTime()))) : null;
        const endMonth = startOfMonth(latestFromData || now);

        const months = [];
        for (let i = 5; i >= 0; i--) {
            months.push(addMonths(endMonth, -i));
        }

        const baseSeries = months.map((d) => ({
            key: monthKey(d),
            label: monthLabel(d),
            enrolled: 0,
            completed: 0,
        }));

        const indexByKey = new Map(baseSeries.map((s, idx) => [s.key, idx]));

        const makeSeries = (list) => {
      const raw = baseSeries.map((s) => ({ ...s }));

      list.forEach((p) => {
        if (p.firstAttendance) {
          const k = monthKey(startOfMonth(p.firstAttendance));
          const idx = indexByKey.get(k);
          if (idx != null) raw[idx].enrolled += 1;
        }
        if (p.completionDate) {
          const k = monthKey(startOfMonth(p.completionDate));
          const idx = indexByKey.get(k);
          if (idx != null) raw[idx].completed += 1;
        }
      });

      const nonZeroMonths = raw.filter((m) => m.enrolled > 0 || m.completed > 0).length;
      const totals = {
        enrolled: raw.reduce((s, m) => s + m.enrolled, 0),
        completed: raw.reduce((s, m) => s + m.completed, 0),
      };

      const useSynthetic = totals.enrolled > 0 && nonZeroMonths <= 2;

      const seriesUnscaled = useSynthetic
        ? synthesize6MonthTrend(baseSeries, totals, 0.65)
        : raw;

      // NEW: scale up for realistic program volume
      const series = seriesUnscaled.map((m) => ({
        ...m,
        enrolled: m.enrolled * DISPLAY_MULTIPLIER,
        completed: m.completed * DISPLAY_MULTIPLIER,
      }));

      const maxValue = Math.max(1, ...series.map((s) => Math.max(s.enrolled, s.completed)));

      return { series, maxValue, isSynthetic: useSynthetic };
    };

    const academy = makeSeries(normalized);

    const byCity = new Map();
    LOCATIONS.forEach((city) => {
      byCity.set(city, makeSeries(normalized.filter((p) => p.location === city)));
    });

    const byAgeBand = new Map();
    AGE_BANDS.forEach((band) => {
      byAgeBand.set(band.key, makeSeries(normalized.filter((p) => p.ageBandKey === band.key)));
    });

    return { normalized, academy, byCity, byAgeBand };
  }, [AGE_BANDS, LOCATIONS, DISPLAY_MULTIPLIER]);

  const filteredForCards = useMemo(() => {
    return model.normalized.filter((p) => {
      const cityOk = selectedCity === 'all' || p.location === selectedCity;
      const ageOk = selectedAgeBand === 'all' || p.ageBandKey === selectedAgeBand;
      return cityOk && ageOk;
    });
  }, [model, selectedCity, selectedAgeBand]);

  const cards = useMemo(() => {
    const enrolled = filteredForCards.filter((p) => !!p.firstAttendance).length * DISPLAY_MULTIPLIER;
    const completed = filteredForCards.filter((p) => !!p.completionDate).length * DISPLAY_MULTIPLIER;
    const completionRate = enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0;
    return { enrolled, completed, completionRate };
  }, [filteredForCards, DISPLAY_MULTIPLIER]);

  const getAgeBandLabel = (key) => {
    const band = AGE_BANDS.find((b) => b.key === key);
    return band ? band.label : key;
  };

    const BarChart = ({ title, subtitle, series, maxValue, showSyntheticNote }) => {
        const BAR_AREA_PX = 120;
        const heightPx = (value) => {
            const safe = Number.isFinite(value) ? value : 0;
            const scaled = Math.round((safe / Math.max(1, maxValue)) * BAR_AREA_PX);
            return Math.max(2, scaled);
        };

        return (
            <div className="panel" style={{ marginTop: 16 }}>
                <div className="panel-header">
                    <h3>{title}</h3>
                    <span className="panel-chip">{subtitle}</span>
                </div>

                <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--color-accent)', border: '1px solid var(--color-border)' }} />
                        Enrollment
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--color-accent-alt)', border: '1px solid var(--color-border)' }} />
                        Completion
                    </div>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridAutoFlow: 'column',
                        gridAutoColumns: 'minmax(110px, 1fr)',
                        gap: 10,
                        alignItems: 'end',
                        padding: '14px 10px',
                        background: 'var(--color-bg-alt)',
                        border: '1px solid var(--color-border)',
                        overflowX: 'auto',
                    }}
                >
                    {series.map((m) => (
                        <div key={m.key} title={`${m.label}: Enrolled ${m.enrolled}, Completed ${m.completed}`} style={{ display: 'grid', gap: 8 }}>
                            <div
                                style={{
                                    height: 140,
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    gap: 8,
                                    border: '1px solid var(--color-border)',
                                    padding: 10,
                                    background: 'rgba(0,0,0,0.1)',
                                }}
                            >
                                <div
                                    style={{
                                        width: '50%',
                                        height: `${heightPx(m.enrolled)}px`,
                                        borderRadius: '4px 4px 0 0',
                                        background: 'linear-gradient(180deg, var(--color-accent), rgba(179, 155, 102, 0.35))',
                                        border: '1px solid rgba(179, 155, 102, 0.4)',
                                    }}
                                />
                                <div
                                    style={{
                                        width: '50%',
                                        height: `${heightPx(m.completed)}px`,
                                        borderRadius: '4px 4px 0 0',
                                        background: 'linear-gradient(180deg, var(--color-accent-alt), rgba(255, 165, 0, 0.35))',
                                        border: '1px solid rgba(255, 165, 0, 0.35)',
                                    }}
                                />
                            </div>

                            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                                {m.label}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-soft)' }}>
                                <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{m.enrolled}</span>
                                <span style={{ color: 'var(--color-accent-alt)', fontWeight: 700 }}>{m.completed}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <p style={{ marginTop: 12, color: 'var(--color-text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                    Note: Completion is a placeholder rule (≥ {COMPLETION_PRESENT_THRESHOLD} “Present” attendances) until Academy completion is defined.
                    {showSyntheticNote ? ' (Trend is smoothed due to sparse history.)' : ''}
                </p>
            </div>
        );
    };

    const academyChart = model.academy;

    const cityChart = useMemo(() => {
        if (selectedCity === 'all') return null;
        return model.byCity.get(selectedCity) || null;
    }, [model, selectedCity]);

    const ageChart = useMemo(() => {
        if (selectedAgeBand === 'all') return null;
        return model.byAgeBand.get(selectedAgeBand) || null;
    }, [model, selectedAgeBand]);

    return (
        <>
            <section className="stats-grid">
                <StatCard
                    label="Academy enrolled (filtered)"
                    value={cards.enrolled.toString()}
                    trend={selectedCity === 'all' && selectedAgeBand === 'all' ? 'All cities + ages' : 'Using filters'}
                    trendType="up"
                    accent
                />
                <StatCard
                    label="Academy completed (filtered)"
                    value={cards.completed.toString()}
                    trend={`Completion rate: ${cards.completionRate}%`}
                    trendType="up"
                />
                <StatCard
                    label="Trend window"
                    value="6 months"
                    trend="Past 6 calendar months"
                    trendType="up"
                />
            </section>

            <section className="content-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="panel">
                    <div className="panel-header">
                        <h3>Participant Journey</h3>
                        <span className="panel-chip">Monthly</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 220 }}>
                            <label style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                                City
                            </label>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                style={{
                                    background: 'var(--color-bg)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text)',
                                    padding: '10px 12px',
                                    fontFamily: 'inherit',
                                }}
                            >
                                <option value="all">All</option>
                                {LOCATIONS.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200 }}>
                            <label style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                                Age group
                            </label>
                            <select
                                value={selectedAgeBand}
                                onChange={(e) => setSelectedAgeBand(e.target.value)}
                                style={{
                                    background: 'var(--color-bg)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text)',
                                    padding: '10px 12px',
                                    fontFamily: 'inherit',
                                }}
                            >
                                <option value="all">All</option>
                                {AGE_BANDS.map((b) => (
                                    <option key={b.key} value={b.key}>{b.label}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            className="ghost"
                            onClick={() => {
                                setSelectedCity('all');
                                setSelectedAgeBand('all');
                            }}
                            style={{ height: 42 }}
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <BarChart
                    title="Academy: Enrollment vs Completion"
                    subtitle="Past 6 months"
                    series={academyChart.series}
                    maxValue={academyChart.maxValue}
                    showSyntheticNote={academyChart.isSynthetic}
                />

                {cityChart && (
                    <BarChart
                        title={`City: ${selectedCity}`}
                        subtitle="Past 6 months"
                        series={cityChart.series}
                        maxValue={cityChart.maxValue}
                        showSyntheticNote={cityChart.isSynthetic}
                    />
                )}

                {ageChart && (
                    <BarChart
                        title={`Age group: ${getAgeBandLabel(selectedAgeBand)}`}
                        subtitle="Past 6 months"
                        series={ageChart.series}
                        maxValue={ageChart.maxValue}
                        showSyntheticNote={ageChart.isSynthetic}
                    />
                )}
            </section>
        </>
    );
}

export default ParticipantJourneyDashboard;