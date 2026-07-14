package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.CandidateDashboardResponse;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CandidateDashboardService {

    private final ResumeRepository resumeRepository;

    public CandidateDashboardResponse getDashboard(
            String email) {

        Resume resume =
                resumeRepository
                        .findTopByCandidateEmailOrderByIdDesc(
                                email)
                        .orElseThrow();

        return CandidateDashboardResponse
                .builder()
                .resumeId(
                        resume.getId())
                .atsScore(
                        resume.getAtsScore())
                .matchScore(
                        resume.getMatchScore())
                .status(
                        resume.getStatus().name())
                .uploadedAt(
                        resume.getUploadedAt().toString())
                .candidateEmail(
                        resume.getCandidateEmail())
                .build();
    }
}