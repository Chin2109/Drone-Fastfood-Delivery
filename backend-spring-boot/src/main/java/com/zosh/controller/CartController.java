package com.zosh.controller;
import com.zosh.dto.CheckoutCalculateDto;
import com.zosh.repository.UserRepository;
import com.zosh.request.CartPreviewRequest;
import com.zosh.request.CreateCartItemRequest;
import com.zosh.response.AddToCartResult;
import com.zosh.response.CartPreviewResponse;
import com.zosh.response.CartSummaryResponse;
import com.zosh.response.CheckoutCalculateResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.zosh.model.User;
import com.zosh.service.CartSerive;
import com.zosh.service.UserService;

import java.util.Map;

@RestController
@RequestMapping("/api/cart-item")
public class CartController {
	@Autowired
	private CartSerive cartService;
	@Autowired
	private UserService userService;
	@Autowired
	private UserRepository userRepository;

	@PostMapping("/addtocart/{merchantId}")
	public ResponseEntity<?> addToCart(
			@PathVariable Long merchantId,
			@RequestBody CreateCartItemRequest request,
			Authentication authentication // lấy từ SecurityContext (JwtTokenValidator)
	) {
		// 1. Lấy email từ JWT
		String email = authentication.getName(); // vì JwtTokenValidator set principal = email

		// 2. Tìm user theo email
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User không tồn tại với email: " + email));

		Long userId = user.getId();

		// 3. Gọi service xử lý logic addToCart
		AddToCartResult result = cartService.addToCart(request, userId, merchantId);

		// 4. Trả về giống style bên NestJS (message + data)
		return ResponseEntity.ok(
				Map.of(
						"success", true,
						"message", result.getMessage(),
						"data", result.getData()
				)
		);
	}

	@GetMapping("/get-cartitems/{merchantId}")
	public ResponseEntity<?> getCartItemsByUser(
			@PathVariable Long merchantId,
			Authentication authentication
	) {
		String email = authentication.getName();
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User không tồn tại với email: " + email));

		Long userId = user.getId();

		CartSummaryResponse summary = cartService.getCartItems(userId, merchantId);

		if (summary == null)
		{
			CartSummaryResponse empty = new CartSummaryResponse();
			empty.setCartId(null);
			empty.setMerchantId(merchantId);
			empty.setMerchantName(null);
			empty.setItems(java.util.List.of());
			empty.setTotal(0L);

			return ResponseEntity.ok(
					Map.of(
							"success", true,
							"message", "Giỏ hàng trống",
							"data", empty
					)
			);
		}

		return ResponseEntity.ok(
				Map.of(
						"success", true,
						"message", "Lấy giỏ hàng thành công",
						"data", summary
				)
		);
	}

	@PostMapping("/checkout-preview/{merchantId}")
	public ResponseEntity<?> checkoutPreview(
			@PathVariable Long merchantId,
			@RequestBody CartPreviewRequest request,
			Authentication authentication
	) {
		String email = authentication.getName();
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User không tồn tại với email: " + email));

		Long userId = user.getId();

		CartPreviewResponse preview = cartService.cartPreview(userId, merchantId, request);

		return ResponseEntity.ok(
				Map.of(
						"success", true,
						"message", "Xem trước giỏ hàng thành công.",
						"data", preview
				)
		);
	}


	@PostMapping("/checkout-calculate/{merchantId}")
	public ResponseEntity<?> checkoutCalculate(
			@PathVariable Long merchantId,
			@RequestBody CheckoutCalculateDto dto,
			Authentication authentication
	) {
		// ==== lấy userId từ JWT (giống req.user.id trong Nest) ====
		String email = authentication.getName();
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User id not found"));
		Long userId = user.getId();

		// ==== validate như Nest ====
		if (dto.getAddressId() == null && dto.getTemporaryAddress() == null) {
			throw new IllegalArgumentException(
					"Either addressId or temporaryAddress must be provided."
			);
		}

		if (dto.getAddressId() != null && dto.getTemporaryAddress() != null) {
			throw new IllegalArgumentException(
					"Cannot use both addressId and temporaryAddress at the same time."
			);
		}

		// ==== gọi service ====
		CheckoutCalculateResponse data =
				cartService.checkoutCalculate(userId, merchantId, dto);

		// ==== trả về giống Nest: message + data ====
		return ResponseEntity.ok(
				Map.of(
						"message", "Checkout tính toán thành công.",
						"data", data
				)
		);
	}
}