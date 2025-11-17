package com.zosh.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zosh.model.CartItem;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Tìm cartItem cùng cart + food + ingredientDetailsJson (để gộp)
    Optional<CartItem> findByCart_IdAndFood_IdAndIngredientDetailsJson(
            Long cartId,
            Long foodId,
            String ingredientDetailsJson
    );

    // Lấy tất cả cartItem trong cart để tính tổng tiền
    List<CartItem> findByCart_Id(Long cartId);

    List<CartItem> findByCart_IdAndIdIn(Long cartId, List<Long> ids);
}
