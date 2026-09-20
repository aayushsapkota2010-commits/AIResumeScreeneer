import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Briefcase,
    Building2,
    MapPin,
    Clock3,
    GraduationCap,
    Wallet,
    CalendarDays
} from "lucide-react";
import api from "../api/api";
import "./JobDetails.css";

function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/jobs/${id}`);
            setJob(response.data);
        } catch (err) {
            console.error("Failed to load job:", err);
            setError("Unable to load this job.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="job-details-page">
                <div className="job-details-state">
                    Loading job details...
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="job-details-page">
                <button
                    className="back-button"
                    onClick={() => navigate("/browse-jobs")}
                >
                    <ArrowLeft size={18} />
                    Back to Jobs
                </button>

                <div className="job-details-state error">
                    {error || "Job not found."}
                </div>
            </div>
        );
    }

    return (
        <div className="job-details-page">

            <button
                className="back-button"
                onClick={() => navigate("/browse-jobs")}
            >
                <ArrowLeft size={18} />
                Back to Jobs
            </button>

            <div className="job-details-card">

                <div className="job-details-header">

                    <div className="job-company-icon">
                        {job.company?.charAt(0)?.toUpperCase() || "C"}
                    </div>

                    <div className="job-details-heading">
                        <span className="job-details-status">
                            {job.status || "OPEN"}
                        </span>

                        <h1>{job.title}</h1>

                        <div className="job-details-company">
                            <Building2 size={17} />
                            {job.company}
                        </div>
                    </div>

                </div>

                <div className="job-details-meta">

                    {job.location && (
                        <div className="job-meta-item">
                            <MapPin size={17} />
                            <div>
                                <span>Location</span>
                                <strong>{job.location}</strong>
                            </div>
                        </div>
                    )}

                    {job.employmentType && (
                        <div className="job-meta-item">
                            <Briefcase size={17} />
                            <div>
                                <span>Employment Type</span>
                                <strong>{job.employmentType}</strong>
                            </div>
                        </div>
                    )}

                    {job.experience && (
                        <div className="job-meta-item">
                            <GraduationCap size={17} />
                            <div>
                                <span>Experience</span>
                                <strong>{job.experience}</strong>
                            </div>
                        </div>
                    )}

                    {job.salary && (
                        <div className="job-meta-item">
                            <Wallet size={17} />
                            <div>
                                <span>Salary</span>
                                <strong>{job.salary}</strong>
                            </div>
                        </div>
                    )}

                    {job.deadline && (
                        <div className="job-meta-item">
                            <CalendarDays size={17} />
                            <div>
                                <span>Application Deadline</span>
                                <strong>
                                    {new Date(job.deadline).toLocaleDateString()}
                                </strong>
                            </div>
                        </div>
                    )}

                </div>

                <div className="job-details-description">

                    <h2>About the Role</h2>

                    <p>
                        {job.description}
                    </p>

                </div>

                <div className="job-details-apply">

                    <div>
                        <h3>Interested in this opportunity?</h3>
                        <p>
                            Apply using one of your saved resumes.
                        </p>
                    </div>

                    <button
                        className="apply-job-button"
                        onClick={() => navigate(`/apply/${job.id}`)}
                    >
                        Apply Now
                    </button>

                </div>

            </div>
        </div>
    );
}

export default JobDetails;