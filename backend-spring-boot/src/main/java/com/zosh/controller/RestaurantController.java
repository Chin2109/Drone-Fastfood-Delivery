//package com.zosh.controller;
//
//import java.util.List;
//
//import com.zosh.request.CreateRestaurantRequest;
//import com.zosh.response.MenuItemResponse;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import com.zosh.Exception.RestaurantException;
//import com.zosh.Exception.UserException;
//import com.zosh.dto.RestaurantDto;
//import com.zosh.model.Restaurant;
//import com.zosh.model.User;
//import com.zosh.service.RestaurantService;
//import com.zosh.service.UserService;
//
//@RestController
//@RequestMapping("/api/restaurants")
//public class RestaurantController {
//	@Autowired
//	private RestaurantService restaurantService;
//
//	@Autowired
//	private UserService userService;
//
//	@PostMapping("/create")
//	public ResponseEntity<Restaurant> createRestaurant(
//			@RequestBody CreateRestaurantRequest req,
//			@RequestHeader("Authorization") String jwt) throws UserException {
//
//		User user = userService.findUserProfileByJwt(jwt);
//
//		System.out.println("----TRUE___-----"+jwt);
//		Restaurant restaurant = restaurantService.createRestaurant(req,user);
//		return ResponseEntity.ok(restaurant);
//	}
//
//
//
////	@GetMapping("/search")
////	public ResponseEntity<List<Restaurant>> findRestaurantByName(
////			@RequestParam String keyword) {
////		List<Restaurant> restaurant = restaurantService.searchRestaurant(keyword);
////
////		return ResponseEntity.ok(restaurant);
////	}
////
////
////	@GetMapping()
////	public ResponseEntity<List<Restaurant>> getAllRestaurants() {
////
////		List<Restaurant> restaurants = restaurantService.getAllRestaurant();
////		return ResponseEntity.ok(restaurants);
////	}
////
////
////	@GetMapping("/{id}")
////	public ResponseEntity<Restaurant> findRestaurantById(
////			@PathVariable Long id) throws RestaurantException {
////
////			Restaurant restaurant = restaurantService.findRestaurantById(id);
////			return ResponseEntity.ok(restaurant);
////	}
////
////	@GetMapping("/{id}/menu")
////	public ResponseEntity<List<MenuItemResponse>> getMenu(@PathVariable Long id) {
////		return ResponseEntity.ok(restaurantService.getMenu(id));
////	}
//}
