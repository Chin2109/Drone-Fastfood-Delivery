package com.zosh.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Controller
public class ViewController {

    @GetMapping("/restaurants/view")
    public String viewRestaurants(Model model) {
        // Gọi API backend
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:5454/api/restaurants";
        List<Map<String, Object>> restaurants = restTemplate.getForObject(url, List.class);

        model.addAttribute("restaurants", restaurants);
        return "restaurants"; // Tên file HTML (restaurants.html)
    }

    @GetMapping("/restaurants/home")
    public String mainRestaurants(Model model) {

        // Gọi API backend
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:5454/api/restaurants";
        List<Map<String, Object>> restaurants = restTemplate.getForObject(url, List.class);

        model.addAttribute("restaurants", restaurants);
        return "restaurants"; // Tên file HTML (restaurants.html)
    }
}
