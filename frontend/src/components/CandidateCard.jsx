
import {
    FileText,
    Eye,
    UserSquare2,
    ArrowRightLeft,
    MoreVertical,
    CalendarDays,
    Bot,
    Check
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./CandidateCard.css";

function getInitials(name) {
    if (!name) return "?";

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");
}

function scoreTier(score) {
    const value = Number(score);
    if (!Number.isFinite(value)) return "score-unknown";
    if (value >= 80) return "score-high";
    if (value >= 55) return "score-mid";
    return "score-low";
}

function statusTier(status) {
    const normalized = (status || "").toLowerCase();

    if (normalized === "selected") return "status-selected";
    if (normalized === "shortlisted") return "status-shortlisted";
    if (normalized === "rejected") return "status-rejected";
    if (normalized === "interview") return "status-interview";

    return "status-applied";
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
    onInterviewInvite,
    onMoveStage,
    onGenerateQuestions
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const menuRef = useRef(null);
    const triggerRef = useRef(null);
    const dropdownRef = useRef(null);

    const data = candidate || {};

    const {
        name,
        email,
        resumeFileName,
        atsScore,
        matchScore,
        status,
        skills,
        uploadDate
    } = data;

    const skillList = Array.isArray(skills)
        ? skills.filter(
            (skill) => typeof skill === "string" && skill.trim()
        )
        : [];

    const visibleSkills = skillList.slice(0, 4);
    const remainingSkillCount = Math.max(0, skillList.length - 4);

    const updateMenuPosition = () => {
        if (!triggerRef.current) return;

        const rect = triggerRef.current.getBoundingClientRect();
        const menuWidth = 236;
        const menuHeight = 158;

        const left = Math.max(
            12,
            Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 12)
        );

        const top = Math.max(
            12,
            Math.min(rect.bottom - menuHeight, window.innerHeight - menuHeight - 12)
        );

        setMenuPosition({ top, left });
    };

    useEffect(() => {
        if (!menuOpen) return;

        updateMenuPosition();

        const handleOutsideClick = (event) => {
            if (
                !menuRef.current?.contains(event.target) &&
                !dropdownRef.current?.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        };

        const handlePositionChange = () => updateMenuPosition();

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);
        window.addEventListener("resize", handlePositionChange);
        window.addEventListener("scroll", handlePositionChange, true);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
            window.removeEventListener("resize", handlePositionChange);
            window.removeEventListener("scroll", handlePositionChange, true);
        };
    }, [menuOpen]);

    const handleMenuAction = (callback) => {
        setMenuOpen(false);
        callback?.(data);
    };

    const dropdown = menuOpen
        ? createPortal(
            <div
                className="candidate-dropdown"
                ref={dropdownRef}
                style={{
                    position: "fixed",
                    top: menuPosition.top,
                    left: menuPosition.left
                }}
                role="menu"
            >
                <div className="candidate-dropdown-heading">
                    Candidate actions
                </div>

                <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleMenuAction(onMoveStage)}
                >
                    <ArrowRightLeft size={16} />
                    <span>Move to another stage</span>
                </button>

                <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleMenuAction(onGenerateQuestions)}
                >
                    <Bot size={16} />
                    <span>Generate AI questions</span>
                </button>

                <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleMenuAction(onInterviewInvite)}
                >
                    <CalendarDays size={16} />
                    <span>Schedule interview</span>
                </button>
            </div>,
            document.body
        )
        : null;

    return (
        <article className="candidate-card">
            <div className="candidate-card-top">
                <div className="candidate-avatar">
                    {getInitials(name)}
                </div>

                <div className="candidate-identity">
                    <h3 className="candidate-name">
                        {name || "Unnamed Candidate"}
                    </h3>
                    <p className="candidate-email">
                        {email || "No email available"}
                    </p>
                </div>

                <span className={`candidate-status ${statusTier(status)}`}>
                    <span className="status-dot" />
                    {status || "Unknown"}
                </span>
            </div>

            <div className="candidate-resume-row">
                <div className="candidate-resume-icon">
                    <FileText size={16} />
                </div>

                <span className="candidate-resume-name" title={resumeFileName}>
                    {resumeFileName || "No resume file"}
                </span>
            </div>

            <div className="candidate-score-row">
                <div className="candidate-score-box">
                    <div className="candidate-score-heading">
                        <span>ATS SCORE</span>
                        <span className="score-indicator">AI</span>
                    </div>
                    <div className={`candidate-score-value ${scoreTier(atsScore)}`}>
                        {atsScore ?? "—"}
                        {atsScore != null && <small>/100</small>}
                    </div>
                </div>

                <div className="candidate-score-box">
                    <div className="candidate-score-heading">
                        <span>JOB MATCH</span>
                        <span className="score-indicator">MATCH</span>
                    </div>
                    <div className={`candidate-score-value ${scoreTier(matchScore)}`}>
                        {matchScore != null ? `${matchScore}%` : "—"}
                    </div>
                </div>
            </div>

            <div className="candidate-skills-section">
                <div className="candidate-section-heading">
                    <span>Key skills</span>
                    <span className="candidate-skill-count">
                        {skillList.length} detected
                    </span>
                </div>

                {visibleSkills.length > 0 ? (
                    <div className="candidate-skills">
                        {visibleSkills.map((skill, index) => (
                            <span className="skill-chip" key={`${skill}-${index}`}>
                                {skill}
                            </span>
                        ))}

                        {remainingSkillCount > 0 && (
                            <span className="skill-chip skill-chip--more">
                                +{remainingSkillCount} more
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="candidate-no-skills">
                        No skills extracted yet
                    </span>
                )}
            </div>

            <div className="candidate-card-footer">
                <span className="candidate-upload-date">
                    Uploaded {formatDate(uploadDate)}
                </span>
            </div>

            <div className="candidate-actions">
                <button
                    type="button"
                    className="candidate-action-btn candidate-action-primary"
                    onClick={() => onViewResume?.(data)}
                >
                    <Eye size={16} />
                    <span>View resume</span>
                </button>

                <button
                    type="button"
                    className="candidate-action-btn candidate-action-secondary"
                    onClick={() => onOpenProfile?.(data)}
                >
                    <UserSquare2 size={16} />
                    <span>Open profile</span>
                </button>

                <div className="candidate-menu" ref={menuRef}>
                    <button
                        ref={triggerRef}
                        type="button"
                        className={`candidate-menu-trigger ${menuOpen ? "active" : ""}`}
                        onClick={() => setMenuOpen((previous) => !previous)}
                        aria-label="More candidate actions"
                        aria-expanded={menuOpen}
                        aria-haspopup="menu"
                    >
                        <MoreVertical size={19} />
                    </button>
                </div>
            </div>

            {dropdown}
        </article>
    );
}

export default CandidateCard;
