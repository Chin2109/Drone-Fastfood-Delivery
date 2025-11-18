package com.zosh.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.zosh.mapper.FoodMapper;
import com.zosh.model.*;
import com.zosh.repository.CategoryRepository;
import com.zosh.repository.FoodRepository;
import com.zosh.request.AddCategoryRequest;
import com.zosh.request.AddFoodRequest;
import com.zosh.request.IngredientCategoryDTO;
import com.zosh.request.IngredientItemDTO;
import com.zosh.response.FoodItemResponse;
import com.zosh.response.FoodResponse;
import com.zosh.response.ProductDetailResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;

import com.zosh.repository.RestaurantRepository;


@Service
public class FoodServiceImplementation implements FoodService {
	@Autowired
	private FoodRepository foodRepository;
    @Autowired
    private RestaurantRepository restaurantRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    //mapper
    private ProductDetailResponse.ProductToppingGroupResponse toProductToppingGroupResponse(
            IngredientCategory ic,
            Food food
    ) {
        ProductDetailResponse.ProductToppingGroupResponse dto =
                new ProductDetailResponse.ProductToppingGroupResponse();

        dto.setId(ic.getId());
        dto.setProductId(food.getId());
        dto.setToppingGroupId(ic.getId()); // lấy id của IngredientCategory

        // ---- toppingGroup ----
        ProductDetailResponse.ToppingGroupResponse tg =
                new ProductDetailResponse.ToppingGroupResponse();
        tg.setId(ic.getId());
        tg.setName(ic.getName());
        tg.set_required(false); // bổ sung
        tg.setMinSelection(1);    // tạm min=1
        tg.setMaxSelection(ic.getIngredients() != null ? ic.getIngredients().size() : 0);

        // toppings (IngredientsItem)
        List<ProductDetailResponse.ToppingResponse> toppings =
                ic.getIngredients().stream()
                        .map(this::toToppingResponse)
                        .toList();

        tg.setToppings(toppings);
        dto.setToppingGroup(tg);

        return dto;
    }

    //mapper
    private ProductDetailResponse.ToppingResponse toToppingResponse(IngredientsItem item) {
        ProductDetailResponse.ToppingResponse dto =
                new ProductDetailResponse.ToppingResponse();

        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setPrice(item.getPrice());

        return dto;
    }

    //mapper
    private ProductDetailResponse mapToProductDetail(Food f) {
        ProductDetailResponse dto = new ProductDetailResponse();

        dto.setId(f.getId());
        dto.setName(f.getName());
        dto.setDescription(f.getDescription());
        dto.setBasePrice(f.getPrice()); // basePrice <- Food.price
        dto.setImage(f.getImage());

        // ---- Category ----
        Category category = f.getFoodCategory();
        if (category != null) {
            ProductDetailResponse.CategoryShortResponse cateDto =
                    new ProductDetailResponse.CategoryShortResponse();
            cateDto.setName(category.getName());
            cateDto.setMerchantId(
                    category.getRestaurant() != null
                            ? category.getRestaurant().getId()
                            : null
            );
            dto.setCategory(cateDto);
        }

        // ---- productToppingGroups (IngredientCategory) ----
        List<ProductDetailResponse.ProductToppingGroupResponse> ptgDtos =
                f.getIngredientCategories().stream()
                        .map(ic -> toProductToppingGroupResponse(ic, f))
                        .toList();

        dto.setProductToppingGroups(ptgDtos);

        return dto;
    }

    @Override
    public Category createCategory(AddCategoryRequest request, Long id) {
        Restaurant restaurant = restaurantRepository.findById(id).orElseThrow();

        Category category = new Category();
        category.setName(request.getName());
        category.setRestaurant(restaurant);

        return categoryRepository.save(category);
    }

	@Override
    @Transactional //vì thực hiện save nhiều lần
    public Food createFood(AddFoodRequest request, Long id) {
        Category category = categoryRepository.findById(request.getFoodCategoryId()).orElseThrow();
        Restaurant restaurant = restaurantRepository.findById(id).orElseThrow();

        //entity food
        Food food = new Food();
        food.setName(request.getName());
        food.setPrice(request.getPrice());
        food.setDescription(request.getDescription());
        food.setFoodCategory(category);
        food.setImage(request.getImage());
        food.setAvailable(request.isAvailable());
        food.setCreationDate(request.getCreationDate());

        //mỗi food có một list ingredient category
        List<IngredientCategory> ingredientCategories = new ArrayList<>();
        for(IngredientCategoryDTO icDTO : request.getIngredientCategoryDTOs()) {
            IngredientCategory ic = new IngredientCategory();
            ic.setName(icDTO.getName());
            ic.setFood(food);
            //mỗi ingredient category có một list ingredient item
            List<IngredientsItem> ingredientsItems = new ArrayList<>();
            for(IngredientItemDTO itDTO : icDTO.getIngredients()) {
                IngredientsItem it = new IngredientsItem();
                it.setName(itDTO.getName());
                it.setInStoke(itDTO.isInStoke());
                it.setPrice(itDTO.getPrice());
                it.setCategory(ic);
                ingredientsItems.add(it);
            }
            //lưu list ingredient item cho một ingredient category
            ic.setIngredients(ingredientsItems);
            ingredientCategories.add(ic);
        }
        //lưu list ingredient category cho food
        food.setIngredientCategories(ingredientCategories);

        return foodRepository.save(food);
    }

    @Override
    public Page<FoodResponse> getAllFood (Long merchantId,
                                         Long categoryId,
                                         String name,
                                         int page,
                                         int limit)
    {
        if (page < 1) {
            page = 1;
        }
        if (limit <= 0) {
            limit = 10;
        }

        PageRequest pageable = PageRequest.of(page - 1, limit);

        //nếu name rỗng thì keyword là null để query
        String keyword = (name == null || name.isBlank()) ? null : name.trim();

        Page<Food> foods = foodRepository.searchFoods(merchantId,categoryId,keyword,pageable);

        return foods.map(FoodMapper::toFoodResponse);
    }

    @Override
    public ProductDetailResponse findOneProductById(Long id) {
        Food food = foodRepository.findByIdAndAvailableTrue(id)
                .orElseThrow(() -> new RuntimeException("Product not found or inactive"));

        return mapToProductDetail(food);
    }
}
