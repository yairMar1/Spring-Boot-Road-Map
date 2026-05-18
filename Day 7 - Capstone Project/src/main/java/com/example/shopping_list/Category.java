package com.example.shopping_list;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;


import java.util.UUID;

@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @NotBlank(message = "שם קטגוריה לא יכולה להיות ריקה")
    private String name;

    public Category() {}

    public Category(String name) {
        this.name = name;
    }

    public String getName() {return name;}

    public void setName(String name) {this.name = name;}

    public UUID getId() {return id;}

//    public void setId(UUID id) {this.id = id;}
}