package com.example.AIResumeScreeneer.contoller;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.AIResumeScreeneer.entity.Notification;
import com.example.AIResumeScreeneer.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;


    // ============================================================
    // USER - MY NOTIFICATIONS
    // ============================================================

    @GetMapping
    public List<Notification> getNotifications(
            Principal principal) {

        return notificationService
                .getCandidateNotifications(
                        principal.getName()
                );
    }


    // ============================================================
    // USER - MY UNREAD NOTIFICATIONS
    // ============================================================

    @GetMapping("/unread")
    public List<Notification> getUnreadNotifications(
            Principal principal) {

        return notificationService
                .getUnreadCandidateNotifications(
                        principal.getName()
                );
    }


    // ============================================================
    // USER - MARK MY NOTIFICATIONS AS READ
    // ============================================================

    @PutMapping("/read-all")
    public String markAllAsRead(
            Principal principal) {

        notificationService
                .markCandidateNotificationsAsRead(
                        principal.getName()
                );

        return "Notifications marked as read";
    }
}