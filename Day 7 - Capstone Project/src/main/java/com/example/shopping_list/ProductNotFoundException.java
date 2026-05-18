package com.example.shopping_list;

import java.util.UUID;

public class ProductNotFoundException extends RuntimeException {

    public ProductNotFoundException(UUID id) {
        super("Product not found, for id: " + id);
    }

    public ProductNotFoundException(String name) {
        super("Product not found, for name: " + name);
    }
}
