package com.zosh.controller;

import com.zosh.model.Category;
import com.zosh.model.Food;
import com.zosh.request.AddCategoryRequest;
import com.zosh.request.AddFoodRequest;
import com.zosh.response.FoodItemResponse;
import com.zosh.response.FoodResponse;
import com.zosh.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/product")
public class FoodController {
    @Autowired
    private FoodService foodService;

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllProducts(
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int limit
    ) {

        Page<FoodResponse> foods = foodService.getAllFood(merchantId, categoryId, name, page, limit);


        return new ResponseEntity<>(Map.of(
            "success", true,
            "message", "Taken successfully",
            "data", foods.getContent()
        ), HttpStatus.OK);
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
