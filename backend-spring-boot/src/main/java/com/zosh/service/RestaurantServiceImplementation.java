package com.zosh.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.zosh.domain.RestaurantRegisterImage;
import com.zosh.domain.RestaurantStatus;
import com.zosh.model.*;
import com.zosh.repository.*;
import com.zosh.request.Form1;
import com.zosh.request.RestaurantRegisterDTO;
import com.zosh.response.FoodResponse;
import com.zosh.response.MenuItemResponse;
import jakarta.transaction.Transactional;
import org.locationtech.jts.geom.Coordinate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zosh.Exception.RestaurantException;
import com.zosh.dto.RestaurantDto;
import com.zosh.request.CreateRestaurantRequest;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Point;
import org.springframework.web.multipart.MultipartFile;

@Service
public class RestaurantServiceImplementation implements RestaurantService {
	@Autowired
	private RestaurantRepository restaurantRepository;
	@Autowired
	private AddressRepository addressRepository;

	@Autowired
	private AddressService addressService;

	@Autowired
	private UserService userService;

	@Autowired
	private UserRepository userRepository;

    @Autowired
    private GeocodingService geocodingService;

	@Autowired
	private GeometryFactory geometryFactory;

	@Autowired
	private CategoryRepository categoryRepository;

	@Autowired
	private FoodRepository foodRepository;

	@Autowired
	private DroneHubRepository droneHubRepository;

	@Autowired
	private CloudinaryService cloudinaryService;

	@Transactional
	@Override
	public Restaurant createMerchant(
			RestaurantRegisterDTO form,
			List<MultipartFile> identityImages,
			List<MultipartFile> businessImages,
			List<MultipartFile> kitchenImages,
			List<MultipartFile> otherImages
	) {
		Restaurant restaurant = new Restaurant();
		// Thông tin cơ bản
		restaurant.setName(form.getName());
		restaurant.setRepresentativeName(form.getRepresentativeName());
		restaurant.setRepresentativeEmail(form.getMerchantEmail());
		restaurant.setRepresentativemobile(form.getMerchantPhoneNumber());

		// Email / số điện thoại của cửa hàng (mình cho trùng merchant luôn, tuỳ bạn)
		restaurant.setRestaurantEmail(form.getMerchantEmail());
		restaurant.setRestaurantPhoneNumber(form.getMerchantPhoneNumber());

		// Mô hình kinh doanh + số đơn
		restaurant.setBusinessModel(form.getBusinessModel());
		// dailyOrderVolume bạn đang để static, tốt nhất là sửa lại thành field thường.
		// Nếu bạn đã có setter thì:
		restaurant.setDailyOrderVolume(form.getDailyOrderVolume());

		// Pháp lý
		restaurant.setRegistrationType(form.getRegistrationType());
		restaurant.setLegalBusinessName(form.getLegalBusinessName());
		restaurant.setBusinessRegistrationCode(form.getBusinessRegistrationCode());
		restaurant.setRegistrationDate(form.getRegistrationDate());
		restaurant.setBusinessIndustry(form.getBusinessIndustry());

		// Ngân hàng
		restaurant.setBankName(form.getBankName());
		restaurant.setBankAccountNumber(form.getBankAccountNumber());
		restaurant.setBankAccountHolderName(form.getBankAccountHolderName());

		// Chủ sở hữu
		restaurant.setOwnerName(form.getOwnerName());
		restaurant.setOwnerDateOfBirth(form.getOwnerDateOfBirth());
		restaurant.setOwnerIdNumber(form.getOwnerIdNumber());
		restaurant.setOwnerIdIssueDate(form.getOwnerIdIssueDate());
		restaurant.setOwnerIdIssuePlace(form.getOwnerIdIssuePlace());
		restaurant.setOwnerIdExpiryDate(form.getOwnerIdExpiryDate());
		restaurant.setOwnerPermanentAddress(form.getOwnerPermanentAddress());
		restaurant.setOwnerCountry(form.getOwnerCountry());
		restaurant.setOwnerCity(form.getOwnerCity());
		restaurant.setOwnerCurrentAddress(form.getOwnerCurrentAddress());

		// Trạng thái mặc định
		restaurant.setOpen(false); // chưa mở bán
		restaurant.setStatus(RestaurantStatus.PENDING);

		Address add = new Address();
		add.setFullName(form.getRestaurantAddress());
		try {
			GeocodingService.Location location = geocodingService.getCoordinates(add.getFullName());
			Coordinate coor = new Coordinate(location.getLng(),location.getLat());
			Point point = geometryFactory.createPoint(coor);
			add.setLocation(point);
		} catch (Exception e) {
			System.err.println("Lỗi khi tìm tọa độ: " + e.getMessage());
		}
		// 1) Lưu address trước
		Address savedAddress = addressRepository.save(add);

		// 2) Gán address đã persist vào restaurant
		restaurant.setAddress(savedAddress);

		Restaurant saved = restaurantRepository.save(restaurant);

		// 5. Upload từng nhóm file theo type
		cloudinaryService.saveImages(identityImages, saved, RestaurantRegisterImage.IDENTITY);
		cloudinaryService.saveImages(businessImages, saved, RestaurantRegisterImage.BUSINESS);
		cloudinaryService.saveImages(kitchenImages, saved, RestaurantRegisterImage.KITCHEN);
		cloudinaryService.saveImages(otherImages, saved, RestaurantRegisterImage.OTHERS);

		return restaurantRepository.findByIdWithImages(saved.getId())
				.orElseThrow(() -> new RuntimeException("Restaurant not found after creation"));
	}

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

}
