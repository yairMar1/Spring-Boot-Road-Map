package com.example.dependency_injection_and_ioc;

import org.springframework.stereotype.Repository;

@Repository
public class GreetingRepository {

    public GreetingRepository() {
        System.out.println("GreetingRepository created");
    }

    public String find(){
        return "Hello from GreetingRepository";
    }
}