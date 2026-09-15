package com.example.AIResumeScreeneer.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.example.AIResumeScreeneer.entity.Notification;
import com.example.AIResumeScreeneer.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    private final Map<String, SseEmitter> emitters =
            new ConcurrentHashMap<>();

    public List<Notification> getNotifications(
            String email) {

        return notificationRepository
                .findByRecipientEmailOrderByCreatedAtDesc(email);
    }

    public List<Notification> getUnreadNotifications(
            String email) {

        return notificationRepository
                .findByRecipientEmailAndReadFalseOrderByCreatedAtDesc(
                        email
                );
    }

    public long getUnreadCount(String email) {

        return notificationRepository
                .countByRecipientEmailAndReadFalse(email);
    }

    public Notification createNotification(
            String recipientEmail,
            String title,
            String message,
            String type,
            Long resumeId) {

        Notification notification =
                Notification.builder()
                        .title(title)
                        .message(message)
                        .type(type)
                        .read(false)
                        .recipientEmail(recipientEmail)
                        .resumeId(resumeId)
                        .createdAt(LocalDateTime.now())
                        .build();

        Notification saved =
                notificationRepository.save(notification);

        sendLiveNotification(
                recipientEmail,
                saved
        );

        return saved;
    }

    public void markAllAsRead(String email) {

        List<Notification> notifications =
                notificationRepository
                        .findByRecipientEmailOrderByCreatedAtDesc(
                                email
                        );

        for (Notification notification : notifications) {
            notification.setRead(true);
        }

        notificationRepository.saveAll(notifications);
    }

    public void markAsRead(Long id) {

        notificationRepository.findById(id)
                .ifPresent(notification -> {
                    notification.setRead(true);
                    notificationRepository.save(notification);
                });
    }

    public SseEmitter subscribe(String email) {

        SseEmitter emitter =
                new SseEmitter(
                        30L * 60L * 1000L
                );

        SseEmitter oldEmitter =
                emitters.put(email, emitter);

        if (oldEmitter != null) {
            oldEmitter.complete();
        }

        emitter.onCompletion(
                () -> emitters.remove(email)
        );

        emitter.onTimeout(
                () -> emitters.remove(email)
        );

        emitter.onError(
                error -> emitters.remove(email)
        );

        try {
            emitter.send(
                    SseEmitter.event()
                            .name("connected")
                            .data("Notification connection established")
            );
        } catch (IOException e) {
            emitters.remove(email);
            emitter.completeWithError(e);
        }

        return emitter;
    }

    private void sendLiveNotification(
            String email,
            Notification notification) {

        SseEmitter emitter =
                emitters.get(email);

        if (emitter == null) {
            return;
        }

        try {

            emitter.send(
                    SseEmitter.event()
                            .name("notification")
                            .data(notification)
            );

        } catch (IOException e) {

            emitters.remove(email);

            emitter.completeWithError(e);
        }
    }
}