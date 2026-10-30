
import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import "./JobPosts.css";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";

function JobPosts() {
    const [jobs, setJobs] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/jobs/all");
            setJobs(response.data || []);
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
            setError("We couldn't load your job listings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const isOpen = (status) =>
        ["OPEN", "ACTIVE"].includes((status || "").toUpperCase());

    const stats = useMemo(() => ({
        total: jobs.length,
        open: jobs.filter(job => isOpen(job.status)).length,
        closed: jobs.filter(job => !isOpen(job.status)).length
    }), [jobs]);

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const query = search.toLowerCase();

            const matchesSearch = [
                job.title,
                job.company,
                job.location
            ].some(value => (value || "").toLowerCase().includes(query));

            const matchesFilter =
                filter === "ALL" ||
                (filter === "OPEN" && isOpen(job.status)) ||
                (filter === "CLOSED" && !isOpen(job.status));

            return matchesSearch && matchesFilter;
        });
    }, [jobs, search, filter]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;

        try {
            await api.delete(`/jobs/${id}`);
            setJobs(prev => prev.filter(job => job.id !== id));
        } catch (err) {
            console.error("Failed to delete job:", err);
            alert("Failed to delete job.");
        }
    };

    const handleClose = async (job) => {
        const newStatus = isOpen(job.status) ? "CLOSED" : "OPEN";

        try {
            await api.put(`/jobs/${job.id}`, {
                ...job,
                status: newStatus
            });

            setJobs(prev =>
                prev.map(item =>
                    item.id === job.id
                        ? { ...item, status: newStatus }
                        : item
                )
            );
        } catch (err) {
            console.error("Failed to update job status:", err);
            alert("Failed to update job status.");
        }
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setModalOpen(true);
    };

    return (
        <div className="jobs-workspace">
            <section className="jobs-hero">
                <div className="jobs-hero-content">
                    <div className="jobs-eyebrow">
                        <span className="eyebrow-dot" />
                        RECRUITMENT WORKSPACE
                    </div>

                    <h1>
                        Find the right people.
                        <br />
                        <span>Build your next team.</span>
                    </h1>

                    <p>
                        Create opportunities, manage your openings,
                        and bring exceptional talent into your organization.
                    </p>
                </div>

                <button
                    className="create-job-btn"
                    onClick={() => {
                        setEditingJob(null);
                        setModalOpen(true);
                    }}
                >
                    <span>＋</span> Create a job
                </button>

                
            </section>

            <section className="jobs-stats">
                <div className="jobs-stat-card">
                    <div className="stat-icon stat-purple">▤</div>
                    <div>
                        <strong>{stats.total}</strong>
                        <span>Total listings</span>
                    </div>
                    <small>All time</small>
                </div>

                <div className="jobs-stat-card">
                    <div className="stat-icon stat-green">↗</div>
                    <div>
                        <strong>{stats.open}</strong>
                        <span>Active openings</span>
                    </div>
                    <small className="stat-live">
                        <i /> Live
                    </small>
                </div>

                <div className="jobs-stat-card">
                    <div className="stat-icon stat-orange">◷</div>
                    <div>
                        <strong>{stats.closed}</strong>
                        <span>Closed positions</span>
                    </div>
                    <small>Archived</small>
                </div>
            </section>

            <section className="jobs-list-section">
                <div className="jobs-section-heading">
                    <div>
                        <div className="section-kicker">YOUR OPPORTUNITIES</div>
                        <h2>Job listings</h2>
                        <p>Everything you're currently hiring for.</p>
                    </div>

                    <span className="jobs-result-count">
                        {filteredJobs.length} results
                    </span>
                </div>

                <div className="jobs-toolbar">
                    <div className="jobs-search">
                        <span>⌕</span>
                        <input
                            type="text"
                            placeholder="Search by job title, company or location..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && (
                            <button onClick={() => setSearch("")}>×</button>
                        )}
                    </div>

                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        aria-label="Filter jobs"
                    >
                        <option value="ALL">All positions</option>
                        <option value="OPEN">Open positions</option>
                        <option value="CLOSED">Closed positions</option>
                    </select>
                </div>

                {loading && (
                    <div className="jobs-empty-state">
                        <div className="jobs-loader" />
                        <h3>Preparing your workspace</h3>
                        <p>Loading your job listings...</p>
                    </div>
                )}

                {error && (
                    <div className="jobs-empty-state jobs-error">
                        <h3>Something went wrong</h3>
                        <p>{error}</p>
                        <button onClick={fetchJobs}>Try again</button>
                    </div>
                )}

                {!loading && !error && filteredJobs.length === 0 && (
                    <div className="jobs-empty-state">
                        <div className="empty-icon">⌕</div>
                        <h3>
                            {jobs.length === 0
                                ? "Your next opportunity starts here"
                                : "No matching jobs found"}
                        </h3>
                        <p>
                            {jobs.length === 0
                                ? "Create your first job listing and start discovering talent."
                                : "Try another search term or change your filters."}
                        </p>
                        {jobs.length === 0 ? (
                            <button
                                onClick={() => {
                                    setEditingJob(null);
                                    setModalOpen(true);
                                }}
                            >
                                ＋ Create your first job
                            </button>
                        ) : (
                            <button onClick={() => {
                                setSearch("");
                                setFilter("ALL");
                            }}>
                                Clear filters
                            </button>
                        )}
                    </div>
                )}

                {!loading && !error && filteredJobs.length > 0 && (
                    <div className="jobs-grid">
                        {filteredJobs.map((job, index) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                index={index}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onCloseJob={handleClose}
                            />
                        ))}
                    </div>
                )}
            </section>

            <JobModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingJob(null);
                }}
                job={editingJob}
                onSuccess={() => {
                    setModalOpen(false);
                    setEditingJob(null);
                    fetchJobs();
                }}
            />
        </div>
    );
}

export default JobPosts;
