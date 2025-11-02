package com.zosh.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.zosh.repository.CategoryRepository;
import com.zosh.repository.FoodRepository;
import com.zosh.request.AddCategoryRequest;
import com.zosh.request.AddFoodRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;

import com.zosh.Exception.FoodException;
import com.zosh.Exception.RestaurantException;
import com.zosh.model.Category;
import com.zosh.model.IngredientsItem;
import com.zosh.model.Food;
import com.zosh.model.Restaurant;
import com.zosh.repository.IngredientsCategoryRepository;
import com.zosh.repository.RestaurantRepository;


@Service
public class FoodServiceImplementation implements FoodService {
	@Autowired
	private FoodRepository foodRepository;
    @Autowired
    private RestaurantRepository restaurantRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Category createCategory(AddCategoryRequest request, Long id) {
        Restaurant restaurant = restaurantRepository.findById(id).orElseThrow();

        Category category = new Category();
        category.setName(request.getName());
        category.setRestaurant(restaurant);

        return categoryRepository.save(category);
    }

//	@Override
//    @Transactional //vì thực hiện save nhiều lần
//    public Food createFood(AddFoodRequest request, Long id) {
//        Category category = categoryRepository.findById(request.getFoodCategoryId()).orElseThrow();
//        Restaurant restaurant = restaurantRepository.findById(id).orElseThrow();
//
//
//
//    }

}
