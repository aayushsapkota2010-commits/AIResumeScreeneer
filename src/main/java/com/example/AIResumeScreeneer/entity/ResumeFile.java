package com.example.AIResumeScreeneer.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Durable copy of an uploaded resume.
 *
 * Cloud deployments (Railway/Render/Heroku, etc.) use an ephemeral
 * filesystem, so files written to disk disappear whenever the app is
 * redeployed or restarted. Keeping the bytes in the database makes the
 * resume viewable even after the container is recreated.
 */
@Entity
@Table(name = "resume_files")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeFile {

    @Id
    private Long resumeId;

    private String fileName;

    private String contentType;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] data;
}
