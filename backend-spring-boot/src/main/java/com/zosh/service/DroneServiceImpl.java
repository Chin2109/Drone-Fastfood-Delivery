package com.zosh.service;

import com.zosh.domain.DroneStatus;
import com.zosh.dto.DroneDto;
import com.zosh.mapper.DroneMapper;
import com.zosh.model.Drone;
import com.zosh.repository.DroneHubRepository;
import com.zosh.repository.DroneRepository;
import com.zosh.request.CreateDroneRequest;
import com.zosh.service.DroneService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor

public class DroneServiceImpl implements DroneService {

    @Autowired
    private final DroneRepository droneRepository;
    @Autowired
    private final DroneHubRepository droneHubRepository;


    public List<DroneDto> getAll() {
        return droneRepository.findAll()
                .stream()
                .map(DroneMapper::toDto)
                .collect(Collectors.toList());
    }

    public DroneDto getById(Long id) {
        Drone d = droneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drone không tồn tại"));
        return DroneMapper.toDto(d);
    }

    public DroneDto updateDrone(Long id, DroneDto dto) {
        Drone d = droneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drone không tồn tại"));
        DroneMapper.updateFromDto(d, dto);
        d = droneRepository.save(d);
        return DroneMapper.toDto(d);
    }

    public DroneDto updateStatus(Long id, DroneStatus status) {
        Drone d = droneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drone không tồn tại"));
        d.setStatus(status);
        d = droneRepository.save(d);
        return DroneMapper.toDto(d);
    }

    public DroneDto createDrone(CreateDroneRequest req) {
        Drone d = new Drone();

        d.setBattery(req.getBattery());
        d.setStatus(req.getStatus() != null ? req.getStatus() : DroneStatus.AVAILABLE);

        d.setPayloadCapacityKg(req.getPayloadCapacityKg());
        d.setSerialNumber(req.getSerialNumber());
        d.setTelemetryId(req.getTelemetryId());

        // location để null, sau này cập nhật bằng telemetry / service khác
        // gán hub nếu có
        if (req.getHubId() != null) {
            droneHubRepository.findById(req.getHubId()).ifPresent(d::setHub);
        }

        // order mặc định null
        d.setOrder(null);

        d = droneRepository.save(d);
        return DroneMapper.toDto(d);
    }

}
