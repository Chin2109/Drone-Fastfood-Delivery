package com.zosh.response;

import lombok.Data;

import java.util.Date;

@Data
public class ProductToppingGroupResponse {
    private Long id;
    private Long productId;
    private Long toppingGroupId;
    private Date createdAt;
    private Date updatedAt;

    private ToppingGroupResponse toppingGroup;
}
