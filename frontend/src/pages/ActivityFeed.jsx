import { useEffect, useState } from "react";
import api from "../api/api";

function ActivityFeed() {

    const [logs, setLogs] =
        useState([]);

    useEffect(() => {

        api.get("/resume/activity-logs")
            .then((response) => {

                setLogs(
                    response.data
                );

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
                Recruiter Activity Feed
            </h1>

            {

                logs.map((log) => (

                    <div
                        key={log.id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "15px",
                            marginBottom: "10px",
                            borderRadius: "10px"
                        }}
                    >

                        <h3>
                            {log.actionType}
                        </h3>

                        <p>
                            Candidate:
                            {" "}
                            {log.candidateName}
                        </p>

                        <p>
                            Recruiter:
                            {" "}
                            {log.recruiterEmail}
                        </p>

                        <small>
                            {log.actionTime}
                        </small>

                    </div>

                ))

            }

        </div>

    );
}

export default ActivityFeed;