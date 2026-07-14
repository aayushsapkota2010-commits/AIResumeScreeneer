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
                        resumeRepository.findByStatus(
                                CandidateStatus.APPLIED))

                .shortlisted(
                        resumeRepository.findByStatus(
                                CandidateStatus.SHORTLISTED))

                .interview(
                        resumeRepository.findByStatus(
                                CandidateStatus.INTERVIEW))

                .selected(
                        resumeRepository.findByStatus(
                                CandidateStatus.SELECTED))

                .rejected(
                        resumeRepository.findByStatus(
                                CandidateStatus.REJECTED))

                .build();
    }
}