
package com.example.AIResumeScreeneer.service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;

import org.apache.tika.Tika;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import com.example.AIResumeScreeneer.entity.CandidateStatus;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.repository.ResumeRepository;
import com.example.AIResumeScreeneer.repository.ActivityLogRepository;
import com.example.AIResumeScreeneer.repository.ApplicationRepository;
import com.example.AIResumeScreeneer.repository.RecruiterNoteRepository;
import com.example.AIResumeScreeneer.repository.InterviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final NotificationService notificationService;
    private final AtsService atsService;
    private final ActivityLogService activityLogService;
    private final ActivityLogRepository activityLogRepository;
    private final RecruiterNoteRepository recruiterNoteRepository;
    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;

    public String uploadResume(
            MultipartFile file,
            String candidateEmail
    ) throws IOException {

        String uploadDir =
                System.getProperty("user.home")
                        + File.separator
                        + "resume-uploads";

        File directory = new File(uploadDir);

        if (!directory.exists() && !directory.mkdirs()) {
            throw new IOException("Could not create upload directory");
        }

        String fileName =
                System.currentTimeMillis()
                        + "_"
                        + file.getOriginalFilename();

        File destination = new File(directory, fileName);

        file.transferTo(destination);

        String extractedText = "";

        try {
            Tika tika = new Tika();
            extractedText = tika.parseToString(destination);
        } catch (Exception e) {
            e.printStackTrace();
        }

        int score = atsService.calculateScore(extractedText);
        String skills = atsService.extractSkills(extractedText);
        String suggestions = atsService.generateSuggestions(score);

        Resume resume = Resume.builder()
                .fileName(fileName)
                .filePath(destination.getAbsolutePath())
                .contentType(file.getContentType())
                .fileSize(file.getSize())
                .candidateEmail(candidateEmail)
                .uploadedAt(LocalDateTime.now())
                .extractedText(extractedText)
                .atsScore(score)
                .skills(skills)
                .suggestions(suggestions)
                .build();

        resume.setStatus(CandidateStatus.APPLIED);

        // New resumes must be active.
        resume.setDeleted(false);

        Resume savedResume = resumeRepository.save(resume);

        activityLogService.saveLog(
                "aayush@gmail.com",
                "RESUME_UPLOADED",
                savedResume.getId(),
                savedResume.getFileName()
        );

        notificationService.createNotification(
                "New resume submitted",
                savedResume.getFileName()
                        + " was uploaded and ATS score generated.",
                "RESUME_UPLOADED"
        );

        return "Resume Uploaded Successfully";
    }

    @Transactional
    public void deleteResume(Long id) throws IOException {

        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        if (resume.isDeleted()) {
            throw new RuntimeException("Resume is already deleted");
        }

        // Soft delete: preserve applications, interviews and history.
        resume.setDeleted(true);
        resumeRepository.save(resume);

        System.out.println("Resume soft-deleted. ID = " + id);
    }

    @Transactional
    public void deleteOwnResume(
            Long id,
            String candidateEmail
    ) throws IOException {

        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = authentication != null
                && authentication.getAuthorities().stream()
                        .anyMatch(authority ->
                                authority.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin &&
                !candidateEmail.equalsIgnoreCase(resume.getCandidateEmail())) {
            throw new RuntimeException(
                    "You are not allowed to delete this resume");
        }

        if (resume.isDeleted()) {
            throw new RuntimeException("Resume is already deleted");
        }

        // Mark as deleted instead of physically removing the row.
        resume.setDeleted(true);
        resumeRepository.save(resume);

        System.out.println("Resume soft-deleted. ID = " + id);
    }
}
