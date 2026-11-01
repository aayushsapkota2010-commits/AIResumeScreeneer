import { useEffect, useMemo, useState } from "react";
import {
    Users,
    Clock3,
    CalendarDays,
    UserCheck,
    UserX,
    Inbox,
    FileText,
    Building2,
    AlertCircle
} from "lucide-react";
import api from "../api/api";
import "./PipelineBoard.css";

const STATUS_META = {
    APPLIED: {
        label: "Applied",
        accent: "#6366f1",
        soft: "#eef2ff"
    },
    SCREENING: {
        label: "Screening",
        accent: "#0ea5e9",
        soft: "#e0f2fe"
    },
    SHORTLISTED: {
        label: "Shortlisted",
        accent: "#8b5cf6",
        soft: "#f3e8ff"
    },
    INTERVIEW: {
        label: "Interview",
        accent: "#f59e0b",
        soft: "#fef3c7"
    },
    SELECTED: {
        label: "Selected",
        accent: "#10b981",
        soft: "#d1fae5"
    },
    REJECTED: {
        label: "Rejected",
        accent: "#ef4444",
        soft: "#fee2e2"
    },
    WITHDRAWN: {
        label: "Withdrawn",
        accent: "#64748b",
        soft: "#f1f5f9"
    }
};

const STATUSES = [
    "APPLIED",
    "SCREENING",
    "SHORTLISTED",
    "INTERVIEW",
    "SELECTED",
    "REJECTED",
    "WITHDRAWN"
];

function formatName(email) {
    if (!email) return "Unknown candidate";

    const local = email.split("@")[0] || "";

    const formatted = local
        .split(/[._-]+/)
        .filter(Boolean)
        .map(
            (part) =>
                part.charAt(0).toUpperCase() +
                part.slice(1)
        )
        .join(" ");

    return formatted || local || "Unknown candidate";
}

function initialsFromEmail(email) {
    const name = formatName(email);
    const parts = name.split(" ").filter(Boolean);

    if (parts.length === 0) return "?";

    return (
        parts[0].charAt(0) +
        (parts[1] ? parts[1].charAt(0) : "")
    ).toUpperCase();
}

