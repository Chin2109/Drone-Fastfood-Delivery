package com.zosh.domain;

public enum DroneStatus {
    AVAILABLE,//Drone đang ở Trạm, đủ pin và sẵn sàng nhận lệnh.
    CHARGING,//Drone đang kết nối với trạm sạc và đang nạp lại pin
    IN_MAINTENANCE,//Drone đang được bảo trì
    FLYING_TO_PICKUP,//Drone đang bay từ Hub đến Nhà hàng (điểm lấy hàng) để nhận đơn hàng
    AT_PICKUP_POINT,//Drone đã đến điểm lấy hàng, chờ được bỏ hàng lên (nhân viên xác nhận)
    OUT_FOR_DELIVERY,//Drone đã lấy hàng, đang bay đến địa chỉ giao
    DROPPING_OFF,//Drone đang lơ lửng, dùng cảm biến lực căng và xử lý ảnh để chờ người dùng lấy hàng
    RETURNING_TO_HUB,//Drone đã giao hàng thành công và đang bay về Trạm để kết thúc chuyến bay và sạc pin
    EMERGENCY_LANDING, //Drone gặp sự cố kỹ thuật/pin/thời tiết và đang thực hiện quy trình hạ cánh khẩn cấp
}
