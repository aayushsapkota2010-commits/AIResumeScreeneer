import { useEffect, useState } from "react";
import api from "../api/api";
import "./Dashboard.css";
import Layout from "../components/Layout";
import {
    FaFileAlt,
    FaChartLine,
    FaStar,
    FaBullseye
} from "react-icons/fa";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";

const PIPELINE_STAGES = [
    { key: "applied", label: "Applied", color: "#4F46E5" },
    { key: "shortlisted", label: "Shortlisted", color: "#6366F1" },
    { key: "interviewed", label: "Interviewed", color: "#D97757" },
    { key: "selected", label: "Selected", color: "#65A088" },
    { key: "rejected", label: "Rejected", color: "#94A3B8" }
];

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get("/resume/dashboard")
            .then((response) => setDashboard(response.data))
            .catch((err) => {
                console.error(err);
                setError("We couldn't load your dashboard. Try refreshing the page.");
            });

        api.get("/resume/dashboard-chart")
            .then((response) => setChartData(response.data))
            .catch((err) => {
                console.error(err);
            });
    }, []);

    if (error) {
        return (
            <Layout>
                <div className="dash-state dash-state--error">
                    <p>{error}</p>
                </div>
            </Layout>
        );
    }

    if (!dashboard) {
        return (
            <Layout>
                <div className="dash-state">
                    <div className="dash-spinner" />
                    <p>Loading your dashboard…</p>
                </div>
            </Layout>
        );
    }

    const pieData = chartData
        ? PIPELINE_STAGES.map((stage) => ({
              name: stage.label,
              value: chartData[stage.key] ?? 0,
              color: stage.color
          }))
        : [];

    const maxStageValue = chartData
        ? Math.max(...PIPELINE_STAGES.map((s) => chartData[s.key] ?? 0), 1)
        : 1;

    return (
        
            <div className="dash-container">
                <header className="dash-header">
                    <p className="dash-eyebrow">Recruitment Overview</p>
                    <h1 className="dash-title">Welcome back</h1>
                    <p className="dash-subtitle">
                        Here's how your candidate pipeline is moving today.
                    </p>
                </header>

                <section className="dash-stats">
                    <StatCard
                        label="Total Resumes"
                        value={dashboard.totalResumes}
                        icon={<FaFileAlt />}
                        accent="indigo"
                    />
                    <StatCard
                        label="Average ATS Score"
                        value={dashboard.averageAtsScore.toFixed(1)}
                        icon={<FaChartLine />}
                        accent="sage"
                    />
                    <StatCard
                        label="Highest ATS Score"
                        value={dashboard.highestAtsScore}
                        icon={<FaStar />}
                        accent="amber"
                    />
                    <StatCard
                        label="Highest Match"
                        value={`${dashboard.highestMatchScore}%`}
                        icon={<FaBullseye />}
                        accent="slate"
                    />
                </section>

                {chartData && (
                    <>
                        <section className="dash-funnel">
                            <div className="dash-section-head">
                                <h2>Recruitment Pipeline</h2>
                                <span className="dash-section-sub">
                                    Candidates by stage
                                </span>
                            </div>

                            <div className="funnel-track">
                                {PIPELINE_STAGES.map((stage, index) => {
                                    const value = chartData[stage.key] ?? 0;
                                    const widthPct = Math.max(
                                        (value / maxStageValue) * 100,
                                        6
                                    );

                                    const prevValue =
                                        index > 0
                                            ? chartData[
                                                  PIPELINE_STAGES[index - 1]
                                                      .key
                                              ] ?? 0
                                            : null;
                                    const dropOff =
                                        prevValue &&
                                        prevValue > 0 &&
                                        stage.key !== "rejected"
                                            ? Math.round(
                                                  ((prevValue - value) /
                                                      prevValue) *
                                                      100
                                              )
                                            : null;

                                    return (
                                        <div
                                            className={`funnel-step ${
                                                stage.key === "rejected"
                                                    ? "funnel-step--exit"
                                                    : ""
                                            }`}
                                            key={stage.key}
                                        >
                                            {dropOff !== null && (
                                                <div className="funnel-dropoff">
                                                    <span className="funnel-dropoff-line" />
                                                    <span className="funnel-dropoff-label">
                                                        {dropOff > 0
                                                            ? `−${dropOff}%`
                                                            : "no loss"}
                                                    </span>
                                                </div>
                                            )}

                                            <div
                                                className="funnel-shape"
                                                style={{
                                                    width: `${widthPct}%`,
                                                    background: `linear-gradient(135deg, ${stage.color}, ${stage.color}E6)`
                                                }}
                                            >
                                                <span className="funnel-shape-label">
                                                    {stage.label}
                                                </span>
                                                <span className="funnel-shape-value">
                                                    {value}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="dash-charts">
                            <div className="dash-chart-card">
                                <div className="dash-section-head">
                                    <h2>Candidate Distribution</h2>
                                    <span className="dash-section-sub">
                                        Share of total pipeline
                                    </span>
                                </div>
                                <div className="dash-chart-body">
                                    <ResponsiveContainer width="100%" height={360}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius={70}
                                                outerRadius={120}
                                                paddingAngle={2}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell
                                                        key={entry.name}
                                                        fill={entry.color}
                                                        stroke="none"
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: 12,
                                                    border: "1px solid rgba(15, 23, 42, 0.08)",
                                                    boxShadow:
                                                        "0 12px 32px -10px rgba(15, 23, 42, 0.18)",
                                                    fontFamily:
                                                        "'IBM Plex Mono', monospace",
                                                    fontSize: 13,
                                                    padding: "10px 14px"
                                                }}
                                                itemStyle={{ padding: 0 }}
                                            />
                                            <Legend
                                                iconType="circle"
                                                iconSize={9}
                                                wrapperStyle={{
                                                    fontSize: 13,
                                                    paddingTop: 18
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="dash-chart-card">
                                <div className="dash-section-head">
                                    <h2>Stage Comparison</h2>
                                    <span className="dash-section-sub">
                                        Volume by pipeline stage
                                    </span>
                                </div>
                                <div className="dash-chart-body">
                                    <ResponsiveContainer width="100%" height={360}>
                                        <BarChart data={pieData}>
                                            <CartesianGrid
                                                strokeDasharray="3 6"
                                                stroke="rgba(15, 23, 42, 0.07)"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fontSize: 12, fill: "#6B7280" }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12, fill: "#6B7280" }}
                                                axisLine={false}
                                                tickLine={false}
                                                allowDecimals={false}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: 12,
                                                    border: "1px solid rgba(15, 23, 42, 0.08)",
                                                    boxShadow:
                                                        "0 12px 32px -10px rgba(15, 23, 42, 0.18)",
                                                    fontFamily:
                                                        "'IBM Plex Mono', monospace",
                                                    fontSize: 13,
                                                    padding: "10px 14px"
                                                }}
                                                itemStyle={{ padding: 0 }}
                                                cursor={{
                                                    fill: "rgba(79,70,229,0.05)",
                                                    radius: 6
                                                }}
                                            />
                                            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={64}>
                                                {pieData.map((entry) => (
                                                    <Cell
                                                        key={entry.name}
                                                        fill={entry.color}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </div>
        
    );
}

function StatCard({ label, value, icon, accent }) {
    return (
        <div className={`stat-card stat-card--${accent}`}>
            <div className="stat-card-glow" />
            <div className="stat-card-top">
                <span className="stat-card-label">{label}</span>
                <span className="stat-card-icon">{icon}</span>
            </div>
            <span className="stat-card-value">{value}</span>
            <div className="stat-card-bar" />
        </div>
    );
}

export default Dashboard;
