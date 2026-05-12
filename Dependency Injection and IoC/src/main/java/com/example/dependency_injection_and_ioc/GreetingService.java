package com.example.dependency_injection_and_ioc;

import org.springframework.stereotype.Service;

@Service
public class GreetingService implements GreetingServiceInterface {

    private final GreetingRepository greetingRepository;

    public GreetingService(GreetingRepository greetingRepository) {
        System.out.println("GreetingService created");
        this.greetingRepository = greetingRepository;
    }

    public String greet() {
        return greetingRepository.find();
    }
}
