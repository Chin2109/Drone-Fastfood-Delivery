package com.zosh.domain;

public enum OrderStatus {
    RECEIVED, //Đơn hàng đã được hệ thống nhận thành công.Khách hàng vừa thanh toán, chưa gửi đến Nhà hàng.
    CONFIRMED, //Đã được nhà hàng xác nhận
    READY_FOR_PICKUP, //Nhà hàng đã hoàn thành, sẵn sàng tại khu vực lấy hàng
    AWAITING_DRONE, //Đang chờ hệ thống phân cho Drone và đến lấy
    OUT_FOR_DELIVERY, //Drone đang bay từ trạm đến lấy hàng, giao hàng
    DROPPING_OFF, //Lơ lửng để thả hàng, dùng cảm biến lực căng và xử lý ảnh để chờ người dùng lấy hàng
    DELIVERED, //Hàng đã được lấy
}
