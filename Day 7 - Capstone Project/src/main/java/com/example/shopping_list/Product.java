package com.example.shopping_list;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

@Entity
public class Product {
    @Id
    @GeneratedValue
    private UUID id;

    @NotBlank (message = "שם מוצר לא יכול להיות ריק")
    private String name;
    private boolean done;
    private String note;
    private int quantity = 1;

    @ManyToOne
    @JoinColumn(name = "catedory_id")
    private Category category;

    public UUID getId() {return id;}

//    public void setId(UUID id) {this.id = id;}

    public int getQuantity() {return quantity;}

    public void setQuantity(int quantity) {this.quantity = quantity;}

    public String getName() {return name;}

    public void setName(String name) {this.name = name;}

    public Boolean isDone() {return done;}

    public void setDone(Boolean done) {this.done = done;}

    public Category getCategory() {return category;}

    public void setCategory(Category category) {this.category = category;}

    public String getNote() {return note;}

    public void setNote(String note) {this.note = note;}
}
