package com.zosh.repository;

import java.util.List;
import java.util.Optional;

import com.zosh.domain.OrderStatus;
import com.zosh.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.zosh.model.Order;
import com.zosh.model.User;

public interface OrderRepository extends JpaRepository<Order,Long> {
	@Query("SELECT o FROM Order o WHERE o.customer.id = :userId")
	List<Order> findAllUserOrders(@Param("userId")Long userId);
    
	@Query("SELECT o FROM Order o WHERE o.restaurant.id = :restaurantId")
	List<Order> findOrdersByRestaurantId(@Param("restaurantId") Long restaurantId);

	List<Order> findByCustomerOrderByCreatedAtDesc(User customer);

	List<Order> findByRestaurantOrderByCreatedAtDesc(Restaurant restaurant);

	List<Order> findByOrderStatus(String status);
}
