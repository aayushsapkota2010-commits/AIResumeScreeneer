package com.example.AIResumeScreeneer.contoller;

import java.io.IOException;
import java.util.List;

import org.apache.tika.exception.TikaException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.xml.sax.SAXException;

import com.example.AIResumeScreeneer.service.AIInterviewService;
import com.example.AIResumeScreeneer.service.AIResumeAnalysisService;
import com.example.AIResumeScreeneer.service.ActivityLogService;
import com.example.AIResumeScreeneer.service.CandidateDashboardService;
import com.example.AIResumeScreeneer.service.CareerRoadmapService;
import com.example.AIResumeScreeneer.service.CoverLetterService;
import com.example.AIResumeScreeneer.service.JobMatchingService;
import com.example.AIResumeScreeneer.service.JobRankingService;
import com.example.AIResumeScreeneer.service.JobRecommendationService;
import com.example.AIResumeScreeneer.service.KanbanService;
import com.example.AIResumeScreeneer.service.KeywordGapService;
import com.example.AIResumeScreeneer.service.MockInterviewService;
import com.example.AIResumeScreeneer.service.NotificationService;
import com.example.AIResumeScreeneer.service.RankingService;
import com.example.AIResumeScreeneer.service.RecruiterAnalyticsService;
import com.example.AIResumeScreeneer.service.RecruiterDashboardService;
import com.example.AIResumeScreeneer.service.RecruiterNoteService;
import com.example.AIResumeScreeneer.service.ResumeAnalysisService;
import com.example.AIResumeScreeneer.service.ResumeChatService;
import com.example.AIResumeScreeneer.service.ResumeImprovementService;
import com.example.AIResumeScreeneer.service.ResumeSearchService;
import com.example.AIResumeScreeneer.service.ResumeService;
import com.example.AIResumeScreeneer.repository.ResumeFileRepository;
import com.example.AIResumeScreeneer.repository.ResumeRepository;
import com.example.AIResumeScreeneer.dto.AIAnalysisResponse;
import com.example.AIResumeScreeneer.dto.CandidateDashboardResponse;
import com.example.AIResumeScreeneer.dto.CoverLetterResponse;
import com.example.AIResumeScreeneer.dto.DashboardResponse;
import com.example.AIResumeScreeneer.dto.InterviewEvaluationRequest;
import com.example.AIResumeScreeneer.dto.InterviewEvaluationResponse;
import com.example.AIResumeScreeneer.dto.InterviewInviteRequest;
import com.example.AIResumeScreeneer.dto.InterviewQuestionResponse;
import com.example.AIResumeScreeneer.dto.JobDescriptionRequest;
import com.example.AIResumeScreeneer.dto.JobMatchResponse;
import com.example.AIResumeScreeneer.dto.JobRankingResponse;
import com.example.AIResumeScreeneer.dto.JobRecommendationResponse;
import com.example.AIResumeScreeneer.dto.KanbanResponse;
import com.example.AIResumeScreeneer.dto.KeywordGapResponse;
import com.example.AIResumeScreeneer.dto.MockInterviewResponse;
import com.example.AIResumeScreeneer.dto.MultiJobRequest;
import com.example.AIResumeScreeneer.dto.PipelineResponse;
import com.example.AIResumeScreeneer.dto.RecruiterNoteRequest;
import com.example.AIResumeScreeneer.dto.ResumeAnalysisResponse;
import com.example.AIResumeScreeneer.dto.ResumeChatRequest;
import com.example.AIResumeScreeneer.dto.ResumeChatResponse;
import com.example.AIResumeScreeneer.dto.ResumeImprovementResponse;
import com.example.AIResumeScreeneer.dto.ResumeRankingResponse;
import com.example.AIResumeScreeneer.dto.ResumeSearchResponse;
import com.example.AIResumeScreeneer.dto.StatusUpdateRequest;
import com.example.AIResumeScreeneer.entity.ActivityLog;
import com.example.AIResumeScreeneer.entity.CandidateStatus;
import com.example.AIResumeScreeneer.entity.RecruiterNote;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.entity.ResumeFile;
import lombok.RequiredArgsConstructor;
import com.example.AIResumeScreeneer.service.DashboardService;
import com.example.AIResumeScreeneer.service.EmailService;
import com.example.AIResumeScreeneer.service.InterviewEvaluationService;
import com.example.AIResumeScreeneer.service.PdfReportService;
import com.example.AIResumeScreeneer.service.PipelineService;
import com.example.AIResumeScreeneer.service.ResumeFilterService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import com.example.AIResumeScreeneer.dto.RecruiterAnalyticsResponse;
import com.example.AIResumeScreeneer.dto.RecruiterDashboardChartResponse;
import com.example.AIResumeScreeneer.dto.RoadmapResponse;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import org.springframework.core.io.Resource;

