package com.zosh.mapper;

import com.zosh.dto.DroneDto;
import com.zosh.dto.DroneOptionDto;
import com.zosh.model.Drone;

public class DroneMapper {

    public static DroneDto toDto(Drone d) {
        if (d == null) return null;
        DroneDto dto = new DroneDto();
        dto.setId(d.getId());
        dto.setBattery(d.getBattery());
        dto.setStatus(d.getStatus());
        dto.setLatitude(d.getLatitude());
        dto.setLongitude(d.getLongitude());
        dto.setPayloadCapacityKg(d.getPayloadCapacityKg());
        dto.setSerialNumber(d.getSerialNumber());
        dto.setTelemetryId(d.getTelemetryId());

        if (d.getHub() != null) {
            dto.setHubId(d.getHub().getId());
            dto.setHubAddress(d.getHub().getAddress().getFullName());
        }

        if (d.getOrder() != null) {
            dto.setOrderId(d.getOrder().getId());
        }
        return dto;
    }

    // chỉ cho phép update một số field
    public static void updateFromDto(Drone d, DroneDto dto) {
        d.setBattery(dto.getBattery());
        d.setPayloadCapacityKg(dto.getPayloadCapacityKg());
        d.setSerialNumber(dto.getSerialNumber());
        d.setTelemetryId(dto.getTelemetryId());
        // không đụng location, hub, order ở đây
    }

    public static DroneOptionDto toOptionDto(Drone d) {
        DroneOptionDto dto = new DroneOptionDto();
        dto.setId(d.getId());
        dto.setBattery(d.getBattery());
        dto.setStatus(d.getStatus());
        dto.setSerialNumber(d.getSerialNumber());
        dto.setPayloadCapacityKg(d.getPayloadCapacityKg());
        if (d.getHub() != null) {
            // tuỳ droneHub có name / address
            dto.setHubName("Hub #" + d.getHub().getId());
        }
        return dto;
    }
}
