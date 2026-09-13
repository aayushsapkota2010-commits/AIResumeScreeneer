import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api";
import "./SearchFilter.css";

function SearchFilter() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [skill, setSkill] = useState(
        searchParams.get("query") || ""
    );

    const [status, setStatus] = useState("");
    const [minAts, setMinAts] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const search = async (searchValue = skill) => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            if (searchValue.trim()) {
                params.append("skill", searchValue.trim());
            }

            if (status) {
                params.append("status", status);
            }

            if (minAts !== "") {
                params.append("minAts", minAts);
            }

            const response = await api.get(
                `/resume/filter?${params.toString()}`
            );

            const data = Array.isArray(response.data)
                ? response.data
                : [];

            setResults(data);

            if (searchValue.trim()) {
                setSearchParams({
                    query: searchValue.trim()
                });
            } else {
                setSearchParams({});
            }
        } catch (err) {
            console.error("Search failed:", err);
            setError("Unable to search resumes.");
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initialQuery =
            searchParams.get("query") || "";

        if (initialQuery) {
            setSkill(initialQuery);
            search(initialQuery);
        }
    }, []);

    const handleSearchKeyDown = (event) => {
        if (event.key === "Enter") {
            search();
        }
    };

    const clearSearch = () => {
        setSkill("");
        setStatus("");
        setMinAts("");
        setResults([]);
        setError("");
        setSearchParams({});
    };

    return (
        <div className="search-page">

            <div className="search-container">

                <div className="search-header">
                    <p className="search-eyebrow">
                        Candidate Discovery
                    </p>

                    <h1>
                        Search Candidates
                    </h1>

                    <p>
                        Find resumes using skills, status,
                        and minimum ATS score.
                    </p>
                </div>

                <div className="search-card">

                    <div className="search-fields">

                        <div className="search-field">
                            <label htmlFor="skill">
                                Skill or keyword
                            </label>

                            <input
                                id="skill"
                                type="text"
                                placeholder="e.g. Java, Python, React"
                                value={skill}
                                onChange={(e) =>
                                    setSkill(e.target.value)
                                }
                                onKeyDown={
                                    handleSearchKeyDown
                                }
                            />
                        </div>

                        <div className="search-field">
                            <label htmlFor="status">
                                Status
                            </label>

                            <select
                                id="status"
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value)
                                }
                            >
                                <option value="">
                                    All Statuses
                                </option>

                                <option value="APPLIED">
                                    APPLIED
                                </option>

                                <option value="SCREENING">
                                    SCREENING
                                </option>

                                <option value="SHORTLISTED">
                                    SHORTLISTED
                                </option>

                                <option value="INTERVIEW">
                                    INTERVIEW
                                </option>

                                <option value="SELECTED">
                                    SELECTED
                                </option>

                                <option value="REJECTED">
                                    REJECTED
                                </option>
                            </select>
                        </div>

                        <div className="search-field">
                            <label htmlFor="minAts">
                                Minimum ATS
                            </label>

                            <input
                                id="minAts"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="e.g. 70"
                                value={minAts}
                                onChange={(e) =>
                                    setMinAts(e.target.value)
                                }
                                onKeyDown={
                                    handleSearchKeyDown
                                }
                            />
                        </div>

                    </div>

                    <div className="search-actions">

                        <button
                            type="button"
                            className="search-submit"
                            onClick={() => search()}
                            disabled={loading}
                        >
                            {loading
                                ? "Searching..."
                                : "Search Candidates"}
                        </button>

                        <button
                            type="button"
                            className="search-clear"
                            onClick={clearSearch}
                        >
                            Clear
                        </button>

                    </div>

                </div>

                {error && (
                    <div className="search-error">
                        {error}
                    </div>
                )}

                <div className="search-results-header">
                    <h2>
                        Search Results
                    </h2>

                    <span>
                        {results.length} result
                        {results.length !== 1
                            ? "s"
                            : ""}
                    </span>
                </div>

                <div className="search-results">

                    {loading && (
                        <div className="search-empty">
                            Searching resumes...
                        </div>
                    )}

                    {!loading &&
                        results.length === 0 &&
                        !error && (
                            <div className="search-empty">
                                No matching resumes found.
                            </div>
                        )}

                    {!loading &&
                        results.map((resume) => (
                            <div
                                className="search-result-card"
                                key={resume.id}
                            >
                                <div className="search-result-main">

                                    <h3>
                                        {resume.fileName ||
                                            resume.name ||
                                            "Resume"}
                                    </h3>

                                    <div className="search-result-meta">

                                        <span>
                                            ATS:{" "}
                                            <strong>
                                                {resume.atsScore ??
                                                    "—"}
                                            </strong>
                                        </span>

                                        <span>
                                            Status:{" "}
                                            <strong>
                                                {resume.status ||
                                                    "—"}
                                            </strong>
                                        </span>

                                    </div>

                                </div>

                                <div
                                    className={`search-status search-status--${(
                                        resume.status || ""
                                    ).toLowerCase()}`}
                                >
                                    {resume.status ||
                                        "UNKNOWN"}
                                </div>
                            </div>
                        ))}

                </div>

            </div>

        </div>
    );
}

export default SearchFilter;