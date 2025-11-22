package com.zosh.service;
import com.zosh.dto.DroneOptionDto;
import com.zosh.dto.OrderDetailDto;
import com.zosh.dto.OrderListItemDto;

import java.util.List;

public interface DispatchService {

        public List<OrderListItemDto> getOrders(String status, String keyword);

        public OrderDetailDto getOrderDetail(Long id);

        public List<DroneOptionDto> getAvailableDronesForDispatch();

        public OrderDetailDto assignDrone(Long orderId, Long droneId);

        public OrderDetailDto startFlight(Long orderId);
}
