import { useEffect, useMemo, useState } from "react";
import api from "../api/api";

function PipelineBoard() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState("");

    const statuses = [
        "APPLIED",
        "SCREENING",
        "SHORTLISTED",
        "INTERVIEW",
        "SELECTED",
        "REJECTED",
        "WITHDRAWN"
    ];


    // =========================================================
    // LOAD APPLICATIONS
    // =========================================================

    useEffect(() => {

        const loadApplications = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get("/applications/pipeline");

                setApplications(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load application pipeline:",
                    error
                );

                setError(
                    "Failed to load candidates."
                );

            } finally {

                setLoading(false);

            }
        };

        loadApplications();

    }, []);


    // =========================================================
    // GROUP APPLICATIONS
    // =========================================================

    const groupedApplications = useMemo(() => {

        const groups = {};

        statuses.forEach((status) => {
            groups[status] = [];
        });

        applications.forEach((application) => {

            const status =
                (application.status || "APPLIED").toUpperCase();

            if (groups[status]) {
                groups[status].push(application);
            }

        });

        return groups;

    }, [applications]);


    // =========================================================
    // UPDATE APPLICATION STATUS
    // =========================================================

    const updateStatus = async (
        applicationId,
        newStatus
    ) => {

        const previousApplications =
            applications;


        // -----------------------------------------------------
        // OPTIMISTIC UI
        // -----------------------------------------------------

        setApplications((current) =>
            current.map((application) =>
                application.id === applicationId
                    ? {
                        ...application,
                        status: newStatus
                    }
                    : application
            )
        );


        setUpdatingId(applicationId);
        setError("");


        try {

            await api.put(
                `/applications/${applicationId}/status`,
                {
                    status: newStatus
                }
            );

        } catch (error) {

            console.error(
                "Failed to update application status:",
                error
            );


            // -------------------------------------------------
            // ROLLBACK
            // -------------------------------------------------

            setApplications(
                previousApplications
            );

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

            {/* HEADER */}

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
                    Manage applications through every
                    stage of the recruitment process.
                </p>

            </div>


            {/* ERROR */}

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


            {/* PIPELINE */}

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
                        groupedApplications[status] || [];


                    return (

                        <div
                            key={status}
                            style={{
                                background: "#f8fafc",
                                border:
                                    "1px solid #e2e8f0",
                                borderRadius: "14px",
                                minHeight: "360px",
                                overflow: "hidden"
                            }}
                        >

                            {/* COLUMN HEADER */}

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
                                            borderRadius:
                                                "999px",
                                            background:
                                                "#eef2ff",
                                            color:
                                                "#4f46e5",
                                            fontSize: "12px",
                                            fontWeight: 700
                                        }}
                                    >
                                        {candidates.length}
                                    </span>

                                </div>

                            </div>


                            {/* CARDS */}

                            <div
                                style={{
                                    padding: "12px"
                                }}
                            >

                                {candidates.length === 0 ? (

                                    <div
                                        style={{
                                            padding:
                                                "28px 10px",
                                            textAlign:
                                                "center",
                                            color:
                                                "#94a3b8",
                                            fontSize:
                                                "13px"
                                        }}
                                    >
                                        No candidates
                                    </div>

                                ) : (

                                    candidates.map(
                                        (application) => {

                                            const job =
                                                application.job;

                                            const resume =
                                                application.resume;


                                            return (

                                                <div
                                                    key={
                                                        application.id
                                                    }
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

                                                    {/* JOB */}

                                                    <div
                                                        style={{
                                                            fontSize:
                                                                "14px",
                                                            fontWeight:
                                                                600,
                                                            color:
                                                                "#1e293b",
                                                            lineHeight:
                                                                "20px",
                                                            marginBottom:
                                                                "4px"
                                                        }}
                                                    >
                                                        {job?.title ||
                                                            "Job Application"}
                                                    </div>


                                                    {/* COMPANY */}

                                                    <div
                                                        style={{
                                                            fontSize:
                                                                "12px",
                                                            color:
                                                                "#64748b",
                                                            marginBottom:
                                                                "8px"
                                                        }}
                                                    >
                                                        {job?.company ||
                                                            "Company"}
                                                    </div>


                                                    {/* CANDIDATE */}

                                                    <div
                                                        style={{
                                                            fontSize:
                                                                "12px",
                                                            color:
                                                                "#475569",
                                                            marginBottom:
                                                                "8px",
                                                            overflow:
                                                                "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            whiteSpace:
                                                                "nowrap"
                                                        }}
                                                        title={
                                                            application.candidateEmail
                                                        }
                                                    >
                                                        Candidate:{" "}
                                                        {application.candidateEmail ||
                                                            "Unknown"}
                                                    </div>


                                                    {/* RESUME */}

                                                    <div
                                                        style={{
                                                            fontSize:
                                                                "12px",
                                                            color:
                                                                "#64748b",
                                                            marginBottom:
                                                                "10px",
                                                            overflow:
                                                                "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            whiteSpace:
                                                                "nowrap"
                                                        }}
                                                        title={
                                                            resume?.fileName
                                                        }
                                                    >
                                                        Resume:{" "}
                                                        {resume?.fileName ||
                                                            "No resume"}
                                                    </div>


                                                    {/* SCORES */}

                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            gap:
                                                                "10px",
                                                            marginBottom:
                                                                "12px",
                                                            fontSize:
                                                                "12px"
                                                        }}
                                                    >

                                                        <span
                                                            style={{
                                                                color:
                                                                    "#475569"
                                                            }}
                                                        >
                                                            ATS:{" "}
                                                            <strong>
                                                                {application.atsScore ??
                                                                    "N/A"}
                                                            </strong>
                                                        </span>


                                                        <span
                                                            style={{
                                                                color:
                                                                    "#475569"
                                                            }}
                                                        >
                                                            Match:{" "}
                                                            <strong>
                                                                {application.matchScore ??
                                                                    "N/A"}
                                                                {application.matchScore !=
                                                                    null
                                                                    ? "%"
                                                                    : ""}
                                                            </strong>
                                                        </span>

                                                    </div>


                                                    {/* STATUS */}

                                                    <select
                                                        value={
                                                            (application.status || "APPLIED").toUpperCase()
                                                        }
                                                        disabled={
                                                            updatingId ===
                                                            application.id
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateStatus(
                                                                application.id,
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
                                                                application.id
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
                                                        application.id && (

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

                                            );

                                        }
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