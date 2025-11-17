package com.zosh.response;

import lombok.Data;

import java.util.List;

@Data
public class RestaurantDetailResponse {
    private Long id;
    private String name;
    //nếu inner class này không static -> không the new AddressResonse(); (tạo instance của inner class)
    private AddressResponse address;
    private List<ImageResponse> backgroundImages;

    @Data
    public static class AddressResponse {
        private String street;
        private Double latitude;
        private Double longitude;
    }

    @Data
    public static class ImageResponse {
        private String url;
    }
}



