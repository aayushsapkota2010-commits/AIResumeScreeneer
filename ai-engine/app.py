from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import os
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Resume Screener API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = (
    os.getenv("GEMINI_API_KEY")
    or os.getenv("GOOGLE_API_KEY")
    or ""
).strip()

if not api_key:
    logger.warning("GEMINI_API_KEY is missing! The chatbot endpoints will fail.")
elif api_key.startswith("AQ."):
    logger.warning(
        "GEMINI_API_KEY uses Google AI Studio's new AQ. key format. Some projects "
        "currently receive ACCESS_TOKEN_TYPE_UNSUPPORTED for these keys. If you get "
        "a 401, create a fresh key in a new AI Studio project or use a Google Cloud "
        "API key (AIza...) for the same Generative Language API."
    )

client = genai.Client(api_key=api_key) if api_key else None

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3.8-flash").strip()
FALLBACK_MODELS = [
    model
    for model in [
        MODEL_NAME,
        "gemini-3.8-flash",
    ]
    if model
]


def _unique(items: list[str]) -> list[str]:
    seen = set()
    ordered = []
    for item in items:
        if item not in seen:
            seen.add(item)
            ordered.append(item)
    return ordered


def _is_auth_error(error: Exception) -> bool:
    text = str(error)
    return any(
        token in text
        for token in (
            "ACCESS_TOKEN_TYPE_UNSUPPORTED",
            "API key not valid",
            "UNAUTHENTICATED",
            "API_KEY_INVALID",
        )
    )


def _is_model_error(error: Exception) -> bool:
    text = str(error)
    return any(
        token in text
        for token in (
            "NOT_FOUND",
            "not found",
            "no longer available",
            "is not found",
        )
    )


def ask_gemini(prompt: str) -> str:
    if client is None:
        raise HTTPException(
            status_code=500,
            detail="Gemini API key is not configured.",
        )

    try:
        # Correct syntax for google-genai SDK
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt,
        )
        return response.text
    except Exception as error:
        logger.exception("Gemini API request failed")
        raise HTTPException(
            status_code=502,
            detail=f"AI service error: {str(error)}",
        ) from error

    last_error: Exception | None = None

    for model_name in _unique(FALLBACK_MODELS):
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
            )

            answer = getattr(response, "text", None)

            if not answer or not answer.strip():
                raise Exception("Gemini returned an empty response.")

            if model_name != MODEL_NAME:
                logger.info("Gemini request succeeded with fallback model %s", model_name)

            return answer

        except HTTPException:
            raise

        except Exception as error:
            last_error = error
            logger.exception("Gemini API request failed for model %s", model_name)

            if _is_auth_error(error):
                raise HTTPException(
                    status_code=502,
                    detail=(
                        "Gemini API key authentication failed (ACCESS_TOKEN_TYPE_UNSUPPORTED). "
                        "AQ. keys from some AI Studio projects are not accepted by the Generative Language API. "
                        "Create a new API key in Google AI Studio (preferably in a different project) or use a Google Cloud API key (AIza...) "
                        "with the Gemini API enabled and set GEMINI_API_KEY on the AI engine service. "
                        "Do not commit the key to git."
                    ),
                ) from error

            if not _is_model_error(error):
                break

    logger.exception("Gemini API request failed")
    raise HTTPException(
        status_code=502,
        detail="AI service request failed. Check the Python server logs.",
    ) from last_error


class ResumeRequest(BaseModel):
    resumeText: str
    jobDescription: str


class CoverLetterRequest(BaseModel):
    resumeText: str
    jobDescription: str


class MockInterviewRequest(BaseModel):
    resumeText: str
    jobDescription: str


class EvaluationRequest(BaseModel):
    question: str
    answer: str


class JobRecommendationRequest(BaseModel):
    resumeText: str


class RoadmapRequest(BaseModel):
    resumeText: str


class ResumeChatRequest(BaseModel):
    resumeText: str
    question: str


class InterviewQuestionRequest(BaseModel):
    resumeText: str


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

    return {"analysis": ask_gemini(prompt)}


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

    return {"coverLetter": ask_gemini(prompt)}


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

    return {"questions": ask_gemini(prompt)}


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

    return {"evaluation": ask_gemini(prompt)}


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

    return {"recommendations": ask_gemini(prompt)}


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

    return {"roadmap": ask_gemini(prompt)}


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
       of practical experience.

    6. Give specific reasons and examples from the resume wherever possible.

    7. If information is missing, explain what cannot be determined.

    8. Keep answers clear, natural, and helpful. Use bullet points when useful.

    9. Give actionable steps when the user asks how to improve something.

    10. If no target job description is provided, do not claim a skill
        is required for a specific job.

    Now answer the user's question.
    """

    return {"answer": ask_gemini(prompt)}


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

    Return only plain text using this format:

    Technical Questions:
    1.

    HR Questions:
    1.

    Project Questions:
    1.
    """

    return {"questions": ask_gemini(prompt)}


@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "gemini_configured": client is not None,
        "model": MODEL_NAME,
    }
