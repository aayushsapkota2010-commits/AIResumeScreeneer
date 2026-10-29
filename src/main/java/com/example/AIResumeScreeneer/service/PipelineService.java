
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

        // Count only active resumes. Do not count soft-deleted records.
        return PipelineResponse.builder()
                .applied(
                        resumeRepository.countByDeletedFalseAndStatus(
                                CandidateStatus.APPLIED))
                .screening(
                        resumeRepository.countByDeletedFalseAndStatus(
                                CandidateStatus.SCREENING))
                .shortlisted(
                        resumeRepository.countByDeletedFalseAndStatus(
                                CandidateStatus.SHORTLISTED))
                .interview(
                        resumeRepository.countByDeletedFalseAndStatus(
                                CandidateStatus.INTERVIEW))
                .selected(
                        resumeRepository.countByDeletedFalseAndStatus(
                                CandidateStatus.SELECTED))
                .rejected(
                        resumeRepository.countByDeletedFalseAndStatus(
                                CandidateStatus.REJECTED))
                .build();
    }
}
