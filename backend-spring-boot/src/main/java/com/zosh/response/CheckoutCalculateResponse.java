package com.zosh.response;

import lombok.Data;

import java.util.List;

@Data
public class CheckoutCalculateResponse {

    private List<CartPreviewResponse.CartPreviewItem> items;

    private Long subtotal;
    private Long deliveryFee;
    private Long finalTotal;
}
