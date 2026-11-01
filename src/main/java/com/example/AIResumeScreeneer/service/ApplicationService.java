
package com.example.AIResumeScreeneer.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.AIResumeScreeneer.entity.Application;
import com.example.AIResumeScreeneer.entity.ApplicationStatus;
import com.example.AIResumeScreeneer.entity.CandidateStatus;
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

        if (resume.isDeleted()) {
            throw new RuntimeException(
                    "Cannot apply using a deleted resume");
        }

        if (!candidateEmail.equalsIgnoreCase(
                resume.getCandidateEmail())) {
            throw new RuntimeException(
                    "You are not allowed to use this resume");
        }

        if (applicationRepository.existsByJobIdAndResumeId(
                jobId, resumeId)) {
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

        var matchResult = jobMatchingService.matchResume(
                resumeText, jobDescription);

        int atsScore = atsService.calculateScore(resumeText);
        int matchScore = matchResult.getMatchPercentage();

        LocalDateTime now = LocalDateTime.now();

        Application application = Application.builder()
                .job(job)
                .resume(resume)
                .candidateEmail(candidateEmail)
                .status(ApplicationStatus.APPLIED)
                .appliedAt(now)
                .updatedAt(now)
                .atsScore(atsScore)
                .matchScore(matchScore)
                .matchedSkills(matchResult.getMatchedSkills())
                .missingSkills(matchResult.getMissingSkills())
                .recommendation(matchResult.getRecommendation())
                .build();

        return applicationRepository.save(application);
    }

    // ============================================================
    // GET MY ACTIVE APPLICATIONS
    // ============================================================

    public List<Application> getMyApplications(String candidateEmail) {
        return applicationRepository
                .findByCandidateEmailAndResumeDeletedFalseOrderByAppliedAtDesc(
                        candidateEmail);
    }

    // ============================================================
    // GET ACTIVE APPLICATIONS FOR A JOB
    // ============================================================

    public List<Application> getApplicationsForJob(Long jobId) {
        return applicationRepository
                .findByJobIdAndResumeDeletedFalseOrderByAppliedAtDesc(
                        jobId);
    }

    // ============================================================
    // GET ALL ACTIVE APPLICATIONS
    // USED BY RECRUITER PIPELINE
    // ============================================================

   
public List<Application> getAllApplications() {
    List<Application> all = applicationRepository.findAllByOrderByAppliedAtDesc();
    List<Application> result = new java.util.ArrayList<>();

    for (Application application : all) {
        Resume resume = application.getResume();
        if (resume == null || resume.isDeleted()) {
            if (application.getCandidateEmail() != null && !application.getCandidateEmail().isBlank()) {
                List<Resume> activeResumes = resumeRepository
                        .findByCandidateEmailAndDeletedFalseOrderByUploadedAtDesc(application.getCandidateEmail());
                if (!activeResumes.isEmpty()) {
                    application.setResume(activeResumes.get(0));
                    applicationRepository.save(application);
                    result.add(application);
                    continue;
                }
            }
        } else {
            result.add(application);
        }
    }

    return result;
}


    // ============================================================
    // UPDATE APPLICATION STATUS
    // ============================================================
@Transactional
public Application updateStatus(
        Long applicationId,
        ApplicationStatus newStatus) {

    Application application = applicationRepository
            .findById(applicationId)
            .orElseThrow(() ->
                    new RuntimeException("Application not found"));

    ensureResumeIsActive(application);

    ApplicationStatus oldStatus = application.getStatus();

    // Always update the application status.
    application.setStatus(newStatus);
    application.setUpdatedAt(LocalDateTime.now());

    Application updatedApplication =
            applicationRepository.save(application);

    // Always synchronize the linked resume,
    // even when the application status was already the same.
    Resume resume = application.getResume();

    if (resume != null && !resume.isDeleted()) {
        try {
            CandidateStatus resumeStatus =
                    CandidateStatus.valueOf(newStatus.name());

            resume.setStatus(resumeStatus);
            resumeRepository.save(resume);

        } catch (IllegalArgumentException e) {
            System.out.println(
                    "No matching CandidateStatus for " + newStatus);
        }
    }

    // Send notification only when the status actually changes.
    if (oldStatus != newStatus) {

        String candidateEmail = application.getCandidateEmail();

        if (candidateEmail != null && !candidateEmail.isBlank()) {

            String jobTitle =
                    application.getJob() != null
                            && application.getJob().getTitle() != null
                            ? application.getJob().getTitle()
                            : "your application";

            notificationService.createCandidateNotification(
                    candidateEmail,
                    "Application status updated",
                    "Your application for " + jobTitle
                            + " has moved from " + formatStatus(oldStatus)
                            + " to " + formatStatus(newStatus) + ".",
                    "APPLICATION_STATUS_CHANGE");
        }

        System.out.println(
                "Application #" + applicationId
                        + " status changed: " + oldStatus
                        + " -> " + newStatus);
    }

    return updatedApplication;
}

    // ============================================================
    // UPDATE STATUS USING RESUME ID

