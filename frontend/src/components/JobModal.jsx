import { useEffect, useState } from "react";
import api from "../api/api";
import "./JobModal.css";

function JobModal({ isOpen, onClose, onSuccess, job }) {
    const [form, setForm] = useState({
        title: "",
        company: "",
        location: "",
        employmentType: "Full Time",
        experience: "",
        salary: "",
        description: "",
        deadline: "",
        status: "OPEN"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        setError("");

        if (job) {
            setForm({
                title: job.title || "",
                company: job.company || "",
                location: job.location || "",
                employmentType: job.employmentType || "Full Time",
                experience: job.experience || "",
                salary: job.salary || "",
                description: job.description || "",
                deadline: job.deadline
                    ? job.deadline.substring(0, 16)
                    : "",
                status: job.status || "OPEN"
            });
        } else {
            setForm({
                title: "",
                company: "",
                location: "",
                employmentType: "Full Time",
                experience: "",
                salary: "",
                description: "",
                deadline: "",
                status: "OPEN"
            });
        }
    }, [isOpen, job]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async () => {
        if (!form.title.trim()) {
            setError("Job title is required.");
            return;
        }

        if (!form.company.trim()) {
            setError("Company name is required.");
            return;
        }

        if (!form.description.trim()) {
            setError("Job description is required.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const jobData = {
                title: form.title.trim(),
                company: form.company.trim(),
                location: form.location.trim(),
                employmentType: form.employmentType,
                experience: form.experience.trim(),
                salary: form.salary.trim(),
                description: form.description.trim(),
                status: form.status,
                deadline: form.deadline
                    ? form.deadline
                    : null
            };

            if (job) {
                // EDIT JOB
                await api.put(
                    `/jobs/${job.id}`,
                    jobData
                );
            } else {
                // CREATE JOB
                await api.post(
                    "/jobs",
                    jobData
                );
            }

            onSuccess();
            onClose();

        } catch (err) {
            console.error("Job save error:", err);

            if (err.response?.status === 403) {
                setError(
                    "You don't have permission to modify jobs. Please login as ADMIN."
                );
            } else if (err.response?.status === 400) {
                setError(
                    "Invalid job details. Please check the form."
                );
            } else {
                setError(
                    "Failed to save job. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="job-modal-overlay">

            <div className="job-modal">

                <h2>
                    {job ? "Edit Job" : "Create Job"}
                </h2>

                {error && (
                    <div className="job-modal-error">
                        {error}
                    </div>
                )}

                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Job Title"
                />

                <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Company"
                />

                <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Location"
                />

                <input
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="Experience (e.g. 0-2 Years)"
                />

                <input
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    placeholder="Salary (e.g. ₹6-10 LPA)"
                />

                <select
                    name="employmentType"
                    value={form.employmentType}
                    onChange={handleChange}
                >
                    <option value="Full Time">
                        Full Time
                    </option>

                    <option value="Part Time">
                        Part Time
                    </option>

                    <option value="Internship">
                        Internship
                    </option>

                    <option value="Remote">
                        Remote
                    </option>
                </select>

                <input
                    type="datetime-local"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                />

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                >
                    <option value="OPEN">
                        Open
                    </option>

                    <option value="CLOSED">
                        Closed
                    </option>
                </select>

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Job Description"
                    rows="5"
                />

                <div className="job-modal-buttons">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : job
                                ? "Update Job"
                                : "Create Job"
                        }
                    </button>

                </div>

            </div>

        </div>
    );
}

export default JobModal;