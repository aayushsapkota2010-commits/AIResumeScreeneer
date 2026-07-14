import { useState } from "react";
import Modal from "react-modal";
import api from "../api/api";

Modal.setAppElement("#root");

function MoveStageModal({
    isOpen,
    onClose,
    candidate,
    onSuccess
}) {

    const [status, setStatus] = useState(
        candidate?.status || "APPLIED"
    );

    const saveStatus = async () => {

        try {

            await api.put(

                `/resume/status/${candidate.id}`,

                {
                    status: status
                }

            );

            onSuccess();

            onClose();

        }

        catch(error){

            console.log(error);

        }

    };

    return (

        <Modal

            isOpen={isOpen}

            onRequestClose={onClose}

            style={{

                content:{
                    width:"450px",
                    height:"300px",
                    margin:"auto",
                    borderRadius:"15px"
                }

            }}

        >

            <h2>Move Candidate</h2>

            <br/>

            <select

                value={status}

                onChange={(e)=>setStatus(e.target.value)}

                style={{

                    width:"100%",
                    padding:"12px"

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

            <br/>
            <br/>

            <button onClick={saveStatus}>

                Save

            </button>

            <button
                onClick={onClose}
                style={{marginLeft:"15px"}}
            >

                Cancel

            </button>

        </Modal>

    );

}

export default MoveStageModal;