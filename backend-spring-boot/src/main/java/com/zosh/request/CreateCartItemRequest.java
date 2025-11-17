package com.zosh.request;

import lombok.Data;

import java.util.List;

@Data
public class CreateCartItemRequest {
    private Long productId;
    private Integer quantity;
    private List<Long> selectedToppingIds;
}
