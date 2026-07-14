package com.example.AIResumeScreeneer.dto;

import java.util.List;

import com.example.AIResumeScreeneer.entity.Resume;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KanbanResponse {

    private List<Resume> applied;

    private List<Resume> shortlisted;

    private List<Resume> interview;

    private List<Resume> selected;

    private List<Resume> rejected;
}