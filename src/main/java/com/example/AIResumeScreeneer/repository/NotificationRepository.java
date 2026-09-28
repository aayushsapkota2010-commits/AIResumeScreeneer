package com.example.AIResumeScreeneer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.AIResumeScreeneer.entity.Notification;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findAllByOrderByCreatedAtDesc();

    List<Notification> findByReadFalseOrderByCreatedAtDesc();

    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(
            String recipientEmail
    );

    List<Notification> findByRecipientEmailAndReadFalseOrderByCreatedAtDesc(
            String recipientEmail
    );

     List<Notification> findByRecipientEmailIsNullOrderByCreatedAtDesc();

    List<Notification> findByRecipientEmailIsNullAndReadFalseOrderByCreatedAtDesc();
}