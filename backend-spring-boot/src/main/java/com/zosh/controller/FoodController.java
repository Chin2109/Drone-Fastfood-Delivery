package com.zosh.controller;

import com.zosh.model.Category;
import com.zosh.model.Food;
import com.zosh.request.AddCategoryRequest;
import com.zosh.request.AddFoodRequest;
import com.zosh.response.FoodItemResponse;
import com.zosh.response.FoodResponse;
import com.zosh.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/food")
public class FoodController {
    @Autowired
    private FoodService foodService;

    @GetMapping("/getall")
    private ResponseEntity<List<FoodItemResponse>> getAllFood() {
        return ResponseEntity.ok(foodService.getAllFood());
    }

    @PostMapping("/add-category/{id}")
    public ResponseEntity<Category> addCategory(@RequestBody AddCategoryRequest request,
                                                @PathVariable("id") Long id) {
        return ResponseEntity.ok(foodService.createCategory(request,id));
    }

    @PostMapping("/add/{id}")
    public ResponseEntity<Food> addFood(@RequestBody AddFoodRequest request,
                                        @PathVariable("id") Long id) {
        return ResponseEntity.ok(foodService.createFood(request,id));
    }
}
