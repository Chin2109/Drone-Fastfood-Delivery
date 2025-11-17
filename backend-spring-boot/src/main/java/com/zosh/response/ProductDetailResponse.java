package com.zosh.response;

import lombok.Data;

import java.util.List;

@Data
public class ProductDetailResponse {
    private Long id;
    private String name;
    private String description;
    private Long basePrice; // map từ Food.price
    private String image;

    private List<ProductToppingGroupResponse> productToppingGroups;
    private CategoryShortResponse category;

    @Data
    public static class ProductToppingGroupResponse {
        private Long id;
        private Long productId;
        private Long toppingGroupId;
        // nếu cần createdAt/updatedAt thì thêm sau
        private ToppingGroupResponse toppingGroup;
    }

    @Data
    public static class ToppingGroupResponse {
        private Long id;
        private String name;
        // tên field là is_required để JSON ra đúng "is_required"
        private boolean is_required;
        private Integer minSelection;
        private Integer maxSelection;
        private List<ToppingResponse> toppings;
    }

    @Data
    public static class ToppingResponse {
        private Long id;
        private String name;
        private Long price;
    }

    @Data
    public static class CategoryShortResponse {
        private String name;
        private Long merchantId;
    }
}

