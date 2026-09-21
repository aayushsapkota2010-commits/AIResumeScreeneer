package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

@Service
public class AtsService {

    /*
     * ============================================================
     * SKILL DICTIONARY
     * ============================================================
     *
     * The ATS can recognize skills from different domains.
     *
     * This is much better than checking only Java/Spring/MySQL.
     */

    private final Map<String, List<String>> skillAliases =
            new LinkedHashMap<>();

    public AtsService() {

        // -------------------------
        // Programming
        // -------------------------

        addSkill("Java", "java");
        addSkill("Python", "python");
        addSkill("C++", "c++", "cpp");
        addSkill("C#", "c#", "c sharp");
        addSkill("JavaScript", "javascript", "js");
        addSkill("TypeScript", "typescript", "ts");
        addSkill("Kotlin", "kotlin");
        addSkill("Go", "golang", "go language");
        addSkill("PHP", "php");

        // -------------------------
        // Backend
        // -------------------------

        addSkill("Spring Boot",
                "spring boot",
                "springboot");

        addSkill("Spring",
                "spring framework");

        addSkill("REST API",
                "rest api",
                "restful api",
                "rest apis",
                "restful apis");

        addSkill("Microservices",
                "microservices",
                "microservice architecture");

        addSkill("Node.js",
                "node.js",
                "nodejs",
                "node js");

        addSkill("Express.js",
                "express.js",
                "expressjs",
                "express js");

        addSkill("FastAPI",
                "fastapi",
                "fast api");

        addSkill("Django",
                "django");

        // -------------------------
        // Databases
        // -------------------------

        addSkill("SQL",
                "sql",
                "structured query language");

        addSkill("MySQL",
                "mysql");

        addSkill("PostgreSQL",
                "postgresql",
                "postgres");

        addSkill("MongoDB",
                "mongodb",
                "mongo db");

        addSkill("Redis",
                "redis");

        addSkill("Oracle",
                "oracle database");

        // -------------------------
        // AI / ML
        // -------------------------

        addSkill("Artificial Intelligence",
                "artificial intelligence",
                "ai");

        addSkill("Machine Learning",
                "machine learning",
                "machine-learning",
                "machine learning algorithms",
                "ml");

        addSkill("Deep Learning",
                "deep learning",
                "deep-learning",
                "dl");

        addSkill("Natural Language Processing",
                "natural language processing",
                "nlp");

        addSkill("Computer Vision",
                "computer vision",
                "cv");

        addSkill("Generative AI",
                "generative ai",
                "generative artificial intelligence",
                "genai",
                "gen ai");

        // -------------------------
        // ML Frameworks
        // -------------------------

        addSkill("TensorFlow",
                "tensorflow");

        addSkill("PyTorch",
                "pytorch");

        addSkill("Scikit-learn",
                "scikit-learn",
                "scikit learn",
                "sklearn");

        addSkill("Keras",
                "keras");

        addSkill("Pandas",
                "pandas");

        addSkill("NumPy",
                "numpy");

        // -------------------------
        // Data
        // -------------------------

        addSkill("Data Science",
                "data science",
                "data scientist");

        addSkill("Data Analysis",
                "data analysis",
                "data analytics");

        addSkill("Statistics",
                "statistics",
                "statistical analysis");

        addSkill("Power BI",
                "power bi",
                "powerbi");

        addSkill("Tableau",
                "tableau");

        // -------------------------
        // Frontend
        // -------------------------

        addSkill("React",
                "react",
                "react.js",
                "reactjs");

        addSkill("Angular",
                "angular",
                "angular.js");

        addSkill("Vue.js",
                "vue",
                "vue.js",
                "vuejs");

        addSkill("HTML",
                "html",
                "html5");

        addSkill("CSS",
                "css",
                "css3");

        // -------------------------
        // Cloud
        // -------------------------

        addSkill("AWS",
                "aws",
                "amazon web services");

        addSkill("Azure",
                "azure",
                "microsoft azure");

        addSkill("Google Cloud",
                "google cloud",
                "gcp",
                "google cloud platform");

        // -------------------------
        // DevOps
        // -------------------------

        addSkill("Docker",
                "docker");

        addSkill("Kubernetes",
                "kubernetes",
                "k8s");

        addSkill("Jenkins",
                "jenkins");

        addSkill("CI/CD",
                "ci/cd",
                "continuous integration",
                "continuous deployment");

        // -------------------------
        // Tools
        // -------------------------

        addSkill("Git",
                "git");

        addSkill("GitHub",
                "github",
                "git hub");

        addSkill("Maven",
                "maven");

        addSkill("Gradle",
                "gradle");

        addSkill("Linux",
                "linux");

        // -------------------------
        // Other technical skills
        // -------------------------

        addSkill("OOP",
                "object oriented programming",
                "object-oriented programming",
                "oops");

        addSkill("Data Structures",
                "data structures",
                "dsa",
                "data structure");

        addSkill("Algorithms",
                "algorithms",
                "algorithm");

        addSkill("API Development",
                "api development");

        addSkill("JWT",
                "jwt",
                "json web token",
                "json web tokens");

        addSkill("OAuth",
                "oauth",
                "oauth2",
                "oauth 2.0");
    }


