import { useEffect, useState } from "react";
import api from "../api/api";
import "./JobModal.css";

function JobModal({ isOpen, onClose, onSuccess,job }) {
    

    const [form, setForm] = useState({
        title: "",
        company: "",
        location: "",
        employmentType: "Full Time",
        experience: "",
        salary: "",
        description: "",
        requiredSkills: ""
    });
    

    

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };
useEffect(() => {

    if (!isOpen) return;

    if (job) {

         setForm({
                title: job.title || "",
                company: job.company || "",
                location: job.location || "",
                employmentType: job.employmentType || "Full Time",
                experience: job.experience || "",
                salary: job.salary || "",
                description: job.description || "",
                requiredSkills: job.requiredSkills || ""
            });

    }

    else {

      
            setForm({
                title: "",
                company: "",
                location: "",
                employmentType: "Full Time",
                experience: "",
                salary: "",
                description: "",
                requiredSkills: ""
            });

    }

}, [isOpen, job]);
if (!isOpen) return null;
   const handleSubmit = async () => {

    try {

        if (job) {

            await api.put(

                `/job/update/${job.id}`,

                form

            );

        }

        else {

            await api.post(

                "/job/create",

                form

            );

        }

        onSuccess();

        onClose();

    }

    catch (err) {

        console.log(err);

    }

};

    return (

        <div className="job-modal-overlay">

            <div className="job-modal">

<h2>{job ? "Edit Job" : "Create Job"}</h2>
               <input
    name="title"
    value={form.title}
    onChange={handleChange}
    placeholder="Job Title"
/>

                <input
    name="company"
    value={form.company}
    onChange={handleChange}
    placeholder="Company"
/>

<input
    name="location"
    value={form.location}
    onChange={handleChange}
     placeholder="Location"
/>

<input
    name="experience"
    value={form.experience}
    onChange={handleChange}
     placeholder="Experience"
/>

<input
    name="salary"
    value={form.salary}
    onChange={handleChange}
     placeholder="Salary"
/>

<select
    name="employmentType"
    value={form.employmentType}
    onChange={handleChange}
>
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Internship</option>
                    <option>Remote</option>
                </select>

               <textarea
    name="description"
    value={form.description}
    onChange={handleChange}
       placeholder="Job Description"
    rows="4"
/>

<textarea
    name="requiredSkills"
    value={form.requiredSkills}
    onChange={handleChange}
      placeholder="Required Skills (Java, Spring Boot, MySQL...)"
    rows="3"
/>

                <div className="job-modal-buttons">

                    <button onClick={onClose}>
                        Cancel
                    </button>

                    <button onClick={handleSubmit}>
    {job ? "Update Job" : "Create Job"}
</button>

                </div>

            </div>

        </div>

    );

}

export default JobModal;