import com.example.AIResumeScreeneer.entity.ApplicationStatus;
import com.example.AIResumeScreeneer.service.ApplicationService;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;



@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final ApplicationService applicationService;
    private final ResumeRepository resumeRepository;
    private final ResumeFileRepository resumeFileRepository;
    private final ResumeAnalysisService resumeAnalysisService;
    private final JobMatchingService jobMatchingService;
    private final KeywordGapService keywordGapService;
    private final ResumeImprovementService resumeImprovementService;
    private final JobRankingService jobRankingService;
    private final AIInterviewService aiInterviewService;
    private final AIResumeAnalysisService aiResumeAnalysisService;
    private final RankingService rankingService;
    private final DashboardService dashboardService;
    private final PdfReportService pdfReportService;
    private final CoverLetterService coverLetterService;
    private final MockInterviewService mockInterviewService;
    private final InterviewEvaluationService interviewEvaluationService;
    private final PipelineService pipelineService;
    private final JobRecommendationService jobRecommendationService;
    private final RecruiterNoteService recruiterNoteService;
    private final ResumeSearchService resumeSearchService;
    private final ResumeFilterService resumeFilterService;
    private final RecruiterAnalyticsService recruiterAnalyticsService;
    private final CareerRoadmapService careerRoadmapService;
    private final EmailService emailService;
    private final ActivityLogService activityLogService;
    private final RecruiterDashboardService recruiterDashboardService;
    private final CandidateDashboardService  candidateDashboardService;
        private final KanbanService kanbanService;
        private final ResumeChatService resumeChatService;
        private final NotificationService notificationService;

    @Value("${app.upload.dir:}")
    private String configuredUploadDir;

  @PostMapping("/upload")
public String uploadResume(
        @RequestParam("file") MultipartFile file,
        @RequestParam("candidateEmail") String candidateEmail)
        throws IOException,TikaException,SAXException {

    return resumeService.uploadResume(
            file,
            candidateEmail
    );
}

@DeleteMapping("/{id}")
public ResponseEntity<String> deleteResume(
        @PathVariable Long id) {

    try {

        resumeService.deleteResume(id);

        return ResponseEntity.ok(
                "Resume deleted successfully"
        );

    } catch (IOException e) {

        return ResponseEntity.internalServerError()
                .body("Failed to delete resume file");

    } catch (RuntimeException e) {

        return ResponseEntity.notFound()
                .build();
    }
}

@GetMapping("/{id}")
public Resume getResume(@PathVariable Long id) {
    Resume resume = resumeRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Resume not found"));

    if (resume.isDeleted()) {
        throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Resume not found");
    }

    return resume;
}


@GetMapping("/all")
public List<Resume> getAllResumes() {
    return resumeRepository.findByDeletedFalse();
}


@GetMapping("/analyze/{id}")
public ResumeAnalysisResponse analyzeResume(
        @PathVariable Long id) {

    var resume =
            resumeRepository.findById(id)
                    .orElseThrow();

    return resumeAnalysisService
            .analyze(resume.getExtractedText());
}

@PostMapping("/match/{id}")
public JobMatchResponse matchResume(
        @PathVariable Long id,
        @RequestBody JobDescriptionRequest request) {

    Resume resume =
            resumeRepository.findById(id)
                    .orElseThrow();

    JobMatchResponse response =
            jobMatchingService.matchResume(
                    resume.getExtractedText(),
                    request.getJobDescription());

    resume.setJobDescription(
            request.getJobDescription());

    resume.setMatchScore(
            response.getMatchPercentage());

    resumeRepository.save(resume);

    return response;
}

@PostMapping("/keywords/{id}")
public KeywordGapResponse analyzeKeywords(
        @PathVariable Long id,
        @RequestBody JobDescriptionRequest request) {

    Resume resume =
            resumeRepository.findById(id)
                    .orElseThrow();

    return keywordGapService.analyze(
            resume.getExtractedText(),
            request.getJobDescription());
}


@PostMapping("/improve/{id}")
public ResumeImprovementResponse improveResume(
        @PathVariable Long id,
        @RequestBody JobDescriptionRequest request) {

    Resume resume =
            resumeRepository.findById(id)
                    .orElseThrow();

    return resumeImprovementService.generate(
            resume.getExtractedText(),
            request.getJobDescription());
}

