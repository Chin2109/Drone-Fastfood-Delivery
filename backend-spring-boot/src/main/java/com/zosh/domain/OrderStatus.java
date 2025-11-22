package com.zosh.domain;

public enum OrderStatus {
    PENDING,     // Khách đặt, chưa phân công drone
    ASSIGNED,    // Admin gán drone
    CONFIRMED,   // Nhà hàng xác nhận
    FINISHED,    //Nhà hàng đã chuẩn bị món
    DELIVERING,  // Drone đang giao
    DELIVERED,   // Drone đã tới vị trí giao hàng
    RECEIVED     // Khách đã nhận hàng
}
