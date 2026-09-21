package com.example.AIResumeScreeneer.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.JobMatchResponse;

@Service
public class JobMatchingService {

    /*
     * Skill aliases:
     *
     * The key is the normalized skill name.
     * The values are different ways a skill may appear
     * in a resume or job description.
     */
    private final Map<String, List<String>> skillAliases =
            new LinkedHashMap<>();

    public JobMatchingService() {

        // =========================
        // Programming Languages
        // =========================

        skillAliases.put("Java",
                Arrays.asList("java"));

        skillAliases.put("Python",
                Arrays.asList("python"));

        skillAliases.put("C++",
                Arrays.asList("c++", "cpp"));

        skillAliases.put("C",
                Arrays.asList("c programming"));

        skillAliases.put("C#",
                Arrays.asList("c#", "c sharp"));

        skillAliases.put("JavaScript",
                Arrays.asList("javascript", "js"));

        skillAliases.put("TypeScript",
                Arrays.asList("typescript", "ts"));

        // =========================
        // Backend
        // =========================

        skillAliases.put("Spring Boot",
                Arrays.asList(
                        "spring boot",
                        "springboot"
                ));

        skillAliases.put("Spring",
                Arrays.asList(
                        "spring framework"
                ));

        skillAliases.put("REST API",
                Arrays.asList(
                        "rest api",
                        "restful api",
                        "rest apis",
                        "restful apis"
                ));

        skillAliases.put("Microservices",
                Arrays.asList(
                        "microservices",
                        "microservice architecture"
                ));

        skillAliases.put("Node.js",
                Arrays.asList(
                        "node.js",
                        "nodejs",
                        "node js"
                ));

        skillAliases.put("Express.js",
                Arrays.asList(
                        "express.js",
                        "expressjs",
                        "express js"
                ));

        // =========================
        // Databases
        // =========================

        skillAliases.put("MySQL",
                Arrays.asList(
                        "mysql"
                ));

        skillAliases.put("PostgreSQL",
                Arrays.asList(
                        "postgresql",
                        "postgres"
                ));

        skillAliases.put("MongoDB",
                Arrays.asList(
                        "mongodb",
                        "mongo db"
                ));

        skillAliases.put("Redis",
                Arrays.asList(
                        "redis"
                ));

        skillAliases.put("SQL",
                Arrays.asList(
                        "sql",
                        "structured query language"
                ));

        // =========================
        // AI / ML
        // =========================

        skillAliases.put("Artificial Intelligence",
                Arrays.asList(
                        "artificial intelligence",
                        "ai"
                ));

        skillAliases.put("Machine Learning",
                Arrays.asList(
                        "machine learning",
                        "machine-learning",
                        "machine learning algorithms",
                        "ml"
                ));

        skillAliases.put("Deep Learning",
                Arrays.asList(
                        "deep learning",
                        "deep-learning",
                        "dl"
                ));

        skillAliases.put("Natural Language Processing",
                Arrays.asList(
                        "natural language processing",
                        "nlp"
                ));

        skillAliases.put("Computer Vision",
                Arrays.asList(
                        "computer vision",
                        "cv"
                ));

        skillAliases.put("Generative AI",
                Arrays.asList(
                        "generative ai",
                        "generative artificial intelligence",
                        "genai",
                        "gen ai"
                ));

        // =========================
        // ML Libraries / Frameworks
        // =========================

        skillAliases.put("TensorFlow",
                Arrays.asList(
                        "tensorflow"
                ));

        skillAliases.put("PyTorch",
                Arrays.asList(
                        "pytorch"
                ));

        skillAliases.put("Scikit-learn",
                Arrays.asList(
                        "scikit-learn",
                        "scikit learn",
                        "sklearn"
                ));

        skillAliases.put("Keras",
                Arrays.asList(
                        "keras"
                ));

        skillAliases.put("Pandas",
                Arrays.asList(
                        "pandas"
                ));

        skillAliases.put("NumPy",
                Arrays.asList(
                        "numpy"
                ));

        // =========================
        // Frontend
        // =========================

        skillAliases.put("React",
                Arrays.asList(
                        "react",
                        "react.js",
                        "reactjs"
                ));

        skillAliases.put("Angular",
                Arrays.asList(
                        "angular",
                        "angular.js"
                ));

        skillAliases.put("Vue.js",
                Arrays.asList(
                        "vue",
                        "vue.js",
                        "vuejs"
                ));

        skillAliases.put("HTML",
                Arrays.asList(
                        "html",
                        "html5"
                ));

        skillAliases.put("CSS",
                Arrays.asList(
                        "css",
                        "css3"
                ));

        // =========================
        // Cloud / DevOps
        // =========================

        skillAliases.put("AWS",
                Arrays.asList(
                        "aws",
                        "amazon web services"
                ));

        skillAliases.put("Azure",
                Arrays.asList(
                        "azure",
                        "microsoft azure"
                ));

        skillAliases.put("Google Cloud",
                Arrays.asList(
                        "google cloud",
                        "gcp",
                        "google cloud platform"
                ));

        skillAliases.put("Docker",
                Arrays.asList(
                        "docker"
                ));

        skillAliases.put("Kubernetes",
                Arrays.asList(
                        "kubernetes",
                        "k8s"
                ));

        skillAliases.put("Jenkins",
                Arrays.asList(
                        "jenkins"
                ));

        // =========================
        // Development Tools
        // =========================

        skillAliases.put("Git",
                Arrays.asList(
                        "git"
                ));

        skillAliases.put("GitHub",
                Arrays.asList(
                        "github",
                        "git hub"
                ));

        skillAliases.put("Maven",
                Arrays.asList(
                        "maven"
                ));

        skillAliases.put("Gradle",
                Arrays.asList(
                        "gradle"
                ));

        // =========================
        // Data / Analytics
        // =========================

        skillAliases.put("Data Science",
                Arrays.asList(
                        "data science",
                        "data scientist"
                ));

        skillAliases.put("Data Analysis",
                Arrays.asList(
                        "data analysis",
                        "data analytics"
                ));

        skillAliases.put("Power BI",
                Arrays.asList(
                        "power bi",
                        "powerbi"
                ));

        skillAliases.put("Tableau",
                Arrays.asList(
                        "tableau"
                ));
    }


