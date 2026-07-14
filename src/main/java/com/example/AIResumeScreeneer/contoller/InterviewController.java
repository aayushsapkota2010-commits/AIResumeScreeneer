package com.example.AIResumeScreeneer.contoller;

import com.example.AIResumeScreeneer.entity.Interview;
import com.example.AIResumeScreeneer.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InterviewController {

    private final InterviewService interviewService;

    // Schedule Interview
    @PostMapping("/schedule/{resumeId}")
    public Interview scheduleInterview(

            @PathVariable Long resumeId,

            @RequestBody Interview interview
    ) {

        return interviewService.scheduleInterview(
                resumeId,
                interview
        );
    }

    // Get Interview by Resume
    @GetMapping("/{resumeId}")
    public Interview getInterview(

            @PathVariable Long resumeId
    ) {

        return interviewService.getInterview(resumeId);
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
    @GetMapping("/today")
public List<Interview> getTodayInterviews() {

    return interviewService.getTodayInterviews();

}

}