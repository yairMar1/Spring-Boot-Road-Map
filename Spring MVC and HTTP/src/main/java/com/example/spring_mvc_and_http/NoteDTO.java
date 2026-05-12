package com.example.spring_mvc_and_http;

import java.util.UUID;

public class NoteDTO {
    private UUID id;
    private String title;
    private String content;

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }
}