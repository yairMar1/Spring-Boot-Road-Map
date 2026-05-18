package com.example.shopping_list;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {
    private final CategoryRepository Categoryrepository;

    public CategoryService(CategoryRepository Categoryrepository) {
        this.Categoryrepository = Categoryrepository;
    }

    public List<Category> findAll() {
        return Categoryrepository.findAll();
    }

    public Category getCategory(UUID id) {
        return Categoryrepository.findById(id).orElseThrow(() -> new CategoryNotFoundException(id));
    }

    public Category getCategoryByName(String name) {
        return Categoryrepository.findByName(name).orElseThrow(() -> new CategoryNotFoundException(name));
    }

    public void addCategory(Category category) {
        Categoryrepository.save(category);
    }

    public void deleteCategory(UUID id) {
        Categoryrepository.deleteById(id);
    }

    public void changeNameOfCategory(UUID id, String name) {
        Category category = getCategory(id);
        category.setName(name);
        Categoryrepository.save(category);
    }
}
