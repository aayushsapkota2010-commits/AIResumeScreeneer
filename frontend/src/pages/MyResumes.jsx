import { useEffect, useRef, useState } from "react";
import {
    UploadCloud,
    FileText,
    ExternalLink,
    Trash2,
    Loader2,
    FileCheck2,
    Gauge,
    CalendarDays,
    HardDrive,
    Sparkles
} from "lucide-react";
import api from "../api/api";
import "./MyResumes.css";

function formatFileSize(bytes) {
    if (!bytes) {
        return "Unknown size";
    }

    const kb = bytes / 1024;

    if (kb < 1024) {
        return `${kb.toFixed(0)} KB`;
    }

    return `${(kb / 1024).toFixed(1)} MB`;
}

function formatDate(date) {
    if (!date) {
        return "—";
    }

    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function getFileExtension(fileName) {
    if (!fileName) {
        return "FILE";
    }

    const parts = fileName.split(".");
    return parts.length > 1
        ? parts.pop().toUpperCase()
        : "FILE";
}

function getScoreClass(score) {
    if (score === null || score === undefined) {
        return "pending";
    }

    if (score >= 80) {
        return "excellent";
    }

    if (score >= 60) {
        return "good";
    }

    if (score >= 40) {
        return "average";
    }

    return "low";
}

function getScoreLabel(score) {
    if (score === null || score === undefined) {
        return "Pending";
    }

    if (score >= 80) {
        return "Excellent";
    }

    if (score >= 60) {
        return "Good";
    }

    if (score >= 40) {
        return "Needs improvement";
    }

    return "Needs work";
}

function MyResumes() {

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const fileInputRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchMyResumes();
    }, []);

    const fetchMyResumes = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/resume/my");

            setResumes(response.data || []);

        } catch (error) {

            console.error(
                "Failed to load resumes:",
                error
            );

            setError(
                "Unable to load your resumes."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleUpload = async (event) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (!allowedTypes.includes(file.type)) {

            setError(
                "Please upload a PDF, DOC or DOCX file."
            );

            setMessage("");

            event.target.value = "";

            return;
        }

        if (file.size > 10 * 1024 * 1024) {

            setError(
                "Resume size must be less than 10 MB."
            );

            setMessage("");

            event.target.value = "";

            return;
        }

        const formData = new FormData();

        formData.append(
            "file",
            file
        );

        try {

            setUploading(true);
            setMessage("");
            setError("");

            await api.post(
                "/resume/my-upload",
                formData
            );

            setMessage(
                "Resume uploaded successfully."
            );

            await fetchMyResumes();

        } catch (error) {

            console.error(
                "Resume upload failed:",
                error
            );

            setError(
                error.response?.data ||
                "Resume upload failed. Please try again."
            );

        } finally {

            setUploading(false);
            event.target.value = "";

        }
    };

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this resume?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setMessage("");

            await api.delete(
                `/resume/my/${id}`
            );

            setResumes((previous) =>
                previous.filter(
                    (resume) =>
                        resume.id !== id
                )
            );

            setMessage(
                "Resume deleted successfully."
            );

        } catch (error) {

            console.error(
                "Delete failed:",
                error
            );

            setError(
                error.response?.data ||
                "Failed to delete resume."
            );
        }
    };

    const openResume = (id) => {

        window.open(
            `${API_URL}/resume/view/${id}`,
            "_blank"
        );
    };

    const totalResumes = resumes.length;

    const scoredResumes =
        resumes.filter(
            (resume) =>
                resume.atsScore !== null &&
                resume.atsScore !== undefined
        );

    const bestScore =
        scoredResumes.length > 0
            ? Math.max(
                ...scoredResumes.map(
                    (resume) =>
                        Number(resume.atsScore)
                )
            )
            : null;

    const latestResume =
        resumes.length > 0
            ? resumes[0]
            : null;

    return (

        <div className="my-resumes-page">

            <div className="my-resumes-container">

                {/* HEADER */}

                <div className="my-resumes-header">

                    <div className="my-resumes-heading">

                        <div className="my-resumes-eyebrow">
                            CANDIDATE PROFILE
                        </div>

                        <h1>
                            My Resumes
                        </h1>

                        <p>
                            Manage your resumes, track ATS scores,
                            and keep your best version ready for applications.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="my-resumes-upload-btn"
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                        disabled={uploading}
                    >

                        {uploading ? (

                            <>
                                <Loader2
                                    size={18}
                                    className="upload-spinner"
                                />

                                Uploading...
                            </>

                        ) : (

                            <>
                                <UploadCloud
                                    size={18}
                                />

                                Upload Resume
                            </>

                        )}

                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx"
                        onChange={handleUpload}
                    />

                </div>


                {/* STATS */}

                {!loading && resumes.length > 0 && (

                    <div className="resume-stats">

                        <div className="resume-stat-card">

                            <div className="resume-stat-icon purple">
                                <FileCheck2 size={20} />
                            </div>

                            <div>
                                <span>Total Resumes</span>
                                <strong>{totalResumes}</strong>
                            </div>

                        </div>


                        <div className="resume-stat-card">

                            <div className="resume-stat-icon blue">
                                <Gauge size={20} />
                            </div>

                            <div>
                                <span>Best ATS Score</span>

                                <strong>
                                    {bestScore !== null
                                        ? `${bestScore}/100`
                                        : "Pending"}
                                </strong>
                            </div>

                        </div>


                        <div className="resume-stat-card">

                            <div className="resume-stat-icon green">
                                <CalendarDays size={20} />
                            </div>

                            <div>
                                <span>Latest Upload</span>

                                <strong>
                                    {latestResume
                                        ? formatDate(
                                            latestResume.uploadedAt
                                        )
                                        : "—"}
                                </strong>
                            </div>

                        </div>

                    </div>

                )}


                {/* MESSAGES */}

                {message && (

                    <div className="my-resumes-message success">
                        <Sparkles size={16} />
                        <span>{message}</span>
                    </div>

                )}


                {error && (

                    <div className="my-resumes-message error">
                        <span>{error}</span>
                    </div>

                )}


                {/* SECTION HEADER */}

                {!loading && resumes.length > 0 && (

                    <div className="resumes-section-header">

                        <div>

                            <h2>
                                Your Resume Library
                            </h2>

                            <p>
                                Choose the version you want to use when applying.
                            </p>

                        </div>

                        <span className="resume-count">
                            {resumes.length}
                            {resumes.length === 1
                                ? " resume"
                                : " resumes"}
                        </span>

                    </div>

                )}


                {/* LOADING */}

                {loading ? (

                    <div className="my-resumes-state">

                        <Loader2
                            size={26}
                            className="loading-spinner"
                        />

                        <div>
                            <strong>
                                Loading your resumes
                            </strong>

                            <span>
                                Getting your latest resume information...
                            </span>
                        </div>

                    </div>

                ) : resumes.length === 0 ? (

                    /* EMPTY STATE */

                    <div className="my-resumes-empty">

                        <div className="empty-icon-wrapper">

                            <FileText size={32} />

                        </div>

                        <h3>
                            Build your resume library
                        </h3>

                        <p>
                            Upload your first resume to start applying
                            for jobs and getting ATS insights.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                        >
                            <UploadCloud size={17} />
                            Upload Your First Resume
                        </button>

                        <small>
                            PDF, DOC or DOCX • Maximum 10 MB
                        </small>

                    </div>

                ) : (

                    /* RESUME CARDS */

                    <div className="my-resumes-grid">

                        {resumes.map((resume) => {

                            const score =
                                resume.atsScore !== null &&
                                resume.atsScore !== undefined
                                    ? Number(resume.atsScore)
                                    : null;

                            const scoreClass =
                                getScoreClass(score);

                            return (

                                <div
                                    className="my-resume-card"
                                    key={resume.id}
                                >

                                    {/* CARD HEADER */}

                                    <div className="resume-card-header">

                                        <div className="resume-file-icon">

                                            <FileText size={25} />

                                        </div>

                                        <div className="resume-file-type">
                                            {getFileExtension(
                                                resume.fileName
                                            )}
                                        </div>

                                    </div>


                                    {/* FILE NAME */}

                                    <div className="resume-file-content">

                                        <h3
                                            title={resume.fileName}
                                        >
                                            {resume.fileName}
                                        </h3>

                                        <div className="resume-meta">

                                            <span>
                                                <HardDrive size={14} />
                                                {formatFileSize(
                                                    resume.fileSize
                                                )}
                                            </span>

                                            <span>
                                                <CalendarDays size={14} />
                                                {formatDate(
                                                    resume.uploadedAt
                                                )}
                                            </span>

                                        </div>

                                    </div>


                                    {/* SCORE */}

                                    <div className="resume-score-section">

                                        <div
                                            className={`ats-score-ring ${scoreClass}`}
                                            style={{
                                                "--score":
                                                    score !== null
                                                        ? `${Math.min(
                                                            Math.max(score, 0),
                                                            100
                                                        )}%`
                                                        : "0%"
                                            }}
                                        >

                                            <div className="ats-score-inner">

                                                <strong>
                                                    {score !== null
                                                        ? score
                                                        : "—"}
                                                </strong>

                                                <span>
                                                    ATS
                                                </span>

                                            </div>

                                        </div>


                                        <div className="ats-score-copy">

                                            <span>
                                                ATS Resume Score
                                            </span>

                                            <strong>
                                                {getScoreLabel(score)}
                                            </strong>

                                            <small>
                                                {score !== null
                                                    ? "Based on your resume analysis"
                                                    : "Analysis pending"}
                                            </small>

                                        </div>

                                    </div>


                                    {/* STATUS */}

                                    <div className="resume-card-status">

                                        <span className="status-dot"></span>

                                        {resume.status
                                            ? resume.status
                                            : "READY"}

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="my-resume-actions">

                                        <button
                                            type="button"
                                            className="resume-view-btn"
                                            onClick={() =>
                                                openResume(
                                                    resume.id
                                                )
                                            }
                                        >

                                            <ExternalLink size={16} />

                                            View Resume

                                        </button>


                                        <button
                                            type="button"
                                            className="resume-delete-btn"
                                            onClick={() =>
                                                handleDelete(
                                                    resume.id
                                                )
                                            }
                                            title="Delete resume"
                                        >

                                            <Trash2 size={16} />

                                        </button>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>

        </div>
    );
}

export default MyResumes;