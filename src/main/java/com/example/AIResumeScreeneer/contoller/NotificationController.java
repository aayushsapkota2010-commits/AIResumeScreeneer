package com.example.AIResumeScreeneer.contoller;

import java.security.Principal;
import java.util.List;

import org.springframework.security.core.Authentication;
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
    // MY NOTIFICATIONS
    // ADMIN  -> ALL RECRUITER/GLOBAL NOTIFICATIONS
    // USER   -> ONLY CANDIDATE'S NOTIFICATIONS
    // ============================================================

    @GetMapping
    public List<Notification> getNotifications(
            Principal principal,
            Authentication authentication) {

        if (authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority()
                                .equals("ROLE_ADMIN"))) {

            return notificationService
                    .getAllNotifications();
        }

        return notificationService
                .getCandidateNotifications(
                        principal.getName()
                );
    }

    // ============================================================
    // UNREAD NOTIFICATIONS
    // ============================================================

    @GetMapping("/unread")
    public List<Notification> getUnreadNotifications(
            Principal principal,
            Authentication authentication) {

        if (authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority()
                                .equals("ROLE_ADMIN"))) {

            return notificationService
                    .getUnreadNotifications();
        }

        return notificationService
                .getUnreadCandidateNotifications(
                        principal.getName()
                );
    }

    // ============================================================
    // MARK NOTIFICATIONS AS READ
    // ============================================================

    @PutMapping("/read-all")
    public String markAllAsRead(
            Principal principal,
            Authentication authentication) {

        if (authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority()
                                .equals("ROLE_ADMIN"))) {

            notificationService.markAllAsRead();

            return "All notifications marked as read";
        }

        notificationService
                .markCandidateNotificationsAsRead(
                        principal.getName()
                );

        return "Notifications marked as read";
    }
}