package com.zosh.request;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UpdateFoodRequest {
    private String name;
    private String description;
    private Long price;
    private Long foodCategoryId;
    private Boolean available;

    private List<IngredientCategoryDTO> ingredientCategoryDTOs = new ArrayList<>();

    @Data
    public static class IngredientCategoryDTO {
        private String name;
        private List<IngredientItemDTO> ingredients = new ArrayList<>();
    }

    @Data
    public static class IngredientItemDTO {
        private String name;
        private Long price;
        private Boolean inStoke;
    }
}
