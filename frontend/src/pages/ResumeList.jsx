import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function ResumeList() {

    const [resumes, setResumes] =
        useState([]);
            const API_URL = import.meta.env.VITE_API_URL;


    useEffect(() => {

        api.get("/resume/all")
            .then((response) => {

                setResumes(response.data);

            })
            .catch((error) => {

                console.log(error);

            });

    }, []);

    return (

        <div
            style={{
                padding: "20px"
            }}
        >

            <h1>
                Resume List
            </h1>

            {
                resumes.map((resume) => (

                    <div
                        key={resume.id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "20px",
                            borderRadius: "10px",
                            marginBottom: "15px"
                        }}
                    >

                        <h3>
                            {resume.fileName}
                        </h3>

                        <p>
                            ATS Score :
                            <strong>
                                {" "}
                                {resume.atsScore}
                            </strong>
                        </p>
                          <button
        onClick={() =>
            window.open(
                `${API_URL}/resume/view/${resume.id}`,
                "_blank"
            )
        }
    >
        View Resume
    </button>

                        <p>
                            Match Score :
                            <strong>
                                {" "}
                                {resume.matchScore || 0}%
                            </strong>
                        </p>

                        <p>
                            Status :
                            <strong>
                                {" "}
                                {resume.status}
                            </strong>
                        </p>

                        <Link
                            to={`/resume/${resume.id}`}
                        >
                            <button>
                                View Details
                            </button>
                        </Link>

                    </div>

                ))
            }

        </div>
    );
}

export default ResumeList;