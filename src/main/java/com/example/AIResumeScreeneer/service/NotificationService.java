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

    public Notification createNotification(
            String title,
            String detail,
            String type) {

        System.out.println("===== CREATE NOTIFICATION CALLED =====");
        System.out.println("Title: " + title);
        System.out.println("Detail: " + detail);
        System.out.println("Type: " + type);

        Notification notification =
                Notification.builder()
                        .title(title)
                        .detail(detail)
                        .type(type)
                        .read(false)
                        .createdAt(LocalDateTime.now())
                        .build();

        Notification saved =
                notificationRepository.save(notification);

        System.out.println("===== NOTIFICATION SAVED =====");
        System.out.println("Notification ID: " + saved.getId());

        messagingTemplate.convertAndSend(
                "/topic/notifications",
                saved
        );

        System.out.println("===== NOTIFICATION SENT =====");

        return saved;
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository
                .findAllByOrderByCreatedAtDesc();
    }

    public List<Notification> getUnreadNotifications() {
        return notificationRepository
                .findByReadFalseOrderByCreatedAtDesc();
    }

    public void markAllAsRead() {

        List<Notification> notifications =
                notificationRepository
                        .findByReadFalseOrderByCreatedAtDesc();

        for (Notification notification : notifications) {
            notification.setRead(true);
        }

        notificationRepository.saveAll(notifications);
    }
}