package com.example.shopping_list;

public class SuggestionProduct {
    private final String name;
    private final String category;

    public SuggestionProduct(String name, String category) {
        this.name = name;
        this.category = category;
    }

    public String getName() {return this.name;}
    public String getCategory() {return this.category;}
}
