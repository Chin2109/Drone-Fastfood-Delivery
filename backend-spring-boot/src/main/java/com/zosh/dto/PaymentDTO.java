package com.zosh.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;


public abstract class PaymentDTO {

    // THAY ĐỔI: Thêm @Getter để Jackson có thể đọc các trường
    @Getter
    @Builder
    @AllArgsConstructor
    public static class VNPayResponse {
        // Dùng quyền truy cập mặc định (package-private) cho trường, nhưng @Getter sẽ tạo public methods
        String code;
        String message;
        String paymentUrl;
    }
}