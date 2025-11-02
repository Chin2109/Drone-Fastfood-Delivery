package com.zosh.controller;

import com.zosh.model.Category;
import com.zosh.request.AddCategoryRequest;
import com.zosh.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/food")
public class FoodController {
    @Autowired
    private FoodService foodService;

    @PostMapping("/add-category/{id}")
    public ResponseEntity<Category> addCategory(@RequestBody AddCategoryRequest request,
                                                @PathVariable("id") Long id) {
        return ResponseEntity.ok(foodService.createCategory(request,id));
    }
}
