package com.zosh.service;

import java.util.List;

import com.zosh.Exception.RestaurantException;
import com.zosh.dto.RestaurantDto;
import com.zosh.model.Restaurant;
import com.zosh.model.User;
import com.zosh.request.CreateRestaurantRequest;
import com.zosh.request.Form1;
import com.zosh.request.RestaurantRegisterDTO;
import com.zosh.response.MenuItemResponse;
import org.springframework.web.multipart.MultipartFile;

public interface RestaurantService {
	public Restaurant createMerchant(
			RestaurantRegisterDTO form,
			List<MultipartFile> identityImages,
			List<MultipartFile> businessImages,
			List<MultipartFile> kitchenImages,
			List<MultipartFile> otherImages
	);

//	public Restaurant createRestaurant(CreateRestaurantRequest req,User user);

//	public Restaurant updateRestaurant(Long restaurantId, CreateRestaurantRequest updatedRestaurant)
//			throws RestaurantException;
//
//	public void deleteRestaurant(Long restaurantId) throws RestaurantException;
//
//	public List<Restaurant>getAllRestaurant();
//
//	public List<Restaurant>searchRestaurant(String keyword);
//
//	public Restaurant findRestaurantById(Long id) throws RestaurantException;
//
//	public Restaurant getRestaurantsByUserId(Long userId) throws RestaurantException;
//
//	public Restaurant updateRestaurantStatus(Long id)throws RestaurantException;
//
//	public List<MenuItemResponse> getMenu(Long id);
}
