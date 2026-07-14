package com.example.AIResumeScreeneer.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.CandidateResponse;
import com.example.AIResumeScreeneer.dto.RecruiterDashboardResponse;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecruiterService {

    private final ResumeRepository resumeRepository;

    public List<CandidateResponse> searchBySkill(
            String skill) {

        List<Resume> resumes =
                resumeRepository
                        .findBySkillsContainingIgnoreCase(skill);

        List<CandidateResponse> result =
                new ArrayList<>();

        for (Resume resume : resumes) {

            result.add(
                    CandidateResponse.builder()
                            .resumeId(resume.getId())
                            .atsScore(resume.getAtsScore())
                            .matchScore(resume.getMatchScore())
                            .skills(resume.getSkills())
                            .build()
            );
        }

        return result;
    }

    public List<CandidateResponse> getTopCandidates() {

    List<Resume> resumes =
            resumeRepository.findAll();

    resumes.sort((a, b) ->
            Integer.compare(
                    b.getAtsScore() == null ? 0 : b.getAtsScore(),
                    a.getAtsScore() == null ? 0 : a.getAtsScore()
            ));

    List<CandidateResponse> result =
            new ArrayList<>();

    for (Resume resume : resumes) {

        result.add(
                CandidateResponse.builder()
                        .resumeId(resume.getId())
                        .atsScore(
                                resume.getAtsScore() == null
                                        ? 0
                                        : resume.getAtsScore())
                        .matchScore(
                                resume.getMatchScore() == null
                                        ? 0
                                        : resume.getMatchScore())
                        .skills(resume.getSkills())
                        .build()
        );
    }

    return result;
}

public String shortlistCandidate(Long id) {

    Resume resume =
            resumeRepository.findById(id)
                    .orElseThrow();

    resume.setShortlisted(true);

    resumeRepository.save(resume);

    return "Candidate Shortlisted Successfully";
}
public List<CandidateResponse> getShortlistedCandidates() {

    List<Resume> resumes =
            resumeRepository.findAll();

    List<CandidateResponse> result =
            new ArrayList<>();

    for (Resume resume : resumes) {

        if(Boolean.TRUE.equals(
                resume.getShortlisted())) {

            result.add(
                    CandidateResponse.builder()
                            .resumeId(resume.getId())
                            .atsScore(resume.getAtsScore())
                            .matchScore(resume.getMatchScore())
                            .skills(resume.getSkills())
                            .build()
            );
        }
    }

    return result;
}

public RecruiterDashboardResponse getDashboard() {

    List<Resume> resumes =
            resumeRepository.findAll();

    int totalCandidates =
            resumes.size();

    int shortlistedCandidates = 0;

    int highestATS = 0;

    int totalATS = 0;

    for (Resume resume : resumes) {

        if(Boolean.TRUE.equals(
                resume.getShortlisted())) {

            shortlistedCandidates++;
        }

        int ats =
                resume.getAtsScore() == null
                        ? 0
                        : resume.getAtsScore();

        totalATS += ats;

        highestATS =
                Math.max(highestATS, ats);
    }

    double averageATS =
            totalCandidates == 0
                    ? 0
                    : (double) totalATS / totalCandidates;

    return RecruiterDashboardResponse
            .builder()
            .totalCandidates(totalCandidates)
            .shortlistedCandidates(shortlistedCandidates)
            .averageATS(averageATS)
            .highestATS(highestATS)
            .build();
}
}