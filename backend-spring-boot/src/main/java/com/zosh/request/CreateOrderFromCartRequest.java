package com.zosh.request;

import lombok.Data;

@Data
public class CreateOrderFromCartRequest {
    private Long cartId;
    private String address;
    private Double lng;
    private Double lat;
}
