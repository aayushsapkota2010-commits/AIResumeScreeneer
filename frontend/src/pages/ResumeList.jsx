import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FileText,
    ExternalLink,
    ArrowUpRight,
    Search,
    SlidersHorizontal,
    Trash2
} from "lucide-react";
import api from "../api/api";
import "./ResumeList.css";

function getStatusClass(status) {
    const value = (status || "").toLowerCase();

    if (value === "selected") return "resume-status resume-status--selected";
    if (value === "shortlisted") return "resume-status resume-status--shortlisted";
    if (value === "interview") return "resume-status resume-status--interview";
    if (value === "screening") return "resume-status resume-status--screening";
    if (value === "rejected") return "resume-status resume-status--rejected";

    return "resume-status resume-status--applied";
}

function getScoreClass(score) {
    const value = Number(score);

    if (value >= 80) return "resume-score resume-score--high";
    if (value >= 55) return "resume-score resume-score--medium";

    return "resume-score resume-score--low";
}

function ResumeList() {
    const [resumes, setResumes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        api.get("/resume/all")
            .then((response) => {
                setResumes(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const filteredResumes = resumes.filter((resume) => {
        const matchesSearch =
            resume.fileName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            !statusFilter ||
            resume.status?.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const deleteResume = async (resumeId) => {

    const confirmed = window.confirm(
        "Are you sure you want to delete this resume?"
    );

    if (!confirmed) {
        return;
    }

    try {

        await api.delete(`/resume/${resumeId}`);

        // Remove from UI immediately
        setResumes((previous) =>
            previous.filter(
                (resume) => resume.id !== resumeId
            )
        );

        alert("Resume deleted successfully");

    } catch (error) {

        console.error(
            "Failed to delete resume:",
            error
        );

        alert("Failed to delete resume");
    }
};

    const openResume = (resumeId) => {
        window.open(
            `${API_URL}/resume/view/${resumeId}`,
            "_blank"
        );
    };

    return (
        <div className="resume-page">

            <div className="resume-container">

                <div className="resume-header">

                    <div>
                        <p className="resume-eyebrow">
                            CANDIDATE MANAGEMENT
                        </p>

                        <h1 className="resume-title">
                            Resume Library
                        </h1>

                        <p className="resume-subtitle">
                            Review, evaluate and manage submitted candidate resumes.
                        </p>
                    </div>

                    <div className="resume-count-card">
                        <span className="resume-count-label">
                            TOTAL RESUMES
                        </span>

                        <span className="resume-count-value">
                            {resumes.length}
                        </span>
                    </div>

                </div>

                <div className="resume-toolbar">

                    <div className="resume-search">

                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search resumes..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                        />

                    </div>

                    <div className="resume-filter">

                        <SlidersHorizontal size={16} />

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                        >
                            <option value="">
                                All Status
                            </option>

                            <option value="APPLIED">
                                Applied
                            </option>

                            <option value="SCREENING">
                                Screening
                            </option>

                            <option value="SHORTLISTED">
                                Shortlisted
                            </option>

                            <option value="INTERVIEW">
                                Interview
                            </option>

                            <option value="SELECTED">
                                Selected
                            </option>

                            <option value="REJECTED">
                                Rejected
                            </option>
                        </select>

                    </div>

                </div>

                <div className="resume-results-bar">

                    <div>
                        <span className="resume-results-number">
                            {filteredResumes.length}
                        </span>

                        <span className="resume-results-text">
                            {filteredResumes.length === 1
                                ? "resume found"
                                : "resumes found"}
                        </span>
                    </div>

                    {(searchTerm || statusFilter) && (
                        <button
                            type="button"
                            className="resume-clear-btn"
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("");
                            }}
                        >
                            Clear filters
                        </button>
                    )}

                </div>

                <div className="resume-list">

                    {filteredResumes.length === 0 ? (

                        <div className="resume-empty">

                            <div className="resume-empty-icon">
                                <FileText size={25} />
                            </div>

                            <h3>
                                No resumes found
                            </h3>

                            <p>
                                Try changing your search or filter.
                            </p>

                        </div>

                    ) : (

                        filteredResumes.map((resume) => {

                            const atsScore = Number(resume.atsScore || 0);
                            const matchScore = Number(resume.matchScore || 0);

                            return (
                                <div
                                    className="resume-card"
                                    key={resume.id}
                                >

                                    <div className="resume-card-main">

                                        <div className="resume-file-icon">
                                            <FileText size={22} />
                                        </div>

                                        <div className="resume-file-info">

                                            <h3 className="resume-file-name">
                                                {resume.fileName}
                                            </h3>

                                            <p className="resume-file-id">
                                                Resume ID #{resume.id}
                                            </p>

                                        </div>

                                        <div className="resume-card-status">
                                            <span className={getStatusClass(resume.status)}>
                                                {resume.status || "APPLIED"}
                                            </span>
                                        </div>

                                    </div>

                                    <div className="resume-card-divider" />

                                    <div className="resume-card-bottom">

                                        <div className="resume-metrics">

                                            <div className="resume-metric">

                                                <span className="resume-metric-label">
                                                    ATS SCORE
                                                </span>

                                                <span className={getScoreClass(atsScore)}>
                                                    {resume.atsScore ?? "—"}
                                                </span>

                                            </div>

                                            <div className="resume-metric-divider" />

                                            <div className="resume-metric">

                                                <span className="resume-metric-label">
                                                    MATCH SCORE
                                                </span>

                                                <span className={getScoreClass(matchScore)}>
                                                    {resume.matchScore ?? 0}%
                                                </span>

                                            </div>

                                        </div>

                                        <div className="resume-actions">

    <button
        type="button"
        className="resume-action resume-action--secondary"
        onClick={() =>
            openResume(resume.id)
        }
    >
        <ExternalLink size={15} />
        View Resume
    </button>

    <Link
        to={`/resume/${resume.id}`}
        className="resume-action resume-action--primary"
    >
        View Details
        <ArrowUpRight size={15} />
    </Link>

    <button
        type="button"
        className="resume-action resume-action--delete"
        onClick={() => deleteResume(resume.id)}
    >
        <Trash2 size={15} />
        Delete
    </button>

</div>

                                    </div>

                                </div>
                            );
                        })

                    )}

                </div>

            </div>

        </div>
    );
}

export default ResumeList;