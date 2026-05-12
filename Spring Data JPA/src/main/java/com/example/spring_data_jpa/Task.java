package com.example.spring_data_jpa;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class Task {
    @Id
    @GeneratedValue (strategy = GenerationType.UUID)
    private UUID id;
    private String title;
    private boolean done;
    private LocalDateTime createdAt =  LocalDateTime.now();

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public boolean isDone() {
        return done;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
