package com.example.AIResumeScreeneer.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.RecruiterNoteRequest;
import com.example.AIResumeScreeneer.entity.RecruiterNote;
import com.example.AIResumeScreeneer.repository.RecruiterNoteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecruiterNoteService {

    private final RecruiterNoteRepository recruiterNoteRepository;

    public RecruiterNote saveNote(
            Long resumeId,
            RecruiterNoteRequest request) {

        RecruiterNote note =
                RecruiterNote.builder()
                        .resumeId(resumeId)
                        .note(request.getNote())
                        .createdAt(LocalDateTime.now())
                        .build();

        return recruiterNoteRepository.save(note);
    }

    public List<RecruiterNote> getNotes(
            Long resumeId) {

        return recruiterNoteRepository
                .findByResumeId(resumeId);
    }
}