package com.example.shopping_list;

import java.util.UUID;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(UUID id) {
        super("Category not found, for id: " + id);
    }

    public CategoryNotFoundException(String name) {
        super("Category not found, for name: " + name);
    }
}
