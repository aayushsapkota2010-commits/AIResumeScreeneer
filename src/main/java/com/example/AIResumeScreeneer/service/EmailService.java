package com.example.AIResumeScreeneer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendInterviewInvitation(

            String to,

            String candidateName,

            String interviewer,

            String date,

            String time,

            String mode,

            String meetingLink,

            String location

    ) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);

        message.setSubject("Interview Invitation - AI Resume Screener");

        String body = """

Hello %s,

Congratulations!

Your profile has been shortlisted.

Your interview has been scheduled.

-----------------------------------------

Date : %s

Time : %s

Mode : %s

Interviewer : %s

Meeting Link : %s

Location : %s

-----------------------------------------

Please join 10 minutes before the scheduled time.

Best of luck!

Regards,
AI Resume Screener Team
"""
.formatted(
        candidateName,
        date,
        time,
        mode,
        interviewer,
        meetingLink == null ? "-" : meetingLink,
        location == null ? "-" : location
);

        message.setText(body);

        mailSender.send(message);
    }
    public void sendStatusUpdateEmail(

        String to,

        String status

) {

    SimpleMailMessage message = new SimpleMailMessage();

    message.setTo(to);

    message.setSubject("Application Status Updated");

    message.setText("""

Hello,

Your application status has been updated.

Current Status:

%s

Regards,
AI Resume Screener Team

""".formatted(status));

    mailSender.send(message);

}
}