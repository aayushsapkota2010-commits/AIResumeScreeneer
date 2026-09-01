package com.example.AIResumeScreeneer.contoller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.AIResumeScreeneer.dto.CandidateResponse;
import com.example.AIResumeScreeneer.dto.InterviewInviteRequest;
import com.example.AIResumeScreeneer.service.EmailService;
import com.example.AIResumeScreeneer.service.RecruiterService;

import lombok.RequiredArgsConstructor;
import com.example.AIResumeScreeneer.dto.RecruiterDashboardResponse;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.repository.ResumeRepository;


@RestController
@RequestMapping("/api/recruiter")
@RequiredArgsConstructor
public class RecruiterController {

    private final RecruiterService recruiterService;
    private final EmailService emailService;
        private final ResumeRepository resumeRepository;


    @GetMapping("/search")
    public List<CandidateResponse> searchBySkill(
            @RequestParam String skill) {

        return recruiterService.searchBySkill(skill);
    }

    @GetMapping("/top-candidates")
public List<CandidateResponse> getTopCandidates() {

    return recruiterService.getTopCandidates();
}

@PostMapping("/shortlist/{id}")
public String shortlistCandidate(
        @PathVariable Long id) {

    return recruiterService
            .shortlistCandidate(id);
}
@GetMapping("/shortlisted")
public List<CandidateResponse>
getShortlistedCandidates() {

    return recruiterService
            .getShortlistedCandidates();
}

@GetMapping("/dashboard")
public RecruiterDashboardResponse dashboard() {

    return recruiterService
            .getDashboard();
}

@PostMapping("/interview-invite/{id}")
public String sendInterviewInvite(

        @PathVariable Long id,

        @RequestBody InterviewInviteRequest request) {
                System.out.println("INTERVIEW INVITE API HIT");


    Resume resume =
            resumeRepository
                    .findById(id)
                    .orElseThrow();

  emailService.sendInterviewInvitation(

        resume.getCandidateEmail(),

        resume.getCandidateEmail().split("@")[0],

        request.getInterviewer(),

        request.getInterviewDate(),

        request.getInterviewTime(),

        request.getMode(),

        request.getMeetingLink(),

        request.getLocation()

);

    return "Interview Invite Sent";
}

}