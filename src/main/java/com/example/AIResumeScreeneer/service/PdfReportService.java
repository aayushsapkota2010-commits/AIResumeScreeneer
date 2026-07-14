package com.example.AIResumeScreeneer.service;

import java.io.ByteArrayOutputStream;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.entity.Resume;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;

@Service
public class PdfReportService {

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