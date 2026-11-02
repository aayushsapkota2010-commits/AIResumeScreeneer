from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import os
import logging

try:
    from groq import Groq
except ImportError:  # handled at runtime with a clear log message
    Groq = None

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

gemini_api_key = (
    os.getenv("GEMINI_API_KEY")
    or os.getenv("GOOGLE_API_KEY")
    or ""
).strip()

if not gemini_api_key:
    logger.warning("GEMINI_API_KEY is missing. Gemini calls will be skipped.")
elif gemini_api_key.startswith("AQ."):
    logger.warning(
        "GEMINI_API_KEY uses Google AI Studio's AQ. key format. Some projects receive "
        "ACCESS_TOKEN_TYPE_UNSUPPORTED for these keys. Groq will be used as a fallback "
        "when GROQ_API_KEY is configured."
    )

gemini_client = genai.Client(api_key=gemini_api_key) if gemini_api_key else None

groq_api_key = (os.getenv("GROQ_API_KEY") or "").strip()

if not groq_api_key:
    logger.warning("GROQ_API_KEY is missing. Groq fallback will be unavailable.")
elif Groq is None:
    logger.warning(
        "The 'groq' package is not installed. Run 'pip install -r requirements.txt' "
        "to enable the Groq fallback."
    )

groq_client = Groq(api_key=groq_api_key) if (groq_api_key and Groq) else None


def _unique(items: list[str]) -> list[str]:
    seen = set()
    ordered = []
    for item in items:
        item = (item or "").strip()
        if item and item not in seen:
            seen.add(item)
            ordered.append(item)
    return ordered


GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()
GEMINI_FALLBACK_MODELS = _unique(
    [
        GEMINI_MODEL,
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
    ]
)

GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile").strip()
GROQ_FALLBACK_MODELS = _unique(
    [
        GROQ_MODEL,
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "openai/gpt-oss-120b",
        "meta-llama/llama-4-scout-17b-16e-instruct",
    ]
)


def _is_auth_error(error: Exception) -> bool:
    text = str(error).lower()
    return any(
        token in text
        for token in (
            "access_token_type_unsupported",
            "api key not valid",
            "unauthenticated",
            "api_key_invalid",
            "invalid api key",
            "401",
            "403",
        )
    )


def _is_model_error(error: Exception) -> bool:
    text = str(error).lower()
    return any(
        token in text
        for token in (
            "not_found",
            "not found",
            "no longer available",
            "is not found",
            "does not exist",
            "model_not_found",
            "404",
        )
    )


def _is_rate_limit_error(error: Exception) -> bool:
    text = str(error).lower()
    return any(
        token in text
        for token in (
            "429",
            "rate limit",
            "quota",
            "resource_exhausted",
        )
    )


def ask_gemini(prompt: str) -> str:
    if gemini_client is None:
        raise RuntimeError("Gemini API key is not configured.")

    last_error: Exception | None = None

    for model_name in GEMINI_FALLBACK_MODELS:
        try:
            response = gemini_client.models.generate_content(
                model=model_name,
                contents=prompt,
            )

            answer = getattr(response, "text", None)

            if not answer or not answer.strip():
                raise RuntimeError("Gemini returned an empty response.")

            if model_name != GEMINI_MODEL:
                logger.info("Gemini request succeeded with fallback model %s", model_name)

            return answer

        except Exception as error:
            last_error = error
            logger.warning("Gemini request failed for model %s: %s", model_name, error)

            if _is_auth_error(error) or _is_rate_limit_error(error):
                break

    raise RuntimeError(f"Gemini request failed: {last_error}") from last_error


def ask_groq(prompt: str) -> str:
    if groq_client is None:
        raise RuntimeError("Groq API key is not configured.")

    last_error: Exception | None = None

    for model_name in GROQ_FALLBACK_MODELS:
        try:
            completion = groq_client.chat.completions.create(
                model=model_name,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a helpful, accurate AI resume and career assistant. "
                            "Never invent personal facts that are not in the resume."
                        ),
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.4,
                max_tokens=2048,
            )

            answer = completion.choices[0].message.content

            if not answer or not answer.strip():
                raise RuntimeError("Groq returned an empty response.")

            if model_name != GROQ_MODEL:
                logger.info("Groq request succeeded with fallback model %s", model_name)

            return answer

        except Exception as error:
            last_error = error
            logger.warning("Groq request failed for model %s: %s", model_name, error)

            if not _is_model_error(error) or _is_auth_error(error) or _is_rate_limit_error(error):
                break

    raise RuntimeError(f"Groq request failed: {last_error}") from last_error


def ask_ai(prompt: str) -> str:
    errors: list[str] = []

    if gemini_client is not None:
        try:
            return ask_gemini(prompt)
        except Exception as error:
            errors.append(f"Gemini: {error}")
            logger.exception("Gemini failed, trying Groq fallback")
    else:
        errors.append("Gemini: not configured")

    if groq_client is not None:
        try:
            answer = ask_groq(prompt)
            logger.info("Groq fallback succeeded")
            return answer
        except Exception as error:
            errors.append(f"Groq: {error}")
            logger.exception("Groq fallback failed")
    else:
        errors.append("Groq: not configured")

    raise HTTPException(
        status_code=502,
        detail=(
            "AI service request failed. Configure a valid GEMINI_API_KEY or "
            "GROQ_API_KEY on the AI engine service. " + " | ".join(errors)
        ),
    )


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

    return {"analysis": ask_ai(prompt)}


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

    return {"coverLetter": ask_ai(prompt)}


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

    return {"questions": ask_ai(prompt)}


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

    return {"evaluation": ask_ai(prompt)}


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

    return {"recommendations": ask_ai(prompt)}


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

    return {"roadmap": ask_ai(prompt)}


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

    return {"answer": ask_ai(prompt)}


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

    return {"questions": ask_ai(prompt)}


@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "gemini_configured": gemini_client is not None,
        "groq_configured": groq_client is not None,
        "gemini_model": GEMINI_MODEL,
        "groq_model": GROQ_MODEL,
    }