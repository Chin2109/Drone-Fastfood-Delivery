package com.zosh.controller;

import com.zosh.dto.DroneOptionDto;
import com.zosh.dto.OrderDetailDto;
import com.zosh.dto.OrderListItemDto;
import com.zosh.service.DispatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dispatch")
public class DispatchController {

    private final DispatchService dispatchService;

    public DispatchController(DispatchService dispatchService) {
        this.dispatchService = dispatchService;
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderListItemDto>> listOrders(
            @RequestParam(value = "status", required = false, defaultValue = "PENDING") String status,
            @RequestParam(value = "search", required = false) String search
    ) {
        return ResponseEntity.ok(dispatchService.getOrders(status, search));
    }

    // GET /api/admin/dispatch/orders/{id}
    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderDetailDto> getOrderDetail(@PathVariable Long id) {
        return ResponseEntity.ok(dispatchService.getOrderDetail(id));
    }

    // GET /api/admin/dispatch/available-drones
    @GetMapping("/available-drones")
    public ResponseEntity<List<DroneOptionDto>> getAvailableDrones() {
        return ResponseEntity.ok(dispatchService.getAvailableDronesForDispatch());
    }

    // POST /api/admin/dispatch/orders/{orderId}/assign?droneId=xxx
    @PostMapping("/orders/{orderId}/assign")
    public ResponseEntity<OrderDetailDto> assignDrone(
            @PathVariable Long orderId,
            @RequestParam Long droneId
    ) {
        return ResponseEntity.ok(dispatchService.assignDrone(orderId, droneId));
    }

    @PostMapping("/orders/{orderId}/start-flight")
    public ResponseEntity<OrderDetailDto> startFlight(@PathVariable Long orderId) {
        return ResponseEntity.ok(dispatchService.startFlight(orderId));
    }
}

