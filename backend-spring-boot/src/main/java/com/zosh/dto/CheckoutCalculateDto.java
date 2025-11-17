package com.zosh.dto;

import lombok.Data;

import java.util.List;

@Data
public class CheckoutCalculateDto {

    // Danh sách ID các cart item cần thanh toán
    private List<Long> cartItemId;

    // ID địa chỉ đã lưu (nếu người dùng chọn)
    private Long addressId;

    // Địa chỉ tạm (nếu không dùng addressId)
    private TemporaryAddressDto temporaryAddress;

    // Khoảng cách FE gửi lên (km)
    private Double distance;
}
