package com.zosh.controller;

import com.zosh.model.Category;
import com.zosh.model.Food;
import com.zosh.model.Restaurant;
import com.zosh.model.User;
import com.zosh.repository.RestaurantRepository;
import com.zosh.repository.UserRepository;
import com.zosh.request.AddCategoryRequest;
import com.zosh.request.AddFoodRequest;
import com.zosh.request.UpdateCategoryRequest;
import com.zosh.request.UpdateFoodRequest;
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
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    // CATEGORY
    @GetMapping("/categories")
    public ResponseEntity<?> getCategoriesOfMerchant(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại"));

        List<Category> categories = foodService.getCategoriesOfCurrentMerchant(user.getId());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Lấy category thành công",
                "data", categories
        ));
    }

    @GetMapping("/categories/search")
    public ResponseEntity<?> searchCategories(@RequestParam(required = false) String name,
                                              Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại"));

        List<Category> categories = foodService.searchCategories(user.getId(), name);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Tìm category thành công",
                "data", categories
        ));
    }

    /**
     * Tạo category (bạn đã có endpoint /add-category; giữ nguyên)
     */
    @PostMapping("/add-category")
    public ResponseEntity<?> addCategory(@RequestBody AddCategoryRequest request,
                                         Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại"));

        Category created = foodService.createCategory(request, user.getId());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Tạo category thành công",
                "data", created
        ));
    }

    /**
     * Update category (đổi tên)
     */
    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id,
                                            @RequestBody UpdateCategoryRequest request,
                                            Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại"));

        Category updated = foodService.updateCategory(user.getId(), id, request.getName());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Cập nhật category thành công",
                "data", updated
        ));
    }

    /**
     * Delete category — chỉ xóa khi không có món.
     */
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id,
                                            Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại"));

        foodService.deleteCategory(user.getId(), id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Xóa category thành công"
        ));
    }

    // ------------------ FOOD ------------------

    /**
     * Lấy danh sách món (search theo tên, lọc theo available, theo category, paging).
     * Ví dụ: GET /api/product/getAll?merchantId=...&categoryId=...&name=...&available=true&page=1&limit=10
     *
     * - merchantId optional: nếu frontend muốn pass một merchant cụ thể (admin), nếu null, service có thể hiểu là lấy current merchant.
     * - available optional: filter boolean
     */
    @GetMapping("/getAll")
    public ResponseEntity<?> getAllProducts(
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Boolean available,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int limit,
            Authentication authentication
    ) {
        Long resolvedMerchantId = merchantId;

        // nếu merchantId không được truyền và có user đã auth thì lấy userId
        if (resolvedMerchantId == null && authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại"));
            resolvedMerchantId = user.getId();
        }

        // nếu vẫn null -> hiểu là không filter theo merchant => service trả tất cả products
        Page<?> foods = foodService.getAllFood(resolvedMerchantId, categoryId, name, page, limit, available);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Lấy danh sách món thành công",
                "data", foods.getContent(),
                "page", Map.of("number", foods.getNumber() + 1, "size", foods.getSize(), "totalElements", foods.getTotalElements())
        ));
    }

    @GetMapping("/get-all")
    public ResponseEntity<?> getallProducts(
            @RequestParam(required = false) String inputmerchantId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Boolean available,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int limit,
            Authentication authentication
    ) {
        //lấy merchantId từ token (current user) khi không truyền merchantId:
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại"));
        Long merchantId = user.getId();
        System.out.println("➡️ [GET /get-all] email = " + email + ", merchantId = " + merchantId);

        Restaurant restaurant = restaurantRepository.findByOwner(user).orElseThrow();


        Page<?> foods = foodService.getAllFood(restaurant.getId(), categoryId, name, page, limit, available);

        // Nếu service chưa hỗ trợ filter available trong query, bạn có thể lọc ở service
        // Tại đây giữ consistent: trả về content của page
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Lấy danh sách món thành công",
                "data", foods.getContent(),
                "page", Map.of("number", foods.getNumber() + 1, "size", foods.getSize(), "totalElements", foods.getTotalElements())
        ));
    }

    //Xem chi tiết món
    @GetMapping("/getone/{id}")
    public ResponseEntity<?> getProductDetail(@PathVariable Long id) {
        var data = foodService.findOneProductById(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Lấy chi tiết món thành công",
                "data", data
        ));
    }


    //Tạo món (multipart/form-data) đã có endpoint /add, giữ nguyên.
    @PostMapping(value = "/add", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> addFood(
            @RequestPart("data") AddFoodRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại"));

        Food created = foodService.createFood(request, image, user.getId());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Tạo món thành công",
                "data", created
        ));
    }

    //cập nhật món
    @PutMapping(value = "/update/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> updateFood(
            @PathVariable Long id,
            @RequestPart("data") UpdateFoodRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại"));

        ProductDetailResponse updated = foodService.updateFood(id, request, image, user.getId());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Cập nhật món thành công",
                "data", updated
        ));
    }

    /**
     * Patch trạng thái available (bật/tắt)
     * PATCH /api/product/{id}/available
     * Body: { "available": true }
     */
    @PatchMapping("/{id}/available")
    public ResponseEntity<?> patchAvailable(@PathVariable Long id,
                                            @RequestBody Map<String, Object> body,
                                            Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại"));

        Boolean available = null;
        if (body != null && body.containsKey("available")) {
            Object v = body.get("available");
            if (v instanceof Boolean) {
                available = (Boolean) v;
            } else if (v instanceof String) {
                available = Boolean.parseBoolean((String) v);
            }
        }

        foodService.patchAvailable(id, user.getId(), available);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Cập nhật trạng thái thành công"
        ));
    }

    /**
     * Delete food — chỉ xóa khi không có order chứa món này.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFood(@PathVariable Long id,
                                        Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại"));

        foodService.deleteFood(id, user.getId());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Xóa món thành công"
        ));
    }
}
