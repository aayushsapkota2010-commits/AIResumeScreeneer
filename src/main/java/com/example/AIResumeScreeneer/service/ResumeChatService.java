package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.config.AiEngineClient;
import com.example.AIResumeScreeneer.config.GroqClient;
import com.example.AIResumeScreeneer.dto.ResumeChatRequest;
import com.example.AIResumeScreeneer.dto.ResumeChatResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResumeChatService {

    private final AiEngineClient aiEngineClient;

    private final GroqClient groqClient;

    public ResumeChatResponse askQuestion(
            String resumeText,
            String question) {

        ResumeChatRequest request = new ResumeChatRequest();
        request.setResumeText(resumeText);
        request.setQuestion(question);

        RuntimeException failure;

        try {
            ResumeChatResponse response = aiEngineClient.post(
                    "/resume-chat",
                    request,
                    ResumeChatResponse.class
            );

            if (response != null
                    && response.getAnswer() != null
                    && !response.getAnswer().isBlank()) {
                return response;
            }

            failure = new IllegalStateException(
                    "AI engine returned an empty chat answer."
            );
            log.warn(failure.getMessage());

        } catch (RuntimeException error) {
            failure = error;
            log.warn("AI engine chat failed: {}", error.getMessage());
        }

        if (groqClient.isConfigured()) {
            try {
                log.info("Using Groq fallback for resume chat.");

                String answer = groqClient.ask(
                        buildPrompt(resumeText, question)
                );

                return ResumeChatResponse.builder()
                        .answer(answer)
                        .build();

            } catch (RuntimeException fallbackError) {
                log.error("Groq fallback failed", fallbackError);
                failure.addSuppressed(fallbackError);
            }
        } else {
            log.warn("Groq fallback is not configured.");
        }

        throw failure;
    }

    private String buildPrompt(String resumeText, String question) {
        return """
        You are an intelligent AI Resume and Career Assistant.

        Your job is to help users understand their resumes, identify gaps,
        prepare for interviews, and improve their career prospects.

        RESUME:
        ------------------------
        %s
        ------------------------

        USER QUESTION:
        %s

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
        """.formatted(resumeText, question);
    }
}
