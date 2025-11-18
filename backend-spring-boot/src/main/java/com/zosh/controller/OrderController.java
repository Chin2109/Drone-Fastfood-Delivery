package com.zosh.controller;

import com.zosh.model.Order;
import com.zosh.request.CreateOrderFromCartRequest;
import com.zosh.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/order")
public class OrderController {
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<Order> createOrderFromCart(
            @RequestBody CreateOrderFromCartRequest request,
            @RequestParam String address,
            @RequestParam Double lng,
            @RequestParam Double lat
    ) {
        Order order = orderService.createOrderFromCart(request, address, lng, lat);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }
}
