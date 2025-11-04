package com.zosh.response;

import lombok.Data;

import java.util.List;

@Data
public class FoodResponse {
    private String name;
    private String description;
    private Long price;
    private List<String> images;
    private boolean available;
}
