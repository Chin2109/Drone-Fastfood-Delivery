//package com.zosh.service;
//
//import java.util.ArrayList;
//import java.util.Date;
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//import com.zosh.model.*;
//import com.zosh.repository.CategoryRepository;
//import com.zosh.repository.FoodRepository;
//import com.zosh.request.AddCategoryRequest;
//import com.zosh.request.AddFoodRequest;
//import com.zosh.request.IngredientCategoryDTO;
//import com.zosh.request.IngredientItemDTO;
//import com.zosh.response.FoodItemResponse;
//import com.zosh.response.FoodResponse;
//import jakarta.transaction.Transactional;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.stereotype.Service;
//
//import com.zosh.repository.RestaurantRepository;
//
//
//@Service
//public class FoodServiceImplementation implements FoodService {
//	@Autowired
//	private FoodRepository foodRepository;
//    @Autowired
//    private RestaurantRepository restaurantRepository;
//    @Autowired
//    private CategoryRepository categoryRepository;
//
//    @Override
//    public Category createCategory(AddCategoryRequest request, Long id) {
//        Restaurant restaurant = restaurantRepository.findById(id).orElseThrow();
//
//        Category category = new Category();
//        category.setName(request.getName());
//        category.setRestaurant(restaurant);
//
//        return categoryRepository.save(category);
//    }
//
//	@Override
//    @Transactional //vì thực hiện save nhiều lần
//    public Food createFood(AddFoodRequest request, Long id) {
//        Category category = categoryRepository.findById(request.getFoodCategoryId()).orElseThrow();
//        Restaurant restaurant = restaurantRepository.findById(id).orElseThrow();
//
//        //entity food
//        Food food = new Food();
//        food.setName(request.getName());
//        food.setPrice(request.getPrice());
//        food.setDescription(request.getDescription());
//        food.setFoodCategory(category);
//        food.setImage(request.getImage());
//        food.setAvailable(request.isAvailable());
//        food.setCreationDate(request.getCreationDate());
//
//        //mỗi food có một list ingredient category
//        List<IngredientCategory> ingredientCategories = new ArrayList<>();
//        for(IngredientCategoryDTO icDTO : request.getIngredientCategoryDTOs()) {
//            IngredientCategory ic = new IngredientCategory();
//            ic.setName(icDTO.getName());
//            ic.setFood(food);
//            //mỗi ingredient category có một list ingredient item
//            List<IngredientsItem> ingredientsItems = new ArrayList<>();
//            for(IngredientItemDTO itDTO : icDTO.getIngredients()) {
//                IngredientsItem it = new IngredientsItem();
//                it.setName(itDTO.getName());
//                it.setInStoke(itDTO.isInStoke());
//                it.setCategory(ic);
//                ingredientsItems.add(it);
//            }
//            //lưu list ingredient item cho một ingredient category
//            ic.setIngredients(ingredientsItems);
//            ingredientCategories.add(ic);
//        }
//        //lưu list ingredient category cho food
//        food.setIngredientCategories(ingredientCategories);
//
//        return foodRepository.save(food);
//    }
//
//    public List<FoodItemResponse> getAllFood() {
//        List<Food> foods = foodRepository.findAll();
//        List<FoodItemResponse> fr = new ArrayList<>();
//        for (Food  food : foods) {
//            FoodItemResponse f = new FoodItemResponse();
//            f.setName(food.getName());
//            f.setImage(food.getImage());
//            fr.add(f);
//        }
//        return fr;
//    }
//
//}
