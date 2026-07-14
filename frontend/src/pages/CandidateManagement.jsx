import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";


import {
    Search,
    SlidersHorizontal,
    ArrowUpDown,
    Users,
    UserCheck,
    MessageSquareMore,
    Award,
    UserX,
    Inbox
} from "lucide-react";
import CandidateCard from "../components/CandidateCard";
import "./CandidateManagement.css";
import MoveStageModal from "../components/MoveStageModal";
import ProfileDrawer from "../components/ProfileDrawer";
import InterviewModal from "../components/InterviewModal";

const STATUS_FILTERS = [
    "All",
    "Applied",
    "Shortlisted",
    "Interview",
    "Selected",
    "Rejected"
];

const SORT_OPTIONS = [
    { value: "recent", label: "Most Recent" },
    { value: "ats-desc", label: "ATS Score: High to Low" },
    { value: "ats-asc", label: "ATS Score: Low to High" },
    { value: "name", label: "Name: A to Z" }
];


function CandidateManagement() {
    const [candidates, setCandidates] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("recent");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [interviewModalOpen, setInterviewModalOpen] = useState(false);

const [selectedInterviewCandidate, setSelectedInterviewCandidate] = useState(null);

    useEffect(() => {
       api.get("/resume/all")
.then((res) => {
const mapped = res.data.map((resume) => ({

    id: resume.id,

    name: resume.candidateEmail
        ? resume.candidateEmail.split("@")[0]
        : resume.fileName.replace(".pdf", ""),

    email: resume.candidateEmail || "",

    resumeFileName: resume.fileName,

    atsScore: resume.atsScore,

    matchScore: resume.matchScore,

    status: resume.status,

    uploadDate: resume.uploadedAt,

    skills: resume.skills
        ? resume.skills.split(",").filter(Boolean)
        : [],

    resumeId: resume.id
}));

    setCandidates(mapped);

})

  .catch((err) => {

            console.log(err);
            setError("Failed to load candidates");

        })
        .finally(() => {

            setIsLoading(false);

        });
    }, []);

    const stats = useMemo(() => {
        const total = candidates.length;
        const countByStatus = (status) =>
            candidates.filter(
                (c) => (c.status || "").toLowerCase() === status
            ).length;

        return {
            total,
            shortlisted: countByStatus("shortlisted"),
            interview: countByStatus("interview"),
            selected: countByStatus("selected"),
            rejected: countByStatus("rejected")
        };
    }, [candidates]);

    const visibleCandidates = useMemo(() => {
        let result = [...candidates];

        if (statusFilter !== "All") {
            result = result.filter(
                (c) =>
                    (c.status || "").toLowerCase() ===
                    statusFilter.toLowerCase()
            );
        }

        if (searchTerm.trim()) {
            const query = searchTerm.trim().toLowerCase();
            result = result.filter(
                (c) =>
                    c.name?.toLowerCase().includes(query) ||
                    c.email?.toLowerCase().includes(query)
            );
        }

        switch (sortBy) {
            case "ats-desc":
                result.sort((a, b) => (b.atsScore ?? 0) - (a.atsScore ?? 0));
                break;
            case "ats-asc":
                result.sort((a, b) => (a.atsScore ?? 0) - (b.atsScore ?? 0));
                break;
            case "name":
                result.sort((a, b) =>
                    (a.name || "").localeCompare(b.name || "")
                );
                break;
            default:
                result.sort(
                    (a, b) =>
                        new Date(b.uploadDate ?? 0) -
                        new Date(a.uploadDate ?? 0)
                );
        }

        return result;
    }, [candidates, searchTerm, statusFilter, sortBy]);

   const API_URL = import.meta.env.VITE_API_URL;

const handleViewResume = (candidate) => {

    window.open(
        `${API_URL}/resume/view/${candidate.id}`,
        "_blank"
    );

};
const handleDownload = () => {
    window.open(
        `${API_URL}/resume/view/${candidate.id}`,
        "_blank"
    );
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

    if (error) {
        return (
            <div className="cm-state cm-state--error">
                <p>{error}</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="cm-state">
                <div className="cm-spinner" />
                <p>Loading candidates…</p>
            </div>
        );
    }

    return (
        <>
        <div className="cm-page">
            <header className="cm-header">
                <div className="cm-header-text">
                    <p className="cm-eyebrow">Recruitment</p>
                    <h1 className="cm-title">Candidates</h1>
                    <p className="cm-subtitle">
                        Review, filter, and move candidates through your
                        pipeline.
                    </p>
                </div>

                <div className="cm-header-controls">
                    <div className="cm-search">
                        <Search size={16} className="cm-search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="cm-popover">
                        <button
                            type="button"
                            className="cm-control-btn"
                            onClick={() => setFilterOpen((prev) => !prev)}
                        >
                            <SlidersHorizontal size={15} />
                            Filter
                            {statusFilter !== "All" && (
                                <span className="cm-filter-badge">1</span>
                            )}
                        </button>

                        {filterOpen && (
                            <div className="cm-filter-dropdown">
                                {STATUS_FILTERS.map((status) => (
                                    <button
                                        type="button"
                                        key={status}
                                        className={`cm-filter-option ${
                                            statusFilter === status
                                                ? "cm-filter-option--active"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setStatusFilter(status);
                                            setFilterOpen(false);
                                        }}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="cm-sort">
                        <ArrowUpDown size={15} className="cm-sort-icon" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            <section className="cm-stats">
                <StatPill
                    icon={<Users size={16} />}
                    label="Total Candidates"
                    value={stats.total}
                    accent="indigo"
                />
                <StatPill
                    icon={<UserCheck size={16} />}
                    label="Shortlisted"
                    value={stats.shortlisted}
                    accent="sage"
                />
                <StatPill
                    icon={<MessageSquareMore size={16} />}
                    label="Interview"
                    value={stats.interview}
                    accent="amber"
                />
                <StatPill
                    icon={<Award size={16} />}
                    label="Selected"
                    value={stats.selected}
                    accent="sage"
                />
                <StatPill
                    icon={<UserX size={16} />}
                    label="Rejected"
                    value={stats.rejected}
                    accent="slate"
                />
            </section>

            {visibleCandidates.length === 0 ? (
                <div className="cm-empty-state">
                    <div className="cm-empty-icon">
                        <Inbox size={28} strokeWidth={1.6} />
                    </div>
                    <p className="cm-empty-title">
                        {candidates.length === 0
                            ? "No candidates yet"
                            : "No candidates match your search"}
                    </p>
                    <p className="cm-empty-subtitle">
                        {candidates.length === 0
                            ? "Uploaded resumes will appear here once screening begins."
                            : "Try adjusting your search or filter."}
                    </p>
                </div>
            ) : (
                <div className="cm-grid">
                    {visibleCandidates.map((candidate) => (
                       <CandidateCard
    key={candidate.id}
    candidate={candidate}
    onViewResume={handleViewResume}
    onOpenProfile={handleOpenProfile}
    onInterviewInvite={handleInterviewInvite}
    onMoveStage={handleMoveStage}
/>
                    ))}
                </div>
            )}
                        


        </div>
       <ProfileDrawer
    candidate={selectedCandidate}
    onClose={() => setSelectedCandidate(null)}
    onMoveStage={handleMoveStage}
/>
<InterviewModal
    isOpen={interviewModalOpen}
    onClose={() => setInterviewModalOpen(false)}
    candidate={selectedInterviewCandidate}
    onSuccess={() => {

        api.get("/resume/all")
            .then((res) => {

                const mapped = res.data.map((resume) => ({
                    id: resume.id,
                    name: resume.candidateEmail
                        ? resume.candidateEmail.split("@")[0]
                        : "Unnamed Candidate",
                    email: resume.candidateEmail || "No Email",
                    resumeFileName: resume.fileName,
                    atsScore: resume.atsScore ?? 0,
                    matchScore: resume.matchScore ?? 0,
                    status: resume.status,
                    uploadDate: resume.uploadedAt,
                    skills: resume.skills
                        ? resume.skills.split(",")
                        : []
                }));

                setCandidates(mapped);

            });

    }}
/>
<MoveStageModal

    isOpen={modalOpen}

    onClose={() => setModalOpen(false)}

    candidate={selectedCandidate}

    onSuccess={() => {

        api.get("/resume/all")

            .then((res) => {

                const mapped = res.data.map((candidate) => ({

                    id: candidate.id,

                    name: candidate.candidateEmail
                        ? candidate.candidateEmail.split("@")[0]
                        : "Unnamed Candidate",

                    email: candidate.candidateEmail || "No Email",

                    resumeFileName: candidate.fileName,

                    atsScore: candidate.atsScore ?? 0,

                    matchScore: candidate.matchScore ?? 0,

                    status: candidate.status,

                    uploadDate: candidate.uploadedAt,

                    skills: candidate.skills
                        ? candidate.skills.split(",")
                        : []

                }));

                setCandidates(mapped);

            });

    }}
    

/>


        </>
       
        
    );
}

function StatPill({ icon, label, value, accent }) {
    return (
        <div className={`cm-stat-pill cm-stat-pill--${accent}`}>
            <span className="cm-stat-icon">{icon}</span>
            <div className="cm-stat-text">
                <span className="cm-stat-value">{value}</span>
                <span className="cm-stat-label">{label}</span>
            </div>


        </div>
    );
}

export default CandidateManagement;
