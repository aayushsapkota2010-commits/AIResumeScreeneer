import { useEffect, useMemo, useState } from "react";
import api from "../api/api";

function PipelineBoard() {

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState("");

    const statuses = [
        "APPLIED",
        "SCREENING",
        "SHORTLISTED",
        "INTERVIEW",
        "SELECTED",
        "REJECTED"
    ];

    // =========================================================
    // LOAD RESUMES
    // =========================================================

    useEffect(() => {

        const loadResumes = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get("/resume/all");

                setResumes(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load pipeline:",
                    error
                );

                setError(
                    "Failed to load candidates."
                );

            } finally {

                setLoading(false);

            }
        };

        loadResumes();

    }, []);

    // =========================================================
    // GROUP RESUMES ONCE
    // =========================================================

    const groupedResumes = useMemo(() => {

        const groups = {};

        statuses.forEach((status) => {
            groups[status] = [];
        });

        resumes.forEach((resume) => {

            const status =
                resume.status || "APPLIED";

            if (groups[status]) {
                groups[status].push(resume);
            }

        });

        return groups;

    }, [resumes]);

    // =========================================================
    // UPDATE STATUS
    // =========================================================

    const updateStatus = async (
        id,
        newStatus
    ) => {

        const previousResumes = resumes;

        // -----------------------------------------------------
        // Optimistic UI update
        // -----------------------------------------------------

        setResumes((current) =>
            current.map((resume) =>
                resume.id === id
                    ? {
                        ...resume,
                        status: newStatus
                    }
                    : resume
            )
        );

        setUpdatingId(id);
        setError("");

        try {

            await api.put(
                `/resume/status/${id}`,
                {
                    status: newStatus
                }
            );

        } catch (error) {

            console.error(
                "Failed to update status:",
                error
            );

            // -------------------------------------------------
            // Roll back if backend request fails
            // -------------------------------------------------

            setResumes(previousResumes);

            setError(
                "Failed to update candidate status."
            );

        } finally {

            setUpdatingId(null);

        }
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div
                style={{
                    padding: "32px",
                    color: "#64748b",
                    fontSize: "14px"
                }}
            >
                Loading pipeline...
            </div>
        );

    }

    // =========================================================
    // MAIN UI
    // =========================================================

    return (

        <div
            style={{
                padding: "28px 32px",
                width: "100%",
                boxSizing: "border-box",
                overflowX: "auto"
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    marginBottom: "24px"
                }}
            >

                <h1
                    style={{
                        margin: 0,
                        fontSize: "26px",
                        fontWeight: 700,
                        color: "#111827",
                        letterSpacing: "-0.5px"
                    }}
                >
                    Recruitment Pipeline
                </h1>

                <p
                    style={{
                        margin: "6px 0 0",
                        color: "#64748b",
                        fontSize: "14px"
                    }}
                >
                    Manage candidates through every stage
                    of the recruitment process.
                </p>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div
                    style={{
                        marginBottom: "18px",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        color: "#b91c1c",
                        fontSize: "14px"
                    }}
                >
                    {error}
                </div>

            )}

            {/* =================================================
                PIPELINE
            ================================================= */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(6, minmax(220px, 1fr))",
                    gap: "16px",
                    minWidth: "1360px",
                    alignItems: "start"
                }}
            >

                {statuses.map((status) => {

                    const candidates =
                        groupedResumes[status] || [];

                    return (

                        <div
                            key={status}
                            style={{
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                borderRadius: "14px",
                                minHeight: "360px",
                                overflow: "hidden"
                            }}
                        >

                            {/* =================================
                                COLUMN HEADER
                            ================================= */}

                            <div
                                style={{
                                    padding: "16px",
                                    background: "#ffffff",
                                    borderBottom:
                                        "1px solid #e2e8f0"
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}
                                >

                                    <h3
                                        style={{
                                            margin: 0,
                                            fontSize: "13px",
                                            fontWeight: 700,
                                            color: "#334155",
                                            letterSpacing:
                                                "0.4px"
                                        }}
                                    >
                                        {status}
                                    </h3>

                                    <span
                                        style={{
                                            minWidth: "24px",
                                            height: "24px",
                                            padding: "0 7px",
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            borderRadius: "999px",
                                            background: "#eef2ff",
                                            color: "#4f46e5",
                                            fontSize: "12px",
                                            fontWeight: 700
                                        }}
                                    >
                                        {candidates.length}
                                    </span>

                                </div>

                            </div>

                            {/* =================================
                                CARDS
                            ================================= */}

                            <div
                                style={{
                                    padding: "12px"
                                }}
                            >

                                {candidates.length === 0 ? (

                                    <div
                                        style={{
                                            padding: "28px 10px",
                                            textAlign: "center",
                                            color: "#94a3b8",
                                            fontSize: "13px"
                                        }}
                                    >
                                        No candidates
                                    </div>

                                ) : (

                                    candidates.map(
                                        (resume) => (

                                            <div
                                                key={resume.id}
                                                style={{
                                                    background:
                                                        "#ffffff",
                                                    border:
                                                        "1px solid #e2e8f0",
                                                    borderRadius:
                                                        "10px",
                                                    padding:
                                                        "14px",
                                                    marginBottom:
                                                        "10px",
                                                    boxShadow:
                                                        "0 1px 2px rgba(15, 23, 42, 0.04)"
                                                }}
                                            >

                                                {/* FILE NAME */}

                                                <div
                                                    title={
                                                        resume.fileName
                                                    }
                                                    style={{
                                                        fontSize:
                                                            "14px",
                                                        fontWeight:
                                                            600,
                                                        color:
                                                            "#1e293b",
                                                        lineHeight:
                                                            "20px",
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace:
                                                            "nowrap",
                                                        marginBottom:
                                                            "8px"
                                                    }}
                                                >
                                                    {resume.fileName ||
                                                        "Unnamed Resume"}
                                                </div>

                                                {/* ATS */}

                                                <div
                                                    style={{
                                                        fontSize:
                                                            "13px",
                                                        color:
                                                            "#64748b",
                                                        marginBottom:
                                                            "12px"
                                                    }}
                                                >
                                                    ATS Score:{" "}

                                                    <strong
                                                        style={{
                                                            color:
                                                                "#334155"
                                                        }}
                                                    >
                                                        {resume.atsScore ??
                                                            "N/A"}
                                                    </strong>
                                                </div>

                                                {/* STATUS */}

                                                <select
                                                    value={
                                                        resume.status ||
                                                        "APPLIED"
                                                    }
                                                    disabled={
                                                        updatingId ===
                                                        resume.id
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateStatus(
                                                            resume.id,
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    style={{
                                                        width:
                                                            "100%",
                                                        height:
                                                            "34px",
                                                        padding:
                                                            "0 9px",
                                                        border:
                                                            "1px solid #cbd5e1",
                                                        borderRadius:
                                                            "7px",
                                                        background:
                                                            "#ffffff",
                                                        color:
                                                            "#334155",
                                                        fontSize:
                                                            "12px",
                                                        cursor:
                                                            updatingId ===
                                                            resume.id
                                                                ? "wait"
                                                                : "pointer",
                                                        outline:
                                                            "none"
                                                    }}
                                                >

                                                    {statuses.map(
                                                        (
                                                            option
                                                        ) => (

                                                            <option
                                                                key={
                                                                    option
                                                                }
                                                                value={
                                                                    option
                                                                }
                                                            >
                                                                {
                                                                    option
                                                                }
                                                            </option>

                                                        )
                                                    )}

                                                </select>

                                                {updatingId ===
                                                    resume.id && (

                                                    <div
                                                        style={{
                                                            marginTop:
                                                                "7px",
                                                            fontSize:
                                                                "11px",
                                                            color:
                                                                "#64748b"
                                                        }}
                                                    >
                                                        Updating...
                                                    </div>

                                                )}

                                            </div>

                                        )
                                    )

                                )}

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}

export default PipelineBoard;