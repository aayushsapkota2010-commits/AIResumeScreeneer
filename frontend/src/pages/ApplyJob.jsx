import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    FileText,
    CheckCircle2,
    Loader2
} from "lucide-react";
import api from "../api/api";
import "./ApplyJob.css";

function ApplyJob() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState("");
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [jobResponse, resumeResponse] = await Promise.all([
                api.get(`/jobs/${id}`),
                api.get("/resume/my")
            ]);

            setJob(jobResponse.data);
            setResumes(resumeResponse.data);
        } catch (err) {
            console.error("Failed to load application data:", err);
            setError("Unable to load job or resume information.");
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!selectedResume) {
            setError("Please select a resume before applying.");
            return;
        }

        try {
            setApplying(true);
            setError("");
            setSuccess("");

            await api.post("/applications", null, {
                params: {
                    jobId: id,
                    resumeId: selectedResume
                }
            });

            setSuccess("Application submitted successfully!");

            setTimeout(() => {
                navigate("/my-applications");
            }, 1200);

        } catch (err) {
            console.error("Application failed:", err);

            const message =
                err.response?.data ||
                "Unable to submit your application.";

            setError(message);
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="apply-job-page">
                <div className="apply-job-state">
                    <Loader2 className="spin" size={22} />
                    Loading application details...
                </div>
            </div>
        );
    }

    if (error && !job) {
        return (
            <div className="apply-job-page">

                <button
                    className="back-button"
                    onClick={() => navigate("/browse-jobs")}
                >
                    <ArrowLeft size={18} />
                    Back to Jobs
                </button>

                <div className="apply-job-state error">
                    {error}
                </div>

            </div>
        );
    }

    return (
        <div className="apply-job-page">

            <button
                className="back-button"
                onClick={() => navigate(`/jobs/${id}`)}
            >
                <ArrowLeft size={18} />
                Back to Job
            </button>

            <div className="apply-job-container">

                <div className="apply-job-header">

                    <span className="apply-job-label">
                        APPLICATION
                    </span>

                    <h1>Apply for {job?.title}</h1>

                    <p>
                        {job?.company}
                        {job?.location
                            ? ` · ${job.location}`
                            : ""}
                    </p>

                </div>

                {error && (
                    <div className="apply-message error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="apply-message success">
                        <CheckCircle2 size={18} />
                        {success}
                    </div>
                )}

                <div className="apply-resume-card">

                    <div className="apply-card-header">

                        <div>
                            <h2>Select a Resume</h2>
                            <p>
                                Choose one of your saved resumes to submit
                                with this application.
                            </p>
                        </div>

                        <FileText size={24} />

                    </div>

                    {resumes.length === 0 ? (

                        <div className="no-resumes">

                            <FileText size={40} />

                            <h3>No resumes found</h3>

                            <p>
                                Upload a resume before applying for this job.
                            </p>

                            <button
                                className="upload-resume-button"
                                onClick={() => navigate("/my-resumes")}
                            >
                                Upload Resume
                            </button>

                        </div>

                    ) : (

                        <div className="resume-selection-list">

                            {resumes.map((resume) => (

                                <label
                                    key={resume.id}
                                    className={`resume-selection-item ${
                                        selectedResume === String(resume.id)
                                            ? "selected"
                                            : ""
                                    }`}
                                >

                                    <input
                                        type="radio"
                                        name="resume"
                                        value={resume.id}
                                        checked={
                                            selectedResume ===
                                            String(resume.id)
                                        }
                                        onChange={(e) =>
                                            setSelectedResume(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <div className="resume-selection-icon">
                                        <FileText size={20} />
                                    </div>

                                    <div className="resume-selection-info">

                                        <strong>
                                            {resume.fileName}
                                        </strong>

                                        <span>
                                            Uploaded{" "}
                                            {resume.uploadedAt
                                                ? new Date(
                                                      resume.uploadedAt
                                                  ).toLocaleDateString()
                                                : "Recently"}
                                        </span>

                                    </div>

                                    {resume.atsScore !== null &&
                                        resume.atsScore !== undefined && (
                                            <span className="resume-ats">
                                                ATS {resume.atsScore}
                                            </span>
                                        )}

                                </label>

                            ))}

                        </div>

                    )}

                </div>

                {resumes.length > 0 && (
                    <div className="apply-submit-section">

                        <div>
                            <strong>
                                Ready to submit your application?
                            </strong>

                            <p>
                                Your selected resume will be attached to
                                this application.
                            </p>
                        </div>

                        <button
                            className="submit-application-button"
                            onClick={handleApply}
                            disabled={applying || !!success}
                        >
                            {applying ? (
                                <>
                                    <Loader2
                                        size={17}
                                        className="spin"
                                    />
                                    Applying...
                                </>
                            ) : (
                                "Submit Application"
                            )}
                        </button>

                    </div>
                )}

            </div>
        </div>
    );
}

export default ApplyJob;