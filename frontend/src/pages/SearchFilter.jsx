import { useState } from "react";
import api from "../api/api";

function SearchFilter() {

    const [skill, setSkill] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [minAts, setMinAts] =
        useState("");

    const [results, setResults] =
        useState([]);

    const search = async () => {

        try {

            const response =
                await api.get(
                    `/resume/filter?skill=${skill}&status=${status}&minAts=${minAts}`
                );

            setResults(
                response.data
            );

        } catch (error) {

            console.log(error);
        }
    };

    return (

        <div style={{ padding: "20px" }}>

            <h2>
                Search Candidates
            </h2>

            <input
                placeholder="Skill"
                value={skill}
                onChange={(e) =>
                    setSkill(e.target.value)
                }
            />

            <select
                value={status}
                onChange={(e) =>
                    setStatus(e.target.value)
                }
            >

                <option value="">
                    Select Status
                </option>

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

            <input
                type="number"
                placeholder="Minimum ATS"
                value={minAts}
                onChange={(e) =>
                    setMinAts(e.target.value)
                }
            />

            <button onClick={search}>
                Search
            </button>

            <hr />

            {
                results.map((resume) => (

                    <div
                        key={resume.id}
                        style={{
                            border: "1px solid gray",
                            padding: "10px",
                            marginBottom: "10px"
                        }}
                    >

                        <h4>
                            {resume.fileName}
                        </h4>

                        <p>
                            ATS: {resume.atsScore}
                        </p>

                        <p>
                            Status: {resume.status}
                        </p>

                    </div>

                ))
            }

        </div>
    );
}

export default SearchFilter;