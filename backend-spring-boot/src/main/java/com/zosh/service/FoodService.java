package com.zosh.service;

import com.zosh.model.Category;
import com.zosh.model.Food;
import com.zosh.request.AddCategoryRequest;
import com.zosh.request.AddFoodRequest;
import com.zosh.request.UpdateFoodRequest;
import com.zosh.response.FoodItemResponse;
import com.zosh.response.FoodResponse;
import com.zosh.response.ProductDetailResponse;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FoodService {

    // CATEGORY

    Category createCategory(AddCategoryRequest request, Long userId);

    List<Category> getCategoriesOfCurrentMerchant(Long userId);

    List<Category> searchCategories(Long userId, String name);

    Category updateCategory(Long userId, Long categoryId, String newName);

    void deleteCategory(Long userId, Long categoryId);


    // FOOD

    Food createFood(AddFoodRequest request, MultipartFile image, Long userId);

    ProductDetailResponse  updateFood(Long foodId, UpdateFoodRequest request, MultipartFile image, Long userId);

    void patchAvailable(Long foodId, Long userId, Boolean available);

    void deleteFood(Long foodId, Long userId);

    Page<FoodResponse> getAllFood(Long merchantId,
                                  Long categoryId,
                                  String name,
                                  int page,
                                  int limit,
                                  Boolean available);

    ProductDetailResponse findOneProductById(Long id);
}

