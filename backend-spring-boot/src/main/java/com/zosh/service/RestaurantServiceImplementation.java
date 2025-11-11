//package com.zosh.service;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Optional;
//
//import com.zosh.controller.FoodController;
//import com.zosh.model.*;
//import com.zosh.repository.*;
//import com.zosh.request.Form1;
//import com.zosh.response.FoodResponse;
//import com.zosh.response.MenuItemResponse;
//import org.locationtech.jts.geom.Coordinate;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.zosh.Exception.RestaurantException;
//import com.zosh.dto.RestaurantDto;
//import com.zosh.request.CreateRestaurantRequest;
//import org.locationtech.jts.geom.GeometryFactory;
//import org.locationtech.jts.geom.Coordinate;
//import org.locationtech.jts.geom.Point;
//
//@Service
//public class RestaurantServiceImplementation implements RestaurantService {
//	@Autowired
//	private RestaurantRepository restaurantRepository;
//	@Autowired
//	private AddressRepository addressRepository;
//
//	@Autowired
//	private UserService userService;
//
//	@Autowired
//	private UserRepository userRepository;
//
//    @Autowired
//    private GeocodingService geocodingService;
//
//	@Autowired
//	private GeometryFactory geometryFactory;
//
//	@Autowired
//	private CategoryRepository categoryRepository;
//
//	@Autowired
//	private FoodRepository foodRepository;
//
//	@Override
//	public void registerRestaurant_1(Form1 form) {
//
//	}
//
//	@Override
//	public Restaurant createRestaurant(CreateRestaurantRequest req,User user) {
//		Address address=new Address();
//		address.setFullName(req.getAddress().getFullName());
//        try {
//            GeocodingService.Location location = geocodingService.getCoordinates(address.getFullName());
//			Coordinate coor = new Coordinate(location.getLng(),location.getLat());
//			Point point = geometryFactory.createPoint(coor);
//            address.setLocation(point);
//        } catch (Exception e) {
//            System.err.println("Lỗi khi tìm tọa độ: " + e.getMessage());
//        }
//
//		Address savedAddress = addressRepository.save(address);
//		Restaurant restaurant = new Restaurant();
//		restaurant.setAddress(savedAddress);
//		restaurant.setRestaurantPhoneNumber(req.getMobile());
//		restaurant.setDescription(req.getDescription());
//		restaurant.setImage(req.getImage());
//		restaurant.setName(req.getName());
//		restaurant.setOpeningHours(req.getOpeningHours());
//		restaurant.setOwner(user);
//		Restaurant savedRestaurant = restaurantRepository.save(restaurant);
//
//		return savedRestaurant;
//	}
//
//	@Override
//	public Restaurant updateRestaurant(Long restaurantId, CreateRestaurantRequest updatedReq)
//			throws RestaurantException {
//		Restaurant restaurant = findRestaurantById(restaurantId);
//		if (restaurant.getDescription() != null) {
//			restaurant.setDescription(updatedReq.getDescription());
//		}
//		return restaurantRepository.save(restaurant);
//	}
//
//	@Override
//	public Restaurant findRestaurantById(Long restaurantId) throws RestaurantException {
//		Optional<Restaurant> restaurant = restaurantRepository.findById(restaurantId);
//		if (restaurant.isPresent()) {
//			return restaurant.get();
//		} else {
//			throw new RestaurantException("Restaurant with id " + restaurantId + "not found");
//		}
//	}
//
//	@Override
//	public void deleteRestaurant(Long restaurantId) throws RestaurantException {
//		Restaurant restaurant = findRestaurantById(restaurantId);
//		if (restaurant != null) {
//			restaurantRepository.delete(restaurant);
//			return;
//		}
//		throw new RestaurantException("Restaurant with id " + restaurantId + " Not found");
//
//	}
//
//	@Override
//	public List<Restaurant> getAllRestaurant() {
//		return restaurantRepository.findAll();
//	}
//
//
//	@Override
//	public Restaurant getRestaurantsByUserId(Long userId) throws RestaurantException {
//		Restaurant restaurants=restaurantRepository.findByOwnerId(userId);
//		return restaurants;
//	}
//
//	@Override
//	public List<Restaurant> searchRestaurant(String keyword) {
//		return restaurantRepository.findBySearchQuery(keyword);
//	}
//
//	@Override
//	public Restaurant updateRestaurantStatus(Long id) throws RestaurantException {
//		Restaurant restaurant=findRestaurantById(id);
//		restaurant.setOpen(!restaurant.isOpen());
//		return restaurantRepository.save(restaurant);
//	}
//
//	@Override
//	public List<MenuItemResponse> getMenu(Long id) {
//		Restaurant restaurant = restaurantRepository.findById(id).orElseThrow();
//		List<Category> categories = restaurant.getCategories();
//
//		List<MenuItemResponse> list = new ArrayList<>();
//		for(Category category : categories) {
//			MenuItemResponse response = new MenuItemResponse();
//			response.setCategoryId(category.getId());
//			response.setCategoryName(category.getName());
//
//			List<FoodResponse> foodResponses = new ArrayList<>();
//			for(Food food : category.getFoods()) {
//				FoodResponse fr = new FoodResponse();
//				fr.setName(food.getName());
//				fr.setPrice(food.getPrice());
//				fr.setDescription(food.getDescription());
//				fr.setImage(food.getImage());
//				fr.setAvailable(food.isAvailable());
//
//				foodResponses.add(fr);
//			}
//			response.setFoods(foodResponses);
//
//			list.add(response);
//		}
//
//		return list;
//	}
//
//}
