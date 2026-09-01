package com.example.AIResumeScreeneer.service;

import com.example.AIResumeScreeneer.entity.CandidateStatus;
import com.example.AIResumeScreeneer.entity.Interview;
import com.example.AIResumeScreeneer.entity.InterviewStatus;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.repository.InterviewRepository;
import com.example.AIResumeScreeneer.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ResumeRepository resumeRepository;
    private final EmailService emailService;

    // Schedule Interview
    public Interview scheduleInterview(
            Long resumeId,
            Interview interview
    ) {

        Resume resume = resumeRepository
                .findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        interview.setResume(resume);

        interview.setStatus(InterviewStatus.SCHEDULED);

        // Automatically move candidate to Interview stage
        resume.setStatus(CandidateStatus.INTERVIEW);

        resumeRepository.save(resume);

        Interview savedInterview = interviewRepository.save(interview);

emailService.sendInterviewInvitation(

        resume.getCandidateEmail(),

        resume.getCandidateEmail().split("@")[0],

        interview.getInterviewer(),

        interview.getInterviewDate().toString(),

        interview.getInterviewTime().toString(),

        interview.getMode(),

        interview.getMeetingLink(),

        interview.getLocation()

);

return savedInterview;
    }

    // Get interview for one candidate
    public Interview getInterview(Long resumeId) {

        Resume resume = resumeRepository
                .findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        return interviewRepository
                .findByResume(resume)
                .orElse(null);
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
    public Interview cancelInterview(Long interviewId) {

        Interview interview = interviewRepository
                .findById(interviewId)
                .orElseThrow(() ->
                        new RuntimeException("Interview not found"));

        interview.setStatus(InterviewStatus.CANCELLED);

        return interviewRepository.save(interview);
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
    public List<Interview> getTodayInterviews() {

    return interviewRepository.findByInterviewDate(
            LocalDate.now()
    );

}

}