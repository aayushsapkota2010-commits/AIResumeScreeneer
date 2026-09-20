package com.example.AIResumeScreeneer.repository;

import com.example.AIResumeScreeneer.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByStatusOrderByCreatedAtDesc(String status);

    List<Job> findAllByOrderByCreatedAtDesc();
}