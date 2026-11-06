package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.KanbanResponse;
import com.example.AIResumeScreeneer.entity.CandidateStatus;
import com.example.AIResumeScreeneer.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KanbanService {

    private final ResumeRepository resumeRepository;

    public KanbanResponse getBoard() {

        return KanbanResponse.builder()

                .applied(
                        resumeRepository.findByDeletedFalseAndStatus(
                                CandidateStatus.APPLIED))

                .shortlisted(
                        resumeRepository.findByDeletedFalseAndStatus(
                                CandidateStatus.SHORTLISTED))

                .interview(
                        resumeRepository.findByDeletedFalseAndStatus(
                                CandidateStatus.INTERVIEW))

                .selected(
                        resumeRepository.findByDeletedFalseAndStatus(
                                CandidateStatus.SELECTED))

                .rejected(
                        resumeRepository.findByDeletedFalseAndStatus(
                                CandidateStatus.REJECTED))

                .build();
    }
}