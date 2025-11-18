package com.zosh.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.zosh.domain.OrderStatus;
import com.zosh.repository.*;
import com.zosh.request.CreateOrderFromCartRequest;
import jakarta.transaction.Transactional;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stripe.exception.StripeException;
import com.zosh.Exception.CartException;
import com.zosh.Exception.OrderException;
import com.zosh.Exception.RestaurantException;
import com.zosh.Exception.UserException;
import com.zosh.model.Address;
import com.zosh.model.Cart;
import com.zosh.model.CartItem;
import com.zosh.model.Order;
import com.zosh.model.OrderItem;
import com.zosh.model.Restaurant;
import com.zosh.model.User;
import com.zosh.request.CreateOrderRequest;
@Service
public class OrderServiceImplementation implements OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private GeometryFactory geometryFactory;
    @Autowired
    private RestaurantRepository restaurantRepository;

    @Override
    @Transactional
    public Order createOrderFromCart(CreateOrderFromCartRequest request)
    {
        // 1. Lấy cart
        Cart cart = cartRepository.findById(request.getCartId())
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + request.getCartId()));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Address add = new Address();
        add.setFullName(request.getAddress());
        Coordinate coor = new Coordinate(request.getLng(),request.getLat());
        Point point = geometryFactory.createPoint(coor);
        add.setLocation(point);
        add = addressRepository.save(add);

        // 3. Tạo Order
        Order order = new Order();
        order.setCustomer(cart.getUser());
        order.setRestaurant(cart.getRestaurant());
        order.setDeliveryAddress(add);
        order.setCreatedAt(new Date());

        // Sau khi thanh toán VNPay thành công nên để PAID, tùy bạn quy ước
        order.setOrderStatus(OrderStatus.RECEIVED.name());

        // set tạm để tránh null
        order.setTotalAmount(0L);
        order.setTotalItem(0);
        order.setTotalPrice(0L);

        order = orderRepository.save(order);

        // 4. Tạo OrderItem từ CartItem
        int totalItem = 0;
        long totalPrice = 0L;

        for (CartItem ci : cart.getItems()) {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setFood(ci.getFood());
            oi.setQuantity(ci.getQuantity());
            oi.setIngredientDetailsJson(ci.getIngredientDetailsJson());
            oi.setTotalPrice(ci.getTotalPrice()); // totalPrice của dòng trong cart

            orderItemRepository.save(oi);

            totalItem += ci.getQuantity();
            totalPrice += ci.getTotalPrice();
        }

        // 5. Cập nhật tổng tiền, tổng số lượng
        order.setTotalItem(totalItem);
        order.setTotalPrice(totalPrice);
        order.setTotalAmount(totalPrice); // nếu chưa có phí ship/thuế thì cho bằng luôn

        order = orderRepository.save(order);

        // 6. (Optional) clear cart sau khi đặt hàng
        // Nếu bạn muốn xóa hẳn cart:
        // cartRepository.delete(cart);

        // clear items và set totalPrice = 0
        cart.getItems().clear();
        cart.setTotalPrice(0L);
        cartRepository.save(cart);

        return order;
    }


    @Override
    public List<Order> getOrdersOfUser(User user) {
        return orderRepository.findByCustomerOrderByCreatedAtDesc(user);
    }

    @Override
    public List<Order> getOrdersOfRestaurant(User user) {
        Restaurant restaurant = restaurantRepository.findByOwner(user)
                .orElseThrow();

        return orderRepository.findByRestaurantOrderByCreatedAtDesc(restaurant);
    }

    @Override
    public Order getOrderOfUserById(User user, Long orderId) {
        return orderRepository.findById(orderId).orElseThrow();
//                .filter(o -> o.getCustomer().getId().equals(user.getId()))
//                .orElseThrow(() -> new RuntimeException("Order not found or not belong to user"));
    }

    @Override
    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String current = order.getOrderStatus();

        // Có thể thêm logic kiểm tra hợp lệ:
        if ("RECEIVED".equals(current) && "CONFIRMED".equals(newStatus)) {
            order.setOrderStatus(newStatus);
        } else if ("CONFIRMED".equals(current) && "OUT_FOR_DELIVERY".equals(newStatus)) {
            order.setOrderStatus(newStatus);
        } else {
            throw new RuntimeException("Trạng thái không hợp lệ");
        }

        return orderRepository.save(order);
    }

}
