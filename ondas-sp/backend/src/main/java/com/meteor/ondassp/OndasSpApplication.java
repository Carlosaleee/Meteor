package com.meteor.ondassp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class OndasSpApplication {

    public static void main(String[] args) {
        SpringApplication.run(OndasSpApplication.class, args);
    }
}
