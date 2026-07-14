package com.example.AIResumeScreeneer.service;

import java.util.*;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.KeywordGapResponse;

@Service
public class KeywordGapService {

    public KeywordGapResponse analyze(
            String resumeText,
            String jobDescription) {

        String resume =
                resumeText.toLowerCase();

        String jd =
                jobDescription.toLowerCase();

        String[] words =
                jd.split("\\s+");

        Set<String> uniqueKeywords =
                new HashSet<>();

        for(String word : words) {

            if(word.length() > 3) {
                uniqueKeywords.add(word);
            }
        }

        List<String> present =
                new ArrayList<>();

        List<String> missing =
                new ArrayList<>();

        for(String keyword : uniqueKeywords) {

            if(resume.contains(keyword)) {
                present.add(keyword);
            }
            else {
                missing.add(keyword);
            }
        }

        int coverage =
                (present.size() * 100)
                        / uniqueKeywords.size();

        return KeywordGapResponse.builder()
                .presentKeywords(
                        String.join(", ", present))
                .missingKeywords(
                        String.join(", ", missing))
                .keywordCoverage(coverage)
                .build();
    }
}