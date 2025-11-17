package com.zosh.dto;

import lombok.Data;

import java.util.List;

@Data
public class TemporaryAddressDto {

    private String street;

    // { "type": "Point", "coordinates": [lng, lat] }
    private Location location;

    @Data
    public static class Location {
        private String type;              // "Point"
        private List<Double> coordinates; // [longitude, latitude]
    }
}