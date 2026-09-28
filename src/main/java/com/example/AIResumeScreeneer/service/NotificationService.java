package com.example.AIResumeScreeneer.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.entity.Notification;
import com.example.AIResumeScreeneer.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    private final SimpMessagingTemplate messagingTemplate;


    // ============================================================
    // ADMIN / RECRUITER NOTIFICATION
    // ============================================================

    public Notification createNotification(
            String title,
            String detail,
            String type) {

        System.out.println(
                "===== CREATE GLOBAL NOTIFICATION ====="
        );

        System.out.println("Title: " + title);
        System.out.println("Detail: " + detail);
        System.out.println("Type: " + type);
        

        Notification notification =
                Notification.builder()
                        .title(title)
                        .detail(detail)
                        .type(type)
                        .recipientEmail(null)
                        .read(false)
                        .createdAt(LocalDateTime.now())
                        .build();

        Notification saved =
                notificationRepository.save(notification);

        System.out.println(
                "Notification ID: "
                        + saved.getId()
        );
        
        System.out.println("SENDING GLOBAL WEBSOCKET NOTIFICATION TO: /topic/notifications");

messagingTemplate.convertAndSend(
        "/topic/notifications",
        saved
);
        // Send to admin/recruiter real-time channel
        messagingTemplate.convertAndSend(
                "/topic/notifications",
                saved
        );

        return saved;
    }


    // ============================================================
    // CANDIDATE NOTIFICATION
    // ============================================================

    public Notification createCandidateNotification(
            String recipientEmail,
            String title,
            String detail,
            String type) {

        System.out.println(
                "===== CREATE CANDIDATE NOTIFICATION ====="
        );

        System.out.println("Recipient: " + recipientEmail);
        System.out.println("Title: " + title);
        System.out.println("Detail: " + detail);
        System.out.println("Type: " + type);

        Notification notification =
                Notification.builder()
                        .title(title)
                        .detail(detail)
                        .type(type)
                        .recipientEmail(recipientEmail)
                        .read(false)
                        .createdAt(LocalDateTime.now())
                        .build();

        Notification saved =
                notificationRepository.save(notification);

        System.out.println(
                "Candidate notification ID: "
                        + saved.getId()
        );

        /*
         * Candidate-specific WebSocket destination.
         *
         * Example:
         * /topic/notifications/candidate/candidate@gmail.com
         */
        messagingTemplate.convertAndSend(
                "/topic/notifications/candidate/"
                        + recipientEmail,
                saved
        );

        return saved;
    }


    // ============================================================
    // ALL GLOBAL NOTIFICATIONS
    // Used mainly by ADMIN
    // ============================================================

   public List<Notification> getAllNotifications() {
    return notificationRepository
            .findByRecipientEmailIsNullOrderByCreatedAtDesc();
}


    // ============================================================
    // ALL NOTIFICATIONS FOR A CANDIDATE
    // ============================================================

    public List<Notification> getCandidateNotifications(
            String recipientEmail) {

        return notificationRepository
                .findByRecipientEmailOrderByCreatedAtDesc(
                        recipientEmail
                );
    }


    // ============================================================
    // UNREAD GLOBAL NOTIFICATIONS
    // ============================================================

    public List<Notification> getUnreadNotifications() {
    return notificationRepository
            .findByRecipientEmailIsNullAndReadFalseOrderByCreatedAtDesc();
}


    // ============================================================
    // UNREAD CANDIDATE NOTIFICATIONS
    // ============================================================

    public List<Notification> getUnreadCandidateNotifications(
            String recipientEmail) {

        return notificationRepository
                .findByRecipientEmailAndReadFalseOrderByCreatedAtDesc(
                        recipientEmail
                );
    }


    // ============================================================
    // MARK ALL GLOBAL NOTIFICATIONS AS READ
    // ============================================================

    public void markAllAsRead() {

    List<Notification> notifications =
            notificationRepository
                    .findByRecipientEmailIsNullAndReadFalseOrderByCreatedAtDesc();

    for (Notification notification : notifications) {
        notification.setRead(true);
    }

    notificationRepository.saveAll(notifications);
}


    // ============================================================
    // MARK CANDIDATE NOTIFICATIONS AS READ
    // ============================================================

    public void markCandidateNotificationsAsRead(
            String recipientEmail) {

        List<Notification> notifications =
                notificationRepository
                        .findByRecipientEmailAndReadFalseOrderByCreatedAtDesc(
                                recipientEmail
                        );

        for (Notification notification : notifications) {

            notification.setRead(true);
        }

        notificationRepository.saveAll(
                notifications
        );
    }
}