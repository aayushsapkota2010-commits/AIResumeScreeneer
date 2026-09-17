package com.example.AIResumeScreeneer.service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.AIResumeScreeneer.entity.CandidateStatus;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import com.example.AIResumeScreeneer.repository.ActivityLogRepository;
import com.example.AIResumeScreeneer.repository.RecruiterNoteRepository;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;

    private final NotificationService notificationService;

    private final AtsService atsService;

    private final ActivityLogService activityLogService;

    private final ActivityLogRepository activityLogRepository;
private final RecruiterNoteRepository recruiterNoteRepository;

    public String uploadResume(
            MultipartFile file,
            String candidateEmail
    ) throws IOException {

        // ============================================================
        // 1. Upload directory
        // ============================================================

        String uploadDir =
                System.getProperty("user.home")
                        + File.separator
                        + "resume-uploads";

        File directory = new File(uploadDir);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        // ============================================================
        // 2. Create unique file name
        // ============================================================

        String fileName =
                System.currentTimeMillis()
                        + "_"
                        + file.getOriginalFilename();

        File destination =
                new File(directory, fileName);

        System.out.println(
                "Upload Directory = "
                        + uploadDir
        );

        System.out.println(
                "Destination = "
                        + destination.getAbsolutePath()
        );

        // ============================================================
        // 3. Save uploaded file
        // ============================================================

        file.transferTo(destination);

        // ============================================================
        // 4. Extract resume text using Apache Tika
        // ============================================================

        String extractedText = "";

        try {

            Tika tika = new Tika();

            extractedText =
                    tika.parseToString(destination);

            System.out.println(
                    "===== EXTRACTED RESUME TEXT ====="
            );

            System.out.println(extractedText);

        } catch (Exception e) {

            e.printStackTrace();

        }

        System.out.println(
                "================================="
        );

        System.out.println(
                "Extracted Text Length = "
                        + extractedText.length()
        );

        System.out.println(
                "================================="
        );

        // ============================================================
        // 5. ATS Analysis
        // ============================================================

        int score =
                atsService.calculateScore(
                        extractedText
                );

        String skills =
                atsService.extractSkills(
                        extractedText
                );

       String suggestions =
        atsService.generateSuggestions(
                score
        );

        System.out.println(
                "ATS Score = "
                        + score
        );

        System.out.println(
                "Skills = "
                        + skills
        );

        System.out.println(
                "Suggestions = "
                        + suggestions
        );

        // ============================================================
        // 6. Create Resume entity
        // ============================================================

        Resume resume =
                Resume.builder()
                        .fileName(fileName)
                        .filePath(
                                destination
                                        .getAbsolutePath()
                        )
                        .contentType(
                                file.getContentType()
                        )
                        .fileSize(
                                file.getSize()
                        )
                        .candidateEmail(
                                candidateEmail
                        )
                        .uploadedAt(
                                LocalDateTime.now()
                        )
                        .extractedText(
                                extractedText
                        )
                        .atsScore(score)
                        .skills(skills)
                        .suggestions(suggestions)
                        .build();

        // ============================================================
        // 7. Set initial candidate status
        // ============================================================

        resume.setStatus(
                CandidateStatus.APPLIED
        );

        // ============================================================
        // 8. Save Resume in database
        // ============================================================

        Resume savedResume =
                resumeRepository.save(resume);

        // ============================================================
        // 9. Activity log
        // ============================================================

        activityLogService.saveLog(
                "aayush@gmail.com",
                "RESUME_UPLOADED",
                savedResume.getId(),
                savedResume.getFileName()
        );

        // ============================================================
        // 10. Create notification
        // ============================================================

        notificationService.createNotification(
                "New resume submitted",
                savedResume.getFileName()
                        + " was uploaded and ATS score generated.",
                "RESUME_UPLOADED"
        );

        // ============================================================
        // 11. Return response
        // ============================================================

        return "Resume Uploaded Successfully";
    }

   @Transactional
public void deleteResume(Long id) throws IOException {

    Resume resume =
            resumeRepository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Resume not found"));

    // 1. Delete activity logs related to this resume
    activityLogRepository.deleteByResumeId(id);

    // 2. Delete recruiter notes related to this resume
    recruiterNoteRepository.deleteByResumeId(id);

    // 3. Delete resume from database
    resumeRepository.delete(resume);

    // 4. Delete physical PDF file
    if (resume.getFilePath() != null) {

        File file = new File(resume.getFilePath());

        if (file.exists()) {

            boolean deleted = file.delete();

            System.out.println(
                    "Resume physical file deleted = " + deleted
            );

        } else {

            System.out.println(
                    "Resume physical file not found: "
                            + resume.getFilePath()
            );
        }
    }

    System.out.println(
            "Resume and related data deleted. ID = " + id
    );
}
}