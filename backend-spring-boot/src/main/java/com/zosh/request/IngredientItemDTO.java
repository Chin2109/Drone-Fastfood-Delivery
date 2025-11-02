package com.zosh.request;

import com.zosh.model.IngredientCategory;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

public class IngredientItemDTO {
    private String name;
    private boolean inStoke=true;
}
