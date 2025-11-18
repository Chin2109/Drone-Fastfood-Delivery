package com.zosh.service;

import java.util.List;

import com.stripe.exception.StripeException;
import com.zosh.Exception.CartException;
import com.zosh.Exception.OrderException;
import com.zosh.Exception.RestaurantException;
import com.zosh.Exception.UserException;
import com.zosh.model.Order;
import com.zosh.model.User;
import com.zosh.request.CreateOrderFromCartRequest;
import com.zosh.request.CreateOrderRequest;

public interface OrderService {
    public Order createOrderFromCart(CreateOrderFromCartRequest request);
    List<Order> getOrdersOfUser(User user);
    List<Order> getOrdersOfRestaurant(User user);
    Order getOrderOfUserById(User user, Long orderId);
    Order updateOrderStatus(Long orderId, String newStatus);
}
