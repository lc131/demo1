package com.example.springbootbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisService {
    private final RedisTemplate<String, Object> redisTemplate;

    @Autowired
    public RedisService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void setValue(String key, Object value, long timeoutInMinutes) {
        System.out.println("Redis SET {} = {} (expires in {"+timeoutInMinutes+"} min)" + key + value);
        redisTemplate.opsForValue().set(key, value, timeoutInMinutes, TimeUnit.MINUTES);
    }

    public Object getValue(String key) {
        System.out.println("Redis GET {}" + key + redisTemplate.opsForValue().get(key));
        return redisTemplate.opsForValue().get(key);
    }

    public void delete(String key) {
        System.out.println(("Redis DEL {}" + key));
        redisTemplate.delete(key);
    }

}
