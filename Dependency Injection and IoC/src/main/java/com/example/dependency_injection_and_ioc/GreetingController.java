package com.example.dependency_injection_and_ioc;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingController {

    private final GreetingServiceInterface greetingService;

    public GreetingController(GreetingServiceInterface greetingService) {
        System.out.println("GreetingController created");
        this.greetingService = greetingService;
    }

    @GetMapping("/greet")
    public String greet(){
        return greetingService.greet();
    }

}
