package com.zosh.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.zosh.model.Food;

public interface FoodRepository extends JpaRepository<Food, Long> {
//	@Query("SELECT f FROM Food f WHERE "
//			+ "f.name LIKE %:keyword% OR "
//			+ "f.foodCategory.name LIKE %:keyword% AND "
//			+ "f.restaurant!=null"
//	)
//	List<Food> searchByNameOrCategory(@Param("keyword") String keyword);

    @Query("""
    SELECT f FROM Food f
    WHERE (:merchantId IS NULL OR f.foodCategory.restaurant.id = :merchantId)
      AND (:categoryId IS NULL OR f.foodCategory.id = :categoryId)
      AND (:name IS NULL OR LOWER(f.name) LIKE LOWER(CONCAT('%', :name, '%')))
    """)
    Page<Food> searchFoods(
            @Param("merchantId") Long merchantId,
            @Param("categoryId") Long categoryId,
            @Param("name") String name,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {
            "foodCategory.restaurant",
            "ingredientCategories"
    })
    Optional<Food> findByIdAndAvailableTrue(Long id);

    @Query("select count(f) from Food f where f.foodCategory.id = :categoryId")
    long countByFoodCategoryId(@Param("categoryId") Long categoryId);

    boolean existsByIdAndFoodCategoryRestaurantId(Long foodId, Long restaurantId);


}
