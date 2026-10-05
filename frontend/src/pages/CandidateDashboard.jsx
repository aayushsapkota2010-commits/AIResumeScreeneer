import { useEffect, useState } from "react";
import api from "../api/api";
import "./CandidateDashboard.css";

function CandidateDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/resume/candidate-dashboard")
            .then((response) => {
                setDashboard(response.data);
            })
            .catch((error) => {
                console.error("Dashboard error:", error);
                setError("Unable to load your dashboard.");
            });
    }, []);

    if (error) {
        return (
            <div className="candidate-dashboard-page">
                <div className="candidate-dashboard-error">
                    {error}
                </div>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="candidate-dashboard-page">
                <div className="candidate-dashboard-loading">
                    <div className="candidate-loading-spinner"></div>
                    <p>Loading your career dashboard...</p>
                </div>
            </div>
        );
    }

    const hasApplication =
        dashboard.status &&
        dashboard.status !== "NOT_APPLIED";

    const atsScore = dashboard.atsScore ?? 0;
    const matchScore = dashboard.matchScore ?? 0;

    return (
        <div className="candidate-dashboard-page">
            <div className="candidate-dashboard-container">

                {/* HERO */}
                <section className="candidate-hero">

                    <div className="candidate-hero-content">

                        <span className="candidate-dashboard-eyebrow">
                            AI CAREER PORTAL
                        </span>

                        <h1>
                            Your career,
                            <br />
                            <span>powered by intelligence.</span>
                        </h1>

                        <p>
                            Track your resume performance, application
                            progress and job match from one place.
                        </p>

                        <div className="candidate-hero-actions">

                            <button
                                className="candidate-primary-action"
                                onClick={() =>
                                    window.location.href =
                                        "/browse-jobs"
                                }
                            >
                                Explore Jobs
                                <span>→</span>
                            </button>

                            <button
                                className="candidate-secondary-action"
                                onClick={() =>
                                    window.location.href =
                                        "/my-resumes"
                                }
                            >
                                View My Resumes
                            </button>

                        </div>
                    </div>

                    <div className="candidate-hero-status-card">

                        <div className="candidate-hero-status-top">
                            <span>APPLICATION STATUS</span>

                            <div
                                className={`candidate-status-indicator ${
                                    hasApplication
                                        ? "active"
                                        : "inactive"
                                }`}
                            ></div>
                        </div>

                        <h3>
                            {hasApplication
                                ? dashboard.status
                                : "Not Applied"}
                        </h3>

                        {hasApplication ? (
                            <>
                                <p>
                                    {dashboard.jobTitle ||
                                        "Current application"}
                                </p>

                                <strong>
                                    {dashboard.companyName ||
                                        "Company"}
                                </strong>
                            </>
                        ) : (
                            <p>
                                Start exploring opportunities and
                                submit your first application.
                            </p>
                        )}

                    </div>
                </section>

                {/* SCORE OVERVIEW */}
                <section className="candidate-score-overview">

                    <div className="candidate-section-heading">

                        <div>
                            <span>RESUME INTELLIGENCE</span>

                            <h2>
                                Your performance at a glance
                            </h2>
                        </div>

                        <p>
                            AI-powered insights from your latest
                            application.
                        </p>

                    </div>

                    <div className="candidate-score-grid">

                        {/* ATS */}
                        <div className="candidate-intelligence-card">

                            <div className="candidate-card-top">

                                <div className="candidate-metric-icon">
                                    ✓
                                </div>

                                <span>ATS SCORE</span>

                            </div>

                            <div className="candidate-metric-value">

                                {dashboard.atsScore ?? "—"}

                                {dashboard.atsScore !== null && (
                                    <small>/100</small>
                                )}

                            </div>

                            <p>
                                How well your resume performs against
                                automated screening systems.
                            </p>

                            <div className="candidate-metric-progress">

                                <div
                                    style={{
                                        width: `${Math.min(
                                            atsScore,
                                            100
                                        )}%`
                                    }}
                                />

                            </div>

                            <small className="candidate-resume-reference">
                                {dashboard.resumeFileName ||
                                    "No application resume"}
                            </small>

                        </div>

                        {/* MATCH */}
                        <div className="candidate-intelligence-card">

                            <div className="candidate-card-top">

                                <div className="candidate-metric-icon">
                                    ◎
                                </div>

                                <span>JOB MATCH</span>

                            </div>

                            <div className="candidate-metric-value">

                                {dashboard.matchScore ?? "—"}

                                {dashboard.matchScore !== null && (
                                    <small>/100</small>
                                )}

                            </div>

                            <p>
                                AI-estimated compatibility between
                                your resume and the applied position.
                            </p>

                            <div className="candidate-metric-progress">

                                <div
                                    style={{
                                        width: `${Math.min(
                                            matchScore,
                                            100
                                        )}%`
                                    }}
                                />

                            </div>

                            <div className="candidate-job-reference">

                                <strong>
                                    {dashboard.jobTitle ||
                                        "No application yet"}
                                </strong>

                                <span>
                                    {dashboard.companyName || ""}
                                </span>

                            </div>

                        </div>

                        {/* RESUME */}
                        <div className="candidate-intelligence-card candidate-resume-card">

                            <div className="candidate-card-top">

                                <div className="candidate-metric-icon">
                                    📄
                                </div>

                                <span>ACTIVE RESUME</span>

                            </div>

                            <h3>
                                {dashboard.resumeFileName ||
                                    "No resume"}
                            </h3>

                            <p>
                                Resume currently associated with
                                your latest application.
                            </p>

                            <button
                                onClick={() =>
                                    window.location.href =
                                        "/my-resumes"
                                }
                            >
                                Manage Resume →
                            </button>

                        </div>

                    </div>
                </section>

                {/* APPLICATION JOURNEY */}
                <section className="candidate-application-section">

                    <div className="candidate-section-heading">

                        <div>
                            <span>APPLICATION JOURNEY</span>

                            <h2>
                                Your latest opportunity
                            </h2>
                        </div>

                    </div>

                    <div className="candidate-application-card">

                        <div className="candidate-application-main">

                            <div className="candidate-company-logo">
                                {dashboard.companyName
                                    ? dashboard.companyName
                                          .charAt(0)
                                          .toUpperCase()
                                    : "J"}
                            </div>

                            <div>

                                <span className="candidate-application-label">
                                    LATEST APPLICATION
                                </span>

                                <h3>
                                    {dashboard.jobTitle ||
                                        "No application yet"}
                                </h3>

                                <p>
                                    {dashboard.companyName ||
                                        "Explore jobs to get started"}
                                </p>

                            </div>

                        </div>

                        <div className="candidate-application-meta">

                            <div>
                                <span>STATUS</span>

                                <strong>
                                    {dashboard.status ||
                                        "NOT APPLIED"}
                                </strong>
                            </div>

                            <div>
                                <span>APPLIED ON</span>

                                <strong>
                                    {dashboard.applicationAppliedAt
                                        ? new Date(
                                              dashboard.applicationAppliedAt
                                          ).toLocaleDateString(
                                              "en-IN",
                                              {
                                                  day: "numeric",
                                                  month: "short",
                                                  year: "numeric"
                                              }
                                          )
                                        : "—"}
                                </strong>
                            </div>

                        </div>

                        <button
                            className="candidate-application-button"
                            onClick={() =>
                                (window.location.href =
                                    "/my-applications")
                            }
                        >
                            View Application →
                        </button>

                    </div>
                </section>

                {/* AI INSIGHT */}
                <section className="candidate-ai-insight">

                    <div className="candidate-ai-glow"></div>

                    <div className="candidate-ai-icon">
                        ✦
                    </div>

                    <div className="candidate-ai-content">

                        <span>AI CAREER INSIGHT</span>

                        <h2>
                            Keep improving your resume.
                        </h2>

                        <p>
                            Your resume intelligence scores are
                            calculated using your latest application.
                            Explore more opportunities and keep
                            refining your resume to improve your
                            chances of getting shortlisted.
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            (window.location.href =
                                "/my-resumes")
                        }
                    >
                        Improve Resume →
                    </button>

                </section>

                {/* QUICK ACTIONS */}
                <section className="candidate-quick-section">

                    <div className="candidate-section-heading">

                        <div>
                            <span>QUICK ACTIONS</span>

                            <h2>
                                Keep moving forward
                            </h2>
                        </div>

                    </div>

                    <div className="candidate-quick-grid">

                        <button
                            onClick={() =>
                                (window.location.href =
                                    "/browse-jobs")
                            }
                        >
                            <span>💼</span>

                            <div>
                                <strong>Browse Jobs</strong>

                                <small>
                                    Discover new opportunities
                                </small>
                            </div>

                            <b>→</b>
                        </button>

                        <button
                            onClick={() =>
                                (window.location.href =
                                    "/my-resumes")
                            }
                        >
                            <span>📄</span>

                            <div>
                                <strong>My Resumes</strong>

                                <small>
                                    Manage your resume library
                                </small>
                            </div>

                            <b>→</b>
                        </button>

                        <button
                            onClick={() =>
                                (window.location.href =
                                    "/my-applications")
                            }
                        >
                            <span>📋</span>

                            <div>
                                <strong>My Applications</strong>

                                <small>
                                    Track your applications
                                </small>
                            </div>

                            <b>→</b>
                        </button>

                    </div>
                </section>

            </div>
        </div>
    );
}

export default CandidateDashboard;