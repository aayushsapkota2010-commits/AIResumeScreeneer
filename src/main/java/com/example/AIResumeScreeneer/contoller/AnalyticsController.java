package com.example.AIResumeScreeneer.contoller;

import com.example.AIResumeScreeneer.dto.AnalyticsResponse;
import com.example.AIResumeScreeneer.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public AnalyticsResponse dashboard() {

        return analyticsService.getDashboard();

    }

}