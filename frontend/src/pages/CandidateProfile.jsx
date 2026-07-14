import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

function CandidateProfile() {

    const { id } = useParams();

    const [candidate, setCandidate] = useState(null);

    useEffect(() => {

        api.get(`/resume/${id}`)
            .then((res) => {

                setCandidate(res.data);

            })
            .catch((err) => {

                console.log(err);

            });

    }, [id]);

    if (!candidate) {

        return <h2>Loading...</h2>;

    }

    return (

        <div style={{ padding: "40px" }}>

            <h1>Candidate Profile</h1>

            <hr />

            <p><strong>ID :</strong> {candidate.id}</p>

            <p><strong>Email :</strong> {candidate.candidateEmail}</p>

            <p><strong>Resume :</strong> {candidate.fileName}</p>

            <p><strong>ATS :</strong> {candidate.atsScore}</p>

            <p><strong>Match :</strong> {candidate.matchScore}%</p>

            <p><strong>Status :</strong> {candidate.status}</p>

            <p><strong>Uploaded :</strong> {candidate.uploadedAt}</p>

            <p><strong>Skills :</strong></p>

            <pre>{candidate.skills}</pre>

            <p><strong>Suggestions :</strong></p>

            <pre>{candidate.suggestions}</pre>

        </div>

    );

}

export default CandidateProfile;