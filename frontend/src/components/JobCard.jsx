import "./JobCard.css";

function JobCard({

    job,
    onEdit,
    onDelete,
    onCloseJob

}) {

    return (

        <div className="job-card">

            <div className="job-top">

                <div>

                    <h2>{job.title}</h2>

                    <p>{job.company}</p>

                </div>

                <span className={job.status.toLowerCase()}>
                    {job.status}
                </span>

            </div>

            <div className="job-info">

                <p>📍 {job.location}</p>

                <p>💼 {job.employmentType}</p>

                <p>🧑‍💻 {job.experience}</p>

                <p>💰 {job.salary}</p>

            </div>

            <p className="description">

                {job.description}

            </p>

            <div className="skills">

                {

                    job.requiredSkills
                        ?.split(",")
                        .map(skill => (

                            <span key={skill}>

                                {skill}

                            </span>

                        ))

                }

            </div>

            <div className="job-actions">

                <button
                    onClick={() => onEdit(job)}
                >
                    Edit
                </button>

                <button
                    onClick={() => onCloseJob(job)}
                >
                    {job.status === "ACTIVE"
                        ? "Close"
                        : "Reopen"}
                </button>

                <button
                    className="delete"
                    onClick={() => onDelete(job.id)}
                >
                    Delete
                </button>

            </div>

        </div>

    );

}

export default JobCard;