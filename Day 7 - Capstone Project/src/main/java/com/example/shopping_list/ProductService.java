package com.example.shopping_list;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    public ProductService(ProductRepository productRepository, CategoryService categoryService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
    }

    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    public Product getProduct(UUID id) {
        return productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException(id));
    }

//    public Product getProduct(String name) {
//        return productRepository.findByName(name).orElseThrow(() -> new ProductNotFoundException(name));
//    }

    public Product getProduct (String name) {
        return  productRepository.findByNameContaining(name)
                .stream()
                .findFirst()
                .orElseThrow(() -> new ProductNotFoundException(name));
    }

    public void addProduct(Product product) {
        if(product.getCategory() != null && product.getCategory().getId() != null) {
            Category category = categoryService.getCategory(product.getCategory().getId());
            product.setCategory(category);
        }
        productRepository.save(product);
    }

    public void removeProduct(UUID id) {
        productRepository.delete(getProduct(id));
    }

    public void updateQuantity(UUID id, int quantity) {
        if (quantity < 1) throw new IllegalArgumentException("כמות לא יכולה להיות פחות מ-1");
        Product product = getProduct(id);
        product.setQuantity(quantity);
        productRepository.save(product);
    }

    public void changeNameOfProduct(UUID id, String name) {
        Product product = getProduct(id);
        product.setName(name);
        productRepository.save(product);
    }

    public void changeStatus(UUID id) {
        Product product = getProduct(id);
        product.setDone(!product.isDone());
        productRepository.save(product);
    }

    public void changeNote(UUID id, String note) {
        Product product = getProduct(id);
        product.setNote(note);
        productRepository.save(product);
    }

    public String showNote(UUID id) {
        Product product = getProduct(id);
        return product.getNote();
    }

    public void changeCategory(UUID id, Category category) {
        Product product = getProduct(id);
        Category fullCategory = categoryService.getCategory(category.getId());
        product.setCategory(fullCategory);
        productRepository.save(product);
    }
}
