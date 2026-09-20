import { useEffect, useState } from "react";
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

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/jobs/all");

            setJobs(response.data);
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
            setError("Failed to load jobs.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this job?")) return;

        try {
            await api.delete(`/jobs/${id}`);

            setJobs((prevJobs) =>
                prevJobs.filter((job) => job.id !== id)
            );
        } catch (err) {
            console.error("Failed to delete job:", err);
            alert("Failed to delete job.");
        }
    };

    const handleClose = async (job) => {
        try {
            const newStatus =
                job.status === "OPEN" ? "CLOSED" : "OPEN";

            await api.put(`/jobs/${job.id}`, {
                ...job,
                status: newStatus,
            });

            setJobs((prevJobs) =>
                prevJobs.map((item) =>
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
        <>
            <div className="job-page">

                <div className="job-header">

                    <div>
                        <h1>Job Posts</h1>
                        <p>Manage your recruitment opportunities</p>
                    </div>

                    <button
                        onClick={() => {
                            setEditingJob(null);
                            setModalOpen(true);
                        }}
                    >
                        + Create Job
                    </button>

                </div>

                {loading && (
                    <div className="job-state">
                        Loading jobs...
                    </div>
                )}

                {error && (
                    <div className="job-error">
                        {error}
                    </div>
                )}

                {!loading && !error && jobs.length === 0 && (
                    <div className="job-state">
                        <h3>No jobs posted yet</h3>
                        <p>
                            Create your first job posting to start
                            recruiting candidates.
                        </p>
                    </div>
                )}

                {!loading && !error && jobs.length > 0 && (
                    <div className="job-grid">

                        {jobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onCloseJob={handleClose}
                            />
                        ))}

                    </div>
                )}

            </div>

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
        </>
    );
}

export default JobPosts;