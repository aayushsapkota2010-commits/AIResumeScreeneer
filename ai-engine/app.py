from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os



load_dotenv()
print("Loaded key:")
print(os.getenv("GEMINI_API_KEY"))

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
You are an ATS Resume Assistant.

Answer ONLY from the resume below.

Rules:
1. Never use your own knowledge.
2. Never assume anything.
3. Never guess.
4. If the answer is not present in the resume, reply exactly:

This information is not present in the resume.

Resume:
------------------------
{request.resumeText}
------------------------

Question:
{request.question}

Return only the answer.
"""

    response = model.generate_content(prompt)
   
    print("========== RECEIVED ==========")
    print(request.resumeText)
    print("==============================")


    return {
        "answer": response.text
    }