@PostMapping("/rank-jobs/{id}")
public List<JobRankingResponse> rankJobs(
        @PathVariable Long id,
        @RequestBody MultiJobRequest request) {

    Resume resume =
            resumeRepository.findById(id)
                    .orElseThrow();

    return jobRankingService.rankJobs(
            resume.getExtractedText(),
            request.getJobDescriptions());
}
@PostMapping("/interview/{id}")
public InterviewQuestionResponse generateInterviewQuestions(
        @PathVariable Long id) {

    Resume resume = resumeRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Resume not found"));

    return aiInterviewService.generateQuestions(
            resume.getExtractedText()
    );
}

@PostMapping("/ai-analysis/{id}")
public AIAnalysisResponse aiAnalysis(
        @PathVariable Long id,
        @RequestBody JobDescriptionRequest request) {

    Resume resume =
            resumeRepository.findById(id)
                    .orElseThrow();

    return aiResumeAnalysisService.analyze(
            resume.getExtractedText(),
            request.getJobDescription());
}

@GetMapping("/ranking")
public List<ResumeRankingResponse> getRanking() {

    return rankingService.getRanking();
}


@GetMapping("/dashboard")
public DashboardResponse getDashboard() {
            System.out.println("DASHBOARD API HIT");


    return dashboardService.getDashboard();
}


@GetMapping("/report/{id}")
public ResponseEntity<byte[]> generateReport(
        @PathVariable Long id) {

    Resume resume =
            resumeRepository.findById(id)
                    .orElseThrow();

    byte[] pdf =
            pdfReportService.generateReport(
                    resume);

    return ResponseEntity.ok()
            .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=resume-report.pdf")
            .contentType(
                    MediaType.APPLICATION_PDF)
            .body(pdf);
}


@PostMapping("/cover-letter/{id}")
public CoverLetterResponse generateCoverLetter(
        @PathVariable Long id,
        @RequestBody JobDescriptionRequest request) {

    Resume resume =
            resumeRepository.findById(id)
                    .orElseThrow();

    return coverLetterService.generate(
            resume.getExtractedText(),
            request.getJobDescription());
}
@PostMapping("/mock-interview/{id}")
public MockInterviewResponse generateMockInterview(
        @PathVariable Long id,
        @RequestBody JobDescriptionRequest request) {

    Resume resume =
            resumeRepository.findById(id)
                    .orElseThrow();

    return mockInterviewService.generate(
            resume.getExtractedText(),
            request.getJobDescription());
}


@PostMapping("/evaluate-answer")
public InterviewEvaluationResponse evaluateAnswer(
        @RequestBody InterviewEvaluationRequest request) {

    return interviewEvaluationService.evaluate(
            request.getQuestion(),
            request.getAnswer());
}



@PutMapping("/status/{id}")
public Resume updateStatus(
        @PathVariable Long id,
        @RequestBody StatusUpdateRequest request) {

    Resume resume =
            resumeRepository.findById(id)
                    .orElseThrow();

    CandidateStatus oldStatus =
            resume.getStatus();

 CandidateStatus status =
        CandidateStatus.valueOf(
                request.getStatus().trim().toUpperCase());

    resume.setStatus(status);

    Resume updatedResume =
            resumeRepository.save(resume);

            // ============================================================
// ALSO UPDATE LINKED APPLICATION STATUS
// SO PIPELINE BOARD STAYS IN SYNC
// ============================================================




try {
    ApplicationStatus applicationStatus =
            ApplicationStatus.valueOf(status.name());

    applicationService.updateStatusByResumeId(
            resume.getId(),
            applicationStatus
    );

} catch (IllegalArgumentException e) {
    System.out.println(
            "No matching ApplicationStatus for resume status: "
                    + status);
}


    activityLogService.saveLog(
            "aayush@gmail.com",
            "STATUS_CHANGED_TO_" + status,
            resume.getId(),
            resume.getFileName()
    );

    if (oldStatus != status) {

    System.out.println("=================================");
    System.out.println("CREATING NOTIFICATION");
    System.out.println("Old Status = " + oldStatus);
    System.out.println("New Status = " + status);
    System.out.println("Resume = " + resume.getFileName());
    System.out.println("=================================");

    notificationService.createCandidateNotification(
        resume.getCandidateEmail(),
        "Application status updated",
        "Your application has moved from "
                + (oldStatus != null
                        ? oldStatus.name()
                        : "NEW")
                + " to "
                + status.name()
                + ".",
        "STATUS_CHANGE"
);

} else {

    System.out.println("=================================");
    System.out.println("NO NOTIFICATION CREATED");
    System.out.println("Old Status = " + oldStatus);
    System.out.println("New Status = " + status);
    System.out.println("=================================");
}

    if (updatedResume.getCandidateEmail() != null) {

        emailService.sendStatusUpdateEmail(
                updatedResume.getCandidateEmail(),
                status.name()
        );
    }

    return updatedResume;
}

