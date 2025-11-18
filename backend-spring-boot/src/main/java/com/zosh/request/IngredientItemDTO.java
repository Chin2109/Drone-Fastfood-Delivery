package com.zosh.request;

import lombok.Data;

@Data
public class IngredientItemDTO {
    private String name;
    private Long price;
    private boolean inStoke=true;
}
