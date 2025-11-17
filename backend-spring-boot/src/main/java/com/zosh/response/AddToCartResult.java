package com.zosh.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AddToCartResult {
    private String message;
    private Object data; // có thể là CartItemResponse hoặc null
}