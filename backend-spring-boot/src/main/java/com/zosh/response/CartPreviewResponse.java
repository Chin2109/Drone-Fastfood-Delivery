package com.zosh.response;

import lombok.Data;

import java.util.List;

@Data
public class CartPreviewResponse {
    private List<CartPreviewItem> items;
    private Long totalAmount;

    @Data
    public static class CartPreviewItem {
        private Long cartItemId;
        private Long productId;
        private String productName;
        private String image;
        private Integer quantity;
        private Long priceProduct;
        private List<CartPreviewTopping> toppings;
        private Long subtotal;
    }

    @Data
    public static class CartPreviewTopping {
        private Long toppingId;
        private String toppingName;
        private Long price;
        private Integer quantity;
        // groupId: bên mình không có toppingGroupId, nếu cần có thể thêm sau
        private Long groupId;
    }
}