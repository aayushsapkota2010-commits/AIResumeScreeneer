package com.example.AIResumeScreeneer.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.AIResumeScreeneer.entity.ResumeFile;

public interface ResumeFileRepository
        extends JpaRepository<ResumeFile, Long> {
}
