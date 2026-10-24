import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FileText,
    Briefcase,
    MapPin,
    CalendarDays,
    Loader2,
    ArrowRight,
    Inbox,
    CheckCircle2,
    Clock3,
    XCircle,
    Target,
    Sparkles,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import api from "../api/api";
import "./MyApplications.css";

function MyApplications() {

    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/applications/my");

            setApplications(response.data || []);

        } catch (err) {

            console.error(
                "Failed to fetch applications:",
                err
            );

            setError(
                "Unable to load your applications."
            );

        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (applicationId) => {
    const confirmed = window.confirm(
        "Are you sure you want to withdraw this application?"
    );

    if (!confirmed) return;

    try {
        // Withdraw application
        await api.put(
            `/applications/${applicationId}/withdraw`
        );

        // Refresh applications
        const response = await api.get(
            "/applications/my"
        );

        setApplications(response.data || []);

    } catch (error) {

        console.error(
            "Failed to withdraw application:",
            error
        );

        alert(
            error.response?.data ||
            "Failed to withdraw application."
        );
    }
};

    const getStatusClass = (status) => {

    switch (status) {

        case "APPLIED":
            return "status-applied";

        case "SCREENING":
            return "status-screening";

        case "SHORTLISTED":
            return "status-shortlisted";

        case "INTERVIEW":
            return "status-interview";

        case "SELECTED":
            return "status-selected";

        case "REJECTED":
            return "status-rejected";

        case "WITHDRAWN":
            return "status-withdrawn";

        default:
            return "status-applied";
    }
};

   const getStatusIcon = (status) => {

    switch (status) {

        case "SELECTED":
            return <CheckCircle2 size={15} />;

        case "REJECTED":
            return <XCircle size={15} />;

        case "WITHDRAWN":
            return <XCircle size={15} />;

        default:
            return <Clock3 size={15} />;
    }
};

    const getStatusMessage = (status) => {
    switch (status) {
        case "APPLIED":
            return {
                title: "Application submitted",
                message:
                    "Your application has been successfully submitted and is waiting for recruiter review.",
                className: "action-applied"
            };

        case "SCREENING":
            return {
                title: "Application under review",
                message:
                    "The recruiter is currently reviewing your application.",
                className: "action-screening"
            };

        case "SHORTLISTED":
            return {
                title: "You've been shortlisted",
                message:
                    "Your profile has been shortlisted for the next stage of the recruitment process.",
                className: "action-shortlisted"
            };

        case "INTERVIEW":
            return {
                title: "Interview stage",
                message:
                    "Your application has reached the interview stage. Check your notifications for any interview details.",
                className: "action-interview"
            };

        case "SELECTED":
            return {
                title: "Congratulations! 🎉",
                message:
                    "You have been selected for this position. Check your notifications for further details.",
                className: "action-selected"
            };

        case "REJECTED":
            return {
                title: "Application update",
                message:
                    "This application was not selected for the next stage. You can continue exploring other opportunities.",
                className: "action-rejected"
            };

            case "WITHDRAWN":
    return {
        title: "Application withdrawn",
        message:
            "You have withdrawn this application. Your application history and AI analysis have been preserved.",
        className: "action-withdrawn"
    };

        default:
            return {
                title: "Application status",
                message:
                    "Your application status has been updated.",
                className: "action-applied"
            };
    }
};

    const formatStatus = (status) => {

        if (!status) {
            return "Applied";
        }

        return status
            .toLowerCase()
            .replace("_", " ")
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    const formatDate = (date) => {

        if (!date) {
            return "Recently";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };

    const toggleApplication = (id) => {

        setExpandedId(
            expandedId === id ? null : id
        );
    };

    /*
     * Application progress stages
     */
    const stages = [
        "APPLIED",
        "SCREENING",
        "SHORTLISTED",
        "INTERVIEW",
        "SELECTED"
    ];

    const getStageIndex = (status) => {

        return stages.indexOf(status);
    };

    const renderTimeline = (status) => {

    /*
     * Rejected applications get a separate timeline.
     */
    if (status === "REJECTED") {

        return (
            <div className="application-timeline rejected-timeline">

                <div className="timeline-step completed">
                    <div className="timeline-dot">
                        <CheckCircle2 size={13} />
                    </div>
                    <span>Applied</span>
                </div>

                <div className="timeline-line completed-line" />

                <div className="timeline-step rejected-step">
                    <div className="timeline-dot">
                        <XCircle size={13} />
                    </div>
                    <span>Rejected</span>
                </div>

            </div>
        );
    }


    /*
     * Withdrawn applications get a separate timeline.
     */
    if (status === "WITHDRAWN") {

        return (
            <div className="application-timeline withdrawn-timeline">

                <div className="timeline-step completed">
                    <div className="timeline-dot">
                        <CheckCircle2 size={13} />
                    </div>
                    <span>Applied</span>
                </div>

                <div className="timeline-line completed-line" />

                <div className="timeline-step withdrawn-step">
                    <div className="timeline-dot">
                        <XCircle size={13} />
                    </div>
                    <span>Withdrawn</span>
                </div>

            </div>
        );
    }


    const currentIndex =
        getStageIndex(status);

    return (
        <div className="application-timeline">

            {stages.map((stage, index) => {

                const completed =
                    currentIndex >= index;

                const current =
                    currentIndex === index;

                return (
                    <div
                        className="timeline-wrapper"
                        key={stage}
                    >

                        <div
                            className={`timeline-step ${
                                completed
                                    ? "completed"
                                    : ""
                            } ${
                                current
                                    ? "current"
                                    : ""
                            }`}
                        >

                            <div className="timeline-dot">

                                {completed ? (
                                    <CheckCircle2
                                        size={13}
                                    />
                                ) : (
                                    <span />
                                )}

                            </div>

                            <span>
                                {formatStatus(stage)}
                            </span>

                        </div>

                        {index < stages.length - 1 && (
                            <div
                                className={`timeline-line ${
                                    currentIndex > index
                                        ? "completed-line"
                                        : ""
                                }`}
                            />
                        )}

                    </div>
                );
            })}

        </div>
    );
};

    /*
     * Score color helper
     */
    const getScoreClass = (score) => {

        if (score === null || score === undefined) {
            return "score-neutral";
        }

        if (score >= 80) {
            return "score-excellent";
        }

        if (score >= 60) {
            return "score-good";
        }

        if (score >= 40) {
            return "score-average";
        }

        return "score-low";
    };

    if (loading) {

        return (
            <div className="my-applications-page">

                <div className="my-applications-loading">

                    <Loader2
                        className="spin"
                        size={22}
                    />

                    Loading your applications...

                </div>

            </div>
        );
    }

    return (

        <div className="my-applications-page">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="my-applications-header">

                <div>

                    <span className="applications-label">
                        YOUR APPLICATIONS
                    </span>

                    <h1>
                        My Applications
                    </h1>

                    <p>
                        Track your applications, AI match
                        analysis and recruitment progress.
                    </p>

                </div>

                <button
                    className="browse-jobs-button"
                    onClick={() =>
                        navigate("/browse-jobs")
                    }
                >

                    <Briefcase size={17} />

                    Browse Jobs

                </button>

            </div>


            {/* =========================================
                ERROR
            ========================================= */}

            {error && (

                <div className="applications-error">

                    {error}

                    <button
                        onClick={fetchApplications}
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* =========================================
                EMPTY STATE
            ========================================= */}

            {!error &&
                applications.length === 0 && (

                    <div className="applications-empty">

                        <div className="empty-icon">
                            <Inbox size={38} />
                        </div>

                        <h2>
                            No applications yet
                        </h2>

                        <p>
                            You haven't applied for any jobs
                            yet. Explore available opportunities
                            and submit your first application.
                        </p>

                        <button
                            className="browse-jobs-button"
                            onClick={() =>
                                navigate("/browse-jobs")
                            }
                        >

                            Browse Jobs

                            <ArrowRight
                                size={17}
                            />

                        </button>

                    </div>
                )}


            {/* =========================================
                APPLICATION LIST
            ========================================= */}

            {!error &&
                applications.length > 0 && (

                    <div className="applications-list">

                        {applications.map(
                            (application) => {

                                const job =
                                    application.job;

                                const resume =
                                    application.resume;

                                const isExpanded =
                                    expandedId ===
                                    application.id;

                                return (

                                    <div
                                        className={`application-card ${
                                            isExpanded
                                                ? "expanded"
                                                : ""
                                        }`}
                                        key={
                                            application.id
                                        }
                                    >

                                        {/* =================================
                                            MAIN APPLICATION HEADER
                                        ================================= */}

                                        <div className="application-main">

                                            <div className="application-company-icon">

                                                {job?.company
                                                    ?.charAt(0)
                                                    ?.toUpperCase() ||
                                                    "C"}

                                            </div>


                                            <div className="application-info">

                                                <div className="application-title-row">

                                                    <h2>
                                                        {job?.title ||
                                                            "Job Application"}
                                                    </h2>

                                                    <span
                                                        className={`application-status ${getStatusClass(
                                                            application.status
                                                        )}`}
                                                    >

                                                        {getStatusIcon(
                                                            application.status
                                                        )}

                                                        {formatStatus(
                                                            application.status
                                                        )}

                                                    </span>

                                                </div>


                                                <p className="application-company">

                                                    {job?.company ||
                                                        "Company"}

                                                </p>


                                                <div className="application-meta">

                                                    {job?.location && (

                                                        <span>
                                                            <MapPin
                                                                size={14}
                                                            />

                                                            {job.location}
                                                        </span>

                                                    )}

                                                    <span>

                                                        <CalendarDays
                                                            size={14}
                                                        />

                                                        Applied{" "}
                                                        {formatDate(
                                                            application.appliedAt
                                                        )}

                                                    </span>

                                                    {resume?.fileName && (

                                                        <span>

                                                            <FileText
                                                                size={14}
                                                            />

                                                            {resume.fileName}

                                                        </span>

                                                    )}

                                                </div>

                                            </div>

                                        </div>


                                        {/* =================================
                                            SCORE SECTION
                                        ================================= */}

                                        <div className="application-scores">

                                            <div className="application-score-card">

                                                <div className="score-icon ats-icon">
                                                    <FileText
                                                        size={17}
                                                    />
                                                </div>

                                                <div>

                                                    <span>
                                                        ATS Score
                                                    </span>

                                                    <strong
                                                        className={getScoreClass(
                                                            application.atsScore
                                                        )}
                                                    >
                                                        {application.atsScore ??
                                                            "—"}
                                                        {application.atsScore !==
                                                            null &&
                                                        application.atsScore !==
                                                            undefined
                                                            ? "/100"
                                                            : ""}
                                                    </strong>

                                                </div>

                                            </div>


                                            <div className="application-score-card">

                                                <div className="score-icon match-icon">
                                                    <Target
                                                        size={17}
                                                    />
                                                </div>

                                                <div>

                                                    <span>
                                                        Job Match
                                                    </span>

                                                    <strong
                                                        className={getScoreClass(
                                                            application.matchScore
                                                        )}
                                                    >
                                                        {application.matchScore ??
                                                            "—"}
                                                        {application.matchScore !==
                                                            null &&
                                                        application.matchScore !==
                                                            undefined
                                                            ? "%"
                                                            : ""}
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>


                                        {/* =================================
                                            TIMELINE
                                        ================================= */}

                                        <div className="timeline-section">

                                            <div className="timeline-header">

                                                <div>

                                                    <strong>
                                                        Application Progress
                                                    </strong>

                                                    <span>
                                                        Current stage:{" "}
                                                        {formatStatus(
                                                            application.status
                                                        )}
                                                    </span>

                                                </div>

                                            </div>

                                            {renderTimeline(
                                                application.status
                                            )}
                                            {(() => {
    const statusMessage =
        getStatusMessage(application.status);

    return (
        <div
            className={`application-status-message ${statusMessage.className}`}
        >
            <div className="status-message-content">
                <strong>
                    {statusMessage.title}
                </strong>

                <p>
                    {statusMessage.message}
                </p>
            </div>
        </div>
    );
})()}

                                        </div>


                                        {/* =================================
                                            ACTIONS
                                        ================================= */}

                                        <div className="application-footer">

                                            <button
                                                className="details-button"
                                                onClick={() =>
                                                    toggleApplication(
                                                        application.id
                                                    )
                                                }
                                            >

                                                {isExpanded ? (
                                                    <>
                                                        Hide AI Analysis
                                                        <ChevronUp
                                                            size={16}
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        View AI Analysis
                                                        <ChevronDown
                                                            size={16}
                                                        />
                                                    </>
                                                )}

                                            </button>


                                            <div className="application-actions">

                                                <button
                                                    className="secondary-action"
                                                    onClick={() =>
                                                        navigate(
                                                            `/jobs/${job?.id}`
                                                        )
                                                    }
                                                >

                                                    View Job

                                                    <ArrowRight
                                                        size={16}
                                                    />

                                                </button>

                                            </div>

                                        </div>


                                        {/* =================================
                                            EXPANDED AI ANALYSIS
                                        ================================= */}
{isExpanded && (
    <div className="ai-analysis-panel">

        {/* ================================
            ANALYSIS HEADER
        ================================= */}

        <div className="analysis-heading">
            <div className="analysis-icon">
                <Sparkles size={19} />
            </div>

            <div>
                <h3>Job Match Details</h3>

                <p>
                    Resume analysis for{" "}
                    <strong>
                        {job?.title || "this position"}
                    </strong>
                    {job?.company
                        ? ` at ${job.company}`
                        : ""}
                </p>
            </div>
        </div>


        {/* ================================
            MATCH SUMMARY
        ================================= */}

        <div className="match-summary">

            <div className="match-score-main">

                <div
                    className="match-score-circle"
                    style={{
                        "--match-score": Math.min(
                            Math.max(application.matchScore ?? 0, 0),
                            100
                        )
                    }}
                >
                    <div>
                        <strong>
                            {application.matchScore ?? "—"}
                        </strong>

                        {application.matchScore !== null &&
                            application.matchScore !== undefined && (
                                <span>%</span>
                            )}
                    </div>
                </div>

                <div className="match-score-info">
                    <span className="match-score-label">
                        Job Match
                    </span>

                    <strong>
                        {application.matchScore == null
                            ? "Match score unavailable"
                            : application.matchScore >= 80
                                ? "Excellent match"
                                : application.matchScore >= 60
                                    ? "Good match"
                                    : application.matchScore >= 40
                                        ? "Moderate match"
                                        : "Low match"}
                    </strong>

                    <p>
                        Based on the recognized skills required
                        for this job.
                    </p>
                </div>

            </div>


            <div className="match-score-divider" />


            <div className="ats-summary">

                <div className="ats-summary-icon">
                    <FileText size={18} />
                </div>

                <div>
                    <span>ATS Score</span>

                    <strong
                        className={getScoreClass(
                            application.atsScore
                        )}
                    >
                        {application.atsScore ?? "—"}

                        {application.atsScore !== null &&
                            application.atsScore !== undefined
                            ? "/100"
                            : ""}
                    </strong>

                    <p>
                        Resume screening score
                    </p>
                </div>

            </div>

        </div>


        {/* ================================
            MATCH PROGRESS
        ================================= */}

        {application.matchScore !== null &&
            application.matchScore !== undefined && (
                <div className="match-progress-section">

                    <div className="match-progress-header">
                        <span>Skill match progress</span>

                        <strong>
                            {application.matchScore}%
                        </strong>
                    </div>

                    <div className="match-progress-track">
                        <div
                            className="match-progress-fill"
                            style={{
                                width: `${Math.min(
                                    Math.max(
                                        application.matchScore,
                                        0
                                    ),
                                    100
                                )}%`
                            }}
                        />
                    </div>

                </div>
            )}


        {/* ================================
            SKILLS
        ================================= */}

        <div className="analysis-grid">

            {/* MATCHED SKILLS */}

            <div className="skills-box matched-box">

                <div className="skills-box-header">

                    <div className="skills-box-title">
                        <CheckCircle2 size={17} />

                        <h4>Matched Skills</h4>
                    </div>

                    <span className="skills-count">
                        {application.matchedSkills
                            ? application.matchedSkills
                                .split(",")
                                .filter(
                                    (skill) =>
                                        skill.trim()
                                ).length
                            : 0}
                    </span>

                </div>


                {application.matchedSkills ? (
                    <div className="skills-list">

                        {application.matchedSkills
                            .split(",")
                            .map((skill) => skill.trim())
                            .filter(Boolean)
                            .map((skill) => (
                                <span key={skill}>
                                    ✓ {skill}
                                </span>
                            ))}

                    </div>
                ) : (
                    <p className="no-skill-data">
                        No matched skills recorded.
                    </p>
                )}

            </div>


            {/* MISSING SKILLS */}

            <div className="skills-box missing-box">

                <div className="skills-box-header">

                    <div className="skills-box-title">
                        <Target size={17} />

                        <h4>Missing Skills</h4>
                    </div>

                    <span className="skills-count">
                        {application.missingSkills
                            ? application.missingSkills
                                .split(",")
                                .filter(
                                    (skill) =>
                                        skill.trim()
                                ).length
                            : 0}
                    </span>

                </div>


                {application.missingSkills ? (
                    <div className="skills-list">

                        {application.missingSkills
                            .split(",")
                            .map((skill) => skill.trim())
                            .filter(Boolean)
                            .map((skill) => (
                                <span key={skill}>
                                    + {skill}
                                </span>
                            ))}

                    </div>
                ) : (
                    <p className="no-skill-data">
                        No missing skills detected.
                    </p>
                )}

            </div>

        </div>


        {/* ================================
            RECOMMENDATION
        ================================= */}

        <div className="recommendation-box">

            <div className="recommendation-icon">
                <Sparkles size={17} />
            </div>

            <div>

                <strong>Recommendation</strong>

                <p>
                    {application.recommendation ||
                        "No recommendation available."}
                </p>

            </div>

        </div>


        {/* ================================
            SUBMITTED RESUME
        ================================= */}

        <div className="submitted-resume">

            <div>

                <FileText size={19} />

                <div>

                    <strong>
                        Submitted Resume
                    </strong>

                    <span>
                        {resume?.fileName || "Resume"}
                    </span>

                </div>

            </div>


            <div className="resume-actions">

                {resume?.id && (
                    <button
                        onClick={() =>
                            window.open(
                                `${import.meta.env.VITE_API_URL}/resume/view/${resume.id}`,
                                "_blank"
                            )
                        }
                    >
                        View Resume
                    </button>
                )}


                {[
                    "APPLIED",
                    "SCREENING",
                    "SHORTLISTED",
                    "INTERVIEW"
                ].includes(application.status) && (
                    <button
                        className="withdraw-analysis-button"
                        onClick={() =>
                            handleWithdraw(application.id)
                        }
                    >
                        Withdraw
                    </button>
                )}

            </div>

        </div>

    </div>
)}

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

        </div>
    );
}

export default MyApplications;