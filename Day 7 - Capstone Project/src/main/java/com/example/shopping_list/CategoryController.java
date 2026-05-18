package com.example.shopping_list;

import com.example.shopping_list.dto.UpdateNameRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return categoryService.findAll();
    }

    @GetMapping("/categories/{id}")
    public Category getCategory(@PathVariable UUID id) {
        return categoryService.getCategory(id);
    }

    @GetMapping("/categories/search")
    public Category getCategoryByName(@RequestParam String name) {
        return categoryService.getCategoryByName(name);
    }

    @DeleteMapping("/categories/{id}")
    public void deleteCategory(@PathVariable UUID id) {
        // Maybe return something
        categoryService.deleteCategory(id);
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@Valid @RequestBody Category category) {
        categoryService.addCategory(category);
        return ResponseEntity.status(201).body(category);
    }

    @PutMapping("/categories/{id}")
    public Category changeNameOfCategory(@PathVariable UUID id, @RequestBody UpdateNameRequest request){
        categoryService.changeNameOfCategory(id, request.getName());
        return categoryService.getCategory(id);
    }
}
