package com.zosh.dto;

import com.zosh.domain.DroneStatus;
import lombok.Data;

@Data
public class DroneDto {
    private Long id;
    private Integer battery;
    private DroneStatus status;

    private Double latitude;
    private Double longitude;

    private Double payloadCapacityKg;
    private String serialNumber;
    private String telemetryId;

    private Long hubId;
    private String hubAddress;

    private Long orderId;
}
