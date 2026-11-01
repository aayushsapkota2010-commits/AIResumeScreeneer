package com.example.AIResumeScreeneer.contoller;

import com.example.AIResumeScreeneer.entity.Interview;
import com.example.AIResumeScreeneer.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InterviewController {

    private final InterviewService interviewService;

    // Schedule Interview
    @PostMapping("/schedule/{resumeId}")
    public ResponseEntity<?> scheduleInterview(

            @PathVariable Long resumeId,

            @RequestBody Interview interview
    ) {

        try {

            return ResponseEntity.ok(
                    interviewService.scheduleInterview(
                            resumeId,
                            interview
                    )
            );

        } catch (RuntimeException error) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            Map.of(
                                    "message",
                                    error.getMessage()
                            )
                    );
        }
    }

    // Get Interview by Resume
    @GetMapping("/{resumeId}")
    public Interview getInterview(

            @PathVariable Long resumeId
    ) {

        return interviewService.getInterview(resumeId);
    }

    @GetMapping("/my")
public List<Interview> getMyInterviews(
        Authentication authentication) {

    return interviewService.getMyInterviews(
            authentication.getName()
    );
}

    // Update Interview
    @PutMapping("/update/{id}")
    public Interview updateInterview(

            @PathVariable Long id,

            @RequestBody Interview interview
    ) {

        return interviewService.updateInterview(
                id,
                interview
        );
    }

    // Complete Interview
    @PutMapping("/complete/{id}")
    public Interview completeInterview(

            @PathVariable Long id
    ) {

        return interviewService.completeInterview(id);
    }

    // Cancel Interview
    @PutMapping("/cancel/{id}")
    public Interview cancelInterview(

            @PathVariable Long id
    ) {

        return interviewService.cancelInterview(id);
    }

    // Upcoming Interviews
    @GetMapping("/upcoming")
    public List<Interview> getUpcomingInterviews() {

        return interviewService.getUpcomingInterviews();
    }

    // All Interviews
    @GetMapping("/all")
    public List<Interview> getAllInterviews() {

        return interviewService.getAllInterviews();
    }

    // Lightweight interview status per resume
    @GetMapping("/statuses")
    public List<Map<String, Object>> getInterviewStatuses() {

        return interviewService.getInterviewStatusSummaries();
    }
    @GetMapping("/today")
public List<Interview> getTodayInterviews() {

    return interviewService.getTodayInterviews();

}

}