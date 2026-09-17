package com.example.AIResumeScreeneer.contoller;

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

    @GetMapping
    public List<Notification> getNotifications() {

        return notificationService
                .getAllNotifications();
    }

    @GetMapping("/unread")
    public List<Notification> getUnreadNotifications() {

        return notificationService
                .getUnreadNotifications();
    }

    @PutMapping("/read-all")
    public String markAllAsRead() {

        notificationService.markAllAsRead();

        return "Notifications marked as read";
    }
}