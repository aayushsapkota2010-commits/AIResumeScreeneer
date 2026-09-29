import { useEffect, useState } from "react";
import Modal from "react-modal";
import api from "../api/api";

Modal.setAppElement("#root");

function MoveStageModal({
    isOpen,
    onClose,
    candidate,
    onSuccess
}) {

    const [status, setStatus] = useState("APPLIED");
    const [saving, setSaving] = useState(false);

    // Sync status whenever a different candidate is opened
    useEffect(() => {

        if (candidate) {
            setStatus(
                candidate.status || "APPLIED"
            );
        }

    }, [candidate]);

    const saveStatus = async () => {

        // Safety check
        if (!candidate?.id) {

            console.error(
                "Cannot move stage: candidate is null or has no ID",
                candidate
            );

            return;
        }

        try {

            setSaving(true);

            console.log(
                "Moving candidate:",
                candidate.id,
                "to:",
                status
            );

            await api.put(
                `/resume/status/${candidate.id}`,
                {
                    status: status
                }
            );

            onSuccess();

            onClose();

        } catch (error) {

            console.error(
                "Failed to update candidate status:",
                error
            );

        } finally {

            setSaving(false);

        }
    };

    return (

        <Modal

            isOpen={isOpen}

            onRequestClose={onClose}

            style={{

                content: {
                    width: "450px",
                    height: "300px",
                    margin: "auto",
                    borderRadius: "15px"
                }

            }}

        >

            <h2>Move Candidate</h2>

            <br />

            {!candidate ? (

                <p>
                    No candidate selected.
                </p>

            ) : (

                <>
                    <p>
                        Moving:
                        <strong>
                            {" "}
                            {candidate.name ||
                                candidate.email ||
                                "Candidate"}
                        </strong>
                    </p>

                    <br />

                    <select

                        value={status}

                        onChange={(e) =>
                            setStatus(e.target.value)
                        }

                        disabled={saving}

                        style={{
                            width: "100%",
                            padding: "12px"
                        }}

                    >

                        <option value="APPLIED">
                            Applied
                        </option>

                        <option value="SHORTLISTED">
                            Shortlisted
                        </option>

                        <option value="INTERVIEW">
                            Interview
                        </option>

                        <option value="SELECTED">
                            Selected
                        </option>

                        <option value="REJECTED">
                            Rejected
                        </option>

                    </select>

                    <br />
                    <br />

                    <button
                        onClick={saveStatus}
                        disabled={saving}
                    >

                        {saving
                            ? "Saving..."
                            : "Save"}

                    </button>

                    <button

                        onClick={onClose}

                        disabled={saving}

                        style={{
                            marginLeft: "15px"
                        }}

                    >

                        Cancel

                    </button>
                </>

            )}

        </Modal>
    );
}

export default MoveStageModal;