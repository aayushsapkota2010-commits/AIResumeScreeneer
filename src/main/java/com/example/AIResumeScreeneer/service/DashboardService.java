package com.example.AIResumeScreeneer.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.DashboardResponse;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.repository.ResumeRepository;
import java.util.HashMap;
import java.util.Map;

import com.example.AIResumeScreeneer.entity.CandidateStatus;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ResumeRepository resumeRepository;

    public DashboardResponse getDashboard() {

        List<Resume> resumes =
                resumeRepository.findAll();

        long totalResumes = resumes.size();

        int totalAtsScore = 0;
        int highestAtsScore = 0;
        int highestMatchScore = 0;
        long shortlisted = 0;
        long selected = 0;
        long rejected = 0;

Map<String, Integer> skillCount =
        new HashMap<>();

        for (Resume resume : resumes) {

            int atsScore =
                    resume.getAtsScore() == null
                            ? 0
                            : resume.getAtsScore();

            int matchScore =
                    resume.getMatchScore() == null
                            ? 0
                            : resume.getMatchScore();

            totalAtsScore += atsScore;

            if (atsScore > highestAtsScore) {
                highestAtsScore = atsScore;
            }

            if (matchScore > highestMatchScore) {
                highestMatchScore = matchScore;
            }
            if (resume.getStatus() != null) {

    if (resume.getStatus() ==
            CandidateStatus.SHORTLISTED) {

        shortlisted++;
    }

    if (resume.getStatus() ==
            CandidateStatus.SELECTED) {

        selected++;
    }

    if (resume.getStatus() ==
            CandidateStatus.REJECTED) {

        rejected++;
    }
}

if (resume.getSkills() != null) {

    String[] skills =
            resume.getSkills().split(",");

    for (String skill : skills) {

        String cleanedSkill =
                skill.trim();

        if (!cleanedSkill.isEmpty()) {

            skillCount.put(
                    cleanedSkill,
                    skillCount.getOrDefault(
                            cleanedSkill,
                            0) + 1);
        }
    }
}
        }

        double averageAtsScore = 0;

        if (totalResumes > 0) {
            averageAtsScore =
                    (double) totalAtsScore / totalResumes;
        }

        String topSkill = "N/A";

int maxCount = 0;

for (Map.Entry<String, Integer> entry :
        skillCount.entrySet()) {

    if (entry.getValue() > maxCount) {

        maxCount = entry.getValue();

        topSkill = entry.getKey();
    }
}

      return DashboardResponse.builder()
        .totalResumes(totalResumes)
        .averageAtsScore(averageAtsScore)
        .highestAtsScore(highestAtsScore)
        .highestMatchScore(highestMatchScore)
        .shortlisted(shortlisted)
        .selected(selected)
        .rejected(rejected)
        .topSkill(topSkill)
        .build();
    }
}