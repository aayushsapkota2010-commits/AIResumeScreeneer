import { useEffect, useState } from "react";
import api from "../api/api";
import "./InterviewDashboard.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import InterviewModal from "../components/InterviewModal";

function InterviewDashboard() {

    const [interviews, setInterviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [selectedInterviews, setSelectedInterviews] = useState([]);
const [interviewModalOpen, setInterviewModalOpen] = useState(false);

const [editingInterview, setEditingInterview] = useState(null);

const [selectedCandidate, setSelectedCandidate] = useState(null);


    useEffect(() => {

        fetchInterviews();


    }, []);

    useEffect(() => {

        const date = selectedDate.toISOString().split("T")[0];

        const filtered = interviews.filter(

            interview => interview.interviewDate === date

        );

        setSelectedInterviews(filtered);

    }, [selectedDate, interviews]);

    const fetchInterviews = async () => {

        try {

            const response = await api.get("/interview/all");

            setInterviews(response.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    const markCompleted = async (id) => {

        await api.put(`/interview/complete/${id}`);

        fetchInterviews();

    };

    const cancelInterview = async (id) => {

        await api.put(`/interview/cancel/${id}`);

        fetchInterviews();

    };

    if (loading) return <h2>Loading...</h2>;
    const scheduled = interviews.filter(
        i => i.status === "SCHEDULED"
    ).length;

    const completed = interviews.filter(
        i => i.status === "COMPLETED"
    ).length;

    const cancelled = interviews.filter(
        i => i.status === "CANCELLED"
    ).length;

    const today = new Date().toISOString().split("T")[0];

    const todayCount = interviews.filter(
        i => i.interviewDate === today
    ).length;

    return (
        <>

        <div className="interview-page">

            <h1>Interview Dashboard</h1>

            <div className="summary-grid">

                <div className="summary-card">
                    <h2>{scheduled}</h2>
                    <p>Scheduled</p>
                </div>

                <div className="summary-card">
                    <h2>{completed}</h2>
                    <p>Completed</p>
                </div>

                <div className="summary-card">
                    <h2>{cancelled}</h2>
                    <p>Cancelled</p>
                </div>

                <div className="summary-card">
                    <h2>{todayCount}</h2>
                    <p>Today's Interviews</p>
                </div>

            </div>

            <div className="calendar-section">

                <Calendar

                    onChange={setSelectedDate}

                    value={selectedDate}

                />

                <div className="calendar-events">

                    <h2>

                        Interviews on

                        {selectedDate.toDateString()}

                    </h2>

                    {

                        selectedInterviews.length === 0 ?

                            (

                                <p>No interviews scheduled.</p>

                            )

                            :

                            (

                                selectedInterviews.map(interview => (

                                    <div

                                        key={interview.id}

                                        className="event-card"

                                    >

                                        <h3>

                                            {interview.resume.fileName}

                                        </h3>

                                        <p>

                                            {interview.interviewTime}

                                        </p>

                                        <p>

                                            {interview.interviewer}

                                        </p>

                                        <p>

                                            {interview.mode}

                                        </p>

                                    </div>

                                ))

                            )

                    }

                </div>

            </div>
            <table className="interview-table">

                <thead>

                    <tr>

                        <th>Candidate</th>

                        <th>Date</th>

                        <th>Time</th>

                        <th>Interviewer</th>

                        <th>Mode</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {interviews.map((interview) => (

                        <tr key={interview.id}>

                            <td>

                                {interview.resume.fileName}

                            </td>

                            <td>{interview.interviewDate}</td>

                            <td>{interview.interviewTime}</td>

                            <td>{interview.interviewer}</td>

                            <td>{interview.mode}</td>

                            <td>

                                <span
                                    className={`status ${interview.status.toLowerCase()}`}
                                >
                                    {interview.status}
                                </span>

                            </td>

                            <td>

                                {interview.status === "SCHEDULED" && (

                                    <>

                                        <button
                                            onClick={() =>
                                                markCompleted(interview.id)
                                            }
                                        >
                                            Complete
                                        </button>

                                        <button
                                            onClick={() =>
                                                cancelInterview(interview.id)
                                            }
                                        >
                                            Cancel
                                        </button>
                                       <button
    onClick={() => {

        console.log("Edit clicked");

        console.log(interview);

        setEditingInterview(interview);

        setSelectedCandidate(interview.resume);

        setInterviewModalOpen(true);

    }}
>
    Edit
</button>

                                    </>

                                )}

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
            <InterviewModal
            isOpen={interviewModalOpen}
            onClose={() => {
                setInterviewModalOpen(false);
                setEditingInterview(null);
            }}
            candidate={selectedCandidate}
            interview={editingInterview}
            onSuccess={fetchInterviews}
        />
        </>

    );

}

export default InterviewDashboard;