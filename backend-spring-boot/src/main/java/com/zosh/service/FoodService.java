package com.zosh.service;

import com.zosh.model.Category;
import com.zosh.model.Food;
import com.zosh.request.AddCategoryRequest;
import com.zosh.request.AddFoodRequest;
import com.zosh.response.FoodItemResponse;
import com.zosh.response.FoodResponse;
import com.zosh.response.ProductDetailResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface FoodService {

	public Food createFood(AddFoodRequest request, Long id);

    public Category createCategory(AddCategoryRequest request, Long id);

    public Page<FoodResponse> getAllFood(Long merchantId,
                                 Long categoryId,
                                 String name,
                                 int page,
                                 int limit);

    public ProductDetailResponse findOneProductById(Long id);

//	void deleteFood(Long foodId) throws FoodException;
//
//	public List<Food> getRestaurantsFood(Long restaurantId,
//			boolean isVegetarian, boolean isNonveg, boolean isSeasonal,String foodCategory) throws FoodException;
//
//	public List<Food> searchFood(String keyword);
//
//	public Food findFoodById(Long foodId) throws FoodException;
//
//	public Food updateAvailibilityStatus(Long foodId) throws FoodException;
}
