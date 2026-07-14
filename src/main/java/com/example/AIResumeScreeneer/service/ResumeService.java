package com.example.AIResumeScreeneer.service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.AIResumeScreeneer.entity.CandidateStatus;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.repository.ResumeRepository;
import org.apache.tika.Tika;
import lombok.RequiredArgsConstructor;
import com.example.AIResumeScreeneer.entity.CandidateStatus;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;

    private final String UPLOAD_DIR = "uploads/";
    private final AtsService atsService;
    private final ActivityLogService activityLogService;

    public String uploadResume(
    MultipartFile file,
    String candidateEmail
)
            throws IOException {

        // Upload directory
        String uploadDir =
                System.getProperty("user.home")
                        + File.separator
                        + "resume-uploads";

        File directory = new File(uploadDir);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Unique file name
        String fileName =
                System.currentTimeMillis()
                        + "_"
                        + file.getOriginalFilename();

        File destination =
                new File(directory, fileName);

        System.out.println("Upload Directory = " + uploadDir);
        System.out.println("Destination = " + destination.getAbsolutePath());

        // Save file
        file.transferTo(destination);

        // Extract Resume Text
        String extractedText = "";

        try {
            Tika tika = new Tika();
            extractedText = tika.parseToString(destination);

            System.out.println("===== EXTRACTED RESUME TEXT =====");
            System.out.println(extractedText);

        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("=================================");
System.out.println("Extracted Text Length = "
        + extractedText.length());

System.out.println(
        extractedText.substring(
                0,
                Math.min(500, extractedText.length())
        )
);
System.out.println("=================================");

        // ATS Analysis
        int score =
                atsService.calculateScore(extractedText);

        String skills =
                atsService.extractSkills(extractedText);

        String suggestions =
                atsService.generateSuggestions(score);
                System.out.println("ATS Score = " + score);
System.out.println("Skills = " + skills);
System.out.println("Suggestions = " + suggestions);

        // Save Resume
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
                CandidateStatus status = CandidateStatus.APPLIED;


                resume.setStatus(CandidateStatus.APPLIED);

        resumeRepository.save(resume);
       activityLogService.saveLog(

        "aayush@gmail.com",

        "STATUS_CHANGED_TO_" + status,

        resume.getId(),

        resume.getFileName()
);

        return "Resume Uploaded Successfully";
    }

public int calculateScore(String text) {

    System.out.println("===== ATS SERVICE =====");

    if(text == null){
        System.out.println("TEXT IS NULL");
        return 0;
    }

    System.out.println("TEXT LENGTH = " + text.length());

    String lower = text.toLowerCase();

    System.out.println("Contains Java = "
            + lower.contains("java"));

    System.out.println("Contains Spring = "
            + lower.contains("spring"));

    System.out.println("Contains MySQL = "
            + lower.contains("mysql"));

    System.out.println("Contains MongoDB = "
            + lower.contains("mongodb"));

    int score = 0;

    if(lower.contains("java")) score += 15;
    if(lower.contains("spring")) score += 20;
    if(lower.contains("mysql")) score += 10;
    if(lower.contains("mongodb")) score += 10;
    if(lower.contains("rest")) score += 10;
    if(lower.contains("git")) score += 10;
    if(lower.contains("github")) score += 10;

    System.out.println("FINAL SCORE = " + score);

    return score;
}

public String extractSkills(String text) {

    StringBuilder skills = new StringBuilder();

    String lower = text.toLowerCase();

    if(lower.contains("java"))
        skills.append("Java,");

    if(lower.contains("spring"))
        skills.append("Spring Boot,");

    if(lower.contains("mysql"))
        skills.append("MySQL,");

    if(lower.contains("react"))
        skills.append("React,");

    if(lower.contains("docker"))
        skills.append("Docker,");

    if(lower.contains("aws"))
        skills.append("AWS,");

    return skills.toString();
}

public String generateSuggestions(String text) {

    StringBuilder suggestions =
            new StringBuilder();

    String lower = text.toLowerCase();

    if(!lower.contains("docker"))
        suggestions.append("Learn Docker. ");

    if(!lower.contains("aws"))
        suggestions.append("Add AWS experience. ");

    if(!lower.contains("microservices"))
        suggestions.append("Mention Microservices projects. ");

    return suggestions.toString();
}
}