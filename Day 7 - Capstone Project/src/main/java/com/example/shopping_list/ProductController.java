package com.example.shopping_list;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products")
    public List<Product> getProducts() {
        return productService.getProducts();
    }

    @PostMapping("/products")
    public ResponseEntity<Product> addProduct(@Valid @RequestBody Product product){
        productService.addProduct(product);
        return ResponseEntity.status(201).body(product);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Product> deleteProduct(@PathVariable UUID id){
        productService.removeProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/products/search")
    public ResponseEntity<Product> searchProduct(@RequestParam String name){
        return ResponseEntity.status(200).body(productService.getProduct(name));
    }

    @GetMapping("/products/suggestions")
    public List<SuggestionProduct> getSuggestions(@RequestParam String query){
        if(query == null || query.length() < 2)return List.of();
        return SuggestionsData.ALL.stream()
                .filter(p -> p.getName().contains(query))
                .limit(10)
                .toList();
    }

    @PutMapping("/products/quantity")
    public ResponseEntity<Product> updateProductQuantity(@RequestBody Product  product){
        productService.updateQuantity(product.getId(), product.getQuantity());
        return ResponseEntity.ok(productService.getProduct(product.getId()));
    }

    @PutMapping("/products/name")
    public ResponseEntity<Product> updateProduct(@RequestBody Product product){
        productService.changeNameOfProduct(product.getId(), product.getName());
        return ResponseEntity.status(200).body(productService.getProduct(product.getId()));
    }

    @PutMapping("/products/status")
    public ResponseEntity<Product> updateStatus(@RequestBody Product product){
        productService.changeStatus(product.getId());
        return  ResponseEntity.status(200).body(productService.getProduct(product.getId()));
    }

    @PutMapping("/products/note")
    public ResponseEntity<Product> updateNote(@RequestBody Product product) {
        productService.changeNote(product.getId(), product.getNote());
        return ResponseEntity.status(200).body(productService.getProduct(product.getId()));
    }

    @GetMapping("/products/{id}/Note")
    public ResponseEntity<String> showNote(@PathVariable UUID id){
        return ResponseEntity.ok(productService.showNote(id));
    }

    @PutMapping("/products/category")
    public ResponseEntity<Product> changeCategory(@RequestBody Product product){
        productService.changeCategory(product.getId(), product.getCategory());
        return ResponseEntity.status(200).body(productService.getProduct(product.getId()));
    }
}
