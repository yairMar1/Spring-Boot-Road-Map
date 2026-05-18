package com.example.shopping_list;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {
    private final CategoryRepository categoryRepository;

    public DataLoader(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String ...args){
        if(categoryRepository.count() == 0){
            categoryRepository.save(new Category("ירקות ופירות"));
            categoryRepository.save(new Category("מוצרי חלב"));
            categoryRepository.save(new Category("בשר ודגים"));
            categoryRepository.save(new Category("לחם ומאפים"));
            categoryRepository.save(new Category("שימורים וחטיפים"));
            categoryRepository.save(new Category("משקאות"));
            categoryRepository.save(new Category("ניקיון והיגיינה"));
            categoryRepository.save(new Category("אחר"));
        }
    }
}
