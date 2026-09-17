package com.example.AIResumeScreeneer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.AIResumeScreeneer.entity.RecruiterNote;

public interface RecruiterNoteRepository
        extends JpaRepository<RecruiterNote, Long> {

    List<RecruiterNote> findByResumeId(Long resumeId);
    void deleteByResumeId(Long resumeId);
}