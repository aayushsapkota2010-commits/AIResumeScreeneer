package com.example.AIResumeScreeneer.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.ResumeSearchResponse;
import com.example.AIResumeScreeneer.entity.CandidateStatus;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResumeFilterService {

    private final ResumeRepository resumeRepository;

   public List<ResumeSearchResponse> filter(
        String skill,
        CandidateStatus status,
        Integer minAts) {

        List<Resume> resumes =
                resumeRepository
                        .findBySkillsContainingIgnoreCaseAndStatusAndAtsScoreGreaterThanEqual(
                                skill,
                                status,
                                minAts);

        return resumes.stream()
                .map(resume ->
                        ResumeSearchResponse.builder()
                                .id(resume.getId())
                                .fileName(resume.getFileName())
                                .atsScore(resume.getAtsScore())
                                .matchScore(resume.getMatchScore())
                                .skills(resume.getSkills())
                                .status(resume.getStatus().name())
                                .build())
                .toList();
    }
}