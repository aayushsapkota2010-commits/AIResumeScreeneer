package com.example.AIResumeScreeneer.service;

import com.example.AIResumeScreeneer.entity.Job;
import com.example.AIResumeScreeneer.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;

    // ==============================
    // ADMIN - CREATE JOB
    // ==============================

    public Job createJob(Job job) {

        job.setStatus(
                job.getStatus() == null || job.getStatus().isBlank()
                        ? "OPEN"
                        : job.getStatus().toUpperCase()
        );

        job.setCreatedAt(LocalDateTime.now());
        job.setUpdatedAt(LocalDateTime.now());

        return jobRepository.save(job);
    }

    // ==============================
    // GET ALL JOBS
    // ==============================

    public List<Job> getAllJobs() {
        return jobRepository.findAllByOrderByCreatedAtDesc();
    }

    // ==============================
    // GET OPEN JOBS
    // ==============================

    public List<Job> getOpenJobs() {
        return jobRepository.findByStatusOrderByCreatedAtDesc("OPEN");
    }

    // ==============================
    // GET JOB BY ID
    // ==============================

    public Job getJobById(Long id) {

        return jobRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job not found with id: " + id)
                );
    }

    // ==============================
    // UPDATE JOB
    // ==============================

    public Job updateJob(Long id, Job updatedJob) {

        Job existingJob = getJobById(id);

        existingJob.setTitle(updatedJob.getTitle());
        existingJob.setDescription(updatedJob.getDescription());
        existingJob.setCompany(updatedJob.getCompany());
        existingJob.setLocation(updatedJob.getLocation());
        existingJob.setEmploymentType(updatedJob.getEmploymentType());
        existingJob.setExperience(updatedJob.getExperience());
        existingJob.setSalary(updatedJob.getSalary());
        existingJob.setDeadline(updatedJob.getDeadline());

        if (updatedJob.getStatus() != null &&
                !updatedJob.getStatus().isBlank()) {

            existingJob.setStatus(
                    updatedJob.getStatus().toUpperCase()
            );
        }

        existingJob.setUpdatedAt(LocalDateTime.now());

        return jobRepository.save(existingJob);
    }

    // ==============================
    // DELETE JOB
    // ==============================

    public void deleteJob(Long id) {

        if (!jobRepository.existsById(id)) {
            throw new RuntimeException("Job not found with id: " + id);
        }

        jobRepository.deleteById(id);
    }
}