package com.zosh.service;

import com.zosh.model.Category;
import com.zosh.model.Food;
import com.zosh.request.AddCategoryRequest;
import com.zosh.request.AddFoodRequest;

public interface FoodService {

//	public Food createFood(AddFoodRequest request, Long id);

    public Category createCategory(AddCategoryRequest request, Long id);

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
