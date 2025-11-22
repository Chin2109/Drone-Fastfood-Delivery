package com.zosh.service;

import com.zosh.domain.DroneStatus;
import com.zosh.domain.OrderStatus;
import com.zosh.dto.DroneOptionDto;
import com.zosh.dto.OrderDetailDto;
import com.zosh.dto.OrderListItemDto;
import com.zosh.mapper.DroneMapper;
import com.zosh.mapper.OrderMapper;
import com.zosh.model.Drone;
import com.zosh.model.Order;
import com.zosh.repository.DroneRepository;
import com.zosh.repository.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@Transactional
public class DispatchServiceImpl implements DispatchService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private DroneRepository droneRepository;

    public List<OrderListItemDto> getOrders(String status, String keyword) {
        List<Order> orders;

        if (status != null && !status.equalsIgnoreCase("ALL")) {
            OrderStatus st = OrderStatus.valueOf(status);
            orders = orderRepository.findByOrderStatus(st.name());
        } else {
            orders = orderRepository.findAll();
        }

        String kw = keyword == null ? "" : keyword.trim().toLowerCase();

        return orders.stream()
                .filter(o -> {
                    if (kw.isEmpty()) return true;
                    String idStr = o.getId() != null ? o.getId().toString() : "";
                    String customerName = o.getCustomer() != null ? o.getCustomer().getFullName().toLowerCase() : "";
                    String restaurantName = o.getRestaurant() != null ? o.getRestaurant().getName().toLowerCase() : "";
                    return idStr.contains(kw) || customerName.contains(kw) || restaurantName.contains(kw);
                })
                .map(OrderMapper::toListDto)
                .toList();
    }

    public OrderDetailDto getOrderDetail(Long id) {
        Order o = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại"));
        return OrderMapper.toDetailDto(o);
    }

    public List<DroneOptionDto> getAvailableDronesForDispatch() {
        // demo: cho tất cả drone có status AVAILABLE và pin >= 30, chưa gán order
        List<Drone> drones = droneRepository.findAll();

        return drones.stream()
                .filter(d -> d.getStatus() == DroneStatus.AVAILABLE
                        && (d.getBattery() >= 30))
                .map(DroneMapper::toOptionDto)
                .toList();
    }

    public OrderDetailDto assignDrone(Long orderId, Long droneId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại"));

        if (!Objects.equals(order.getOrderStatus(), OrderStatus.PENDING.toString())) {
            throw new RuntimeException("Chỉ gán drone cho đơn PENDING");
        }

        Drone drone = droneRepository.findById(droneId)
                .orElseThrow(() -> new RuntimeException("Drone không tồn tại"));

        if (drone.getStatus() != DroneStatus.AVAILABLE) {
            throw new RuntimeException("Drone không sẵn sàng");
        }

        // cập nhật binding
        drone.setOrder(order);
        order.setDrone(drone);
        drone.setStatus(DroneStatus.FLYING_TO_PICKUP); // bắt đầu bay từ hub đến nhà hàng
        order.setOrderStatus(OrderStatus.ASSIGNED.name());

        droneRepository.save(drone);
        orderRepository.save(order);

        return OrderMapper.toDetailDto(order);
    }

    public OrderDetailDto startFlight(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại"));

        // chỉ cho phép khi nhà hàng đã chuẩn bị xong món
        if (!Objects.equals(order.getOrderStatus(), OrderStatus.FINISHED.name())) {
            throw new RuntimeException("Chỉ được bắt đầu bay khi đơn ở trạng thái FINISHED (nhà hàng đã chuẩn bị xong món)");
        }

        // tìm drone đang gán cho đơn này
        Drone drone = droneRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn này chưa gán drone"));

        // cập nhật trạng thái
        order.setOrderStatus(OrderStatus.DELIVERING.name());          // đơn chuyển sang đang giao
        drone.setStatus(DroneStatus.FLYING_TO_PICKUP);         // drone bay từ hub đến nhà hàng

        droneRepository.save(drone);
        orderRepository.save(order);

        return OrderMapper.toDetailDto(order); // dto chi tiết đơn mà FE đang dùng
    }

}
