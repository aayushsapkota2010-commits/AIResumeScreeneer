import { useEffect, useState } from "react";
import api from "../api/api";
import "./InterviewDashboard.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import InterviewModal from "../components/InterviewModal";

function InterviewDashboard() {

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedDate, setSelectedDate] =
        useState(new Date());

    const [selectedInterviews, setSelectedInterviews] =
        useState([]);

    const [interviewModalOpen, setInterviewModalOpen] =
        useState(false);

    const [editingInterview, setEditingInterview] =
        useState(null);

    const [selectedCandidate, setSelectedCandidate] =
        useState(null);


    // ============================================================
    // DATE HELPERS
    // ============================================================

    // IMPORTANT:
    // Do NOT use toISOString() for calendar date comparison.
    // It converts the date to UTC and can shift the date by one day.

    const getLocalDateKey = (date) => {

        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };


    const formatDisplayDate = (date) => {

        if (!date) {
            return "";
        }

        const [year, month, day] =
            date.split("-").map(Number);

        const localDate =
            new Date(year, month - 1, day);

        return localDate.toLocaleDateString(
            "en-US",
            {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );
    };


    const formatTime = (time) => {

        if (!time) {
            return "—";
        }

        // Backend usually returns HH:mm:ss
        // Display only HH:mm
        return time.substring(0, 5);
    };


    // ============================================================
    // FETCH INTERVIEWS
    // ============================================================

    useEffect(() => {

        fetchInterviews();

    }, []);


    // ============================================================
    // FILTER INTERVIEWS FOR SELECTED DATE
    // ============================================================

    useEffect(() => {

        const dateKey =
            getLocalDateKey(selectedDate);

        const filtered =
            interviews.filter(
                (interview) =>
                    interview.interviewDate === dateKey
            );

        setSelectedInterviews(filtered);

    }, [selectedDate, interviews]);


    // ============================================================
    // FETCH ALL INTERVIEWS
    // ============================================================

    const fetchInterviews = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/interview/all");

            setInterviews(response.data || []);

        } catch (err) {

            console.error(
                "Failed to fetch interviews:",
                err
            );

        } finally {

            setLoading(false);

        }
    };


    // ============================================================
    // COMPLETE INTERVIEW
    // ============================================================

    const markCompleted = async (id) => {

        try {

            await api.put(
                `/interview/complete/${id}`
            );

            await fetchInterviews();

        } catch (err) {

            console.error(
                "Failed to complete interview:",
                err
            );
        }
    };


    // ============================================================
    // CANCEL INTERVIEW
    // ============================================================

    const cancelInterview = async (id) => {

        try {

            await api.put(
                `/interview/cancel/${id}`
            );

            await fetchInterviews();

        } catch (err) {

            console.error(
                "Failed to cancel interview:",
                err
            );
        }
    };


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (
            <div className="interview-loading">
                <h2>Loading interviews...</h2>
            </div>
        );

    }


    // ============================================================
    // SUMMARY COUNTS
    // ============================================================

    const scheduled =
        interviews.filter(
            (interview) =>
                interview.status === "SCHEDULED"
        ).length;


    const completed =
        interviews.filter(
            (interview) =>
                interview.status === "COMPLETED"
        ).length;


    const cancelled =
        interviews.filter(
            (interview) =>
                interview.status === "CANCELLED"
        ).length;


    // IMPORTANT:
    // Use local date instead of toISOString()

    const today =
        getLocalDateKey(new Date());


    const todayCount =
        interviews.filter(
            (interview) =>
                interview.interviewDate === today
        ).length;


    // ============================================================
    // CALENDAR INTERVIEW INDICATOR
    // ============================================================

    const hasInterviewOnDate = (date) => {

        const dateKey =
            getLocalDateKey(date);

        return interviews.some(
            (interview) =>
                interview.interviewDate === dateKey
        );
    };


    // ============================================================
    // SELECTED DATE
    // ============================================================

    const selectedDateTitle =
        formatDisplayDate(
            getLocalDateKey(selectedDate)
        );


    return (
        <>

            <div className="interview-page">

                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <div className="interview-header">

                    <div>
                        <h1>
                            Interview Dashboard
                        </h1>

                        <p>
                            Schedule, manage, and track candidate interviews.
                        </p>
                    </div>

                </div>


                {/* ==================================================
                    SUMMARY CARDS
                ================================================== */}

                <div className="summary-grid">

                    <div className="summary-card">

                        <div className="summary-number">
                            {scheduled}
                        </div>

                        <p>
                            Scheduled
                        </p>

                    </div>


                    <div className="summary-card">

                        <div className="summary-number">
                            {completed}
                        </div>

                        <p>
                            Completed
                        </p>

                    </div>


                    <div className="summary-card">

                        <div className="summary-number">
                            {cancelled}
                        </div>

                        <p>
                            Cancelled
                        </p>

                    </div>


                    <div className="summary-card">

                        <div className="summary-number">
                            {todayCount}
                        </div>

                        <p>
                            Today's Interviews
                        </p>

                    </div>

                </div>


                {/* ==================================================
                    CALENDAR SECTION
                ================================================== */}

                <div className="calendar-section">

                    {/* ================= CALENDAR ================= */}

                    <div className="calendar-card">

                        <Calendar

                            onChange={setSelectedDate}

                            value={selectedDate}

                            tileContent={({ date }) => {

                                if (
                                    hasInterviewOnDate(date)
                                ) {

                                    return (
                                        <span className="interview-dot">
                                            •
                                        </span>
                                    );

                                }

                                return null;

                            }}

                        />

                    </div>


                    {/* ================= SELECTED DATE ================= */}

                    <div className="calendar-events">

                        <div className="calendar-events-header">

                            <div>

                                <h2>
                                    Interviews
                                </h2>

                                <p>
                                    {selectedDateTitle}
                                </p>

                            </div>

                            <span className="event-count">

                                {selectedInterviews.length}

                                {" "}
                                {selectedInterviews.length === 1
                                    ? "Interview"
                                    : "Interviews"
                                }

                            </span>

                        </div>


                        {selectedInterviews.length === 0 ? (

                            <div className="empty-events">

                                <div className="empty-icon">
                                    📅
                                </div>

                                <h3>
                                    No interviews scheduled
                                </h3>

                                <p>
                                    There are no interviews scheduled for this date.
                                </p>

                            </div>

                        ) : (

                            <div className="event-list">

                                {selectedInterviews.map(
                                    (interview) => {

                                        const candidate =
                                            interview.resume;

                                        return (

                                            <div
                                                key={interview.id}
                                                className="event-card"
                                            >

                                                <div className="event-card-top">

                                                    <div>

                                                        <h3>
                                                            {candidate?.candidateName ||
                                                                candidate?.candidateEmail ||
                                                                candidate?.fileName ||
                                                                "Candidate"}
                                                        </h3>

                                                        {candidate?.candidateEmail && (

                                                            <p className="event-email">
                                                                {candidate.candidateEmail}
                                                            </p>

                                                        )}

                                                    </div>


                                                    <span
                                                        className={`status ${interview.status?.toLowerCase()}`}
                                                    >
                                                        {interview.status}
                                                    </span>

                                                </div>


                                                <div className="event-details">

                                                    <div className="event-detail">

                                                        <span>
                                                            🕐
                                                        </span>

                                                        <div>
                                                            <small>
                                                                Time
                                                            </small>

                                                            <strong>
                                                                {formatTime(
                                                                    interview.interviewTime
                                                                )}
                                                            </strong>
                                                        </div>

                                                    </div>


                                                    <div className="event-detail">

                                                        <span>
                                                            👤
                                                        </span>

                                                        <div>
                                                            <small>
                                                                Interviewer
                                                            </small>

                                                            <strong>
                                                                {interview.interviewer ||
                                                                    "Not assigned"}
                                                            </strong>
                                                        </div>

                                                    </div>


                                                    <div className="event-detail">

                                                        <span>
                                                            💻
                                                        </span>

                                                        <div>
                                                            <small>
                                                                Mode
                                                            </small>

                                                            <strong>
                                                                {interview.mode ||
                                                                    "Not specified"}
                                                            </strong>
                                                        </div>

                                                    </div>

                                                </div>


                                                {interview.meetingLink && (

                                                    <a
                                                        href={
                                                            interview.meetingLink
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="meeting-link"
                                                    >
                                                        Join Interview
                                                    </a>

                                                )}

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </div>

                </div>


                {/* ==================================================
                    ALL INTERVIEWS TABLE
                ================================================== */}

                <div className="interview-table-section">

                    <div className="table-header">

                        <div>

                            <h2>
                                All Interviews
                            </h2>

                            <p>
                                Complete interview schedule
                            </p>

                        </div>

                        <span className="total-interviews">

                            {interviews.length}
                            {" "}
                            Total

                        </span>

                    </div>


                    <div className="table-wrapper">

                        <table className="interview-table">

                            <thead>

                                <tr>

                                    <th>
                                        Candidate
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Time
                                    </th>

                                    <th>
                                        Interviewer
                                    </th>

                                    <th>
                                        Mode
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {interviews.map(
                                    (interview) => {

                                        const candidate =
                                            interview.resume;

                                        return (

                                            <tr
                                                key={interview.id}
                                            >

                                                <td>

                                                    <div className="candidate-cell">

                                                        <div className="candidate-avatar">

                                                            {(candidate?.candidateName ||
                                                                candidate?.candidateEmail ||
                                                                "C")
                                                                .charAt(0)
                                                                .toUpperCase()}

                                                        </div>

                                                        <div>

                                                            <strong>

                                                                {candidate?.candidateName ||
                                                                    candidate?.candidateEmail ||
                                                                    "Candidate"}

                                                            </strong>

                                                            <small>

                                                                {candidate?.candidateEmail ||
                                                                    candidate?.fileName ||
                                                                    "Resume"}

                                                            </small>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td>

                                                    {formatDisplayDate(
                                                        interview.interviewDate
                                                    )}

                                                </td>


                                                <td>

                                                    {formatTime(
                                                        interview.interviewTime
                                                    )}

                                                </td>


                                                <td>

                                                    {interview.interviewer ||
                                                        "—"}

                                                </td>


                                                <td>

                                                    <span className="mode-badge">

                                                        {interview.mode ||
                                                            "—"}

                                                    </span>

                                                </td>


                                                <td>

                                                    <span
                                                        className={`status ${interview.status?.toLowerCase()}`}
                                                    >
                                                        {interview.status}
                                                    </span>

                                                </td>


                                                <td>

                                                    {interview.status ===
                                                        "SCHEDULED" && (

                                                        <div className="action-buttons">

                                                            <button
                                                                className="complete-btn"
                                                                onClick={() =>
                                                                    markCompleted(
                                                                        interview.id
                                                                    )
                                                                }
                                                            >
                                                                Complete
                                                            </button>


                                                            <button
                                                                className="cancel-btn"
                                                                onClick={() =>
                                                                    cancelInterview(
                                                                        interview.id
                                                                    )
                                                                }
                                                            >
                                                                Cancel
                                                            </button>


                                                            <button
                                                                className="edit-btn"
                                                                onClick={() => {

                                                                    setEditingInterview(
                                                                        interview
                                                                    );

                                                                    setSelectedCandidate(
                                                                        interview.resume
                                                                    );

                                                                    setInterviewModalOpen(
                                                                        true
                                                                    );

                                                                }}
                                                            >
                                                                Edit
                                                            </button>

                                                        </div>

                                                    )}

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>


            {/* ======================================================
                INTERVIEW MODAL
            ====================================================== */}

            <InterviewModal

                isOpen={interviewModalOpen}

                onClose={() => {

                    setInterviewModalOpen(false);

                    setEditingInterview(null);

                    setSelectedCandidate(null);

                }}

                candidate={selectedCandidate}

                interview={editingInterview}

                onSuccess={fetchInterviews}

            />

        </>
    );
}

export default InterviewDashboard;