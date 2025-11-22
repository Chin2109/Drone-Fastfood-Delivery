package com.zosh.dto;

import com.zosh.domain.DroneStatus;
import com.zosh.domain.OrderStatus;
import lombok.Data;

import java.util.Date;

@Data
public class OrderListItemDto {
    private Long id;
    private String customerName;
    private String restaurantName;
    private Long totalPrice;
    private String orderStatus;
    private Date createdAt;

    private Long droneId;
    private DroneStatus droneStatus;
}