package com.example.AIResumeScreeneer.contoller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.example.AIResumeScreeneer.entity.Notification;
import com.example.AIResumeScreeneer.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<Notification> getNotifications(
            @RequestParam String email) {

        return notificationService
                .getNotifications(email);
    }

    @GetMapping("/unread")
    public List<Notification> getUnreadNotifications(
            @RequestParam String email) {

        return notificationService
                .getUnreadNotifications(email);
    }

    @GetMapping("/count")
    public long getUnreadCount(
            @RequestParam String email) {

        return notificationService
                .getUnreadCount(email);
    }

    @PostMapping("/read-all")
    public String markAllAsRead(
            @RequestParam String email) {

        notificationService.markAllAsRead(email);

        return "Notifications marked as read";
    }

    @PostMapping("/read/{id}")
    public String markAsRead(
            @PathVariable Long id) {

        notificationService.markAsRead(id);

        return "Notification marked as read";
    }

    @GetMapping(
            value = "/stream",
            produces = MediaType.TEXT_EVENT_STREAM_VALUE
    )
    public SseEmitter stream(
            @RequestParam String email) {

        return notificationService.subscribe(email);
    }
}