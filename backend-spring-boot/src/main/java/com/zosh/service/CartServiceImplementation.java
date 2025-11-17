package com.zosh.service;

import java.util.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zosh.dto.CheckoutCalculateDto;
import com.zosh.mapper.DeliveryFeeUtil;
import com.zosh.model.*;
import com.zosh.repository.FoodRepository;
import com.zosh.repository.IngredientsItemRepository;
import com.zosh.request.CreateCartItemRequest;
import com.zosh.response.AddToCartResult;
import com.zosh.response.CartSummaryResponse;
import com.zosh.response.CartSummaryResponse.CartItemResponse;
import com.zosh.response.CartSummaryResponse.ProductInCartResponse;
import com.zosh.response.CartSummaryResponse.CartToppingResponse;
import com.zosh.response.CheckoutCalculateResponse;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.zosh.request.CartPreviewRequest;
import com.zosh.response.CartPreviewResponse;
import com.zosh.response.CartPreviewResponse.CartPreviewItem;
import com.zosh.response.CartPreviewResponse.CartPreviewTopping;

import com.zosh.Exception.CartException;
import com.zosh.Exception.CartItemException;
import com.zosh.Exception.FoodException;
import com.zosh.Exception.UserException;
import com.zosh.repository.CartItemRepository;
import com.zosh.repository.CartRepository;
import com.zosh.request.AddCartItemRequest;
import com.zosh.request.UpdateCartItemRequest;
import org.springframework.web.bind.annotation.RequestBody;

@Service
@RequiredArgsConstructor
public class CartServiceImplementation implements CartSerive {
	@Autowired
	private CartRepository cartRepository;
	@Autowired
	private CartItemRepository cartItemRepository;
	@Autowired
	private IngredientsItemRepository ingredientsItemRepository;
	@Autowired
	private FoodRepository foodRepository;

	private final ObjectMapper objectMapper;

	//HELPER
	// ================== Helper methods ==================

	private Cart getOrCreateUserCart(Long userId, Long merchantId) {
		return cartRepository
				.findByUser_IdAndRestaurant_Id(userId, merchantId)
				.orElseGet(() -> {
					Cart c = new Cart();
					User u = new User();
					u.setId(userId);
					c.setUser(u);

					Restaurant r = new Restaurant();
					r.setId(merchantId);
					c.setRestaurant(r);

					c.setTotalPrice(0L);
					return cartRepository.save(c);
				});
	}

	private String buildIngredientDetailsJson(List<Long> selectedToppingIds) {
		try {
			if (selectedToppingIds == null || selectedToppingIds.isEmpty()) {
				return null; // không có topping
			}
			List<Long> sorted = new ArrayList<>(selectedToppingIds);
			Collections.sort(sorted);

			Map<String, Object> map = new HashMap<>();
			map.put("toppings", sorted);

			return objectMapper.writeValueAsString(map);
		} catch (JsonProcessingException e) {
			throw new RuntimeException("Không thể serialize ingredientDetailsJson", e);
		}
	}

	private long calcToppingsPrice(List<Long> selectedToppingIds) {
		if (selectedToppingIds == null || selectedToppingIds.isEmpty()) {
			return 0L;
		}
		return ingredientsItemRepository.findByIdIn(selectedToppingIds)
				.stream()
				.mapToLong(i -> Optional.ofNullable(i.getPrice()).orElse(0L))
				.sum();
	}

	private void recalcCartTotal(Cart cart) {
		List<CartItem> items = cartItemRepository.findByCart_Id(cart.getId());
		long total = items.stream()
				.mapToLong(ci -> Optional.ofNullable(ci.getTotalPrice()).orElse(0L))
				.sum();
		cart.setTotalPrice(total);
		cartRepository.save(cart);
	}

	@Data
	public static class IngredientDetails {
		private List<Long> toppings;
	}

