package com.zosh.response;

import lombok.Data;

import java.util.List;

@Data
public class FoodResponse {
    private Long id;
    private String name;
    private Long basePrice;
    private String description;
    private String image;
    private boolean available;

    private List<ProductToppingGroupResponse> productToppingGroups;
    private CategoryResponse category;
}
