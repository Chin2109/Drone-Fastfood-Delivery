package com.zosh.mapper;

import com.zosh.model.Food;
import com.zosh.model.IngredientCategory;
import com.zosh.model.IngredientsItem;
import com.zosh.response.*;

import java.util.stream.Collectors;

public class FoodMapper {

    public static FoodResponse toFoodResponse(Food f) {
        FoodResponse dto = new FoodResponse();

        dto.setId(f.getId());
        dto.setName(f.getName());
        dto.setBasePrice(f.getPrice());
        dto.setDescription(f.getDescription());
        dto.setImage(f.getImage());
        dto.setAvailable(f.isAvailable());

        // Category
        CategoryResponse cateDto = new CategoryResponse();
        cateDto.setId(f.getFoodCategory().getId());
        cateDto.setName(f.getFoodCategory().getName());
        cateDto.setMerchantId(f.getFoodCategory().getRestaurant().getId());
        dto.setCategory(cateDto);

        // IngredientCategories → productToppingGroups
        dto.setProductToppingGroups(
                f.getIngredientCategories()
                        .stream()
                        .map(FoodMapper::toProductToppingGroupResponse)
                        .collect(Collectors.toList())
        );

        return dto;
    }

    private static ProductToppingGroupResponse toProductToppingGroupResponse(IngredientCategory c) {
        ProductToppingGroupResponse dto = new ProductToppingGroupResponse();

        dto.setId(c.getId());
        dto.setProductId(c.getFood().getId());
        dto.setToppingGroupId(c.getId()); // hoặc field gì đúng với DB của bạn

        dto.setCreatedAt(c.getFood().getCreationDate());
        dto.setUpdatedAt(c.getFood().getCreationDate());

        // toppingGroup: map IngredientCategory → ToppingGroupResponse
        ToppingGroupResponse tg = new ToppingGroupResponse();
        tg.setId(c.getId());
        tg.setName(c.getName());
        tg.set_required(false); // Không có field trong entity, bạn set theo logic
        tg.setMinSelection(1);
        tg.setMaxSelection(c.getIngredients().size());

        // toppings
        tg.setToppings(
                c.getIngredients()
                        .stream()
                        .map(FoodMapper::toToppingResponse)
                        .collect(Collectors.toList())
        );

        dto.setToppingGroup(tg);

        return dto;
    }

    private static ToppingResponse toToppingResponse(IngredientsItem item) {
        ToppingResponse dto = new ToppingResponse();

        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setPrice(item.getPrice());

        return dto;
    }
}

