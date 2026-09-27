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

    private final AtsService atsService;

    private final JobMatchingService jobMatchingService;

    // NEW
    private final NotificationService notificationService;


    // ============================================================
    // APPLY FOR JOB
    // ============================================================

    @Transactional
    public Application apply(
            Long jobId,
            Long resumeId,
            String candidateEmail) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));


        if (!"OPEN".equalsIgnoreCase(job.getStatus())) {

            throw new RuntimeException(
                    "This job is no longer accepting applications");
        }


        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));


        if (!candidateEmail.equalsIgnoreCase(
                resume.getCandidateEmail())) {

            throw new RuntimeException(
                    "You are not allowed to use this resume");
        }


        if (applicationRepository.existsByJobIdAndResumeId(
                jobId,
                resumeId)) {

            throw new RuntimeException(
                    "You have already applied to this job using this resume");
        }


        String resumeText = resume.getExtractedText();

        if (resumeText == null) {
            resumeText = "";
        }


        String jobDescription = job.getDescription();

        if (jobDescription == null) {
            jobDescription = "";
        }


        var matchResult =
                jobMatchingService.matchResume(
                        resumeText,
                        jobDescription
                );


        int atsScore =
                atsService.calculateScore(
                        resumeText
                );


        int matchScore =
                matchResult.getMatchPercentage();


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


        LocalDateTime now =
                LocalDateTime.now();


        Application application =
                Application.builder()
                        .job(job)
                        .resume(resume)
                        .candidateEmail(candidateEmail)
                        .status(ApplicationStatus.APPLIED)
                        .appliedAt(now)
                        .updatedAt(now)
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


    // ============================================================
    // GET ALL APPLICATIONS
    // USED BY RECRUITER PIPELINE
    // ============================================================

    public List<Application> getAllApplications() {

        return applicationRepository
                .findAllByOrderByAppliedAtDesc();
    }


    // ============================================================
    // UPDATE APPLICATION STATUS
    // ============================================================

    @Transactional
    public Application updateStatus(
            Long applicationId,
            ApplicationStatus newStatus) {

        // --------------------------------------------------------
        // 1. FIND APPLICATION
        // --------------------------------------------------------

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                ));


        // --------------------------------------------------------
        // 2. GET OLD STATUS
        // --------------------------------------------------------

        ApplicationStatus oldStatus =
                application.getStatus();


        // --------------------------------------------------------
        // 3. DON'T CREATE DUPLICATE NOTIFICATION
        // --------------------------------------------------------

        if (oldStatus == newStatus) {

            return application;
        }


        // --------------------------------------------------------
        // 4. UPDATE APPLICATION
        // --------------------------------------------------------

        application.setStatus(newStatus);

        application.setUpdatedAt(
                LocalDateTime.now()
        );


        // --------------------------------------------------------
        // 5. SAVE APPLICATION
        // --------------------------------------------------------

        Application updatedApplication =
                applicationRepository.save(application);


        // --------------------------------------------------------
        // 6. CANDIDATE NOTIFICATION
        // --------------------------------------------------------

        String candidateEmail =
                application.getCandidateEmail();


        if (candidateEmail != null &&
                !candidateEmail.isBlank()) {

            String jobTitle =
                    application.getJob() != null &&
                    application.getJob().getTitle() != null
                            ? application.getJob().getTitle()
                            : "your application";


            notificationService.createCandidateNotification(

                    candidateEmail,

                    "Application status updated",

                    "Your application for "
                            + jobTitle
                            + " has moved from "
                            + formatStatus(oldStatus)
                            + " to "
                            + formatStatus(newStatus)
                            + ".",

                    "APPLICATION_STATUS_CHANGE"
            );

            notificationService.createNotification(
        "Application withdrawn",
        "Candidate "
                + candidateEmail
                + " has withdrawn their application for "
                + jobTitle
                + ".",
        "APPLICATION_WITHDRAWN"
);
        }


        // --------------------------------------------------------
        // 7. LOG
        // --------------------------------------------------------

        System.out.println(
                "Application #" +
                        applicationId +
                        " status changed: " +
                        oldStatus +
                        " -> " +
                        newStatus
        );


        return updatedApplication;
    }


    // ============================================================
    // FORMAT STATUS
    // ============================================================

    private String formatStatus(
            ApplicationStatus status) {

        if (status == null) {
            return "Applied";
        }

        return status.name()
                .toLowerCase()
                .replace("_", " ");
    }

    // ============================================================
// WITHDRAW APPLICATION
// ============================================================

@Transactional
public Application withdrawApplication(
        Long applicationId,
        String candidateEmail) {

    // --------------------------------------------------------
    // 1. FIND APPLICATION
    // --------------------------------------------------------

    Application application =
            applicationRepository.findById(applicationId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Application not found"
                            ));


    // --------------------------------------------------------
    // 2. VERIFY OWNERSHIP
    // --------------------------------------------------------

    if (!candidateEmail.equalsIgnoreCase(
            application.getCandidateEmail())) {

        throw new RuntimeException(
                "You are not allowed to withdraw this application"
        );
    }


    // --------------------------------------------------------
    // 3. CHECK CURRENT STATUS
    // --------------------------------------------------------

    ApplicationStatus currentStatus =
            application.getStatus();


    if (currentStatus == ApplicationStatus.WITHDRAWN) {

        throw new RuntimeException(
                "Application has already been withdrawn"
        );
    }


    if (currentStatus == ApplicationStatus.SELECTED) {

        throw new RuntimeException(
                "A selected application cannot be withdrawn"
        );
    }


    if (currentStatus == ApplicationStatus.REJECTED) {

        throw new RuntimeException(
                "A rejected application cannot be withdrawn"
        );
    }


    // --------------------------------------------------------
    // 4. UPDATE STATUS
    // --------------------------------------------------------

    application.setStatus(
            ApplicationStatus.WITHDRAWN
    );

    application.setUpdatedAt(
            LocalDateTime.now()
    );


    // --------------------------------------------------------
    // 5. SAVE
    // --------------------------------------------------------

    Application updatedApplication =
            applicationRepository.save(application);


    // --------------------------------------------------------
    // 6. NOTIFY CANDIDATE
    // --------------------------------------------------------

    String jobTitle =
            application.getJob() != null &&
            application.getJob().getTitle() != null
                    ? application.getJob().getTitle()
                    : "the job";


    notificationService.createCandidateNotification(

            candidateEmail,

            "Application withdrawn",

            "Your application for "
                    + jobTitle
                    + " has been successfully withdrawn.",

            "APPLICATION_WITHDRAWN"
    );


    // --------------------------------------------------------
    // 7. LOG
    // --------------------------------------------------------

    System.out.println(
            "Application #"
                    + applicationId
                    + " withdrawn by "
                    + candidateEmail
    );


    return updatedApplication;
}
}