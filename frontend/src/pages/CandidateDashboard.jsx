import { useEffect, useState } from "react";
import api from "../api/api";

function CandidateDashboard() {

    const [dashboard, setDashboard] =
        useState(null);

    const email =
        "aayush.coder2023@gmail.com";

    useEffect(() => {

        api.get(
            `/resume/candidate-dashboard?email=${email}`
        )
        .then((response) => {

            setDashboard(
                response.data
            );

        })
        .catch((error) => {

            console.log(error);

        });

    }, []);

    if (!dashboard) {

        return <h2>Loading...</h2>;
    }

    return (

        <div
            style={{
                padding: "20px"
            }}
        >

            <h1>
                Candidate Dashboard
            </h1>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap"
                }}
            >

                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        width: "220px",
                        borderRadius: "10px"
                    }}
                >
                    <h3>ATS Score</h3>
                    <h1>
                        {dashboard.atsScore}
                    </h1>
                </div>

                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        width: "220px",
                        borderRadius: "10px"
                    }}
                >
                    <h3>Match Score</h3>
                    <h1>
                        {dashboard.matchScore}
                    </h1>
                </div>

                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        width: "220px",
                        borderRadius: "10px"
                    }}
                >
                    <h3>Status</h3>
                    <h1>
                        {dashboard.status}
                    </h1>
                </div>

                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        width: "220px",
                        borderRadius: "10px"
                    }}
                >
                    <h3>Resume ID</h3>
                    <h1>
                        {dashboard.resumeId}
                    </h1>
                </div>

            </div>

        </div>

    );
}

export default CandidateDashboard;