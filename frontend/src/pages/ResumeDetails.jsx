import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import RecruiterNotes from "../components/RecruiterNotes";
import ReactMarkdown from "react-markdown";
import { FaTrash, FaRobot, FaUser } from "react-icons/fa";
import { useRef } from "react";
import {  FaPaperPlane } from "react-icons/fa";
function ResumeDetails() {

    const { id } = useParams();
    const API_URL = import.meta.env.VITE_API_URL;

    const [resume, setResume] =
        useState(null);
        const [timeline, setTimeline] =
    useState([]);
    const [question, setQuestion] = useState("");
    const chatEndRef = useRef(null);

const [messages, setMessages] = useState([
    {
        role: "assistant",
        text:
`# 👋 Welcome!

I'm your **AI Resume Assistant**.

You can ask me:

- Summarize this resume
- Candidate strengths
- Missing skills
- Education
- Experience
- Spring Boot knowledge
- Java Projects

Ask me anything! 🚀`
    }
]);
const [loadingChat, setLoadingChat] = useState(false);


    useEffect(() => {   

        api.get(`/resume/${id}`)
            .then((response) => {

                setResume(response.data);

            })
            .catch((error) => {

                console.log(error);

            });
            api.get(`/resume/timeline/${id}`)
    .then((response) => {

        setTimeline(
            response.data
        );

    })
    .catch((error) => {

        console.log(error);

    });

    }, [id]);


    const askAI = () => {

    if (!question.trim()) return;

    const userQuestion = question;

    setMessages(prev => [

        ...prev,

        {
            role: "user",
            text: userQuestion
        }

    ]);

    setLoadingChat(true);

    api.post(

        `/resume/chat/${id}`,

        {
            question: userQuestion
        }

    )

    .then((response) => {

        setMessages(prev => [

            ...prev,

            {
                role: "assistant",
                text: response.data.answer
            }

        ]);

        setQuestion("");

    })

    .catch((error) => {

        console.log(error);

    })

    .finally(() => {

        setLoadingChat(false);

    });

};

useEffect(() => {

    chatEndRef.current?.scrollIntoView({
        behavior: "smooth"
    });

}, [messages, loadingChat]);

    if (!resume) {

        return <h2>Loading...</h2>;
    }

    return (

        <div
            style={{
                padding: "20px"
            }}
        >

            <h1>
                Resume Details
            </h1>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    marginTop: "20px",
                    flexWrap: "wrap"
                }}
            >

                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        borderRadius: "10px",
                        width: "220px"
                    }}
                >
                    <h3>ATS Score</h3>

                    <h1
                        style={{
                            color:
                                resume.atsScore >= 80
                                    ? "green"
                                    : "orange"
                        }}
                    >
                        {resume.atsScore}
                    </h1>

                </div>

                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        borderRadius: "10px",
                        width: "220px"
                    }}
                >
                    <h3>Match Score</h3>

                    <h1>
                        {resume.matchScore || 0}%
                    </h1>

                </div>

                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        borderRadius: "10px",
                        width: "220px"
                    }}
                >
                    <h3>Status</h3>

                    <h2>
                        {resume.status}
                    </h2>

                </div>

            </div>

            <br />

            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "20px",
                    borderRadius: "10px"
                }}
            >

                <h3>File Name</h3>

                <p>
                    {resume.fileName}
                </p>

            </div>

            <br />

            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "20px",
                    borderRadius: "10px"
                }}
            >

                <h3>Skills</h3>

                <p>
                    {resume.skills}
                </p>

            </div>

            <br />

            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "20px",
                    borderRadius: "10px"
                }}
            >

                <h3>Suggestions</h3>

                <p>
                    {resume.suggestions}
                </p>

            </div>

            <br />
