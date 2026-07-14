package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.PipelineResponse;
import com.example.AIResumeScreeneer.entity.CandidateStatus;
import com.example.AIResumeScreeneer.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PipelineService {

    private final ResumeRepository resumeRepository;

    public PipelineResponse getPipelineStats() {

        return PipelineResponse.builder()
                .applied(
                        resumeRepository.countByStatus(
                                CandidateStatus.APPLIED))
                .screening(
                        resumeRepository.countByStatus(
                                CandidateStatus.SCREENING))
                .shortlisted(
                        resumeRepository.countByStatus(
                                CandidateStatus.SHORTLISTED))
                .interview(
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