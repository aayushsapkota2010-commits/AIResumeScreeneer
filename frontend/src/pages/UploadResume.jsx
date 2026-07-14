import { useState, useRef } from "react";
import { useEffect } from "react";
import api from "../api/api";
import {
    UploadCloud,
    FileText,
    X,
    Mail,
    Loader2,
    Sparkles,
    ScanSearch,
    FileCheck2,
    Users2,
    Lightbulb
} from "lucide-react";
import "./UploadResume.css";

const WHY_UPLOAD_ITEMS = [
    { icon: Sparkles, label: "AI ATS Score" },
    { icon: ScanSearch, label: "Skill Extraction" },
    { icon: FileCheck2, label: "Resume Summary" },
    { icon: Users2, label: "Candidate Matching" },
    { icon: Lightbulb, label: "Recruiter Insights" }
];

function statusClass(status) {
    if (status === "Shortlisted") return "status-badge--success";
    if (status === "Rejected") return "status-badge--danger";
    return "status-badge--neutral";
}

function scoreClass(score) {
    if (score >= 80) return "score-badge--success";
    if (score >= 55) return "score-badge--warning";
    return "score-badge--danger";
}

function formatFileSize(bytes) {
    if (!bytes) return "";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
}

function UploadResume() {
    const [candidateEmail, setCandidateEmail] = useState("");

    const [file, setFile] = useState(null);

    const [message, setMessage] = useState("");

    // --- UI-only additions below: dragActive / isUploading / emailTouched ---
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const fileInputRef = useRef(null);

    // Recent uploads now lives in state, starting empty.
    // Wire this up later with something like:
    //   useEffect(() => {
    //       api.get("/resume/recent-uploads").then((res) => setRecentUploads(res.data));
    //   }, []);
const [recentUploads, setRecentUploads] = useState([]);

const fetchRecentUploads = async () => {
    try {
        const response = await api.get("/resume/all");

        setRecentUploads(response.data);
    } catch (error) {
        console.error(error);
    }
};

useEffect(() => {
    fetchRecentUploads();
}, []);
    const emailIsValid =
        !emailTouched || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateEmail);

    const handleUpload = async () => {
        if (!file || !candidateEmail) {
            alert("Email and Resume are required");

            return;
        }

        const formData = new FormData();

        formData.append("file", file);

        formData.append("candidateEmail", candidateEmail);

        setIsUploading(true);

        try {
            const response = await api.post("/resume/upload", formData);

            setMessage(response.data);
            await fetchRecentUploads();
        } catch (error) {
            console.log(error);

            setMessage("Upload Failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="upload-page">
            <header className="upload-header">
                <p className="upload-eyebrow">Candidate Pipeline</p>
                <h1 className="upload-title">Upload Resume</h1>
                <p className="upload-subtitle">
                    Upload candidate resumes for AI screening and ATS scoring.
                </p>
            </header>

            <div className="upload-grid">
                <section className="upload-card">
                    <div
                        className={`upload-dropzone ${
                            dragActive ? "upload-dropzone--active" : ""
                        } ${file ? "upload-dropzone--filled" : ""}`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragActive(true);
                        }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {!file ? (
                            <>
                                <div className="upload-dropzone-icon">
                                    <UploadCloud size={28} strokeWidth={1.8} />
                                </div>
                                <p className="upload-dropzone-title">
                                    Drag &amp; Drop Resume Here
                                </p>
                                <p className="upload-dropzone-or">or</p>
                                <span className="upload-browse-btn">
                                    Browse Files
                                </span>
                                <p className="upload-dropzone-meta">
                                    Supported files: PDF, DOC, DOCX &middot;
                                    Maximum size: 10 MB
                                </p>
                            </>
                        ) : (
                            <div
                                className="upload-file-preview"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="upload-file-icon">
                                    <FileText size={22} strokeWidth={1.8} />
                                </div>
                                <div className="upload-file-info">
                                    <span className="upload-file-name">
                                        {file.name}
                                    </span>
                                    <span className="upload-file-size">
                                        {formatFileSize(file.size)}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="upload-file-remove"
                                    onClick={removeFile}
                                    aria-label="Remove file"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            className="upload-hidden-input"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>

                    <div className="upload-field">
                        <label className="upload-field-label" htmlFor="candidate-email">
                            Candidate Email
                        </label>
                        <div
                            className={`upload-input-wrap ${
                                !emailIsValid ? "upload-input-wrap--invalid" : ""
                            }`}
                        >
                            <Mail size={16} className="upload-input-icon" />
                            <input
                                id="candidate-email"
                                type="email"
                                placeholder="candidate@email.com"
                                value={candidateEmail}
                                onChange={(e) =>
                                    setCandidateEmail(e.target.value)
                                }
                                onBlur={() => setEmailTouched(true)}
                            />
                        </div>
                        {!emailIsValid && (
                            <span className="upload-field-error">
                                Enter a valid email address
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        className="upload-submit-btn"
                        onClick={handleUpload}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Loader2
                                    size={18}
                                    className="upload-spinner-icon"
                                />
                                Uploading...
                            </>
                        ) : (
                            "Upload Resume"
                        )}
                    </button>

                    {message && (
                        <p className="upload-message">{message}</p>
                    )}
                </section>

                <aside className="upload-side-panel">
                    <h2 className="upload-side-title">Why upload?</h2>
                    <ul className="upload-why-list">
                        {WHY_UPLOAD_ITEMS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li className="upload-why-item" key={item.label}>
                                    <span className="upload-why-icon">
                                        <Icon size={16} strokeWidth={1.8} />
                                    </span>
                                    {item.label}
                                </li>
                            );
                        })}
                    </ul>
                </aside>
            </div>

            <section className="upload-recent">
                <div className="upload-recent-head">
                    <h2>Recent Uploads</h2>
                    <span className="upload-recent-sub">
                        {recentUploads.length} total
                    </span>
                </div>

                {recentUploads.length === 0 ? (
                    <div className="upload-empty-state">
                        <div className="upload-empty-icon">
                            <FileText size={26} strokeWidth={1.6} />
                        </div>
                        <p className="upload-empty-title">
                            No resumes uploaded yet
                        </p>
                        <p className="upload-empty-subtitle">
                            Uploaded candidates will appear here once
                            screening begins.
                        </p>
                    </div>
                ) : (
                    <div className="upload-recent-grid">
                        {recentUploads.map((item) => (
                            <div className="recent-card" key={item.id}>
    <div className="recent-card-top">

        <div className="recent-avatar">
            {(item.fileName || "R")
                .charAt(0)
                .toUpperCase()}
        </div>

        <div className="recent-card-id">

            <span className="recent-card-name">
                {item.fileName}
            </span>

            <span className="recent-card-email">
                {item.candidateEmail || "No Email"}
            </span>

        </div>

    </div>

    <div className="recent-card-badges">

        <span
            className={`score-badge ${scoreClass(item.atsScore || 0)}`}
        >
            ATS {item.atsScore ?? "Pending"}
        </span>

        <span
            className={`status-badge ${statusClass(item.status || "")}`}
        >
            {item.status || "Uploaded"}
        </span>

    </div>

    <span className="recent-card-time">
        {new Date(item.uploadedAt).toLocaleString()}
    </span>

</div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default UploadResume;
