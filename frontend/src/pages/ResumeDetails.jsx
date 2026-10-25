import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Activity, ArrowDownToLine, ArrowUpRight, Bot, CheckCircle2, FileText, MessageCircle, Send, Sparkles, Target, UserRound, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../api/api";
import RecruiterNotes from "../components/RecruiterNotes";
import "./ResumeDetails.css";

function ResumeDetails() {
    const { id } = useParams();
    const API_URL = import.meta.env.VITE_API_URL;
    const [resume, setResume] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const INITIAL_MESSAGES = [
    {
        role: "assistant",
        text: `## Hey! I'm Avya ✨

I'm your personal AI career assistant.

I can help you:
- Summarize this resume
- Identify strengths and potential weaknesses
- Find missing skills
- Review projects and experience
- Prepare for interviews

What would you like to explore today?`
    }
];
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
   
    const [loadingChat, setLoadingChat] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        let active = true;
        setLoading(true);
        Promise.all([api.get(`/resume/${id}`), api.get(`/resume/timeline/${id}`)])
            .then(([resumeResponse, timelineResponse]) => {
                if (!active) return;
                setResume(resumeResponse.data);
                setTimeline(Array.isArray(timelineResponse.data) ? timelineResponse.data : []);
                setError("");
            })
            .catch((err) => {
                console.error("Failed to load resume details:", err);
                if (active) setError("Unable to load this resume. Please refresh and try again.");
            })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, loadingChat]);

    const askAI = async (prompt = question) => {
        const text = prompt.trim();
        if (!text || loadingChat) return;
        setMessages((old) => [...old, { role: "user", text }]);
        setQuestion("");
        setLoadingChat(true);
        try {
            const response = await api.post(`/resume/chat/${id}`, { question: text });
            setMessages((old) => [...old, { role: "assistant", text: response.data?.answer || "No answer was returned. Please try again." }]);
        } catch (err) {
            console.error("AI chat failed:", err);
            setMessages((old) => [...old, { role: "assistant", text: "Sorry, I couldn't answer that right now. Please try again." }]);
        } finally {
            setLoadingChat(false);
        }
    };

    const downloadReport = async () => {
        try {
            const response = await api.get(`/resume/report/${resume.id}`, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.download = "resume-report.pdf";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
            window.alert("Download failed. Please try again.");
        }
    };

    const openPdf = () => window.open(`${API_URL}/resume/view/${id}`, "_blank", "noopener,noreferrer");
    const dateLabel = (value) => {
        if (!value) return "Date unavailable";
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? value : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
    };
    const skills = typeof resume?.skills === "string" ? resume.skills.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const ats = Number(resume?.atsScore);
    const match = Math.min(100, Math.max(0, Number(resume?.matchScore) || 0));

    if (loading) return <main className="resume-details-page"><div className="rd-state"><span className="rd-state-icon"><Sparkles /></span><h2>Loading candidate profile</h2><p>Gathering resume insights and activity…</p></div></main>;
    if (error || !resume) return <main className="resume-details-page"><div className="rd-state"><FileText size={30} /><h2>Resume unavailable</h2><p>{error || "This resume could not be found."}</p><button className="rd-btn rd-btn-primary" onClick={() => window.location.reload()}>Try again</button></div></main>;

    return (
        <main className="resume-details-page">
            <div className="rd-glow" />
            <header className="rd-header">
                <div><div className="rd-eyebrow"><span /> RECRUITMENT WORKSPACE</div><h1>Candidate overview</h1><p>Review resume quality, candidate signals, and recruitment activity in one place.</p></div>
                <div className="rd-header-actions">
                    <button className="rd-btn rd-btn-secondary" onClick={openPdf}><ArrowUpRight size={16} /> Open original PDF</button>
                    <button className="rd-btn rd-btn-primary" onClick={downloadReport}><ArrowDownToLine size={16} /> Download report</button>
                </div>
            </header>

            <section className="rd-candidate-banner">
                <div className="rd-candidate">
                    <div className="rd-avatar">{(resume.fileName || "C").slice(0, 1).toUpperCase()}</div>
                    <div className="rd-candidate-info"><span className="rd-kicker">CANDIDATE FILE</span><h2 title={resume.fileName}>{resume.fileName || "Resume file"}</h2><p><FileText size={14} /> Resume ID: {resume.id}</p></div>
                </div>
                <span className="rd-status"><span />{String(resume.status || "Pending").replaceAll("_", " ")}</span>
            </section>

            <section className="rd-metrics">
                <article className="rd-metric rd-ats">
                    <div className="rd-metric-label"><span><FileText size={17} /></span> ATS SCORE</div>
                    <div className="rd-metric-number">{resume.atsScore ?? "—"}<small>{resume.atsScore != null ? "/100" : ""}</small></div>
                    <div className="rd-track"><span style={{ width: `${Math.min(100, Math.max(0, ats || 0))}%` }} /></div>
                    <p>{ats >= 80 ? "Strong resume screening score" : ats >= 60 ? "Good foundation to build on" : "Review suggestions below to improve"}</p>
                </article>
                <article className="rd-metric rd-match">
                    <div className="rd-metric-label"><span><Target size={17} /></span> MATCH SCORE</div>
                    <div className="rd-metric-number">{resume.matchScore ?? 0}<small>%</small></div>
                    <div className="rd-track"><span style={{ width: `${match}%` }} /></div>
                    <p>Alignment with the selected job criteria</p>
                </article>
                <article className="rd-metric rd-stage">
                    <div className="rd-metric-label"><span><Activity size={17} /></span> APPLICATION STATUS</div>
                    <div className="rd-stage-value">{String(resume.status || "Pending").replaceAll("_", " ")}</div>
                    <p>Current stage in the recruitment workflow</p>
                    <div className="rd-stage-note"><CheckCircle2 size={14} /> Workflow status</div>
                </article>
            </section>

          
<div className="rd-layout">
    {/* LEFT COLUMN */}
    <div className="rd-main-column">
        {/* Resume Profile */}
        <section className="rd-panel">
            <div className="rd-panel-title">
                <span className="rd-panel-icon">
                    <FileText size={18} />
                </span>
                <div>
                    <h2>Resume profile</h2>
                    <p>Extracted information from the uploaded document.</p>
                </div>
            </div>

            <div className="rd-file-row">
                <span className="rd-file-icon">
                    <FileText size={20} />
                </span>
                <div className="rd-file-text">
                    <small>FILE NAME</small>
                    <strong title={resume.fileName}>
                        {resume.fileName || "No file name available"}
                    </strong>
                </div>
                <button
                    className="rd-icon-btn"
                    onClick={openPdf}
                    aria-label="Open PDF"
                >
                    <ArrowUpRight size={17} />
                </button>
            </div>

            <div className="rd-divider" />

            <div className="rd-panel-title">
                <span className="rd-panel-icon rd-green">
                    <Sparkles size={18} />
                </span>
                <div>
                    <h2>Detected skills</h2>
                    <p>
                        {skills.length} listed skill
                        {skills.length === 1 ? "" : "s"}
                    </p>
                </div>
            </div>

            {skills.length ? (
                <div className="rd-skills">
                    {skills.map((skill, i) => (
                        <span key={`${skill}-${i}`}>{skill}</span>
                    ))}
                </div>
            ) : (
                <p className="rd-empty">
                    No skills were recorded for this resume.
                </p>
            )}

            <div className="rd-divider" />

            <div className="rd-panel-title">
                <span className="rd-panel-icon rd-amber">
                    <Sparkles size={18} />
                </span>
                <div>
                    <h2>Improvement suggestions</h2>
                    <p>Recommendations from resume screening.</p>
                </div>
            </div>

            <div className="rd-suggestions">
                {resume.suggestions ? (
                    <ReactMarkdown>{resume.suggestions}</ReactMarkdown>
                ) : (
                    <p className="rd-empty">
                        No suggestions are available yet.
                    </p>
                )}
            </div>

            <div className="rd-report-actions">
                <button
                    className="rd-btn rd-btn-secondary"
                    onClick={downloadReport}
                >
                    <ArrowDownToLine size={16} />
                    Download PDF report
                </button>
                <button
                    className="rd-btn rd-btn-quiet"
                    onClick={openPdf}
                >
                    Open original <ArrowUpRight size={15} />
                </button>
            </div>
        </section>

        {/* Candidate Timeline */}
        <section className="rd-panel">
            <div className="rd-panel-title">
                <span className="rd-panel-icon">
                    <Activity size={18} />
                </span>
                <div>
                    <h2>Candidate timeline</h2>
                    <p>Activity associated with this resume.</p>
                </div>
                <span className="rd-count">
                    {timeline.length} events
                </span>
            </div>

            {timeline.length ? (
                <div className="rd-timeline">
                    {timeline.map((item, index) => (
                        <article
                            className="rd-timeline-item"
                            key={item.id ?? `${item.activity}-${index}`}
                        >
                            <span className="rd-timeline-dot" />
                            <div>
                                <strong>
                                    {item.activity || "Recruitment activity"}
                                </strong>
                                <time>{dateLabel(item.createdAt)}</time>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="rd-timeline-empty">
                    <Activity size={21} />
                    <strong>No activity recorded yet</strong>
                    <p>
                        Candidate events will appear here as the recruitment
                        process progresses.
                    </p>
                </div>
            )}
        </section>

        {/* Recruiter Notes — moved inside the left column */}
        <section className="rd-notes-panel">
            <div className="rd-panel-title">
                <span className="rd-panel-icon">
                    <FileText size={18} />
                </span>
                <div>
                    <h2>Recruiter notes</h2>
                    <p>Private notes to support your hiring decision.</p>
                </div>
            </div>

            <div className="rd-notes">
                <RecruiterNotes resumeId={resume.id} />
            </div>
        </section>
    </div>

    {/* RIGHT COLUMN — Avya AI */}
    <aside className="rd-side-column">
        <section className="rd-assistant">
            <header className="rd-assistant-header">
                <div className="rd-assistant-brand">
                    <span><Bot size={21} /></span>
                    <div>
                        <h2>Avya AI</h2>
                        <p><i /> Ready to help you review</p>
                    </div>
                </div>

                <button
                    className="rd-clear"
                    onClick={() => setMessages(INITIAL_MESSAGES)}
                    title="Clear chat"
                    aria-label="Clear chat"
                >
                    <Trash2 size={16} />
                </button>
            </header>

            <div className="rd-chat-hint">
                <Sparkles size={15} />
                Ask about this candidate's skills, experience, and projects.
            </div>

            <div className="rd-chat" aria-live="polite">
                {!messages.length && (
                    <div className="rd-chat-empty">
                        <span><MessageCircle size={22} /></span>
                        <strong>Start a conversation</strong>
                        <p>Ask a focused question about this candidate.</p>
                    </div>
                )}

                {messages.map((message, index) => (
                    <div
                        className={`rd-message rd-message-${message.role}`}
                        key={`${message.role}-${index}`}
                    >
                        <span className="rd-message-avatar">
                            {message.role === "assistant" ? (
                                <Bot size={16} />
                            ) : (
                                <UserRound size={16} />
                            )}
                        </span>

                        <div className="rd-message-body">
                            <small>
                                {message.role === "assistant"
                                    ? "AI ASSISTANT"
                                    : "YOU"}
                            </small>
                            <div className="rd-markdown">
                                <ReactMarkdown>{message.text}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}

                {loadingChat && (
                    <div className="rd-message rd-message-assistant">
                        <span className="rd-message-avatar">
                            <Bot size={16} />
                        </span>
                        <div className="rd-message-body">
                            <small>AI ASSISTANT</small>
                            <div className="rd-typing">
                                <i /><i /><i />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            <form
                className="rd-composer"
                onSubmit={(e) => {
                    e.preventDefault();
                    askAI();
                }}
            >
                <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask Avya about this candidate…"
                    aria-label="Ask Avya about this candidate"
                    disabled={loadingChat}
                />
                <button
                    type="submit"
                    disabled={!question.trim() || loadingChat}
                    aria-label="Send question"
                >
                    <Send size={17} />
                </button>
            </form>

            <div className="rd-prompts">
                <small>QUICK PROMPTS</small>
                {[
                    "Summarize this resume",
                    "What are the candidate's key strengths?",
                    "What skills are missing for this role?",
                    "What are the candidate's potential weaknesses?",
                    "Generate interview questions",
                ].map((prompt) => (
                    <button
                        type="button"
                        key={prompt}
                        disabled={loadingChat}
                        onClick={() => askAI(prompt)}
                    >
                        {prompt}
                        <ArrowUpRight size={13} />
                    </button>
                ))}
            </div>
        </section>
    </aside>
</div>
</main>
);
}

export default ResumeDetails;
