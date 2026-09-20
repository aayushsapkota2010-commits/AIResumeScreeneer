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
    XCircle
} from "lucide-react";
import api from "../api/api";
import "./MyApplications.css";

function MyApplications() {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
            console.error("Failed to fetch applications:", err);
            setError("Unable to load your applications.");
        } finally {
            setLoading(false);
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

            case "SCREENING":
            case "SHORTLISTED":
            case "INTERVIEW":
                return <Clock3 size={15} />;

            default:
                return <Clock3 size={15} />;
        }
    };

    const formatStatus = (status) => {
        if (!status) return "Applied";

        return status
            .toLowerCase()
            .replace("_", " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const formatDate = (date) => {
        if (!date) return "Recently";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="my-applications-page">
                <div className="my-applications-loading">
                    <Loader2 className="spin" size={22} />
                    Loading your applications...
                </div>
            </div>
        );
    }

    return (
        <div className="my-applications-page">

            {/* Header */}

            <div className="my-applications-header">

                <div>
                    <span className="applications-label">
                        YOUR APPLICATIONS
                    </span>

                    <h1>My Applications</h1>

                    <p>
                        Track the jobs you have applied for and follow
                        your application progress.
                    </p>
                </div>

                <button
                    className="browse-jobs-button"
                    onClick={() => navigate("/browse-jobs")}
                >
                    <Briefcase size={17} />
                    Browse Jobs
                </button>

            </div>

            {/* Error */}

            {error && (
                <div className="applications-error">
                    {error}
                </div>
            )}

            {/* Empty */}

            {!error && applications.length === 0 && (
                <div className="applications-empty">

                    <div className="empty-icon">
                        <Inbox size={38} />
                    </div>

                    <h2>No applications yet</h2>

                    <p>
                        You haven't applied for any jobs yet.
                        Explore available opportunities and submit your
                        first application.
                    </p>

                    <button
                        className="browse-jobs-button"
                        onClick={() => navigate("/browse-jobs")}
                    >
                        Browse Jobs
                        <ArrowRight size={17} />
                    </button>

                </div>
            )}

            {/* Applications */}

            {!error && applications.length > 0 && (
                <div className="applications-list">

                    {applications.map((application) => {

                        const job = application.job;
                        const resume = application.resume;

                        return (
                            <div
                                className="application-card"
                                key={application.id}
                            >

                                <div className="application-main">

                                    <div className="application-company-icon">
                                        {job?.company
                                            ?.charAt(0)
                                            ?.toUpperCase() || "C"}
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
                                                    <MapPin size={14} />
                                                    {job.location}
                                                </span>
                                            )}

                                            <span>
                                                <CalendarDays size={14} />
                                                Applied{" "}
                                                {formatDate(
                                                    application.appliedAt
                                                )}
                                            </span>

                                            {resume?.fileName && (
                                                <span>
                                                    <FileText size={14} />
                                                    {resume.fileName}
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                </div>

                                <div className="application-action">

                                    {job?.id && (
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/jobs/${job.id}`
                                                )
                                            }
                                        >
                                            View Job
                                            <ArrowRight size={16} />
                                        </button>
                                    )}

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
}

export default MyApplications;