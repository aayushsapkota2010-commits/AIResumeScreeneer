package com.example.AIResumeScreeneer.contoller;

import org.springframework.web.bind.annotation.*;

import com.example.AIResumeScreeneer.dto.InterviewQuestionResponse;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.repository.ResumeRepository;
import com.example.AIResumeScreeneer.service.AIInterviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AIInterviewController {

    private final AIInterviewService aiInterviewService;
    private final ResumeRepository resumeRepository;

    @PostMapping("/interview-questions/{resumeId}")
    public InterviewQuestionResponse generateQuestions(
            @PathVariable Long resumeId) {

        Resume resume = resumeRepository
                .findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        return aiInterviewService.generateQuestions(
                resume.getExtractedText()
        );
    }
}