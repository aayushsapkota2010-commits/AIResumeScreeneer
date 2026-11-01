import { useState } from "react";
import Modal from "react-modal";
import api from "../api/api";
import {
    AlertCircle,
    ArrowRightLeft,
    Check,
    Loader2,
    X
} from "lucide-react";
import "./MoveStageModal.css";

Modal.setAppElement("#root");

const STAGES = [
    { value: "APPLIED", label: "Applied", color: "#6366f1" },
    { value: "SCREENING", label: "Screening", color: "#0ea5e9" },
    { value: "SHORTLISTED", label: "Shortlisted", color: "#8b5cf6" },
    { value: "INTERVIEW", label: "Interview", color: "#f59e0b" },
    { value: "SELECTED", label: "Selected", color: "#10b981" },
    { value: "REJECTED", label: "Rejected", color: "#ef4444" }
];

function normalizeStatus(status) {
    return (status || "APPLIED").toUpperCase();
}

function statusLabel(status) {
    const normalized = normalizeStatus(status);
    const match = STAGES.find((stage) => stage.value === normalized);
    return match ? match.label : "Applied";
}

function getInitials(candidate) {
    const source = (candidate?.name || candidate?.email || "?").trim();
    const parts = source.split(/[\s._@-]+/).filter(Boolean);

    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return source.slice(0, 2).toUpperCase();
}

function MoveStageModal({
    isOpen,
    onClose,
    candidate,
    onSuccess
}) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            closeTimeoutMS={160}
            className="msm-modal"
            overlayClassName="msm-overlay"
            style={{
                overlay: {
                    position: "fixed",
                    inset: 0,
                    zIndex: 1200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    backgroundColor: "rgba(15, 23, 42, 0.45)",
                    backdropFilter: "blur(4px)"
                },
                content: {
                    position: "relative",
                    inset: "auto",
                    width: "520px",
                    maxWidth: "100%",
                    maxHeight: "calc(100vh - 40px)",
                    margin: 0,
                    padding: 0,
                    border: "none",
                    borderRadius: "22px",
                    background: "#ffffff",
                    boxShadow:
                        "0 30px 80px -20px rgba(15, 23, 42, 0.45)",
                    overflow: "hidden"
                }
            }}
        >
            {candidate ? (
                <MoveStageForm
                    key={candidate.id}
                    candidate={candidate}
                    onClose={onClose}
                    onSuccess={onSuccess}
                />
            ) : (
                <div className="msm-empty">
                    No candidate selected.
                </div>
            )}
        </Modal>
    );
}

function MoveStageForm({ candidate, onClose, onSuccess }) {
    const currentStatus = normalizeStatus(candidate.status);

    const [status, setStatus] = useState(currentStatus);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const saveStatus = async () => {
        if (!candidate?.id) {
            setError("No candidate selected.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            await api.put(`/resume/status/${candidate.id}`, {
                status
            });

            await onSuccess?.();

            onClose();
        } catch (err) {
            console.error(
                "Failed to update candidate status:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                    "Failed to update candidate status."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="msm-body">
            <header className="msm-header">
                <div className="msm-icon">
                    <ArrowRightLeft size={20} />
                </div>

                <div className="msm-header-text">
                    <p className="msm-eyebrow">Pipeline</p>
                    <h2 className="msm-title">Move candidate</h2>
                    <p className="msm-subtitle">
                        Choose the next stage for this candidate.
                    </p>
                </div>

                <button
                    type="button"
                    className="msm-close"
                    onClick={onClose}
                    disabled={saving}
                    aria-label="Close"
                >
                    <X size={18} />
                </button>
            </header>

            <div className="msm-candidate">
                <div className="msm-avatar">
                    {getInitials(candidate)}
                </div>

                <div className="msm-candidate-meta">
                    <span className="msm-candidate-name">
                        {candidate.name ||
                            candidate.email ||
                            "Candidate"}
                    </span>

                    {candidate.email && (
                        <span className="msm-candidate-email">
                            {candidate.email}
                        </span>
                    )}
                </div>

                <span className="msm-current-badge">
                    {statusLabel(currentStatus)}
                </span>
            </div>

            <div className="msm-field">
                <span className="msm-label">Move to stage</span>

                <div className="msm-stages">
                    {STAGES.map((stage) => {
                        const active = stage.value === status;

                        return (
                            <button
                                type="button"
                                key={stage.value}
                                className={`msm-stage ${
                                    active ? "msm-stage--active" : ""
                                }`}
                                style={{
                                    "--stage-color": stage.color
                                }}
                                onClick={() => setStatus(stage.value)}
                                disabled={saving}
                                aria-pressed={active}
                            >
                                <span className="msm-stage-dot" />
                                <span className="msm-stage-label">
                                    {stage.label}
                                </span>
                                {active && (
                                    <Check
                                        size={14}
                                        className="msm-stage-check"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {error && (
                <div className="msm-error" role="alert">
                    <AlertCircle size={15} />
                    <span>{error}</span>
                </div>
            )}

            <footer className="msm-footer">
                <button
                    type="button"
                    className="msm-btn msm-btn--ghost"
                    onClick={onClose}
                    disabled={saving}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="msm-btn msm-btn--primary"
                    onClick={saveStatus}
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <Loader2 size={15} className="msm-spin" />
                            Saving…
                        </>
                    ) : (
                        "Save changes"
                    )}
                </button>
            </footer>
        </div>
    );
}

export default MoveStageModal;
