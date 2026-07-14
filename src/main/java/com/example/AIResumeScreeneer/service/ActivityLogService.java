package com.example.AIResumeScreeneer.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.entity.ActivityLog;
import com.example.AIResumeScreeneer.repository.ActivityLogRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public void saveLog(

            String recruiterEmail,

            String actionType,

            Long resumeId,

            String candidateName) {

        ActivityLog log =
                ActivityLog.builder()
                        .recruiterEmail(recruiterEmail)
                        .actionType(actionType)
                        .resumeId(resumeId)
                        .candidateName(candidateName)
                        .actionTime(LocalDateTime.now())
                        .build();

        activityLogRepository.save(log);
    }

    public List<ActivityLog> getLogs() {

        return activityLogRepository
                .findAllByOrderByActionTimeDesc();
    }

    public List<ActivityLog> getLogs(
        Long resumeId) {

    return activityLogRepository
            .findByResumeIdOrderByActionTimeDesc(
                    resumeId
            );
}


public void log(
        Long resumeId,
        String action) {

    ActivityLog log =
            ActivityLog.builder()
                    .resumeId(resumeId)
                    .actionType(action)
                    .actionTime(LocalDateTime.now())
                    .build();

    activityLogRepository.save(log);
}

}