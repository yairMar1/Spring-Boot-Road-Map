package com.example.layered_architecture_and_errors;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/tasks")
    public ResponseEntity<Task> addTask(@Valid @RequestBody Task task) {
        taskService.addTask(task);
        return ResponseEntity.status(201).body(task);
    }

    @GetMapping("/tasks")
    public List<Task> findAllTasks() {
        return taskService.findAll();
    }

    @GetMapping("/task/{id}")
    public Task findTaskById(@PathVariable UUID id) {
        return taskService.findById(id);
    }

    @GetMapping("/tasks/open")
    public List<Task> findAllNotOpenTasks() {
       return taskService.findAllOpenTasks();
    }
}
