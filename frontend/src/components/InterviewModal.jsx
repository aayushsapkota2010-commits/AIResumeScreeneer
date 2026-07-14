import { useState, useEffect } from "react";
import api from "../api/api";
import "./InterviewModal.css";

function InterviewModal({
    isOpen,
    onClose,
    candidate,
    onSuccess
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
        if (isOpen) {
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
    }, [isOpen]);

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

            await api.post(
                `/interview/schedule/${candidate.id}`,
                form
            );

            alert("Interview Scheduled Successfully!");

            onSuccess?.();

            onClose();

        } catch (err) {

            console.error(err);

            alert("Failed to Schedule Interview");

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="interview-overlay">

            <div className="interview-modal">

                <h2>Schedule Interview</h2>

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
                            ? "Scheduling..."
                            : "Schedule Interview"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default InterviewModal;