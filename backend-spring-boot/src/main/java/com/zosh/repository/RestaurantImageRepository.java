package com.zosh.repository;

import com.zosh.domain.RestaurantRegisterImage;
import com.zosh.model.Restaurant;
import com.zosh.model.RestaurantImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RestaurantImageRepository extends JpaRepository<RestaurantImage, Long> {
    Optional<RestaurantImage> findByRestaurantAndType(Restaurant restaurant, RestaurantRegisterImage type);

    // Lấy nhiều loại ảnh cùng lúc (trả list)
    List<RestaurantImage> findByRestaurantAndTypeIn(Restaurant restaurant, List<RestaurantRegisterImage> types);

    // Nếu muốn tìm theo restaurantId (nếu không muốn load Restaurant entity trước):
    @Query("select ri from RestaurantImage ri where ri.restaurant.id = :restId and ri.type in :types")
    List<RestaurantImage> findByRestaurantIdAndTypeIn(@Param("restId") Long restaurantId,
                                                      @Param("types") List<RestaurantRegisterImage> types);
}