@GetMapping("/pipeline-stats")
public PipelineResponse getPipeline() {

    return pipelineService.getPipelineStats();
}


@GetMapping("/recommend-jobs/{id}")
public JobRecommendationResponse recommendJobs(
        @PathVariable Long id) {

    Resume resume =
            resumeRepository.findById(id)
                    .orElseThrow();

    return jobRecommendationService.recommend(
            resume.getExtractedText());
}

@PostMapping("/note/{id}")
public RecruiterNote addNote(
        @PathVariable Long id,
        @RequestBody RecruiterNoteRequest request) {

    return recruiterNoteService
            .saveNote(id, request);
}

@GetMapping("/note/{id}")
public List<RecruiterNote> getNotes(
        @PathVariable Long id) {

    return recruiterNoteService
            .getNotes(id);
}
@GetMapping("/search")
public List<ResumeSearchResponse> searchResume(
        @RequestParam String skill) {

    return resumeSearchService
            .searchBySkill(skill);
}

@GetMapping("/filter")
public List<ResumeSearchResponse> filterResumes(

        @RequestParam String skill,

        @RequestParam CandidateStatus status,

        @RequestParam Integer minAts) {

    return resumeFilterService.filter(
            skill,
            status,
            minAts);
}


@GetMapping("/analytics")
public RecruiterAnalyticsResponse analytics() {

    return recruiterAnalyticsService
            .getAnalytics();
}

@GetMapping("/roadmap/{id}")
public RoadmapResponse roadmap(
        @PathVariable Long id) {

    Resume resume =
            resumeRepository.findById(id)
                    .orElseThrow();

    return careerRoadmapService.generate(
            resume.getExtractedText());
}


private Path resolveResumePath(String filePath) {

    Path direct = Paths.get(filePath).toAbsolutePath().normalize();

    if (Files.exists(direct) && Files.isRegularFile(direct)) {
        return direct;
    }

    Path fileName = Paths.get(filePath).getFileName();

    if (fileName == null) {
        return direct;
    }

    String uploadDir =
            (configuredUploadDir != null && !configuredUploadDir.isBlank())
                    ? configuredUploadDir
                    : System.getProperty("user.home")
                            + java.io.File.separator
                            + "resume-uploads";

    Path fallback = Paths.get(uploadDir)
            .toAbsolutePath()
            .normalize()
            .resolve(fileName);

    return Files.exists(fallback) ? fallback : direct;
}

@GetMapping("/view/{id}")
public ResponseEntity<Resource> viewResume(
        @PathVariable Long id) {

    Resume resume = resumeRepository.findById(id)
            .orElseThrow(() ->
                    new ResponseStatusException(
                            NOT_FOUND, "Resume not found"));

    // 1. Prefer the file on disk when it still exists.
    String filePath = resume.getFilePath();

    if (filePath != null && !filePath.isBlank()) {

        Path path = resolveResumePath(filePath);

        if (Files.exists(path)
                && Files.isRegularFile(path)
                && Files.isReadable(path)) {

            return resumeFileResponse(
                    new FileSystemResource(path),
                    resume.getContentType(),
                    path.getFileName().toString());
        }
    }

    // 2. Fall back to the durable copy stored in the database. This keeps
    // resumes viewable even after a redeploy clears the container disk.
    ResumeFile storedFile = resumeFileRepository
            .findById(id)
            .orElse(null);

    if (storedFile != null
            && storedFile.getData() != null
            && storedFile.getData().length > 0) {

        String contentType = storedFile.getContentType() != null
                && !storedFile.getContentType().isBlank()
                        ? storedFile.getContentType()
                        : resume.getContentType();

        String fileName = storedFile.getFileName() != null
                && !storedFile.getFileName().isBlank()
                        ? storedFile.getFileName()
                        : resume.getFileName();

        return resumeFileResponse(
                new ByteArrayResource(storedFile.getData()),
                contentType,
                fileName);
    }

    // 3. Last resort for resumes uploaded before durable storage existed:
    // rebuild a readable PDF from the text that was extracted at upload.
    if (resume.getExtractedText() != null
            && !resume.getExtractedText().isBlank()) {

        String fileName = resume.getFileName() != null
                && !resume.getFileName().isBlank()
                        ? resume.getFileName()
                        : "resume.pdf";

        try {

            byte[] pdf = pdfReportService
                    .generateResumeContentPdf(resume);

            return resumeFileResponse(
                    new ByteArrayResource(pdf),
                    MediaType.APPLICATION_PDF_VALUE,
                    fileName);

        } catch (Exception error) {

            // If the PDF cannot be built (e.g. unsupported characters),
            // serve the recovered text instead of failing the request.
            return resumeFileResponse(
                    new ByteArrayResource(
                            resume.getExtractedText()
                                    .getBytes(java.nio.charset.StandardCharsets.UTF_8)),
                    MediaType.TEXT_PLAIN_VALUE,
                    fileName + ".txt");
        }
    }

    throw new ResponseStatusException(
            NOT_FOUND,
            "Resume file is no longer available on the server");
}

