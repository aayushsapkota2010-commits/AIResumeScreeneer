import { useEffect, useState } from "react";
import api from "../api/api";

function RecruiterNotes({ resumeId }) {

    const [notes, setNotes] =
        useState([]);

    const [note, setNote] =
        useState("");

    const loadNotes = () => {

        api.get(`/resume/note/${resumeId}`)
            .then((response) => {

                setNotes(response.data);

            })
            .catch((error) => {

                console.log(error);
            });
    };

    useEffect(() => {

        loadNotes();

    }, [resumeId]);

    const saveNote = () => {

        api.post(
            `/resume/note/${resumeId}`,
            {
                note
            }
        )
        .then(() => {

            setNote("");

            loadNotes();

        })
        .catch((error) => {

            console.log(error);
        });
    };

    return (

        <div>

            <h2>
                Recruiter Notes
            </h2>

            <textarea
                rows="4"
                cols="60"
                value={note}
                onChange={(e) =>
                    setNote(e.target.value)
                }
            />

            <br />

            <button
                onClick={saveNote}
            >
                Save Note
            </button>

            <hr />

            {
                notes.map((n) => (

                    <div
                        key={n.id}
                        style={{
                            border: "1px solid gray",
                            marginBottom: "10px",
                            padding: "10px"
                        }}
                    >

                        <p>
                            {n.note}
                        </p>

                    </div>

                ))
            }

        </div>
    );
}

export default RecruiterNotes;