from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os



load_dotenv()

app = FastAPI()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)
def ask_gemini(prompt: str):

    try:
        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        print("========== GEMINI ERROR ==========")
        print(e)
        print("==================================")
        return f"ERROR: {str(e)}"

class ResumeRequest(BaseModel):
    resumeText: str
    jobDescription: str

@app.post("/analyze")
def analyze_resume(request: ResumeRequest):

    prompt = f"""
    Analyze this resume.

    Resume:
    {request.resumeText}

    Job Description:
    {request.jobDescription}

    Give:
    1. ATS Score out of 100
    2. Missing Skills
    3. Resume Improvements
    4. Interview Questions

    Return clean text.
    """

    response = model.generate_content(prompt)

    return {
        "analysis": response.text
    }
class CoverLetterRequest(BaseModel):
    resumeText: str
    jobDescription: str

@app.post("/cover-letter")
def generate_cover_letter(request: CoverLetterRequest):

    prompt = f"""
    Create a professional cover letter.

    Resume:
    {request.resumeText}

    Job Description:
    {request.jobDescription}

    Make it professional and recruiter friendly.
    """

    response = model.generate_content(prompt)

    return {
        "coverLetter": response.text
    }
class MockInterviewRequest(BaseModel):
    resumeText: str
    jobDescription: str
@app.post("/mock-interview")
def mock_interview(request: MockInterviewRequest):

    prompt = f"""
    Resume:
    {request.resumeText}

    Job Description:
    {request.jobDescription}

    Generate 10 technical interview questions.

    Focus on:
    - Java
    - Spring Boot
    - MySQL
    - REST APIs
    - System Design

    Return numbered questions only.
    """

    response = model.generate_content(prompt)

    return {
        "questions": response.text
    }
class EvaluationRequest(BaseModel):
    question: str
    answer: str

@app.post("/evaluate-answer")
def evaluate_answer(request: EvaluationRequest):

    prompt = f"""
    Interview Question:
    {request.question}

    Candidate Answer:
    {request.answer}

    Evaluate the answer.

    Return:

    Score out of 10

    Strengths

    Weaknesses

    Better Answer

    Interviewer Feedback
    """

    response = model.generate_content(prompt)

    return {
        "evaluation": response.text
    }
class JobRecommendationRequest(BaseModel):
    resumeText: str

@app.post("/recommend-jobs")
def recommend_jobs(request: JobRecommendationRequest):

    prompt = f"""
    Analyze this resume.

    Resume:
    {request.resumeText}

    Suggest:

    1. Top 10 suitable job roles
    2. Match percentage
    3. Career path

    Return clean formatted text.
    """

    response = model.generate_content(prompt)

    return {
        "recommendations": response.text
    }

class RoadmapRequest(BaseModel):
    resumeText: str

@app.post("/roadmap")
def roadmap(request: RoadmapRequest):

    prompt = f"""
    Analyze this resume:

    {request.resumeText}

    Create a detailed career roadmap.

    Include:
    1. Current Skill Level
    2. Missing Skills
    3. Technologies to Learn
    4. Project Ideas
    5. Career Path
    6. 6 Month Learning Plan

    Return clean formatted text.
    """

    response = model.generate_content(prompt)

    return {
        "roadmap": response.text
    }
class ResumeChatRequest(BaseModel):
    resumeText: str
    question: str



@app.post("/resume-chat")
def resume_chat(request: ResumeChatRequest):

    prompt = f"""
You are an intelligent AI Resume and Career Assistant.

Your job is to help users understand their resumes, identify gaps,
prepare for interviews, and improve their career prospects.

RESUME:
------------------------
{request.resumeText}
------------------------

USER QUESTION:
{request.question}

RULES:

1. Understand the user's intent before answering.

2. For factual questions about education, experience, skills,
   projects, certifications, and achievements, use only information
   supported by the resume. Never invent personal facts.

3. For questions about weaknesses, missing skills, resume quality,
   improvements, or interview preparation, analyze the resume
   critically and provide useful feedback using general career knowledge.

4. Distinguish between facts stated in the resume, potential gaps
   inferred from the resume, and general recommendations.

5. When discussing weaknesses, focus on observable resume gaps,
   such as missing measurable project results or limited evidence
   of practical experience. Do not claim these are definite
   personal weaknesses.

6. Give specific reasons and examples from the resume wherever possible.

7. If information is missing, explain what cannot be determined
   instead of simply refusing to answer.

8. Keep answers clear, natural, and helpful. Use bullet points
   when useful.

9. Give actionable steps when the user asks how to improve something.

10. If no target job description is provided, do not claim a skill
    is required for a specific job.

Now answer the user's question.
"""

    try:
        response = model.generate_content(prompt)

        answer = getattr(response, "text", None)

        if not answer or not answer.strip():
            answer = (
                "I couldn't generate an answer right now. "
                "Please try again."
            )

        return {"answer": answer}

    except Exception:
        return {
            "answer": (
                "I'm having trouble connecting to the AI service. "
                "Please try again in a moment."
            )
        }




class InterviewQuestionRequest(BaseModel):
    resumeText: str


@app.post("/interview-questions")
def generate_interview_questions(request: InterviewQuestionRequest):

    prompt = f"""
You are a Senior Technical Interviewer.

Candidate Resume:

{request.resumeText}

Generate interview questions in exactly three sections.

Technical Questions:
- 10 questions

HR Questions:
- 5 questions

Project Questions:
- 5 questions

Return only plain text using exactly this format.

Technical Questions:
1.
2.

HR Questions:
1.
2.

Project Questions:
1.
2.
"""

    response = model.generate_content(prompt)

    return {
        "questions": response.text
    }

