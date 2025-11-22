package com.zosh.dto;

import com.zosh.domain.DroneStatus;
import com.zosh.domain.OrderStatus;
import lombok.Data;

import java.util.Date;

@Data
public class OrderDetailDto {
    private Long id;
    private String customerName;
    private String customerPhone; // nếu có
    private String restaurantName;
    private String restaurantAddress;
    private Long totalPrice;
    private int totalItem;
    private String orderStatus;
    private Date createdAt;

    private String deliveryAddressText;

    private Long droneId;
    private DroneStatus droneStatus;
    private String droneSerial;
}
