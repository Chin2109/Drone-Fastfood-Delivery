package com.zosh.request;

import com.zosh.domain.DroneStatus;
import lombok.Data;

@Data
public class CreateDroneRequest {
    private Integer battery;
    private DroneStatus status;      // optional, null thì mặc định AVAILABLE

    private Double payloadCapacityKg;
    private String serialNumber;
    private String telemetryId;

    private Long hubId;              // optional: id của DroneHub, nếu bạn muốn gán luôn
}
