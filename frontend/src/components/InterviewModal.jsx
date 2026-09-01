import { useState, useEffect } from "react";
import api from "../api/api";
import "./InterviewModal.css";

function InterviewModal({
    isOpen,
    onClose,
    candidate,
    onSuccess,
    interview
}) {

    const [form, setForm] = useState({
        interviewDate: "",
        interviewTime: "",
        interviewer: "",
        mode: "Online",
        meetingLink: "",
        location: "",
        notes: ""
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {

    if (!isOpen) return;

    if (interview) {

        setForm({
            interviewDate: interview.interviewDate || "",
            interviewTime: interview.interviewTime || "",
            interviewer: interview.interviewer || "",
            mode: interview.mode || "Online",
            meetingLink: interview.meetingLink || "",
            location: interview.location || "",
            notes: interview.notes || ""
        });

    } else {

        setForm({
            interviewDate: "",
            interviewTime: "",
            interviewer: "",
            mode: "Online",
            meetingLink: "",
            location: "",
            notes: ""
        });

    }

}, [isOpen, interview]);
console.log("Modal State:", {
    isOpen,
    candidate,
    interview
});

    if (!isOpen || !candidate) return null;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {

    try {

        setLoading(true);

        if (interview) {

            await api.put(

                `/interview/update/${interview.id}`,

                form

            );

            alert("Interview Updated Successfully!");

        } else {

            await api.post(

                `/interview/schedule/${candidate.id}`,

                form

            );

            alert("Interview Scheduled Successfully!");

        }

        onSuccess?.();

        onClose();

    } catch (err) {

        console.error(err);

        alert("Operation Failed");

    } finally {

        setLoading(false);

    }

};

    return (

        <div className="interview-overlay">

            <div className="interview-modal">

                <h2>

                    {interview ? "Edit Interview" : "Schedule Interview"}

                </h2>
                <p className="candidate-name">
                    {candidate.name}
                </p>

                <label>Date</label>

                <input
                    type="date"
                    name="interviewDate"
                    value={form.interviewDate}
                    onChange={handleChange}
                />

                <label>Time</label>

                <input
                    type="time"
                    name="interviewTime"
                    value={form.interviewTime}
                    onChange={handleChange}
                />

                <label>Interviewer</label>

                <input
                    type="text"
                    name="interviewer"
                    placeholder="Enter interviewer name"
                    value={form.interviewer}
                    onChange={handleChange}
                />

                <label>Mode</label>

                <select
                    name="mode"
                    value={form.mode}
                    onChange={handleChange}
                >
                    <option>Online</option>
                    <option>Offline</option>
                </select>

                {form.mode === "Online" ? (

                    <>
                        <label>Meeting Link</label>

                        <input
                            type="text"
                            name="meetingLink"
                            placeholder="https://meet.google.com/..."
                            value={form.meetingLink}
                            onChange={handleChange}
                        />
                    </>

                ) : (

                    <>
                        <label>Location</label>

                        <input
                            type="text"
                            name="location"
                            placeholder="Conference Room..."
                            value={form.location}
                            onChange={handleChange}
                        />
                    </>

                )}

                <label>Notes</label>

                <textarea
                    rows="4"
                    name="notes"
                    placeholder="Interview Notes..."
                    value={form.notes}
                    onChange={handleChange}
                />

                <div className="interview-actions">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="schedule-btn"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading
? "Saving..."
: interview
    ? "Update Interview"
    : "Schedule Interview"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default InterviewModal;