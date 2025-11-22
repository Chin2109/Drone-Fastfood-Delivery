package com.zosh.service;

import com.zosh.domain.DroneStatus;
import com.zosh.dto.DroneDto;
import com.zosh.mapper.DroneMapper;
import com.zosh.model.Drone;
import com.zosh.request.CreateDroneRequest;

import java.util.List;
import java.util.stream.Collectors;

public interface DroneService {
    public List<DroneDto> getAll();

    public DroneDto getById(Long id);

    public DroneDto updateDrone(Long id, DroneDto dto);

    public DroneDto updateStatus(Long id, DroneStatus status);

    public DroneDto createDrone(CreateDroneRequest req);
}