<button
    style={{
        padding: "10px 20px",
        cursor: "pointer"
    }}
    onClick={async () => {

        try {

            const response =
                await api.get(
                    `/resume/report/${resume.id}`,
                    {
                        responseType: "blob"
                    }
                );

            const url =
                window.URL.createObjectURL(
                    new Blob([response.data])
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.setAttribute(
                "download",
                "resume-report.pdf"
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

        } catch (error) {

            console.log(error);

            alert("Download Failed");

        }
    }}
>
    Download PDF Report
</button>

<button
    style={{
        padding: "10px 20px",
        cursor: "pointer",
        marginLeft: "10px"
    }}
    onClick={() =>
        window.open(
            `${API_URL}/resume/view/${id}`,
            "_blank"
        )
    }
>
    Open PDF
</button>

            <br />
            <br />

            <div
    style={{
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "20px"
    }}
>

    <h2>
        Candidate Timeline
    </h2>

    {
        timeline.map((item) => (

            <div
                key={item.id}
                style={{
                    marginBottom: "15px",
                    paddingBottom: "10px",
                    borderBottom:
                        "1px solid #eee"
                }}
            >

                <h4>
                    {item.activity}
                </h4>

                <small>
                    {item.createdAt}
                </small>

            </div>

        ))
    }

</div>
<br />
<br />

<div
    style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px"
    }}
>

    <h2>
        🤖 AI Resume Assistant
    </h2>

    <div
    style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px"
    }}
>

    
   <button
    onClick={() => setMessages([])}
    style={{
        background: "#ff4d4f",
        color: "white",
        border: "none",
        padding: "10px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        marginBottom: "15px"
    }}
>
    <FaTrash /> Clear Chat
</button>

</div>

  <div
    style={{
        height: "500px",
        overflowY: "auto",
        padding: "25px",
        borderRadius: "20px",
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        boxShadow: "0 5px 20px rgba(0,0,0,.08)",
        marginTop: "20px",
        marginBottom: "20px"
    }}
>

        {
            messages.map((message, index) => (

<div
    key={index}
    style={{
        display: "flex",
        justifyContent:
            message.role === "user"
                ? "flex-end"
                : "flex-start",
        marginBottom: "20px"
    }}
>

    {
        message.role === "assistant" &&

        <div
            style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#1976d2",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10px"
            }}
        >
            <FaRobot />
        </div>
    }

   <div
    style={{
        background: "#fff",
        padding: "15px",
        borderRadius: "15px",
        boxShadow: "0 5px 15px rgba(0,0,0,.08)",

        maxWidth: "70%",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        lineHeight: "1.7"
    }}
>
<ReactMarkdown>
    {message.text}
</ReactMarkdown></div>

    {
        message.role === "user" &&

        <div
            style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#444",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "10px"
            }}
        >
            <FaUser />
        </div>
    }

</div>

))
        }

        {
loadingChat && (

<div
style={{
display:"flex",
gap:"10px",
alignItems:"center"
}}
>

<div
style={{
width:40,
height:40,
borderRadius:"50%",
background:"#10b981",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"white"
}}
>

<FaRobot/>

</div>

<div
style={{
background:"white",
padding:"15px 20px",
borderRadius:"18px",
boxShadow:"0 3px 12px rgba(0,0,0,.08)"
}}
>

<div className="typing">

<span></span>

<span></span>

<span></span>

</div>
</div>

</div>

)
}
        <div ref={chatEndRef}></div>

    </div>

    <div
style={{
display:"flex",
gap:"15px",
alignItems:"center"
}}
>

<input

type="text"

placeholder="Ask about skills, education, projects, experience..."

value={question}

onChange={(e)=>setQuestion(e.target.value)}

onKeyDown={(e)=>{

if(e.key==="Enter"){

askAI();

}

}}

style={{

flex:1,

padding:"18px",

borderRadius:"40px",

border:"1px solid #ddd",

fontSize:"16px",

outline:"none"

}}

/>

<button

onClick={askAI}

style={{

width:"60px",

height:"60px",

borderRadius:"50%",

background:"#2563eb",

border:"none",

cursor:"pointer",

color:"white",

fontSize:"22px",

boxShadow:"0 4px 15px rgba(37,99,235,.4)"

}}

>

<FaPaperPlane/>

</button>

</div>

</div>
<div
    style={{
        marginTop: "20px"
    }}
>

{[
"Summarize this resume",
"What are candidate strengths?",
"Does candidate know Spring Boot?",
"What are weaknesses?"
].map((q) => (

<button

key={q}

onClick={() => setQuestion(q)}

style={{
marginRight: "10px",
marginBottom: "10px",
padding: "8px 15px",
cursor: "pointer"
}}

>

{q}

</button>

))}

</div>

            <RecruiterNotes
                resumeId={resume.id}
            />

        </div>
    );
}

export default ResumeDetails;