@Transactional
public Application updateStatusByResumeId(
        Long resumeId,
        ApplicationStatus newStatus) {

    List<Application> applications =
            applicationRepository
                    .findByResumeIdOrderByAppliedAtDesc(resumeId);

    // If no applications are found directly by resumeId, check by candidate email
    if (applications.isEmpty()) {
        Resume currentResume = resumeRepository.findById(resumeId).orElse(null);
        if (currentResume != null && currentResume.getCandidateEmail() != null
                && !currentResume.getCandidateEmail().isBlank()) {
            List<Application> emailApps = applicationRepository
                    .findByCandidateEmailOrderByAppliedAtDesc(currentResume.getCandidateEmail());
            for (Application app : emailApps) {
                if (app.getResume() == null || app.getResume().isDeleted()) {
                    app.setResume(currentResume);
                }
            }
            applications = emailApps;
        }
    }

    // A candidate may have a resume without any job applications.
    // Do not fail the resume status update in that case.
    if (applications.isEmpty()) {
        System.out.println(
                "No applications linked to resume ID: " + resumeId);
        return null;
    }

    LocalDateTime now = LocalDateTime.now();
    Application latestActiveApplication = null;

    for (Application application : applications) {

        Resume linkedResume = application.getResume();

        if (linkedResume == null || linkedResume.isDeleted()) {
            Resume activeResume = resumeRepository.findById(resumeId).orElse(null);
            if (activeResume != null && !activeResume.isDeleted()) {
                application.setResume(activeResume);
            } else {
                continue;
            }
        }

        application.setStatus(newStatus);
        application.setUpdatedAt(now);

        Application savedApplication =
                applicationRepository.save(application);

        if (latestActiveApplication == null) {
            latestActiveApplication = savedApplication;
        }
    }

    System.out.println(
            "Application status sync completed for resume ID: "
                    + resumeId + ", status: " + newStatus);

    return latestActiveApplication;
}



    // ============================================================
    // FORMAT STATUS
    // ============================================================

    private String formatStatus(ApplicationStatus status) {
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

        Application application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException("Application not found"));

        ensureResumeIsActive(application);

        if (!candidateEmail.equalsIgnoreCase(
                application.getCandidateEmail())) {
            throw new RuntimeException(
                    "You are not allowed to withdraw this application");
        }

        ApplicationStatus currentStatus = application.getStatus();

        if (currentStatus == ApplicationStatus.WITHDRAWN) {
            throw new RuntimeException(
                    "Application has already been withdrawn");
        }

        if (currentStatus == ApplicationStatus.SELECTED) {
            throw new RuntimeException(
                    "A selected application cannot be withdrawn");
        }

        if (currentStatus == ApplicationStatus.REJECTED) {
            throw new RuntimeException(
                    "A rejected application cannot be withdrawn");
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);
        application.setUpdatedAt(LocalDateTime.now());

        Application updatedApplication =
                applicationRepository.save(application);

        String jobTitle =
                application.getJob() != null
                        && application.getJob().getTitle() != null
                        ? application.getJob().getTitle()
                        : "the job";

        notificationService.createCandidateNotification(
                candidateEmail,
                "Application withdrawn",
                "Your application for " + jobTitle
                        + " has been successfully withdrawn.",
                "APPLICATION_WITHDRAWN");

        notificationService.createNotification(
                "Application withdrawn",
                "Candidate " + candidateEmail
                        + " has withdrawn their application for "
                        + jobTitle + ".",
                "APPLICATION_WITHDRAWN");

        System.out.println(
                "Application #" + applicationId
                        + " withdrawn by " + candidateEmail);

        return updatedApplication;
    }

    // ============================================================
    // SHARED VALIDATION
    // ============================================================

    private void ensureResumeIsActive(Application application) {
        Resume resume = application.getResume();

        if (resume == null || resume.isDeleted()) {
            if (application.getCandidateEmail() != null && !application.getCandidateEmail().isBlank()) {
                List<Resume> active = resumeRepository
                        .findByCandidateEmailAndDeletedFalseOrderByUploadedAtDesc(application.getCandidateEmail());
                if (!active.isEmpty()) {
                    application.setResume(active.get(0));
                    applicationRepository.save(application);
                    return;
                }
            }
            throw new RuntimeException(
                    "This application is linked to a deleted resume");
        }
    }
}
