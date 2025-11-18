package com.zosh.repository;

import java.util.List;
import java.util.Optional;

import com.zosh.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.zosh.model.Restaurant;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    @Query("SELECT r FROM Restaurant r LEFT JOIN FETCH r.restaurantImages WHERE r.id = :id")
    Optional<Restaurant> findByIdWithImages(@Param("id") Long id);

    @EntityGraph(attributePaths = {"address", "restaurantImages"})
    Optional<Restaurant> findWithAddressAndImagesById(Long id);

    Optional<Restaurant> findByOwner(User owner);
}
