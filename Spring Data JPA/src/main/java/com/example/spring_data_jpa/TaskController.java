package com.example.spring_data_jpa;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/tasks")
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        return ResponseEntity.status(201).body(taskService.createTask(task));
    }

    @GetMapping("/tasks")
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/tasks/{id}")
    public Task getTaskById(@PathVariable String id){
        return taskService.getTaskById(java.util.UUID.fromString(id));
    }

    @GetMapping("/tasks/open")
    public List<Task> getOpenTasks() {
        return taskService.getOpenTasks();
    }
}