function formatDate(value) {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return null;

    return date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function scoreClass(score) {
    const value = Number(score);

    if (!Number.isFinite(value)) return "";

    if (value >= 80) return "pb-score--high";
    if (value >= 55) return "pb-score--mid";

    return "pb-score--low";
}

function PipelineBoard() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState("");

    // =========================================================
    // LOAD APPLICATIONS
    // =========================================================

    useEffect(() => {

        const loadApplications = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get("/applications/pipeline");

                setApplications(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load application pipeline:",
                    error
                );

                setError(
                    "Failed to load candidates."
                );

            } finally {

                setLoading(false);

            }
        };

        loadApplications();

    }, []);


    // =========================================================
    // GROUP APPLICATIONS
    // =========================================================

    const groupedApplications = useMemo(() => {

        const groups = {};

        STATUSES.forEach((status) => {
            groups[status] = [];
        });

        applications.forEach((application) => {

            const status =
                (application.status || "APPLIED").toUpperCase();

            if (groups[status]) {
                groups[status].push(application);
            }

        });

        return groups;

    }, [applications]);


    // =========================================================
    // SUMMARY STATS
    // =========================================================

    const summary = useMemo(() => {

        const count = (status) =>
            groupedApplications[status]?.length || 0;

        return {
            total: applications.length,
            inProgress:
                count("APPLIED") +
                count("SCREENING") +
                count("SHORTLISTED") +
                count("INTERVIEW"),
            interview: count("INTERVIEW"),
            selected: count("SELECTED"),
            rejected: count("REJECTED") + count("WITHDRAWN")
        };

    }, [applications, groupedApplications]);


    // =========================================================
    // UPDATE APPLICATION STATUS
    // =========================================================

    const updateStatus = async (
        applicationId,
        newStatus
    ) => {

        const previousApplications = applications;


        // -----------------------------------------------------
        // OPTIMISTIC UI
        // -----------------------------------------------------

        setApplications((current) =>
            current.map((application) =>
                application.id === applicationId
                    ? {
                        ...application,
                        status: newStatus
                    }
                    : application
            )
        );


        setUpdatingId(applicationId);
        setError("");


        try {

            await api.put(
                `/applications/${applicationId}/status`,
                {
                    status: newStatus
                }
            );

        } catch (error) {

            console.error(
                "Failed to update application status:",
                error
            );


            // -------------------------------------------------
            // ROLLBACK
            // -------------------------------------------------

            setApplications(previousApplications);

            setError(
                "Failed to update candidate status."
            );

        } finally {

            setUpdatingId(null);

        }
    };


    // =========================================================
    // HEADER
    // =========================================================

    const renderHeader = () => (

        <header className="pb-header">

            <div>
                <p className="pb-eyebrow">Recruitment</p>

                <h1 className="pb-title">
                    Recruitment Pipeline
                </h1>

                <p className="pb-subtitle">
                    Manage applications through every stage of the
                    recruitment process.
                </p>
            </div>

            <div className="pb-header-meta">

                <span className="pb-live">
                    <span className="pb-live-dot" />
                    Live pipeline
                </span>

                <span className="pb-total-pill">
                    {applications.length} application
                    {applications.length === 1 ? "" : "s"}
                </span>

            </div>

        </header>
    );


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className="pb-page">

                {renderHeader()}

                <div className="pb-loading">

                    {STATUSES.map((status) => (

                        <div
                            key={status}
                            className="pb-skeleton-column"
                        >
                            <div className="pb-skeleton-line pb-skeleton-line--short" />

                            <div className="pb-skeleton-card" />
                            <div className="pb-skeleton-card" />
                        </div>

                    ))}

                </div>

            </div>
        );

    }


    // =========================================================
    // MAIN UI
    // =========================================================

    return (

        <div className="pb-page">

            {renderHeader()}


            {/* SUMMARY */}

            <div className="pb-stats">

                <div className="pb-stat pb-stat--indigo">
                    <span className="pb-stat-icon">
                        <Users size={18} />
                    </span>
                    <div className="pb-stat-text">
                        <span className="pb-stat-value">
                            {summary.total}
                        </span>
                        <span className="pb-stat-label">
                            Total applications
                        </span>
                    </div>
                </div>

                <div className="pb-stat pb-stat--blue">
                    <span className="pb-stat-icon">
                        <Clock3 size={18} />
                    </span>
                    <div className="pb-stat-text">
                        <span className="pb-stat-value">
                            {summary.inProgress}
                        </span>
                        <span className="pb-stat-label">
                            In progress
                        </span>
                    </div>
                </div>

                <div className="pb-stat pb-stat--amber">
                    <span className="pb-stat-icon">
                        <CalendarDays size={18} />
                    </span>
                    <div className="pb-stat-text">
                        <span className="pb-stat-value">
                            {summary.interview}
                        </span>
                        <span className="pb-stat-label">
                            Interviews
                        </span>
                    </div>
                </div>

                <div className="pb-stat pb-stat--sage">
                    <span className="pb-stat-icon">
                        <UserCheck size={18} />
                    </span>
                    <div className="pb-stat-text">
                        <span className="pb-stat-value">
                            {summary.selected}
                        </span>
                        <span className="pb-stat-label">
                            Selected
                        </span>
                    </div>
                </div>

                <div className="pb-stat pb-stat--rose">
                    <span className="pb-stat-icon">
                        <UserX size={18} />
                    </span>
                    <div className="pb-stat-text">
                        <span className="pb-stat-value">
                            {summary.rejected}
                        </span>
                        <span className="pb-stat-label">
                            Rejected / withdrawn
                        </span>
                    </div>
                </div>

            </div>


            {/* ERROR */}

            {error && (
                <div className="pb-error">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}


            {/* PIPELINE */}

            <div className="pb-board">

                {STATUSES.map((status) => {

                    const meta = STATUS_META[status];

                    const candidates =
                        groupedApplications[status] || [];


                    return (

                        <div
                            key={status}
                            className="pb-column"
                            style={{
                                "--pb-accent": meta.accent,
                                "--pb-accent-soft": meta.soft
                            }}
                        >

                            {/* COLUMN HEADER */}

                            <div className="pb-column-head">

                                <span className="pb-column-title">
                                    <span className="pb-column-dot" />
                                    {meta.label}
                                </span>

                                <span className="pb-column-count">
                                    {candidates.length}
                                </span>

                            </div>


                            {/* CARDS */}

                            <div className="pb-column-body">

                                {candidates.length === 0 ? (

                                    <div className="pb-empty">
                                        <Inbox size={22} />
                                        <span>No candidates</span>
                                    </div>

                                ) : (

                                    candidates.map((application) => {

                                        const job = application.job;
                                        const resume = application.resume;

                                        const appliedOn =
                                            formatDate(
                                                application.appliedAt
                                            );

                                        const isUpdating =
                                            updatingId ===
                                            application.id;


                                        return (

                                            <article
                                                key={application.id}
                                                className="pb-card"
                                            >

                                                {/* IDENTITY */}

                                                <div className="pb-card-identity">

                                                    <div className="pb-avatar">
                                                        {initialsFromEmail(
                                                            application.candidateEmail
                                                        )}
                                                    </div>

                                                    <div className="pb-card-person">

                                                        <span className="pb-card-name">
                                                            {formatName(
                                                                application.candidateEmail
                                                            )}
                                                        </span>

                                                        <span
                                                            className="pb-card-email"
                                                            title={
                                                                application.candidateEmail
                                                            }
                                                        >
                                                            {application.candidateEmail ||
                                                                "No email"}
                                                        </span>

                                                    </div>

                                                </div>


                                                {/* JOB */}

                                                <div className="pb-card-job">

                                                    <div
                                                        className="pb-card-job-title"
                                                        title={
                                                            job?.title
                                                        }
                                                    >
                                                        {job?.title ||
                                                            "Job Application"}
                                                    </div>

                                                    <div className="pb-card-company">
                                                        <Building2 size={11} />
                                                        <span>
                                                            {job?.company ||
                                                                "Company"}
                                                        </span>
                                                    </div>

                                                </div>


                                                {/* RESUME */}

                                                <div
                                                    className="pb-card-resume"
                                                    title={
                                                        resume?.fileName
                                                    }
                                                >
                                                    <FileText size={11} />
                                                    <span>
                                                        {resume?.fileName ||
                                                            "No resume"}
                                                    </span>
                                                </div>


                                                {/* SCORES */}

                                                <div className="pb-scores">

                                                    <div
                                                        className={`pb-score ${scoreClass(
                                                            application.atsScore
                                                        )}`}
                                                    >
                                                        <span className="pb-score-label">
                                                            ATS
                                                        </span>
                                                        <span className="pb-score-value">
                                                            {application.atsScore ??
                                                                "N/A"}
                                                            {application.atsScore !=
                                                                null && (
                                                                <small>
                                                                    /100
                                                                </small>
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div
                                                        className={`pb-score ${scoreClass(
                                                            application.matchScore
                                                        )}`}
                                                    >
                                                        <span className="pb-score-label">
                                                            Match
                                                        </span>
                                                        <span className="pb-score-value">
                                                            {application.matchScore ??
                                                                "N/A"}
                                                            {application.matchScore !=
                                                                null && (
                                                                <small>
                                                                    %
                                                                </small>
                                                            )}
                                                        </span>
                                                    </div>

                                                </div>


                                                {/* APPLIED DATE */}

                                                {appliedOn && (
                                                    <div className="pb-card-date">
                                                        <CalendarDays size={11} />
                                                        <span>
                                                            Applied {appliedOn}
                                                        </span>
                                                    </div>
                                                )}


                                                {/* STATUS */}

                                                <select
                                                    className="pb-status-select"
                                                    value={
                                                        (application.status ||
                                                            "APPLIED"
                                                        ).toUpperCase()
                                                    }
                                                    disabled={isUpdating}
                                                    onChange={(event) =>
                                                        updateStatus(
                                                            application.id,
                                                            event.target.value
                                                        )
                                                    }
                                                >

                                                    {STATUSES.map(
                                                        (option) => (
                                                            <option
                                                                key={option}
                                                                value={option}
                                                            >
                                                                {
                                                                    STATUS_META[
                                                                        option
                                                                    ].label
                                                                }
                                                            </option>
                                                        )
                                                    )}

                                                </select>


                                                {isUpdating && (
                                                    <div className="pb-updating">
                                                        <span className="pb-spinner" />
                                                        Updating status…
                                                    </div>
                                                )}

                                            </article>

                                        );

                                    })

                                )}

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}

export default PipelineBoard;
