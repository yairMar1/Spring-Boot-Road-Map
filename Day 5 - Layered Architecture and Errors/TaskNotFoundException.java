package com.example.layered_architecture_and_errors;

import java.util.UUID;

public class TaskNotFoundException extends RuntimeException {

    public TaskNotFoundException(UUID id) {
        super("Task with id " + id + " not found");
    }


}
