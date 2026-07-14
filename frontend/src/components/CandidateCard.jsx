import {
    FileText,
    Eye,
    UserSquare2,
    ArrowRightLeft,
    MoreVertical
} from "lucide-react";
import "./CandidateCard.css";
import { useState } from "react";

function getInitials(name) {
    if (!name) return "?";
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");
}

function scoreTier(score) {
    if (score >= 80) return "tier-high";
    if (score >= 55) return "tier-mid";
    return "tier-low";
}

function statusTier(status) {
    const normalized = (status || "").toLowerCase();
    if (normalized === "selected" || normalized === "shortlisted") {
        return "tier-high";
    }
    if (normalized === "rejected") return "tier-low";
    return "tier-neutral";
}

function formatDate(dateString) {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}
function CandidateCard({
    candidate,
    onViewResume,
    onOpenProfile,
    onMoveStage,
    onInterviewInvite
}){
    const {
        name,
        email,
        resumeFileName,
        atsScore,
        matchScore,
        status,
        skills,
        uploadDate
    } = candidate;

    const skillList = Array.isArray(skills) ? skills : [];
    const visibleSkills = skillList.slice(0, 4);
    const remainingSkillCount = skillList.length - visibleSkills.length;
    const [menuOpen, setMenuOpen] = useState(false);    

    return (
        <div className="candidate-card">
            <div className="candidate-card-top">
                <div className="candidate-avatar">{getInitials(name)}</div>
                <div className="candidate-identity">
                    <span className="candidate-name">{name || "Unnamed Candidate"}</span>
                    <span className="candidate-email">{email || "—"}</span>
                </div>
                <span className={`status-pill ${statusTier(status)}`}>
                    {status || "Unknown"}
                </span>
            </div>

            <div className="candidate-resume-row">
                <FileText size={14} />
                <span className="candidate-resume-name">
                    {resumeFileName || "No resume file"}
                </span>
            </div>

            <div className="candidate-score-row">
                <div className={`score-pill ${scoreTier(atsScore ?? 0)}`}>
                    <span className="score-pill-label">ATS</span>
                    <span className="score-pill-value">
                        {atsScore ?? "—"}
                    </span>
                </div>
                <div className={`score-pill ${scoreTier(matchScore ?? 0)}`}>
                    <span className="score-pill-label">Match</span>
                    <span className="score-pill-value">
                        {matchScore != null ? `${matchScore}%` : "—"}
                    </span>
                </div>
            </div>

            {visibleSkills.length > 0 && (
                <div className="candidate-skills">
                    {visibleSkills.map((skill) => (
                        <span className="skill-chip" key={skill}>
                            {skill}
                        </span>
                    ))}
                    {remainingSkillCount > 0 && (
                        <span className="skill-chip skill-chip--more">
                            +{remainingSkillCount}
                        </span>
                    )}
                </div>
            )}

            <span className="candidate-upload-date">
                Uploaded {formatDate(uploadDate)}
            </span>

            <div className="candidate-actions">
                <button
                    type="button"
                    className="candidate-action-btn"
                    onClick={() => onViewResume?.(candidate)}
                >
                    <Eye size={14} />
                    View Resume
                </button>
                <button
                    type="button"
                    className="candidate-action-btn"
                    onClick={() => onOpenProfile?.(candidate)}
                >
                    <UserSquare2 size={14} />
                    Open Profile
                </button>
               <div className="candidate-menu">

    <button
        className="candidate-action-btn candidate-action-btn--primary"
        onClick={() => setMenuOpen(!menuOpen)}
    >
        <MoreVertical size={16}/>
    </button>

    {menuOpen && (

        <div className="candidate-dropdown">

            <button
                onClick={()=>{
                    setMenuOpen(false);
                    onMoveStage?.(candidate);
                }}
            >
                <ArrowRightLeft size={14}/>
                Move Stage
            </button>

            <button
                onClick={()=>{
                    setMenuOpen(false);
                    onInterviewInvite?.(candidate);
                }}
            >
                Schedule Interview
            </button>

        </div>

    )}

</div>
            </div>
        </div>
    );
}

export default CandidateCard;
