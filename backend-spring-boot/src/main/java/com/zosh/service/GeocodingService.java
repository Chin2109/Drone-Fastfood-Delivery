package com.zosh.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class GeocodingService {
    @Value("${goong.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://rsapi.goong.io/geocode";
    private static final double EARTH_RADIUS_KM = 6371.0;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public GeocodingService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        //khởi tạo webclient với base url
        this.webClient = webClientBuilder.baseUrl(BASE_URL).build();
        this.objectMapper = objectMapper;
    }

    //cấu trúc responses của Goong
    @Getter
    @Setter
    public static class GeocodingResult {
        private List<Result> results;
    }

    @Getter
    @Setter
    public static class Result {
        private Geometry geometry;
        private String formatted_address;
    }

    @Getter
    @Setter
    public static class Geometry {
        private Location location;
    }

    @Getter
    @Setter
    public static class Location {
        private double lat;
        private double lng;
    }

    public Location getCoordinates(String fullAddress) throws Exception {
        //mã hóa chuỗi ký tự non-ascii sang định dạng ascii để truyền url
        String encodedAddress = URLEncoder.encode(fullAddress, StandardCharsets.UTF_8);

        String uri = String.format("?address=%s&api_key=%s",encodedAddress,apiKey);

        GeocodingResult response = webClient.get()
                .uri(uri)
                .retrieve()
                .bodyToMono(GeocodingResult.class)
                .block();
        if(response != null && !response.getResults().isEmpty()) {
            return response.getResults().get(0).getGeometry().getLocation();
        }

        throw new Exception("Khong tim thay toa do cua dia chi: " + fullAddress);
    }

    public String getFullAddress(double lat, double lng) throws Exception {
        String uri = String.format("?latlng=%s,%s&api_key=%s",lat,lng,apiKey);

        GeocodingResult response = webClient.get()
                .uri(uri)
                .retrieve()
                .bodyToMono(GeocodingResult.class)
                .block();

        if(response != null && !response.getResults().isEmpty()) {
            return response.getResults().get(0).getFormatted_address();
        }

        throw new Exception("Khong tim thay dia chi cua toa do " + lat + " " + lng);
    }

    //không cần tạo đối tượng, chủ yếu để tính toán
    public static double calculateDistanceKm(double lat1, double lng1, double lat2, double lng2) {
        // 1. Chuyển đổi độ sang radian
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lng2 - lng1);

        // 2. Chuyển đổi các tọa độ sang radian
        double lat1Rad = Math.toRadians(lat1);
        double lat2Rad = Math.toRadians(lat2);

        // 3. Công thức Haversine
        double a = Math.pow(Math.sin(dLat / 2), 2) +
                Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // 4. Kết quả khoảng cách (Distance = R * c)
        return EARTH_RADIUS_KM * c;
    }

}
