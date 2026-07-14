package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.RecruiterDashboardChartResponse;
import com.example.AIResumeScreeneer.entity.CandidateStatus;
import com.example.AIResumeScreeneer.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecruiterDashboardService {

    private final ResumeRepository resumeRepository;

    public RecruiterDashboardChartResponse getChartData() {

        return RecruiterDashboardChartResponse.builder()
                .applied(
                        resumeRepository.countByStatus(
                                CandidateStatus.APPLIED))
                .shortlisted(
                        resumeRepository.countByStatus(
                                CandidateStatus.SHORTLISTED))
                .interviewed(
                        resumeRepository.countByStatus(
                                CandidateStatus.INTERVIEW))
                .selected(
                        resumeRepository.countByStatus(
                                CandidateStatus.SELECTED))
                .rejected(
                        resumeRepository.countByStatus(
                                CandidateStatus.REJECTED))
                .build();
    }
}