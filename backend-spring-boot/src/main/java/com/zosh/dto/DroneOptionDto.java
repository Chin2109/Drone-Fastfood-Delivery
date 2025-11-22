package com.zosh.dto;

import com.zosh.domain.DroneStatus;
import lombok.Data;

@Data
public class DroneOptionDto {
    private Long id;
    private Integer battery;
    private DroneStatus status;
    private String serialNumber;
    private Double payloadCapacityKg;
    private String hubName;
}