	private List<CartToppingResponse> buildToppingResponses(String ingredientDetailsJson, int quantity) {
		if (ingredientDetailsJson == null || ingredientDetailsJson.isBlank()) {
			return List.of();
		}

		try {
			IngredientDetails details = objectMapper.readValue(ingredientDetailsJson, IngredientDetails.class);
			if (details.getToppings() == null || details.getToppings().isEmpty()) {
				return List.of();
			}

			List<IngredientsItem> toppingEntities =
					ingredientsItemRepository.findByIdIn(details.getToppings());

			List<CartToppingResponse> resList = new ArrayList<>();
			for (IngredientsItem topping : toppingEntities) {
				CartToppingResponse tRes = new CartToppingResponse();
				tRes.setId(topping.getId());
				tRes.setName(topping.getName());
				tRes.setPrice(topping.getPrice());
				tRes.setQuantity(quantity);
				resList.add(tRes);
			}
			return resList;
		} catch (JsonProcessingException e) {
			return List.of();
		}
	}

	// Helper parse ingredientDetailsJson -> List<CartPreviewTopping>
	private List<CartPreviewTopping> buildPreviewToppings(String ingredientDetailsJson, int itemQuantity) {
		if (ingredientDetailsJson == null || ingredientDetailsJson.isBlank()) {
			return List.of();
		}

		try {
			IngredientDetails details = objectMapper.readValue(ingredientDetailsJson, IngredientDetails.class);
			if (details.getToppings() == null || details.getToppings().isEmpty()) {
				return List.of();
			}

			List<IngredientsItem> toppingEntities =
					ingredientsItemRepository.findByIdIn(details.getToppings());

			List<CartPreviewTopping> result = new ArrayList<>();

			for (IngredientsItem topping : toppingEntities) {
				CartPreviewTopping tDto = new CartPreviewTopping();
				tDto.setToppingId(topping.getId());
				tDto.setToppingName(topping.getName());
				tDto.setPrice(topping.getPrice());
				tDto.setQuantity(itemQuantity); // giống bên addToCart: mỗi dòng cart có số lượng riêng
				tDto.setGroupId(null); // nếu sau này bạn có groupId thì set
				result.add(tDto);
			}

			return result;
		} catch (JsonProcessingException e) {
			return List.of();
		}
	}

	/// //////////////////
	@Override
	@Transactional
	public AddToCartResult addToCart(CreateCartItemRequest request,
									 Long userId,
									 Long merchantId) {

		Long productId = request.getProductId();
		Integer quantity = request.getQuantity();
		List<Long> selectedToppingIds =
				request.getSelectedToppingIds() != null ? request.getSelectedToppingIds() : List.of();

		if (quantity == null || quantity <= 0) {
			throw new IllegalArgumentException("Số lượng sản phẩm phải lớn hơn 0!");
		}

		// 1) Kiểm tra sản phẩm tồn tại + active
		Food food = foodRepository.findByIdAndAvailableTrue(productId)
				.orElseThrow(() -> new EntityNotFoundException("Sản phẩm chưa được tìm thấy!"));

		// 2) Check product thuộc merchant
		Category category = food.getFoodCategory();
		if (category == null || category.getRestaurant() == null) {
			throw new IllegalStateException("Sản phẩm không có thông tin nhà hàng.");
		}
		Long productMerchantId = category.getRestaurant().getId();

		if (!Objects.equals(productMerchantId, merchantId)) {
			throw new IllegalArgumentException("Sản phẩm không thuộc merchant này!");
		}

		// 3) Lấy hoặc tạo cart cho user + merchant
		Cart cart = getOrCreateUserCart(userId, merchantId);

		// 4) Chuẩn hoá toppings -> ingredientDetailsJson (dùng để so trùng)
		String ingredientDetailsJson = buildIngredientDetailsJson(selectedToppingIds);

		// 5) Tìm cartItem trùng (cùng product + cùng toppings)
		Optional<CartItem> matchingOpt =
				cartItemRepository.findByCart_IdAndFood_IdAndIngredientDetailsJson(
						cart.getId(), food.getId(), ingredientDetailsJson
				);

		// Tính basePrice + tổng topping cho 1 sản phẩm
		long basePrice = Optional.ofNullable(food.getPrice()).orElse(0L);
		long toppingsPrice = calcToppingsPrice(selectedToppingIds);

		if (matchingOpt.isPresent()) {
			// 5.1) Nếu đã tồn tại thì tăng số lượng
			CartItem cartItem = matchingOpt.get();
			int newQuantity = cartItem.getQuantity() + quantity;
			cartItem.setQuantity(newQuantity);

			long lineTotal = (basePrice + toppingsPrice) * newQuantity;
			cartItem.setTotalPrice(lineTotal);

			cartItemRepository.save(cartItem);

			// 6) Cập nhật tổng tiền cart
			recalcCartTotal(cart);

			return new AddToCartResult(
					"Đã tăng số lượng sản phẩm thành công!",
					cartItem
			);
		}

		// 5.2) Nếu chưa có thì tạo mới cartItem
		CartItem newItem = new CartItem();
		newItem.setCart(cart);
		newItem.setFood(food);
		newItem.setQuantity(quantity);
		newItem.setIngredientDetailsJson(ingredientDetailsJson);

		long lineTotal = (basePrice + toppingsPrice) * quantity;
		newItem.setTotalPrice(lineTotal);

		cartItemRepository.save(newItem);

		// 6) Cập nhật tổng tiền cart
		recalcCartTotal(cart);

		return new AddToCartResult(
				"Thêm vào giỏ hàng thành công!",
				newItem
		);
	}

