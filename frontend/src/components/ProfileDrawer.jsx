import { Download, ExternalLink, ArrowRightLeft, FileText, Calendar } from "lucide-react";
import "./ProfileDrawer.css";
import api from "../api/api";



function getInitials(name) {
    if (!name) return "?";
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join("");
}

function scoreTier(score) {
    const n = Number(score);
    if (n >= 80) return "tier-high";
    if (n >= 55) return "tier-mid";
    return "tier-low";
}

function statusTier(status) {
    const s = (status || "").toLowerCase();
    if (s === "selected" || s === "shortlisted") return "tier-high";
    if (s === "rejected") return "tier-low";
    return "tier-neutral";
}

function formatDate(dateString) {
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

const DEFAULT_TIMELINE = [
    { label: "Resume Uploaded",   note: "AI screening initiated" },
    { label: "ATS Scoring Done",  note: "Score computed successfully" },
    { label: "Under Review",      note: "Recruiter reviewing profile" }
];

function ProfileDrawer({
    candidate,
    onClose,
    onDownloadResume,
    onViewResume,
    onMoveStage
}) {
    if (!candidate) return null;
     const API_URL = import.meta.env.VITE_API_URL;

    const timeline = candidate.timeline?.length
        ? candidate.timeline
        : DEFAULT_TIMELINE;

    const skills = Array.isArray(candidate.skills) ? candidate.skills : [];
    const handleViewResume = (candidate) => {

    window.open(
        `${API_URL}/resume/view/${candidate.id}`,
        "_blank"
    );

};
const handleDownload = async () => {
    try {

        const response = await api.get(
            `/resume/report/${candidate.id}`,
            {
                responseType: "blob"
            }
        );

        const url = window.URL.createObjectURL(
            new Blob([response.data])
        );

        const link = document.createElement("a");

        link.href = url;
        link.download = "resume-report.pdf";

        document.body.appendChild(link);
        link.click();
        link.remove();

    } catch (err) {
        console.error(err);
        alert("Download failed");
    }
};

const handleOpenProfile = (candidate) => {
    setSelectedCandidate(candidate);
};
const handleInterviewInvite = (candidate) => {

    setSelectedInterviewCandidate(candidate);

    setInterviewModalOpen(true);

};

   const handleMoveStage = (candidate) => {

    setSelectedCandidate(candidate);

    setModalOpen(true);

};

  



    return (

        <div className="drawer-overlay" onClick={onClose}>

            <div className="drawer" onClick={(e) => e.stopPropagation()}>

                {/* ── Sticky Header ── */}
                <div className="drawer-header">
                    <div className="drawer-avatar">
                        {getInitials(candidate.name)}
                    </div>
                    <div className="drawer-identity">
                        <h2 className="drawer-name">{candidate.name}</h2>
                        <p className="drawer-email">{candidate.email}</p>
                    </div>
                    <button
                        className="drawer-close"
                        onClick={onClose}
                        aria-label="Close profile"
                    >
                        ✕
                    </button>
                </div>

                {/* ── Scrollable Body ── */}
                <div className="drawer-body">

                    {/* Candidate Info */}
                    <section className="drawer-section">
                        <span className="drawer-section-label">
                            Candidate Info
                        </span>
                        <div className="drawer-badges">
                            <div className={`drawer-score-badge ${scoreTier(candidate.ats)}`}>
                                <span className="drawer-badge-key">ATS</span>
                                <span className="drawer-badge-val">
                                    {candidate.ats ?? "—"}
                                </span>
                            </div>
                            <div className={`drawer-score-badge ${scoreTier(candidate.match)}`}>
                                <span className="drawer-badge-key">Match</span>
                                <span className="drawer-badge-val">
                                    {candidate.match != null
                                        ? `${candidate.match}%`
                                        : "—"}
                                </span>
                            </div>
                            <div className={`drawer-status-badge ${statusTier(candidate.status)}`}>
                                {candidate.status || "Unknown"}
                            </div>
                        </div>
                    </section>

                    {/* Resume Details */}
                    <section className="drawer-section">
                        <span className="drawer-section-label">
                            Resume Details
                        </span>
                        <div className="drawer-resume-card">
                            <div className="drawer-resume-icon">
                                <FileText size={18} strokeWidth={1.8} />
                            </div>
                            <div className="drawer-resume-meta">
                                <span className="drawer-resume-filename">
                                    {candidate.resumeFileName || "resume.pdf"}
                                </span>
                                <span className="drawer-resume-date">
                                    <Calendar size={12} />
                                    Uploaded {formatDate(candidate.uploadDate)}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Skills */}
                    {skills.length > 0 && (
                        <section className="drawer-section">
                            <span className="drawer-section-label">Skills</span>
                            <div className="drawer-skills">
                                {skills.map((skill) => (
                                    <span className="drawer-skill-chip" key={skill}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Suggestions */}
                    <section className="drawer-section">
                        <span className="drawer-section-label">
                            AI Suggestions
                        </span>
                        <div className="drawer-suggestions">
                            {candidate.suggestions || "No suggestions available for this candidate."}
                        </div>
                    </section>

                    {/* Activity Timeline */}
                    <section className="drawer-section">
                        <span className="drawer-section-label">
                            Activity Timeline
                        </span>
                        <div className="drawer-timeline">
                            {timeline.map((entry, index) => (
                                <div className="drawer-timeline-item" key={index}>
                                    <div className="drawer-timeline-dot" />
                                    <div className="drawer-timeline-content">
                                        <span className="drawer-timeline-label">
                                            {entry.label}
                                        </span>
                                        {entry.note && (
                                            <span className="drawer-timeline-note">
                                                {entry.note}
                                            </span>
                                        )}
                                        {entry.date && (
                                            <span className="drawer-timeline-date">
                                                {formatDate(entry.date)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                {/* ── Sticky Footer Actions ── */}
                <div className="drawer-footer">
<button
    type="button"
    className="drawer-btn drawer-btn--secondary"
    onClick={handleDownload}
>                        <Download size={15} />
                        Download Resume
                    </button>
<button
    type="button"
    className="drawer-btn drawer-btn--secondary"
   onClick={() => handleViewResume(candidate)}
>                        <ExternalLink size={15} />
                        View Resume
                    </button>
<button
    type="button"
    className="drawer-btn drawer-btn--primary"
    onClick={() => onMoveStage(candidate)}
>                     <ArrowRightLeft size={15} />
                        Move Stage
                    </button>
                </div>

            </div>

        </div>

    );

}

export default ProfileDrawer;
