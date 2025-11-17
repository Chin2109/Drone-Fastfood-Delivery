package com.zosh.mapper;


public class DeliveryFeeUtil {

    //  - <= 0km  => 0đ
    //  - <= 1km  => 15000đ
    //  - > 1km   => 15000 + 3000đ * (distance - 1)
    public static long calculateDeliveryFee(double distanceKm) {
        if (distanceKm <= 0) return 0L;

        long base = 15000L;
        if (distanceKm <= 1.0) {
            return base;
        }

        double extraKm = distanceKm - 1.0;
        long perKm = 3000L;

        return base + Math.round(extraKm * perKm);
    }
}
