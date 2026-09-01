import { useEffect, useState } from "react";
import api from "../api/api";
import "./JobPosts.css";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";
function JobPosts() {

    const [jobs, setJobs] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {

        const response = await api.get("/job/all");

        setJobs(response.data);
    };

    const handleDelete = async (id) => {

    if (!window.confirm("Delete this job?")) return;

    await api.delete(`/job/delete/${id}`);

    fetchJobs();

};

const handleClose = async (job) => {

    if (job.status === "ACTIVE") {

        await api.put(`/job/close/${job.id}`);

    } else {

        await api.put(`/job/reopen/${job.id}`);

    }

    fetchJobs();

};

const handleEdit = (job) => {

    setEditingJob(job);

    setModalOpen(true);

};

    return (
<>
        <div className="job-page">

            <div className="job-header">

                <h1>Job Posts</h1>

               <button
    onClick={() => setModalOpen(true)}
>
    Create Job
</button>

            </div>

            <div className="job-grid">

                {   
                jobs.map(job => (

            <JobCard

                key={job.id}

                job={job}

                onEdit={handleEdit}

                onDelete={handleDelete}

                onCloseJob={handleClose}

            />

        ))


                }

            </div>

        </div>
       <JobModal

    isOpen={modalOpen}

    onClose={() => {

        setModalOpen(false);

        setEditingJob(null);

    }}

    job={editingJob}

    onSuccess={fetchJobs}

/>
        </>

    );

}

export default JobPosts;