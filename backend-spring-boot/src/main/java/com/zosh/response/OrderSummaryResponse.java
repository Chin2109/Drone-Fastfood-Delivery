package com.zosh.response;

import lombok.Data;

@Data
public class OrderSummaryResponse {
    private Long id;
    private String orderStatus;
    private Long totalAmount;   // hoặc totalPrice tuỳ bạn đang dùng cái nào
    private String createdAt;   // format String để dễ hiển thị
    private RestaurantSummary restaurant;

    @Data
    public static class RestaurantSummary {
        private Long id;
        private String name;
        private String image; // hoặc logo
    }
}

