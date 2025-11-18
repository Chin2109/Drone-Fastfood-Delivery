package com.zosh.controller;

import com.zosh.model.Category;
import com.zosh.model.Food;
import com.zosh.model.User;
import com.zosh.repository.UserRepository;
import com.zosh.request.AddCategoryRequest;
import com.zosh.request.AddFoodRequest;
import com.zosh.response.FoodItemResponse;
import com.zosh.response.FoodResponse;
import com.zosh.response.ProductDetailResponse;
import com.zosh.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/product")
public class FoodController {
    @Autowired
    private FoodService foodService;
    @Autowired
    private UserRepository userRepository;

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

    @GetMapping("/getone/{id}")
    public ResponseEntity<?> getProductDetail(@PathVariable Long id) {

        ProductDetailResponse data = foodService.findOneProductById(id);

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "Taken successfully",
                        "data", data
                )
        );
    }


    @PostMapping("/add-category")
    public ResponseEntity<Category> addCategory(@RequestBody AddCategoryRequest request,
                                                Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại với email: " + email));


        return ResponseEntity.ok(foodService.createCategory(request,user.getId()));
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategoriesOfMerchant(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại với email: " + email));

        List<Category> categories = foodService.getCategoriesOfCurrentMerchant(user.getId());

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "Lấy category thành công",
                        "data", categories
                )
        );
    }

    @PostMapping(
            value = "/add",
            consumes = { MediaType.MULTIPART_FORM_DATA_VALUE }
    )
    public ResponseEntity<Food> addFood(
            @RequestPart("data") AddFoodRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại với email: " + email));

        Food created = foodService.createFood(request, image, user.getId());
        return ResponseEntity.ok(created);
    }
}
