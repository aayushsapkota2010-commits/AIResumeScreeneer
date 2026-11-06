package com.example.AIResumeScreeneer.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    /*
     * Email delivery is intentionally asynchronous.
     *
     * SMTP providers (especially on cloud hosts) can take many seconds or
     * time out, and the recruiter should never have to wait for that while
     * scheduling an interview. Failures are logged but never propagate to
     * the caller, so the interview is still saved successfully.
     */
    @Async
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

        try {

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

        } catch (Exception error) {

            log.error(
                    "Failed to send interview invitation to {}: {}",
                    to,
                    error.getMessage()
            );
        }
    }

    @Async
    public void sendStatusUpdateEmail(

        String to,

        String status

) {

    try {

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

    } catch (Exception error) {

        log.error(
                "Failed to send status update email to {}: {}",
                to,
                error.getMessage()
        );
    }
}
}
