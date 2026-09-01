package com.example.AIResumeScreeneer.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InterviewInviteRequest {

    private String interviewDate;

    private String interviewTime;

    private String interviewer;

    private String mode;

    private String location;

    private String meetingLink;
}