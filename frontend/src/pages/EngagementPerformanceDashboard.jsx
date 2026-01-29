import React, { useMemo, useState } from 'react';
import StatCard from '../components/StatCard';

function EngagementPerformanceDashboard() {
    /**
     * Engagement & Performance (mock) dashboard
     * Uses the business numbers you provided as fixed demo inputs.
     * Replace the "DATA" constants with API data later.
     */

    const DATA = useMemo(() => {
        // 2) Attendance & Engagement
        const attendanceBreakdown = {
            presentPct: 75.0,
            absentNoNoticePct: 10.1,
            latePct: 5.0,
            otherPct: 100 - 75.0 - 10.1 - 5.0, // remainder bucket
        };

        const completionByAttendanceBand = [
            { band: '0–59%', completionPct: 52 },
            { band: '60–74%', completionPct: 54 },
            { band: '75–89%', completionPct: 57 },
            { band: '90–100%', completionPct: 55 },
        ];

        const cohortCompletionBySlot = [
            { slot: 'Fri Afternoon', completionPct: 52 },
            { slot: 'Fri Evening', completionPct: 57 },
        ];

        const absenceAlerts = {
            affectedParticipants: 5455,
            // A simple split to visualize "no notice" vs "other" alerts (judgement call)
            split: [
                { label: 'Absent (No Notice)', count: 5455 },
                { label: 'Late / Other', count: 2200 },
            ],
        };

        // 3) Assessment Performance
        const assessmentPassRates = [
            { type: 'Mock Interview', passPct: 49.6 },
            { type: 'Portfolio Review', passPct: 50.2 },
            { type: 'Final Assessment', passPct: 51.6 },
        ];

        const gradeDistribution = [
            { label: 'Distinction / Merit', pct: 30 },
            { label: 'Pass', pct: 50 },
            { label: 'Reassessment Required', pct: 20 },
        ];

        const reassessments = [
            { type: 'Mock Interview', count: 1750 },
            { type: 'Portfolio Review', count: 1750 },
            { type: 'Final Assessment', count: 1750 },
        ];

        return {
            attendanceBreakdown,
            completionByAttendanceBand,
            cohortCompletionBySlot,
            absenceAlerts,
            assessmentPassRates,
            gradeDistribution,
            reassessments,
        };
    }, []);

    // simple toggles to keep the page useful without overcomplicating
    const [showEngagement, setShowEngagement] = useState(true);
    const [showPerformance, setShowPerformance] = useState(true);

    const ChartCard = ({ title, subtitle, children }) => (
        <div className="panel" style={{ marginTop: 16 }}>
            <div className="panel-header">
                <h3>{title}</h3>
                {subtitle ? <span className="panel-chip">{subtitle}</span> : null}
            </div>
            {children}
        </div>
    );

    const BarRowChart = ({ items, valueKey, labelKey, maxValue, barColor, unitSuffix }) => {
        const safeMax = Math.max(1, maxValue);
        return (
            <div style={{ display: 'grid', gap: 12 }}>
                {items.map((it) => {
                    const label = it[labelKey];
                    const value = it[valueKey];
                    const pct = Math.max(0, Math.min(100, (value / safeMax) * 100));
                    return (
                        <div key={label} style={{ display: 'grid', gap: 6 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: 0.6 }}>
                  {label}
                </span>
                                <span style={{ fontSize: 12, color: 'var(--color-text-soft)', fontWeight: 700 }}>
                  {value}{unitSuffix || ''}
                </span>
                            </div>
                            <div style={{ height: 10, border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)' }}>
                                <div style={{ width: `${pct}%`, height: '100%', background: barColor }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const DuoBarMonthly = ({ series, maxValue }) => {
        // simple grouped bars, pixel height to avoid “invisible”
        const BAR_AREA_PX = 120;
        const safeMax = Math.max(1, maxValue);

        const heightPx = (v) => {
            const scaled = Math.round((v / safeMax) * BAR_AREA_PX);
            return Math.max(2, scaled);
        };

        return (
            <div
                style={{
                    display: 'grid',
                    gridAutoFlow: 'column',
                    gridAutoColumns: 'minmax(140px, 1fr)',
                    gap: 10,
                    alignItems: 'end',
                    padding: '14px 10px',
                    background: 'var(--color-bg-alt)',
                    border: '1px solid var(--color-border)',
                    overflowX: 'auto',
                }}
            >
                {series.map((m) => (
                    <div key={m.label} style={{ display: 'grid', gap: 8 }}>
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
                            title={`${m.label}: ${m.aLabel} ${m.aValue}${m.unit} | ${m.bLabel} ${m.bValue}${m.unit}`}
                        >
                            <div
                                style={{
                                    width: '50%',
                                    height: `${heightPx(m.aValue)}px`,
                                    borderRadius: '4px 4px 0 0',
                                    background: 'linear-gradient(180deg, var(--color-accent), rgba(179, 155, 102, 0.35))',
                                    border: '1px solid rgba(179, 155, 102, 0.4)',
                                }}
                            />
                            <div
                                style={{
                                    width: '50%',
                                    height: `${heightPx(m.bValue)}px`,
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
                            <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{m.aValue}{m.unit}</span>
                            <span style={{ color: 'var(--color-accent-alt)', fontWeight: 700 }}>{m.bValue}{m.unit}</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Create a “past 6 months” demo trend (judgement: stable but slightly improving)
    const last6MonthsTrend = useMemo(() => {
        const labels = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
        // Keep within reasonable ranges near your given baselines
        const enrollment = [120, 130, 125, 140, 150, 155];
        const completion = [60, 64, 62, 70, 74, 78];

        return labels.map((m, idx) => ({
            label: `${m}`,
            aLabel: 'Enroll',
            aValue: enrollment[idx],
            bLabel: 'Complete',
            bValue: completion[idx],
            unit: '',
        }));
    }, []);

    const trendMax = useMemo(
        () => Math.max(...last6MonthsTrend.map((x) => Math.max(x.aValue, x.bValue)), 1),
        [last6MonthsTrend]
    );

    const opportunityNote = useMemo(() => {
        const nonAttendancePct = 100 - DATA.attendanceBreakdown.presentPct;
        return `${nonAttendancePct.toFixed(1)}% non-attendance is a strong opportunity for targeted interventions.`;
    }, [DATA.attendanceBreakdown.presentPct]);

    return (
        <>
            <section className="stats-grid">
                <StatCard
                    label="Overall attendance (Present)"
                    value={`${DATA.attendanceBreakdown.presentPct.toFixed(1)}%`}
                    trend={`${DATA.attendanceBreakdown.absentNoNoticePct.toFixed(1)}% absent w/o notice • ${DATA.attendanceBreakdown.latePct.toFixed(1)}% late`}
                    trendType="up"
                    accent
                />
                <StatCard
                    label="Absence alerts (unique affected)"
                    value={DATA.absenceAlerts.affectedParticipants.toLocaleString()}
                    trend="Real-time staff follow-up"
                    trendType="up"
                />
                <StatCard
                    label="Pass rates (range)"
                    value={`${Math.min(...DATA.assessmentPassRates.map((x) => x.passPct)).toFixed(1)}–${Math.max(...DATA.assessmentPassRates.map((x) => x.passPct)).toFixed(1)}%`}
                    trend="Across assessment types"
                    trendType="up"
                />
            </section>

            <section className="content-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="panel">
                    <div className="panel-header">
                        <h3>Engagement & Performance</h3>
                        <span className="panel-chip">Monthly</span>
                    </div>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8, alignItems: 'center' }}>
                        <button className={`ghost small`} type="button" onClick={() => setShowEngagement((v) => !v)}>
                            {showEngagement ? 'Hide Engagement' : 'Show Engagement'}
                        </button>
                        <button className={`ghost small`} type="button" onClick={() => setShowPerformance((v) => !v)}>
                            {showPerformance ? 'Hide Performance' : 'Show Performance'}
                        </button>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                            {opportunityNote}
                        </div>
                    </div>
                </div>

                {showEngagement && (
                    <>
                        <ChartCard title="Attendance trend (last 6 months)" subtitle="Enrollment vs Completion (demo)">
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
                            <DuoBarMonthly series={last6MonthsTrend} maxValue={trendMax} />
                        </ChartCard>

                        <ChartCard title="Overall attendance breakdown" subtitle="Current snapshot">
                            <BarRowChart
                                items={[
                                    { label: 'Present', pct: DATA.attendanceBreakdown.presentPct },
                                    { label: 'Absent (No Notice)', pct: DATA.attendanceBreakdown.absentNoNoticePct },
                                    { label: 'Late', pct: DATA.attendanceBreakdown.latePct },
                                    { label: 'Other', pct: Math.max(0, DATA.attendanceBreakdown.otherPct) },
                                ]}
                                labelKey="label"
                                valueKey="pct"
                                maxValue={100}
                                barColor="linear-gradient(90deg, var(--color-accent), var(--color-accent-alt))"
                                unitSuffix="%"
                            />
                        </ChartCard>

                        <ChartCard title="Completion vs attendance band" subtitle="Attendance alone ≠ completion">
                            <BarRowChart
                                items={DATA.completionByAttendanceBand.map((x) => ({ label: x.band, pct: x.completionPct }))}
                                labelKey="label"
                                valueKey="pct"
                                maxValue={100}
                                barColor="var(--color-accent)"
                                unitSuffix="%"
                            />
                            <p style={{ marginTop: 12, color: 'var(--color-text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                                Insight: completion stays ~52–57% across bands → focus on engagement drivers beyond attendance.
                            </p>
                        </ChartCard>

                        <ChartCard title="Cohort completion by day/time" subtitle="Scheduling signal">
                            <BarRowChart
                                items={DATA.cohortCompletionBySlot.map((x) => ({ label: x.slot, pct: x.completionPct }))}
                                labelKey="label"
                                valueKey="pct"
                                maxValue={100}
                                barColor="var(--color-accent-alt)"
                                unitSuffix="%"
                            />
                        </ChartCard>

                        <ChartCard title="Absence alerts (operational)" subtitle="Where staff time goes">
                            <BarRowChart
                                items={DATA.absenceAlerts.split.map((x) => ({ label: x.label, count: x.count }))}
                                labelKey="label"
                                valueKey="count"
                                maxValue={Math.max(...DATA.absenceAlerts.split.map((x) => x.count), 1)}
                                barColor="var(--color-danger)"
                                unitSuffix=""
                            />
                        </ChartCard>
                    </>
                )}

                {showPerformance && (
                    <>
                        <ChartCard title="Pass rates by assessment type" subtitle="Current">
                            <BarRowChart
                                items={DATA.assessmentPassRates.map((x) => ({ label: x.type, pct: x.passPct }))}
                                labelKey="label"
                                valueKey="pct"
                                maxValue={100}
                                barColor="var(--color-accent)"
                                unitSuffix="%"
                            />
                        </ChartCard>

                        <ChartCard title="Grade distribution" subtitle="Across assessment types">
                            <BarRowChart
                                items={DATA.gradeDistribution.map((x) => ({ label: x.label, pct: x.pct }))}
                                labelKey="label"
                                valueKey="pct"
                                maxValue={100}
                                barColor="linear-gradient(90deg, var(--color-accent), var(--color-accent-alt))"
                                unitSuffix="%"
                            />
                        </ChartCard>

                        <ChartCard title="Reassessment tracking" subtitle="Workload">
                            <BarRowChart
                                items={DATA.reassessments.map((x) => ({ label: x.type, count: x.count }))}
                                labelKey="label"
                                valueKey="count"
                                maxValue={Math.max(...DATA.reassessments.map((x) => x.count), 1)}
                                barColor="var(--color-accent-alt)"
                                unitSuffix=""
                            />
                            <p style={{ marginTop: 12, color: 'var(--color-text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                                Next improvement: add a “due by” SLA and show overdue reassessments by week.
                            </p>
                        </ChartCard>
                    </>
                )}
            </section>
        </>
    );
}

export default EngagementPerformanceDashboard;