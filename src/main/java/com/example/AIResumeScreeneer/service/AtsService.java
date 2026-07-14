package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;

@Service
public class AtsService {

    public int calculateScore(String text) {

    int score = 0;

    String lower = text.toLowerCase();

    if(lower.contains("java")) score += 15;
    if(lower.contains("spring")) score += 20;
    if(lower.contains("mysql")) score += 10;
    if(lower.contains("mongodb")) score += 10;
    if(lower.contains("rest")) score += 10;
    if(lower.contains("git")) score += 10;
    if(lower.contains("github")) score += 10;
    if(lower.contains("react")) score += 10;
    if(lower.contains("docker")) score += 10;
    if(lower.contains("aws")) score += 15;

    System.out.println("Contains Java = " + lower.contains("java"));
System.out.println("Contains Spring = " + lower.contains("spring"));
System.out.println("Contains MySQL = " + lower.contains("mysql"));
System.out.println("Contains MongoDB = " + lower.contains("mongodb"));
System.out.println("Contains Git = " + lower.contains("git"));

    return Math.min(score, 100);
}

    public String extractSkills(String text) {

    StringBuilder skills = new StringBuilder();

    String lower = text.toLowerCase();

    if(lower.contains("java"))
        skills.append("Java, ");

    if(lower.contains("spring"))
        skills.append("Spring Boot, ");

    if(lower.contains("mysql"))
        skills.append("MySQL, ");

    if(lower.contains("mongodb"))
        skills.append("MongoDB, ");

    if(lower.contains("react"))
        skills.append("React, ");

    if(lower.contains("git"))
        skills.append("Git, ");

    if(lower.contains("github"))
        skills.append("GitHub, ");

    return skills.toString();
}

    public String generateSuggestions(int score) {

        if(score >= 80)
            return "Excellent Resume";

        if(score >= 60)
            return "Add more projects and achievements";

        return "Add technical skills, certifications and projects";
    }
}