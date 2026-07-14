package com.example.AIResumeScreeneer.dto;

import lombok.Data;

@Data
public class ResumeChatRequest {

    private String resumeText;

    private String question;
}