    /*
     * ============================================================
     * MAIN ATS SCORE
     * ============================================================
     */

    public int calculateScore(String text) {

        if (text == null || text.trim().isEmpty()) {
            return 0;
        }

        String resume = normalize(text);

        /*
         * --------------------------------------------------------
         * 1. TECHNICAL SKILLS - 40 POINTS
         * --------------------------------------------------------
         *
         * Instead of expecting specific technologies,
         * calculate how much technical content the resume contains.
         */

        int skillCount = countDetectedSkills(resume);

        int skillScore;

        if (skillCount >= 12) {
            skillScore = 40;
        } else if (skillCount >= 9) {
            skillScore = 36;
        } else if (skillCount >= 7) {
            skillScore = 32;
        } else if (skillCount >= 5) {
            skillScore = 27;
        } else if (skillCount >= 3) {
            skillScore = 20;
        } else if (skillCount >= 1) {
            skillScore = 10;
        } else {
            skillScore = 0;
        }


        /*
         * --------------------------------------------------------
         * 2. PROJECTS - 15 POINTS
         * --------------------------------------------------------
         */

        int projectScore = calculateSectionScore(
                resume,
                15,
                "projects",
                "project",
                "academic project",
                "personal project"
        );


        /*
         * --------------------------------------------------------
         * 3. EXPERIENCE - 15 POINTS
         * --------------------------------------------------------
         */

        int experienceScore = calculateSectionScore(
                resume,
                15,
                "experience",
                "work experience",
                "professional experience",
                "internship",
                "internships",
                "employment"
        );


        /*
         * --------------------------------------------------------
         * 4. EDUCATION - 10 POINTS
         * --------------------------------------------------------
         */

        int educationScore = calculateSectionScore(
                resume,
                10,
                "education",
                "qualification",
                "academic"
        );


        /*
         * --------------------------------------------------------
         * 5. CERTIFICATIONS - 10 POINTS
         * --------------------------------------------------------
         */

        int certificationScore = calculateSectionScore(
                resume,
                10,
                "certification",
                "certifications",
                "certificate",
                "certificates"
        );


        /*
         * --------------------------------------------------------
         * 6. RESUME COMPLETENESS - 10 POINTS
         * --------------------------------------------------------
         */

        int completenessScore =
                calculateCompletenessScore(resume);


        /*
         * --------------------------------------------------------
         * FINAL SCORE
         * --------------------------------------------------------
         */

        int total =
                skillScore
                        + projectScore
                        + experienceScore
                        + educationScore
                        + certificationScore
                        + completenessScore;

        total = Math.min(total, 100);

        System.out.println("========== ATS ANALYSIS ==========");
        System.out.println("Detected Skills = " + skillCount);
        System.out.println("Skill Score = " + skillScore);
        System.out.println("Project Score = " + projectScore);
        System.out.println("Experience Score = " + experienceScore);
        System.out.println("Education Score = " + educationScore);
        System.out.println("Certification Score = " + certificationScore);
        System.out.println("Completeness Score = " + completenessScore);
        System.out.println("FINAL ATS SCORE = " + total);
        System.out.println("==================================");

        return total;
    }


