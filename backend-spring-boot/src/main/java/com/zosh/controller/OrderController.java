package com.zosh.controller;

import com.zosh.mapper.OrderMapper;
import com.zosh.model.Order;
import com.zosh.model.User;
import com.zosh.repository.UserRepository;
import com.zosh.request.CreateOrderFromCartRequest;
import com.zosh.response.OrderDetailResponse;
import com.zosh.response.OrderSummaryResponse;
import com.zosh.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/order")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<Order> createOrderFromCart(@RequestBody CreateOrderFromCartRequest request) {
        Order order = orderService.createOrderFromCart(request);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public List<OrderSummaryResponse> getMyOrders(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại với email: " + email));

        List<Order> orders = orderService.getOrdersOfUser(user);

        return orders.stream()
                .map(OrderMapper::toSummary)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public OrderDetailResponse getOrderDetail(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại với email: " + email));

        Order order = orderService.getOrderOfUserById(user, id);

        return OrderMapper.toDetail(order);
    }
}
