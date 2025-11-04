package com.zosh.request;

import lombok.Data;

import java.util.List;

@Data
public class IngredientCategoryDTO {
    private String name;
    private List<IngredientItemDTO> ingredients;
}
