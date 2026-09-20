import { useEffect, useState } from "react";
import api from "../api/api";
import "./BrowseJobs.css";
import { useNavigate } from "react-router-dom";

function BrowseJobs() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/jobs");

            setJobs(response.data);
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
            setError("Unable to load available jobs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="browse-jobs-page">

            <div className="browse-jobs-header">

                <div>
                    <span className="page-label">
                        CAREER OPPORTUNITIES
                    </span>

                    <h1>Find Your Next Opportunity</h1>

                    <p>
                        Explore open positions and find a role
                        that matches your skills and career goals.
                    </p>
                </div>

            </div>

            {loading && (
                <div className="jobs-state">
                    Loading available jobs...
                </div>
            )}

            {error && (
                <div className="jobs-error">
                    {error}
                </div>
            )}

            {!loading && !error && jobs.length === 0 && (
                <div className="jobs-state">
                    <h3>No open positions available</h3>

                    <p>
                        Check back later for new opportunities.
                    </p>
                </div>
            )}

            {!loading && !error && jobs.length > 0 && (

                <div className="browse-jobs-grid">

                    {jobs.map((job) => (

                        <div
                            className="candidate-job-card"
                            key={job.id}
                        >

                            <div className="candidate-job-top">

                                <div className="company-icon">
                                    {job.company?.charAt(0)?.toUpperCase() || "C"}
                                </div>

                                <span className="job-status">
                                    OPEN
                                </span>

                            </div>

                            <h2>{job.title}</h2>

                            <p className="job-company">
                                {job.company}
                            </p>

                            <div className="job-meta">

                                {job.location && (
                                    <span>
                                        📍 {job.location}
                                    </span>
                                )}

                                {job.employmentType && (
                                    <span>
                                        💼 {job.employmentType}
                                    </span>
                                )}

                                {job.experience && (
                                    <span>
                                        🎯 {job.experience}
                                    </span>
                                )}

                            </div>

                            <p className="job-description">
                                {job.description}
                            </p>

                            {job.salary && (
                                <div className="job-salary">
                                    {job.salary}
                                </div>
                            )}

                            <button
                                className="view-job-button"
                                onClick={() => navigate(`/jobs/${job.id}`)}
                            >
                                View Job
                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default BrowseJobs;