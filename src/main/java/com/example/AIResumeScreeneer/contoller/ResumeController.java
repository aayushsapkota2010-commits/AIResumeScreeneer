package com.example.AIResumeScreeneer.contoller;

import java.io.IOException;
import java.util.List;

import org.apache.tika.exception.TikaException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
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
import lombok.RequiredArgsConstructor;
import com.example.AIResumeScreeneer.service.DashboardService;
import com.example.AIResumeScreeneer.service.EmailService;
import com.example.AIResumeScreeneer.service.InterviewEvaluationService;
import com.example.AIResumeScreeneer.service.PdfReportService;
import com.example.AIResumeScreeneer.service.PipelineService;
import com.example.AIResumeScreeneer.service.ResumeFilterService;

import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import com.example.AIResumeScreeneer.dto.RecruiterAnalyticsResponse;
import com.example.AIResumeScreeneer.dto.RecruiterDashboardChartResponse;
import com.example.AIResumeScreeneer.dto.RoadmapResponse;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.core.io.Resource;



@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final ResumeRepository resumeRepository;
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
    public Resume getResume(
            @PathVariable Long id) {

        return resumeRepository
                .findById(id)
                .orElseThrow();
    }
    @GetMapping("/all")
public List<Resume> getAllResumes() {
    return resumeRepository.findAll();
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
                    request.getStatus());

    resume.setStatus(status);

    Resume updatedResume =
            resumeRepository.save(resume);

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

    notificationService.createNotification(
            "Candidate status updated",
            resume.getFileName()
                    + " moved from "
                    + (oldStatus != null
                            ? oldStatus.name()
                            : "NEW")
                    + " to "
                    + status.name(),
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

@GetMapping("/pipeline")
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

@GetMapping("/view/{id}")
public ResponseEntity<Resource> viewResume(
        @PathVariable Long id)
        throws Exception {

    Resume resume =
            resumeRepository
                    .findById(id)
                    .orElseThrow();

    Path path =
            Paths.get(
                    resume.getFilePath());

    Resource resource =
            new UrlResource(
                    path.toUri());

    return ResponseEntity.ok()
            .contentType(
                    MediaType.APPLICATION_PDF)
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
public CandidateDashboardResponse
candidateDashboard(

        @RequestParam String email) {

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

    System.out.println("========== EXTRACTED TEXT ==========");
    System.out.println(resume.getExtractedText());
    System.out.println("===================================");

    return resumeChatService.askQuestion(

            resume.getExtractedText(),

            request.getQuestion()
    );
}

}