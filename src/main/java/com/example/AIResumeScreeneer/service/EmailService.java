package com.example.AIResumeScreeneer.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

   public void sendInterviewInvitation(

        String email,
        String interviewDate,
        String interviewTime,
        String meetingLink) {

    SimpleMailMessage message =
            new SimpleMailMessage();

    message.setTo(email);

    message.setSubject(
            "Interview Invitation");

    message.setText(

            "Congratulations!\n\n" +

            "You have been shortlisted for the interview round.\n\n" +

            "Interview Date: "
                    + interviewDate +

            "\nInterview Time: "
                    + interviewTime +

            "\nMeeting Link: "
                    + meetingLink +

            "\n\nBest Regards\nRecruitment Team"
    );

    mailSender.send(message);
}


    public void sendStatusUpdateEmail(
        String to,
        String status) {

    SimpleMailMessage message =
            new SimpleMailMessage();

    message.setTo(to);

    message.setSubject(
            "Application Status Updated");

   message.setText(
        "Hello,\n\n" +
        "Your application status has been updated.\n\n" +
        "Current Status: " + status + "\n\n" +
        "Thank you for applying.\n\n" +
        "Regards,\nAI Resume Screener Team"
);

    mailSender.send(message);
}
}