package com.example.AIResumeScreeneer.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.AIResumeScreeneer.entity.Application;
import com.example.AIResumeScreeneer.entity.ApplicationStatus;
import com.example.AIResumeScreeneer.entity.Job;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.repository.ApplicationRepository;
import com.example.AIResumeScreeneer.repository.JobRepository;
import com.example.AIResumeScreeneer.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;

    /*
     * Resume quality / ATS analysis
     */
    private final AtsService atsService;

    /*
     * Job-specific resume matching
     */
    private final JobMatchingService jobMatchingService;


    // ============================================================
    // APPLY FOR JOB
    // ============================================================

    @Transactional
    public Application apply(
            Long jobId,
            Long resumeId,
            String candidateEmail) {

        // ========================================================
        // 1. FIND JOB
        // ========================================================

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));


        // ========================================================
        // 2. JOB MUST BE OPEN
        // ========================================================

        if (!"OPEN".equalsIgnoreCase(job.getStatus())) {

            throw new RuntimeException(
                    "This job is no longer accepting applications");
        }


        // ========================================================
        // 3. FIND RESUME
        // ========================================================

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));


        // ========================================================
        // 4. CHECK RESUME OWNERSHIP
        // ========================================================

        if (!candidateEmail.equalsIgnoreCase(
                resume.getCandidateEmail())) {

            throw new RuntimeException(
                    "You are not allowed to use this resume");
        }


        // ========================================================
        // 5. PREVENT DUPLICATE APPLICATION
        // ========================================================

        if (applicationRepository.existsByJobIdAndResumeId(
                jobId,
                resumeId)) {

            throw new RuntimeException(
                    "You have already applied to this job using this resume");
        }


        // ========================================================
        // 6. GET RESUME TEXT
        // ========================================================

        String resumeText = resume.getExtractedText();

        if (resumeText == null) {
            resumeText = "";
        }


        // ========================================================
        // 7. GET JOB DESCRIPTION
        // ========================================================

        String jobDescription = job.getDescription();

        if (jobDescription == null) {
            jobDescription = "";
        }


        // ========================================================
        // 8. JOB-SPECIFIC MATCHING
        // ========================================================

        var matchResult =
                jobMatchingService.matchResume(
                        resumeText,
                        jobDescription
                );


        // ========================================================
        // 9. GENERIC ATS / RESUME QUALITY SCORE
        // ========================================================

        int atsScore =
                atsService.calculateScore(
                        resumeText
                );


        // ========================================================
        // 10. GET MATCH SCORE
        // ========================================================

        int matchScore =
                matchResult.getMatchPercentage();


        // ========================================================
        // 11. LOG ANALYSIS
        // ========================================================

        System.out.println();
        System.out.println("========================================");
        System.out.println("       APPLICATION ANALYSIS");
        System.out.println("========================================");

        System.out.println(
                "Candidate = " + candidateEmail
        );

        System.out.println(
                "Job = " + job.getTitle()
        );

        System.out.println(
                "Resume = " + resume.getFileName()
        );

        System.out.println(
                "ATS Score = " + atsScore
        );

        System.out.println(
                "Match Score = " + matchScore
        );

        System.out.println(
                "Matched Skills = "
                        + matchResult.getMatchedSkills()
        );

        System.out.println(
                "Missing Skills = "
                        + matchResult.getMissingSkills()
        );

        System.out.println(
                "Recommendation = "
                        + matchResult.getRecommendation()
        );

        System.out.println("========================================");
        System.out.println();


        // ========================================================
        // 12. CREATE APPLICATION
        // ========================================================

        LocalDateTime now =
                LocalDateTime.now();

        Application application =
                Application.builder()

                        .job(job)

                        .resume(resume)

                        .candidateEmail(candidateEmail)

                        .status(
                                ApplicationStatus.APPLIED
                        )

                        .appliedAt(now)

                        .updatedAt(now)

                        // -------------------------------
                        // Job-specific analysis
                        // -------------------------------

                        .atsScore(atsScore)

                        .matchScore(matchScore)

                        .matchedSkills(
                                matchResult.getMatchedSkills()
                        )

                        .missingSkills(
                                matchResult.getMissingSkills()
                        )

                        .recommendation(
                                matchResult.getRecommendation()
                        )

                        .build();


        // ========================================================
        // 13. SAVE APPLICATION
        // ========================================================

        return applicationRepository.save(application);
    }


    // ============================================================
    // GET MY APPLICATIONS
    // ============================================================

    public List<Application> getMyApplications(
            String candidateEmail) {

        return applicationRepository
                .findByCandidateEmailOrderByAppliedAtDesc(
                        candidateEmail
                );
    }


    // ============================================================
    // GET APPLICATIONS FOR JOB
    // ============================================================

    public List<Application> getApplicationsForJob(
            Long jobId) {

        return applicationRepository
                .findByJobIdOrderByAppliedAtDesc(
                        jobId
                );
    }
}