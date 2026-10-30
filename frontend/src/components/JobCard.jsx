
import "./JobCard.css";

function JobCard({ job, onEdit, onDelete, onCloseJob, index = 0 }) {
    const isOpen = ["OPEN", "ACTIVE"].includes(
        (job.status || "").toUpperCase()
    );

  const rawSkills =
    job.requiredSkills ??
    job.required_skills ??
    job.skills ??
    [];

const skills = Array.isArray(rawSkills)
    ? rawSkills.map(skill =>
        typeof skill === "string" ? skill.trim() : skill?.name?.trim()
      ).filter(Boolean)
    : typeof rawSkills === "string"
        ? rawSkills.split(",").map(skill => skill.trim()).filter(Boolean)
        : [];   

    const initial = (job.company || job.title || "J")
        .trim()
        .charAt(0)
        .toUpperCase();

        console.log("Job data:", job);
console.log("Required skills:", job.requiredSkills);

    return (
        <article
            className="premium-job-card"
            style={{ "--card-index": index }}
        >
            <div className="premium-card-top">
                <div className="company-avatar">{initial}</div>

                <span className={`job-status-pill ${isOpen ? "is-open" : "is-closed"}`}>
                    <i />
                    {isOpen ? "Open" : "Closed"}
                </span>
            </div>

            <div className="premium-job-heading">
                <h3>{job.title}</h3>
                <p>{job.company || "Company not specified"}</p>
            </div>

            <div className="premium-job-details">
                <div>
                    <span className="detail-symbol">⌖</span>
                    <span>{job.location || "Location not specified"}</span>
                </div>
                <div>
                    <span className="detail-symbol">▣</span>
                    <span>{job.employmentType || "Employment type not specified"}</span>
                </div>
                <div>
                    <span className="detail-symbol">◷</span>
                    <span>{job.experience || "Experience not specified"}</span>
                </div>
                <div>
                    <span className="detail-symbol">₹</span>
                    <span>{job.salary || "Salary not specified"}</span>
                </div>
            </div>

            <div className="premium-job-description">
                {job.description || "No job description provided."}
            </div>

            <div className="premium-skills-section">
    <h4>Required skills</h4>

    {skills.length > 0 ? (
        <div className="premium-skills">
            {skills.slice(0, 5).map((skill, i) => (
                <span key={`${skill}-${i}`}>{skill}</span>
            ))}

            {skills.length > 5 && (
                <span className="more-skills">
                    +{skills.length - 5}
                </span>
            )}
        </div>
    ) : (
        <p className="no-skills">No skills added for this position</p>
    )}
</div>

            <div className="premium-card-actions">
                <button className="edit-job-btn" onClick={() => onEdit(job)}>
                    Edit
                </button>

                <button className="toggle-job-btn" onClick={() => onCloseJob(job)}>
                    {isOpen ? "Close position" : "Reopen position"}
                </button>

                <button
                    className="delete-job-btn"
                    onClick={() => onDelete(job.id)}
                >
                    Delete
                </button>
            </div>
        </article>
    );
}

export default JobCard;
