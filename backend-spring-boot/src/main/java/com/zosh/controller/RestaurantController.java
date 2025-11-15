package com.zosh.controller;

import java.util.List;

import com.zosh.request.CreateRestaurantRequest;
import com.zosh.request.RestaurantRegisterDTO;
import com.zosh.response.MenuItemResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.zosh.Exception.RestaurantException;
import com.zosh.Exception.UserException;
import com.zosh.dto.RestaurantDto;
import com.zosh.model.Restaurant;
import com.zosh.model.User;
import com.zosh.service.RestaurantService;
import com.zosh.service.UserService;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/merchant")
public class RestaurantController {
	@Autowired
	private RestaurantService restaurantService;

	@Autowired
	private UserService userService;

	@PostMapping
	public ResponseEntity<?> createMerchant(
			@RequestPart("form") RestaurantRegisterDTO form, // text fields
			@RequestPart(value = "IDENTITY", required = false) List<MultipartFile> identityImages,
			@RequestPart(value = "BUSINESS", required = false) List<MultipartFile> businessImages,
			@RequestPart(value = "KITCHEN", required = false) List<MultipartFile> kitchenImages,
			@RequestPart(value = "OTHERS", required = false) List<MultipartFile> otherImages
	) {
		try {
			Restaurant merchant = restaurantService.createMerchant(form, identityImages, businessImages, kitchenImages, otherImages);
			return ResponseEntity.ok().body(merchant);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Đã xảy ra lỗi khi tạo merchant: " + e.getMessage());
		}
	}


}
