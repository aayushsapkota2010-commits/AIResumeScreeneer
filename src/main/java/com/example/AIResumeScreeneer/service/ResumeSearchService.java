package com.example.AIResumeScreeneer.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.ResumeSearchResponse;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResumeSearchService {

    private final ResumeRepository resumeRepository;

    
    public List<ResumeSearchResponse> searchBySkill(
        String skill) {

    return resumeRepository
            .findBySkillsContainingIgnoreCase(skill)
            .stream()
            .map(resume ->
                    ResumeSearchResponse.builder()
                            .id(resume.getId())
                            .fileName(resume.getFileName())
                            .atsScore(resume.getAtsScore())
                            .matchScore(resume.getMatchScore())
                            .skills(resume.getSkills())
                            .status(
                                    resume.getStatus() != null
                                            ? resume.getStatus().name()
                                            : "APPLIED")
                            .build())
            .toList();
}
}