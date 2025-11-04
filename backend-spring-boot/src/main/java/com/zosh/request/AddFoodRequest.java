package com.zosh.request;

import com.zosh.model.Category;
import com.zosh.model.IngredientsItem;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class AddFoodRequest {
    private String name;
    private String description;
    private Long price;
    private Long foodCategoryId;
    private List<String> images;
    private boolean available;
    private List<IngredientCategoryDTO> ingredientCategoryDTOs;
    private Date creationDate;
}
