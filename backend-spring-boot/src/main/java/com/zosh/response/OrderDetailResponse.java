package com.zosh.response;
import lombok.Data;
import java.util.List;

@Data
public class OrderDetailResponse {

    private Long id;
    private String merchantName;

    private String deliveryAddress;
    private Double deliveryLat;
    private Double deliveryLng;

    private String status;

    private Long subtotal;
    private Long deliveryFee;
    private Long finalTotal;

    private RestaurantDto restaurant;
    private List<ItemDto> items;

    @Data
    public static class RestaurantDto {
        private Long id;
        private String name;
        private AddressDto address;
    }

    @Data
    public static class AddressDto {
        private Double latitude;
        private Double longitude;
        // nếu bạn có GeoJSON location thì có thể thêm vào:
        // private LocationDto location;
    }

    @Data
    public static class ItemDto {
        private Long id;
        private String productName;
        private int quantity;
        private Long totalPrice;
        private String totalPriceFormatted;
    }
}
