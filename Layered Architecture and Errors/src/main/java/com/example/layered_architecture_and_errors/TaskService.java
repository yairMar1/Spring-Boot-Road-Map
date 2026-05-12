package com.example.layered_architecture_and_errors;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task findById(UUID id) {
//        return taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found!!!"));
        return taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
    }

    public void addTask(Task task) {
        taskRepository.save(task);
    }

    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    public List<Task> findAllOpenTasks() {
        return taskRepository.findAllNotDoneTasks();
    }
}
