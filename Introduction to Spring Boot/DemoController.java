package com.example.demo;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoController {

//    public DemoController() {
//        System.out.println("DemoController נוצר על ידי Spring Boot!");
//    }

    @RequestMapping("/hello")
    public String hello() {
        return "index";
    }

    @RequestMapping("/hello/{name}")
    public String helloWithName(@PathVariable String name) {
        return "hello " + name + "!";
    }
}