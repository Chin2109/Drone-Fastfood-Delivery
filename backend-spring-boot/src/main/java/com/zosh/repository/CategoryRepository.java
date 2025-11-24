package com.zosh.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zosh.model.Category;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CategoryRepository extends JpaRepository<Category, Long> {

	public List<Category> findByRestaurantId(Long id);

	List<Category> findByRestaurantIdAndNameContainingIgnoreCase(Long restaurantId, String name);
	boolean existsByIdAndRestaurantId(Long id, Long restaurantId);

	@Query("select count(f) from Food f where f.foodCategory.id = :categoryId")
	long countFoodsByCategoryId(@Param("categoryId") Long categoryId);
}