private ResponseEntity<Resource> resumeFileResponse(
        Resource resource,
        String contentType,
        String fileName) {

    MediaType mediaType = MediaType.APPLICATION_PDF;

    if (contentType != null && !contentType.isBlank()) {
        try {
            mediaType = MediaType.parseMediaType(contentType);
        } catch (Exception ignored) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }
    }

    String safeFileName =
            (fileName == null || fileName.isBlank())
                    ? "resume"
                    : fileName.replace("\"", "");

    return ResponseEntity.ok()
            .contentType(mediaType)
            .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "inline; filename=\"" + safeFileName + "\"")
            .body(resource);
}

@PostMapping("/interview-invite/{id}")
public String sendInterviewInvite(
        @PathVariable Long id,
        @RequestBody InterviewInviteRequest request) {

    Resume resume =
            resumeRepository
                    .findById(id)
                    .orElseThrow();

    emailService.sendInterviewInvitation(
            resume.getCandidateEmail(),
            resume.getCandidateEmail().split("@")[0],
            request.getInterviewer(),
            request.getInterviewDate(),
            request.getInterviewTime(),
            request.getMode(),
            request.getMeetingLink(),
            request.getLocation()
    );

    notificationService.createNotification(
            "Interview invite sent",
            "Interview invitation sent for "
                    + resume.getFileName(),
            "INTERVIEW_INVITE"
    );

    return "Interview Invite Sent";
}

@GetMapping("/timeline/{id}")
public List<ActivityLog> getTimeline(
        @PathVariable Long id) {

    return activityLogService.getLogs(id);
}

@GetMapping("/dashboard-chart")
public RecruiterDashboardChartResponse dashboardChart() {
            System.out.println("DASHBOARD CHART API HIT");


    return recruiterDashboardService.getChartData();
}

@GetMapping("/activity-logs")
public List<ActivityLog> getLogs() {

    return activityLogService.getLogs();
}


@GetMapping("/candidate-dashboard")
public CandidateDashboardResponse candidateDashboard(
        Principal principal) {

    String email = principal.getName();

    return candidateDashboardService
            .getDashboard(email);
}

@GetMapping("/kanban")
public KanbanResponse getKanbanBoard() {

    return kanbanService.getBoard();
}


@PostMapping("/chat/{id}")
public ResumeChatResponse chat(

        @PathVariable Long id,

        @RequestBody ResumeChatRequest request) {
                    System.out.println("CHAT API HIT");


    Resume resume =
            resumeRepository
                    .findById(id)
                    .orElseThrow();



    return resumeChatService.askQuestion(

            resume.getExtractedText(),

            request.getQuestion()
    );
}

// ============================================================
// USER - GET MY RESUMES
// ============================================================


@GetMapping("/my")
public List<Resume> getMyResumes(Principal principal) {

    String email = principal.getName();

    return resumeRepository
            .findByCandidateEmailAndDeletedFalseOrderByUploadedAtDesc(
                    email);
}



// ============================================================
// USER - UPLOAD MY RESUME
// ============================================================

@PostMapping("/my-upload")
public String uploadMyResume(
        @RequestParam("file") MultipartFile file,
        Principal principal)
        throws IOException, TikaException, SAXException {

    String email = principal.getName();

    return resumeService.uploadResume(
            file,
            email
    );
}


// ============================================================
// USER - DELETE MY RESUME
// ============================================================

@DeleteMapping("/my/{id}")
public ResponseEntity<String> deleteMyResume(
        @PathVariable Long id,
        Principal principal) {

    try {

        String email = principal.getName();

        resumeService.deleteOwnResume(
                id,
                email
        );

        return ResponseEntity.ok(
                "Resume deleted successfully"
        );

    } catch (RuntimeException e) {

        return ResponseEntity
                .status(404)
                .body(e.getMessage());

    } catch (IOException e) {

        return ResponseEntity
                .internalServerError()
                .body("Failed to delete resume file");
    }
}

}