import { useEffect, useState } from "react";
import api from "../api/api";

function PipelineBoard() {

    const [resumes, setResumes] =
        useState([]);

    useEffect(() => {

        api.get("/resume/all")
            .then((response) => {

                setResumes(
                    response.data
                );

            });

    }, []);

    const statuses = [
        "APPLIED",
        "SCREENING",
        "SHORTLISTED",
        "INTERVIEW",
        "SELECTED",
        "REJECTED"
    ];

      const updateStatus = async (
    id,
    newStatus
) => {

    try {

        await api.put(
            `/resume/status/${id}`,
            {
                status: newStatus
            }
        );

        const response =
            await api.get(
                "/resume/all"
            );

        setResumes(
            response.data
        );

    } catch (error) {

        console.log(error);
    }
};
    return (

        <div
            style={{
                display: "flex",
                gap: "20px",
                overflowX: "auto",
                padding: "20px"
            }}
        >

            {
                statuses.map((status) => (

                    <div
                        key={status}
                        style={{
                            minWidth: "220px",
                            border: "1px solid gray",
                            padding: "10px"
                        }}
                    >

                        <h3>
                            {status}
                        </h3>

                        {
                            resumes
                                .filter(
                                    r =>
                                    r.status === status
                                )
                                .map((resume) => (

    <div
        key={resume.id}
        style={{
            border: "1px solid lightgray",
            marginBottom: "10px",
            padding: "10px"
        }}
    >

        <strong>
            {resume.fileName}
        </strong>

        <br />

        ATS: {resume.atsScore}

        <br />
        <br />

        <select
            value={resume.status}
            onChange={(e) =>
                updateStatus(
                    resume.id,
                    e.target.value
                )
            }
        >

            <option value="APPLIED">
                APPLIED
            </option>

            <option value="SCREENING">
                SCREENING
            </option>

            <option value="SHORTLISTED">
                SHORTLISTED
            </option>

            <option value="INTERVIEW">
                INTERVIEW
            </option>

            <option value="SELECTED">
                SELECTED
            </option>

            <option value="REJECTED">
                REJECTED
            </option>

        </select>

    </div>

))
                        }

                    </div>

                ))
            }

        </div>
    );
  
}

export default PipelineBoard;