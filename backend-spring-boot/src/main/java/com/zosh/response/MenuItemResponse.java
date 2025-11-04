package com.zosh.response;

import com.zosh.model.Category;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.util.List;

@Data
public class MenuItemResponse {
    private Long categoryId;
    private String categoryName;
    private List<FoodResponse> foods;
}
