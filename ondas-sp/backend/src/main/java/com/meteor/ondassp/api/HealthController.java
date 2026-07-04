package com.meteor.ondassp.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private static final Logger log = LoggerFactory.getLogger(HealthController.class);

    @Autowired
    private DataSource dataSource;

    @Autowired
    private RedisConnectionFactory redisConnectionFactory;

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now());

        Map<String, String> components = new HashMap<>();

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT 1")) {
            components.put("database", "UP");
        } catch (Exception e) {
            log.error("Database health check failed", e);
            components.put("database", "DOWN: " + e.getMessage());
            status.put("status", "DOWN");
        }

        try {
            redisConnectionFactory.getConnection().ping();
            components.put("redis", "UP");
        } catch (Exception e) {
            log.error("Redis health check failed", e);
            components.put("redis", "DOWN: " + e.getMessage());
            status.put("status", "DOWN");
        }

        status.put("components", components);
        return ResponseEntity.ok(status);
    }
}