    public JobMatchResponse matchResume(
            String resumeText,
            String jobDescription) {

        if (resumeText == null) {
            resumeText = "";
        }

        if (jobDescription == null) {
            jobDescription = "";
        }

        String resume = normalize(resumeText);
        String job = normalize(jobDescription);

        List<String> requiredSkills = new ArrayList<>();

        /*
         * First find which skills are actually mentioned
         * in THIS particular job description.
         */
        for (Map.Entry<String, List<String>> entry
                : skillAliases.entrySet()) {

            if (containsSkill(job, entry.getValue())) {

                requiredSkills.add(entry.getKey());
            }
        }

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        /*
         * Compare the resume against the skills
         * found in the job description.
         */
        for (String skill : requiredSkills) {

            List<String> aliases =
                    skillAliases.get(skill);

            if (containsSkill(resume, aliases)) {

                matched.add(skill);

            } else {

                missing.add(skill);
            }
        }

        /*
         * If the job description contains no recognized
         * technical skills, don't return a misleading 0%.
         */
        int percentage;

        if (requiredSkills.isEmpty()) {

            percentage = 0;

        } else {

            percentage =
                    (matched.size() * 100)
                            / requiredSkills.size();
        }

        String recommendation;

        if (requiredSkills.isEmpty()) {

            recommendation =
                    "No recognized skills were found in the job description.";

        } else if (missing.isEmpty()) {

            recommendation =
                    "Excellent match. The resume contains all recognized job skills.";

        } else if (percentage >= 75) {

            recommendation =
                    "Strong match. Consider adding: "
                            + String.join(", ", missing);

        } else if (percentage >= 50) {

            recommendation =
                    "Moderate match. Improve the resume with: "
                            + String.join(", ", missing);

        } else {

            recommendation =
                    "Low skill match. Missing: "
                            + String.join(", ", missing);
        }

        return JobMatchResponse.builder()
                .matchPercentage(percentage)
                .matchedSkills(
                        String.join(", ", matched)
                )
                .missingSkills(
                        String.join(", ", missing)
                )
                .recommendation(recommendation)
                .build();
    }


    /*
     * Normalize text before matching.
     */
    private String normalize(String text) {

        return text
                .toLowerCase()
                .replaceAll("[\\r\\n\\t]+", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }


    /*
     * Checks whether at least one alias exists
     * in the provided text.
     */
    private boolean containsSkill(
            String text,
            List<String> aliases) {

        for (String alias : aliases) {

            if (containsWholeSkill(text, alias)) {
                return true;
            }
        }

        return false;
    }


    /*
     * Whole-word style matching.
     *
     * This prevents mistakes such as:
     *
     * Java -> accidentally matching JavaScript
     */
    private boolean containsWholeSkill(
            String text,
            String skill) {

        String normalizedSkill =
                normalize(skill);

        String pattern =
                "(^|[^a-z0-9+#])"
                        + java.util.regex.Pattern.quote(normalizedSkill)
                        + "([^a-z0-9+#]|$)";

        return text.matches(".*" + pattern + ".*");
    }
}