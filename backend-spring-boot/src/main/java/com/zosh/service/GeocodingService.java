package com.zosh.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;
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
}