	@Override
	@Transactional()
	public CartSummaryResponse getCartItems(Long userId, Long merchantId) {

		Cart cart = cartRepository
				.findByUser_IdAndRestaurant_Id(userId, merchantId)
				.orElse(null);

		if (cart == null) {
			return null;
		}

		List<CartItem> cartItems = cartItemRepository.findByCart_Id(cart.getId());

		List<CartItemResponse> itemResponses = new ArrayList<>();

		for (CartItem item : cartItems) {
			CartItemResponse itemRes = new CartItemResponse();
			itemRes.setId(item.getId());
			itemRes.setQuantity(item.getQuantity());

			// ---- Product ----
			Food food = item.getFood();
			Long basePrice = food != null ? Optional.ofNullable(food.getPrice()).orElse(0L) : 0L;

			ProductInCartResponse productRes = new ProductInCartResponse();
			if (food != null) {
				productRes.setId(food.getId());
				productRes.setName(food.getName());
				productRes.setImage(food.getImage());
				productRes.setBasePrice(basePrice);
			}
			itemRes.setProduct(productRes);

			// ---- Toppings ----
			List<CartToppingResponse> toppingResponses = buildToppingResponses(
					item.getIngredientDetailsJson(),
					item.getQuantity()
			);
			itemRes.setToppings(toppingResponses);

			long toppingUnitPrice = toppingResponses.stream()
					.mapToLong(t -> Optional.ofNullable(t.getPrice()).orElse(0L))
					.sum();

			long subTotal = (basePrice + toppingUnitPrice) * item.getQuantity();
			itemRes.setSubTotal(subTotal);

			itemResponses.add(itemRes);
		}

		long total = itemResponses.stream()
				.mapToLong(i -> Optional.ofNullable(i.getSubTotal()).orElse(0L))
				.sum();

		CartSummaryResponse summary = new CartSummaryResponse();
		summary.setCartId(cart.getId());
		summary.setMerchantId(merchantId);
		summary.setMerchantName(
				cart.getRestaurant() != null ? cart.getRestaurant().getName() : null
		);
		summary.setItems(itemResponses);
		summary.setTotal(total);

		return summary;
	}

