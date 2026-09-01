package com.example.AIResumeScreeneer.service;

import com.example.AIResumeScreeneer.dto.JobRequest;
import com.example.AIResumeScreeneer.dto.JobResponse;
import com.example.AIResumeScreeneer.entity.Job;
import com.example.AIResumeScreeneer.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;

    public JobResponse create(JobRequest request) {

        Job job = Job.builder()
                .title(request.getTitle())
                .company(request.getCompany())
                .location(request.getLocation())
                .employmentType(request.getEmploymentType())
                .experience(request.getExperience())
                .salary(request.getSalary())
                .description(request.getDescription())
                .requiredSkills(request.getRequiredSkills())
                .build();

        jobRepository.save(job);

        return map(job);
    }

    public List<JobResponse> getAll() {

        return jobRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    private JobResponse map(Job job) {

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(job.getCompany())
                .location(job.getLocation())
                .employmentType(job.getEmploymentType())
                .experience(job.getExperience())
                .salary(job.getSalary())
                .description(job.getDescription())
                .requiredSkills(job.getRequiredSkills())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
    public JobResponse update(Long id, JobRequest request) {

    Job job = jobRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Job not found"));

    job.setTitle(request.getTitle());
    job.setCompany(request.getCompany());
    job.setLocation(request.getLocation());
    job.setEmploymentType(request.getEmploymentType());
    job.setExperience(request.getExperience());
    job.setSalary(request.getSalary());
    job.setDescription(request.getDescription());
    job.setRequiredSkills(request.getRequiredSkills());

    jobRepository.save(job);

    return map(job);
}

public void delete(Long id) {

    jobRepository.deleteById(id);

}
public JobResponse closeJob(Long id) {

    Job job = jobRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Job not found"));

    job.setStatus("CLOSED");

    jobRepository.save(job);

    return map(job);
}

public JobResponse reopenJob(Long id) {

    Job job = jobRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Job not found"));

    job.setStatus("ACTIVE");

    jobRepository.save(job);

    return map(job);
}
}