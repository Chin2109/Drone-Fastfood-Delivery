package com.zosh.controller;

import com.zosh.domain.DroneStatus;
import com.zosh.dto.DroneDto;
import com.zosh.request.CreateDroneRequest;
import com.zosh.service.DroneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/drones")
public class DroneController {

    @Autowired
    private DroneService droneService;

    @PostMapping
    public ResponseEntity<DroneDto> create(@RequestBody CreateDroneRequest request) {
        DroneDto dto = droneService.createDrone(request);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<DroneDto>> getAll() {
        return ResponseEntity.ok(droneService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DroneDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(droneService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DroneDto> updateDrone(
            @PathVariable Long id,
            @RequestBody DroneDto dto
    ) {
        return ResponseEntity.ok(droneService.updateDrone(id, dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<DroneDto> updateStatus(
            @PathVariable Long id,
            @RequestParam("status") DroneStatus status
    ) {
        return ResponseEntity.ok(droneService.updateStatus(id, status));
    }
}