	@Override
	@Transactional()
	public CartPreviewResponse cartPreview(Long userId, Long merchantId, CartPreviewRequest request) {

		// 1) Tìm cart của user với merchant này
		Cart cart = cartRepository
				.findByUser_IdAndRestaurant_Id(userId, merchantId)
				.orElseThrow(() ->
						new IllegalArgumentException("Không tìm thấy giỏ hàng của merchant này.")
				);

		// 2) Lọc cartItems theo cartItemId nếu có
		List<Long> cartItemIds = request.getCartItemId();
		List<CartItem> cartItems;

		if (cartItemIds != null && !cartItemIds.isEmpty()) {
			cartItems = cartItemRepository.findByCart_IdAndIdIn(cart.getId(), cartItemIds);
		} else {
			cartItems = cartItemRepository.findByCart_Id(cart.getId());
		}

		if (cartItems.isEmpty()) {
			throw new IllegalArgumentException("Giỏ hàng trống hoặc không hợp lệ.");
		}

		List<CartPreviewItem> items = new ArrayList<>();

		for (CartItem item : cartItems) {
			Food product = item.getFood();
			if (product == null) continue;

			Long basePrice = Optional.ofNullable(product.getPrice()).orElse(0L);

			// Parse topping từ ingredientDetailsJson
			List<CartPreviewTopping> toppingDtos =
					buildPreviewToppings(item.getIngredientDetailsJson(), item.getQuantity());

			long toppingTotal = toppingDtos.stream()
					.mapToLong(t -> Optional.ofNullable(t.getPrice()).orElse(0L) * t.getQuantity())
					.sum();

			long subtotal = (basePrice + toppingTotal) * item.getQuantity();

			CartPreviewItem dto = new CartPreviewItem();
			dto.setCartItemId(item.getId());
			dto.setProductId(product.getId());
			dto.setProductName(product.getName());
			dto.setImage(product.getImage());
			dto.setQuantity(item.getQuantity());
			dto.setPriceProduct(basePrice);
			dto.setToppings(toppingDtos);
			dto.setSubtotal(subtotal);

			items.add(dto);
		}

		long totalAmount = items.stream()
				.mapToLong(i -> Optional.ofNullable(i.getSubtotal()).orElse(0L))
				.sum();

		CartPreviewResponse response = new CartPreviewResponse();
		response.setItems(items);
		response.setTotalAmount(totalAmount);

		return response;
	}

	@Override
	@Transactional()
	public CheckoutCalculateResponse checkoutCalculate(Long userId,
													   Long merchantId,
													   CheckoutCalculateDto dto) {

		// ===== 1) Lấy giỏ hàng xem trước (cartPreview) =====
		CartPreviewRequest previewReq = new CartPreviewRequest();
		previewReq.setCartItemId(dto.getCartItemId());

		CartPreviewResponse cartPrev = cartPreview(userId, merchantId, previewReq);

		if (cartPrev == null
				|| cartPrev.getItems() == null
				|| cartPrev.getItems().isEmpty()) {
			throw new IllegalArgumentException("Không có sản phẩm hợp lệ trong giỏ hàng.");
		}

		// ===== 2) Tính phí giao hàng =====
		long deliveryFee = 0L;
		double distance = 0.0;

		if (dto.getTemporaryAddress() != null) {
			// FE gửi khoảng cách
			if (dto.getDistance() != null) {
				distance = dto.getDistance();
			} else if (dto.getTemporaryAddress().getLocation() != null) {
				// nếu bạn muốn tự tính từ toạ độ thì xử lý thêm ở đây
				distance = 0.0;
			}
			deliveryFee = DeliveryFeeUtil.calculateDeliveryFee(distance);

		} else if (dto.getAddressId() != null) {
			// TODO: nếu bạn dùng Address entity để lưu distance, có thể:
			// Address addr = addressRepository.findById(dto.getAddressId())
			//     .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy địa chỉ."));
			// double distanceFromDb = ...;
			if (dto.getDistance() != null) {
				distance = dto.getDistance();
			}
			deliveryFee = DeliveryFeeUtil.calculateDeliveryFee(distance);
		} else {
			throw new IllegalArgumentException(
					"Either addressId or temporaryAddress must be provided."
			);
		}

		// ===== 3) Tổng tiền =====
		long subTotal = cartPrev.getTotalAmount() != null
				? cartPrev.getTotalAmount()
				: 0L;
		long finalTotal = subTotal + deliveryFee;

		// ===== 4) Build response =====
		CheckoutCalculateResponse resp = new CheckoutCalculateResponse();
		resp.setItems(cartPrev.getItems());
		resp.setSubtotal(subTotal);
		resp.setDeliveryFee(deliveryFee);
		resp.setFinalTotal(finalTotal);

		return resp;
	}

}
