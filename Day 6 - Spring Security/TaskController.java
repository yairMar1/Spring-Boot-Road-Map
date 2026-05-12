package com.example.spring_security;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TaskController {

    @GetMapping("/tasks")
    public String getTasks() {
        return "Here are the tasks.";
    }

    @GetMapping("/admin/tasks")
    public String getAdminTasks() {
        return "Here are the admin tasks.";
    }

    @PostMapping("/tasks")
    public String createTask() {
            return "Task created.";
    }
}
