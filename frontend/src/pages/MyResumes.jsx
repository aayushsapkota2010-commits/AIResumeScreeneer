import { useEffect, useRef, useState } from "react";
import {
    UploadCloud,
    FileText,
    ExternalLink,
    Trash2,
    Loader2
} from "lucide-react";
import api from "../api/api";
import "./MyResumes.css";

function formatFileSize(bytes) {

    if (!bytes) {
        return "Unknown size";
    }

    const kb = bytes / 1024;

    if (kb < 1024) {
        return `${kb.toFixed(0)} KB`;
    }

    return `${(kb / 1024).toFixed(1)} MB`;
}


function MyResumes() {

    const [resumes, setResumes] = useState([]);

    const [loading, setLoading] = useState(true);

    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState("");

    const [message, setMessage] = useState("");

    const fileInputRef = useRef(null);


    const API_URL = import.meta.env.VITE_API_URL;


    useEffect(() => {

        fetchMyResumes();

    }, []);


    const fetchMyResumes = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await api.get("/resume/my");

            setResumes(response.data);

        } catch (error) {

            console.error(
                "Failed to load resumes:",
                error
            );

            setError(
                "Unable to load your resumes."
            );

        } finally {

            setLoading(false);

        }
    };


    const handleUpload = async (event) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }


        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];


        if (!allowedTypes.includes(file.type)) {

            alert(
                "Please upload a PDF, DOC or DOCX file."
            );

            event.target.value = "";

            return;
        }


        if (file.size > 10 * 1024 * 1024) {

            alert(
                "Resume size must be less than 10 MB."
            );

            event.target.value = "";

            return;
        }


        const formData = new FormData();

        formData.append(
            "file",
            file
        );


        try {

            setUploading(true);

            setMessage("");

            await api.post(
                "/resume/my-upload",
                formData
            );


            setMessage(
                "Resume uploaded successfully."
            );


            await fetchMyResumes();

        } catch (error) {

            console.error(
                "Resume upload failed:",
                error
            );

            setMessage(
                "Resume upload failed."
            );

        } finally {

            setUploading(false);

            event.target.value = "";

        }
    };


    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this resume?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await api.delete(
                `/resume/my/${id}`
            );


            setResumes((previous) =>
                previous.filter(
                    (resume) =>
                        resume.id !== id
                )
            );


            setMessage(
                "Resume deleted successfully."
            );

        } catch (error) {

            console.error(
                "Delete failed:",
                error
            );

            alert(
                error.response?.data ||
                "Failed to delete resume."
            );
        }
    };


    const openResume = (id) => {

        window.open(
            `${API_URL}/resume/view/${id}`,
            "_blank"
        );
    };


    return (

        <div className="my-resumes-page">

            <div className="my-resumes-container">

                <div className="my-resumes-header">

                    <div>

                        <p className="my-resumes-eyebrow">
                            CANDIDATE PROFILE
                        </p>

                        <h1>
                            My Resumes
                        </h1>

                        <p>
                            Manage the resumes you use
                            when applying for jobs.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="my-resumes-upload-btn"
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                        disabled={uploading}
                    >

                        {uploading ? (

                            <>
                                <Loader2
                                    size={18}
                                    className="upload-spinner"
                                />

                                Uploading...

                            </>

                        ) : (

                            <>
                                <UploadCloud
                                    size={18}
                                />

                                Upload Resume
                            </>

                        )}

                    </button>


                    <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx"
                        onChange={handleUpload}
                    />

                </div>


                {message && (

                    <div className="my-resumes-message">
                        {message}
                    </div>

                )}


                {error && (

                    <div className="my-resumes-error">
                        {error}
                    </div>

                )}


                {loading ? (

                    <div className="my-resumes-state">
                        Loading your resumes...
                    </div>

                ) : resumes.length === 0 ? (

                    <div className="my-resumes-empty">

                        <div className="my-resumes-empty-icon">

                            <FileText
                                size={28}
                            />

                        </div>

                        <h3>
                            No resumes yet
                        </h3>

                        <p>
                            Upload your first resume
                            to start applying for jobs.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                        >
                            Upload Resume
                        </button>

                    </div>

                ) : (

                    <div className="my-resumes-grid">

                        {resumes.map((resume) => (

                            <div
                                className="my-resume-card"
                                key={resume.id}
                            >

                                <div className="my-resume-card-top">

                                    <div className="my-resume-icon">

                                        <FileText
                                            size={24}
                                        />

                                    </div>


                                    <div>

                                        <h3>
                                            {resume.fileName}
                                        </h3>

                                        <p>
                                            {formatFileSize(
                                                resume.fileSize
                                            )}
                                        </p>

                                    </div>

                                </div>


                                <div className="my-resume-info">

                                    <span>
                                        Uploaded
                                    </span>

                                    <strong>
                                        {resume.uploadedAt
                                            ? new Date(
                                                resume.uploadedAt
                                            ).toLocaleDateString()
                                            : "—"}
                                    </strong>

                                </div>


                                <div className="my-resume-score">

                                    <span>
                                        ATS Score
                                    </span>

                                    <strong>
                                        {resume.atsScore ?? "Pending"}
                                    </strong>

                                </div>


                                <div className="my-resume-actions">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            openResume(
                                                resume.id
                                            )
                                        }
                                    >

                                        <ExternalLink
                                            size={15}
                                        />

                                        View

                                    </button>


                                    <button
                                        type="button"
                                        className="delete-resume-btn"
                                        onClick={() =>
                                            handleDelete(
                                                resume.id
                                            )
                                        }
                                    >

                                        <Trash2
                                            size={15}
                                        />

                                        Delete

                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default MyResumes;