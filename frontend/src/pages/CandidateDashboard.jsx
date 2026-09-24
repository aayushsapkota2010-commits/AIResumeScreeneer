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

            console.error(
                "Dashboard error:",
                error
            );

            setError(
                "Unable to load your dashboard."
            );

        });

}, []);

    if (error) {

        return (
            <div className="candidate-page">
                <div className="dashboard-error">
                    {error}
                </div>
            </div>
        );

    }

    if (!dashboard) {

        return (
            <div className="candidate-page">
                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading your dashboard...</p>
                </div>
            </div>
        );

    }

    return (

        <div className="candidate-page">

            <div className="candidate-container">

                {/* Header */}

                <div className="candidate-header">

                    <div>

                        <p className="dashboard-label">
                            CANDIDATE PORTAL
                        </p>

                        <h1>
                            Candidate Dashboard
                        </h1>

                        <p className="dashboard-subtitle">
                            Track your resume performance and application progress.
                        </p>

                    </div>

                    <button
                        className="browse-jobs-button"
                        onClick={() =>
                            window.location.href = "/browse-jobs"
                        }
                    >
                        Browse Jobs →
                    </button>

                </div>


                {/* Score Cards */}

                <div className="stats-grid">

                    <div className="stat-card">

                        <div className="stat-icon blue">
                            ✓
                        </div>

                        <div>

                            <p className="stat-title">
                                ATS Score
                            </p>

                            <h2>
                                {dashboard.atsScore ?? 0}
                                <span>/100</span>
                            </h2>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon purple">
                            ◎
                        </div>

                        <div>

                            <p className="stat-title">
                                Match Score
                            </p>

                            <h2>
                                {dashboard.matchScore ?? 0}
                                <span>/100</span>
                            </h2>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon green">
                            ✓
                        </div>

                        <div>

                            <p className="stat-title">
                                Application Status
                            </p>

                            <h2 className="status-value">
                                {dashboard.status || "Not Applied"}
                            </h2>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon orange">
                            #
                        </div>

                        <div>

                            <p className="stat-title">
                                Resume ID
                            </p>

                            <h2>
                                #{dashboard.resumeId ?? "--"}
                            </h2>

                        </div>

                    </div>

                </div>


                {/* Main Content */}

                <div className="dashboard-grid">

                    {/* Resume Performance */}

                    <div className="dashboard-card performance-card">

                        <div className="card-header">

                            <div>

                                <h3>
                                    Resume Performance
                                </h3>

                                <p>
                                    How your resume performs against screening systems.
                                </p>

                            </div>

                            <span className="card-badge">
                                AI Analysis
                            </span>

                        </div>


                        <div className="score-section">

                      <div
    className="score-circle"
    style={{
        "--score": Math.min(
            dashboard.atsScore ?? 0,
            100
        )
    }}
>

                                <div>

                                    <strong>
                                        {dashboard.atsScore ?? 0}
                                    </strong>

                                    <span>
                                        ATS
                                    </span>

                                </div>

                            </div>


                            <div className="score-info">

                                <h4>
                                    Resume screening score
                                </h4>

                                <p>
                                    Your ATS score indicates how well your resume is structured for automated screening systems.
                                </p>

                                <div className="progress-container">

                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${Math.min(
                                                dashboard.atsScore ?? 0,
                                                100
                                            )}%`
                                        }}
                                    />

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* Application Status */}

                    <div className="dashboard-card">

                        <div className="card-header">

                            <div>

                                <h3>
                                    Application Status
                                </h3>

                                <p>
                                    Current progress of your latest application.
                                </p>

                            </div>

                        </div>


                        <div className="application-status">

                            <div className="status-dot"></div>

                            <div>

                                <strong>
                                    {dashboard.status || "Not Applied"}
                                </strong>

                                <p>
                                    Latest application status
                                </p>

                            </div>

                        </div>


                        <button
                            className="secondary-button"
                            onClick={() =>
                                window.location.href = "/my-applications"
                            }
                        >
                            View My Applications
                        </button>

                    </div>

                </div>


                {/* Quick Actions */}

                <div className="dashboard-card quick-actions-card">

                    <div className="card-header">

                        <div>

                            <h3>
                                Quick Actions
                            </h3>

                            <p>
                                Continue your job search.
                            </p>

                        </div>

                    </div>


                    <div className="quick-actions">

                        <button
                            onClick={() =>
                                window.location.href = "/browse-jobs"
                            }
                        >
                            <span>💼</span>

                            <div>
                                <strong>
                                    Browse Jobs
                                </strong>

                                <small>
                                    Find opportunities
                                </small>
                            </div>

                            <b>→</b>

                        </button>


                        <button
                            onClick={() =>
                                window.location.href = "/my-resumes"
                            }
                        >
                            <span>📄</span>

                            <div>
                                <strong>
                                    My Resumes
                                </strong>

                                <small>
                                    Manage your resumes
                                </small>
                            </div>

                            <b>→</b>

                        </button>


                        <button
                            onClick={() =>
                                window.location.href = "/my-applications"
                            }
                        >
                            <span>📋</span>

                            <div>
                                <strong>
                                    My Applications
                                </strong>

                                <small>
                                    Track applications
                                </small>
                            </div>

                            <b>→</b>

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default CandidateDashboard;