    /*
     * ============================================================
     * SKILL EXTRACTION
     * ============================================================
     */

    public String extractSkills(String text) {

        if (text == null || text.trim().isEmpty()) {
            return "";
        }

        String resume = normalize(text);

        List<String> detectedSkills =
                new ArrayList<>();

        for (Map.Entry<String, List<String>> entry
                : skillAliases.entrySet()) {

            if (containsSkill(
                    resume,
                    entry.getValue())) {

                detectedSkills.add(
                        entry.getKey()
                );
            }
        }

        return String.join(
                ", ",
                detectedSkills
        );
    }


    /*
     * ============================================================
     * SUGGESTIONS
     * ============================================================
     */

    public String generateSuggestions(int score) {

        if (score >= 85) {

            return "Strong resume. Keep improving projects, achievements and measurable results.";

        } else if (score >= 70) {

            return "Good resume. Add stronger project details, measurable achievements and relevant certifications.";

        } else if (score >= 50) {

            return "Average resume. Add more technical skills, projects, experience and certifications.";

        } else {

            return "Resume needs improvement. Add technical skills, projects, education, experience and certifications.";
        }
    }


    /*
     * ============================================================
     * HELPER METHODS
     * ============================================================
     */

    private void addSkill(
            String skill,
            String... aliases) {

        skillAliases.put(
                skill,
                Arrays.asList(aliases)
        );
    }


    private String normalize(String text) {

        return text
                .toLowerCase()
                .replaceAll("[\\r\\n\\t]+", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }


    private int countDetectedSkills(
            String resume) {

        int count = 0;

        for (List<String> aliases
                : skillAliases.values()) {

            if (containsSkill(
                    resume,
                    aliases)) {

                count++;
            }
        }

        return count;
    }


    private boolean containsSkill(
            String text,
            List<String> aliases) {

        for (String alias : aliases) {

            if (containsWholeSkill(
                    text,
                    alias)) {

                return true;
            }
        }

        return false;
    }


    private boolean containsWholeSkill(
            String text,
            String skill) {

        String normalizedSkill =
                normalize(skill);

        String pattern =
                "(^|[^a-z0-9+#])"
                        + Pattern.quote(normalizedSkill)
                        + "([^a-z0-9+#]|$)";

        return text.matches(
                ".*" + pattern + ".*"
        );
    }


    private int calculateSectionScore(
            String resume,
            int maximumScore,
            String... keywords) {

        int matches = 0;

        for (String keyword : keywords) {

            if (resume.contains(
                    keyword.toLowerCase())) {

                matches++;
            }
        }

        if (matches == 0) {
            return 0;
        }

        /*
         * One section heading gives partial credit.
         * Multiple related indicators give higher credit.
         */

        if (matches >= 3) {
            return maximumScore;
        }

        if (matches == 2) {
            return (maximumScore * 80) / 100;
        }

        return (maximumScore * 60) / 100;
    }


    private int calculateCompletenessScore(
            String resume) {

        int score = 0;

        if (containsAny(
                resume,
                "email",
                "@")) {

            score += 2;
        }

        if (containsAny(
                resume,
                "phone",
                "mobile",
                "contact")) {

            score += 2;
        }

        if (containsAny(
                resume,
                "education",
                "degree",
                "b.tech",
                "b.e.",
                "bachelor",
                "master")) {

            score += 2;
        }

        if (containsAny(
                resume,
                "skills",
                "technical skills")) {

            score += 2;
        }

        if (containsAny(
                resume,
                "projects",
                "project")) {

            score += 2;
        }

        return Math.min(score, 10);
    }


    private boolean containsAny(
            String text,
            String... keywords) {

        for (String keyword : keywords) {

            if (text.contains(
                    keyword.toLowerCase())) {

                return true;
            }
        }

        return false;
    }
}