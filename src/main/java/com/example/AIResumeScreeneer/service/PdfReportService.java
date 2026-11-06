package com.example.AIResumeScreeneer.service;

import java.io.ByteArrayOutputStream;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.entity.Resume;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;

@Service
public class PdfReportService {

    /**
     * Rebuilds a readable PDF from the resume text that was extracted and
     * stored in the database. Used only as a last resort when the original
     * uploaded file was lost (for example, resumes uploaded before durable
     * storage was added, or files wiped from an ephemeral container disk).
     */
    public byte[] generateResumeContentPdf(Resume resume) {

        try {

            ByteArrayOutputStream output =
                    new ByteArrayOutputStream();

            Document document =
                    new Document();

            PdfWriter.getInstance(
                    document,
                    output);

            document.open();

            document.add(
                    new Paragraph(
                            "Resume content (recovered)"));

            document.add(new Paragraph(" "));

            if (resume.getFileName() != null) {
                document.add(
                        new Paragraph(
                                "File: " + resume.getFileName()));
            }

            if (resume.getCandidateEmail() != null) {
                document.add(
                        new Paragraph(
                                "Candidate: "
                                        + resume.getCandidateEmail()));
            }

            document.add(new Paragraph(" "));

            String text = resume.getExtractedText();

            if (text == null || text.isBlank()) {
                document.add(
                        new Paragraph(
                                "No resume text is available."));
            } else {
                for (String line : text.split("\\R")) {
                    document.add(
                            new Paragraph(line));
                }
            }

            document.close();

            return output.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }

    public byte[] generateReport(Resume resume) {

        try {

            ByteArrayOutputStream output =
                    new ByteArrayOutputStream();

            Document document =
                    new Document();

            PdfWriter.getInstance(
                    document,
                    output);

            document.open();

            document.add(
                    new Paragraph(
                            "AI Resume Analysis Report"));

            document.add(new Paragraph(" "));

            document.add(
                    new Paragraph(
                            "Resume ID: "
                                    + resume.getId()));

            document.add(
                    new Paragraph(
                            "ATS Score: "
                                    + resume.getAtsScore()));

            document.add(
                    new Paragraph(
                            "Match Score: "
                                    + resume.getMatchScore()));

            document.add(
                    new Paragraph(
                            "Skills: "
                                    + resume.getSkills()));

            document.add(
                    new Paragraph(
                            "Suggestions: "
                                    + resume.getSuggestions()));

            document.close();

            return output.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }
}