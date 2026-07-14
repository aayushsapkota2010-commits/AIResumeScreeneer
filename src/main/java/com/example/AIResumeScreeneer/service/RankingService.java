package com.example.AIResumeScreeneer.service;

import java.util.*;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.ResumeRankingResponse;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RankingService {

    private final ResumeRepository resumeRepository;

    public List<ResumeRankingResponse> getRanking() {

    List<Resume> resumes =
            resumeRepository.findAll();

    resumes.sort((a, b) ->
            Integer.compare(
                    b.getAtsScore() == null ? 0 : b.getAtsScore(),
                    a.getAtsScore() == null ? 0 : a.getAtsScore()
            ));

    List<ResumeRankingResponse> ranking =
            new ArrayList<>();

    int rank = 1;

    for (Resume resume : resumes) {

        ranking.add(
                ResumeRankingResponse.builder()
                        .rank(rank++)
                        .resumeId(resume.getId())
                        .atsScore(
                                resume.getAtsScore() == null
                                        ? 0
                                        : resume.getAtsScore()
                        )
                        .matchScore(
                                resume.getMatchScore() == null
                                        ? 0
                                        : resume.getMatchScore()
                        )
                        .build()
        );
    }

    return ranking;
}
}