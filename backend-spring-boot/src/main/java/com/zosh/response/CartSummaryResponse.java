package com.zosh.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class CartSummaryResponse {
    private Long cartId;
    private Long merchantId;
    private String merchantName;
    private List<CartItemResponse> items;
    private Long total;

    @Data
    public static class CartItemResponse {
        private Long id;
        private int quantity;
        private ProductInCartResponse product;
        private List<CartToppingResponse> toppings;
        private Long subTotal;
    }

    @Data
    public static class ProductInCartResponse {
        private Long id;
        private String name;
        private String image;

        @JsonProperty("base_price")
        private Long basePrice;
    }

    @Data
    public static class CartToppingResponse {
        private Long id;
        private String name;
        private Long price;
        private int quantity;
    }
}


