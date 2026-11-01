package com.example.AIResumeScreeneer.service;

import com.example.AIResumeScreeneer.entity.ApplicationStatus;
import com.example.AIResumeScreeneer.entity.CandidateStatus;
import com.example.AIResumeScreeneer.entity.Interview;
import com.example.AIResumeScreeneer.entity.InterviewStatus;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.repository.InterviewRepository;
import com.example.AIResumeScreeneer.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ResumeRepository resumeRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;
    private final ApplicationService applicationService;

    // Schedule Interview
    @Transactional
    public Interview scheduleInterview(
        Long resumeId,
        Interview interview
) {

    Resume resume = resumeRepository
            .findById(resumeId)
            .orElseThrow(() ->
                    new RuntimeException("Resume not found"));

    if (resume.isDeleted()) {
        throw new RuntimeException("Resume not found");
    }

    List<Interview> existingInterviews =
            interviewRepository
                    .findByResumeIdOrderByIdAsc(resumeId);

    Interview target;

    if (existingInterviews.isEmpty()) {

        target = interview;
        target.setResume(resume);

    } else {

        boolean alreadyScheduled =
                existingInterviews.stream()
                        .anyMatch(item ->
                                item.getStatus()
                                        == InterviewStatus.SCHEDULED);

        if (alreadyScheduled) {
            throw new RuntimeException(
                    "An interview is already scheduled for this resume");
        }

        boolean alreadyCompleted =
                existingInterviews.stream()
                        .anyMatch(item ->
                                item.getStatus()
                                        == InterviewStatus.COMPLETED);

        if (alreadyCompleted) {
            throw new RuntimeException(
                    "An interview has already been completed for this resume");
        }

        // Only cancelled interviews remain: reschedule the latest one
        // instead of creating a duplicate record for the same resume.
        target = existingInterviews.get(
                existingInterviews.size() - 1
        );

        target.setInterviewDate(
                interview.getInterviewDate());
        target.setInterviewTime(
                interview.getInterviewTime());
        target.setInterviewer(
                interview.getInterviewer());
        target.setMode(
                interview.getMode());
        target.setLocation(
                interview.getLocation());
        target.setMeetingLink(
                interview.getMeetingLink());
        target.setNotes(
                interview.getNotes());
        target.setResume(resume);
    }

    target.setStatus(
            InterviewStatus.SCHEDULED
    );

    // Automatically move candidate to Interview stage
    resume.setStatus(
            CandidateStatus.INTERVIEW
    );

    resumeRepository.save(resume);

    // Keep the application pipeline in sync with the resume stage
    applicationService.updateStatusByResumeId(
            resumeId,
            ApplicationStatus.INTERVIEW
    );

    // Save interview
    Interview savedInterview =
            interviewRepository.save(target);


    // ============================================================
    // SEND INTERVIEW EMAIL
    // ============================================================

    emailService.sendInterviewInvitation(
            resume.getCandidateEmail(),
            resume.getCandidateEmail().split("@")[0],
            savedInterview.getInterviewer(),
            savedInterview.getInterviewDate().toString(),
            savedInterview.getInterviewTime().toString(),
            savedInterview.getMode(),
            savedInterview.getMeetingLink(),
            savedInterview.getLocation()
    );


    // ============================================================
    // FRONTEND NOTIFICATION → CANDIDATE
    // ============================================================

    if (resume.getCandidateEmail() != null
            && !resume.getCandidateEmail().isBlank()) {

        String candidateEmail =
                resume.getCandidateEmail();

        String interviewer =
                savedInterview.getInterviewer() != null
                        ? savedInterview.getInterviewer()
                        : "Recruiter";

        String date =
                savedInterview.getInterviewDate() != null
                        ? savedInterview.getInterviewDate().toString()
                        : "the scheduled date";

        String time =
                savedInterview.getInterviewTime() != null
                        ? savedInterview.getInterviewTime().toString()
                        : "the scheduled time";


        notificationService.createCandidateNotification(
                candidateEmail,

                "Interview scheduled",

                "Your interview has been scheduled for "
                        + date
                        + " at "
                        + time
                        + " with "
                        + interviewer
                        + ".",

                "INTERVIEW_SCHEDULED"
        );


        // ========================================================
        // FRONTEND NOTIFICATION → RECRUITER / ADMIN
        // ========================================================

        notificationService.createNotification(

                "Interview scheduled",

                "An interview has been scheduled with candidate "
                        + candidateEmail
                        + " for "
                        + date
                        + " at "
                        + time
                        + ".",

                "INTERVIEW_SCHEDULED"
        );

        System.out.println(
                "✅ Interview notifications created for "
                        + candidateEmail
        );
    }


    return savedInterview;
}

    // Get interview for one candidate
    public Interview getInterview(Long resumeId) {

        Resume resume = resumeRepository
                .findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        List<Interview> interviews =
                interviewRepository
                        .findByResumeIdOrderByIdAsc(
                                resume.getId()
                        );

        if (interviews.isEmpty()) {
            return null;
        }

        // Prefer the active interview, otherwise return the latest one
        return interviews.stream()
                .filter(item ->
                        item.getStatus()
                                == InterviewStatus.SCHEDULED)
                .findFirst()
                .orElse(
                        interviews.get(
                                interviews.size() - 1
                        )
                );
    }

    // Update Interview
    public Interview updateInterview(
            Long interviewId,
            Interview updatedInterview
    ) {

        Interview interview = interviewRepository
                .findById(interviewId)
                .orElseThrow(() ->
                        new RuntimeException("Interview not found"));

        interview.setInterviewDate(updatedInterview.getInterviewDate());
        interview.setInterviewTime(updatedInterview.getInterviewTime());
        interview.setInterviewer(updatedInterview.getInterviewer());
        interview.setMode(updatedInterview.getMode());
        interview.setLocation(updatedInterview.getLocation());
        interview.setMeetingLink(updatedInterview.getMeetingLink());
        interview.setNotes(updatedInterview.getNotes());

        return interviewRepository.save(interview);
    }

    // Complete Interview
    public Interview completeInterview(Long interviewId) {

        Interview interview = interviewRepository
                .findById(interviewId)
                .orElseThrow(() ->
                        new RuntimeException("Interview not found"));

        interview.setStatus(InterviewStatus.COMPLETED);

        return interviewRepository.save(interview);
    }

    // Cancel Interview
    @Transactional
    public Interview cancelInterview(Long interviewId) {

        Interview interview = interviewRepository
                .findById(interviewId)
                .orElseThrow(() ->
                        new RuntimeException("Interview not found"));

        interview.setStatus(InterviewStatus.CANCELLED);

        Interview savedInterview =
                interviewRepository.save(interview);

        // Move the candidate back to the shortlisted stage so the
        // resume and application pipeline stay consistent.
        Resume resume = interview.getResume();

        if (resume != null
                && resume.getStatus()
                        == CandidateStatus.INTERVIEW) {

            resume.setStatus(
                    CandidateStatus.SHORTLISTED
            );

            resumeRepository.save(resume);

            applicationService.updateStatusByResumeId(
                    resume.getId(),
                    ApplicationStatus.SHORTLISTED
            );
        }

        return savedInterview;
    }

    // Upcoming Interviews
    public List<Interview> getUpcomingInterviews() {

        return interviewRepository.findByStatus(
                InterviewStatus.SCHEDULED
        );
    }

    // Get All Interviews
    public List<Interview> getAllInterviews() {

        return interviewRepository.findAll();
    }

    // Lightweight interview status summary per resume
    public List<java.util.Map<String, Object>>
            getInterviewStatusSummaries() {

        return interviewRepository
                .findInterviewStatusSummaries();
    }

    // Get interviews for logged-in candidate only
public List<Interview> getMyInterviews(String candidateEmail) {

    return interviewRepository
            .findByResumeCandidateEmailOrderByInterviewDateAscInterviewTimeAsc(
                    candidateEmail
            );
}
    public List<Interview> getTodayInterviews() {

    return interviewRepository.findByInterviewDate(
            LocalDate.now()
    );

}

}