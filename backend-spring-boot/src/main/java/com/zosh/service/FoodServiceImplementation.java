package com.zosh.service;

import java.util.*;
import java.util.stream.Collectors;

import com.zosh.mapper.FoodMapper;
import com.zosh.model.*;
import com.zosh.repository.*;
import com.zosh.request.*;
import com.zosh.response.FoodItemResponse;
import com.zosh.response.FoodResponse;
import com.zosh.response.ProductDetailResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;


@Service
public class FoodServiceImplementation implements FoodService {
	@Autowired
	private FoodRepository foodRepository;
    @Autowired
    private RestaurantRepository restaurantRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private OrderItemRepository orderItemRepository; // tạo repo nếu chưa có


    //mapper
    private ProductDetailResponse.ProductToppingGroupResponse toProductToppingGroupResponse(
            IngredientCategory ic,
            Food food
    ) {
        ProductDetailResponse.ProductToppingGroupResponse dto =
                new ProductDetailResponse.ProductToppingGroupResponse();

        dto.setId(ic.getId());
        dto.setProductId(food.getId());
        dto.setToppingGroupId(ic.getId()); // lấy id của IngredientCategory

        // ---- toppingGroup ----
        ProductDetailResponse.ToppingGroupResponse tg =
                new ProductDetailResponse.ToppingGroupResponse();
        tg.setId(ic.getId());
        tg.setName(ic.getName());
        tg.set_required(false); // bổ sung
        tg.setMinSelection(1);    // tạm min=1
        tg.setMaxSelection(ic.getIngredients() != null ? ic.getIngredients().size() : 0);

        // toppings (IngredientsItem)
        List<ProductDetailResponse.ToppingResponse> toppings =
                ic.getIngredients().stream()
                        .map(this::toToppingResponse)
                        .toList();

        tg.setToppings(toppings);
        dto.setToppingGroup(tg);

        return dto;
    }

    //mapper
    private ProductDetailResponse.ToppingResponse toToppingResponse(IngredientsItem item) {
        ProductDetailResponse.ToppingResponse dto =
                new ProductDetailResponse.ToppingResponse();

        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setPrice(item.getPrice());

        return dto;
    }

    //mapper
    private ProductDetailResponse mapToProductDetail(Food f) {
        ProductDetailResponse dto = new ProductDetailResponse();

        dto.setId(f.getId());
        dto.setName(f.getName());
        dto.setDescription(f.getDescription());
        dto.setBasePrice(f.getPrice()); // basePrice <- Food.price
        dto.setImage(f.getImage());

        // ---- Category ----
        Category category = f.getFoodCategory();
        if (category != null) {
            ProductDetailResponse.CategoryShortResponse cateDto =
                    new ProductDetailResponse.CategoryShortResponse();
            cateDto.setName(category.getName());
            cateDto.setMerchantId(
                    category.getRestaurant() != null
                            ? category.getRestaurant().getId()
                            : null
            );
            dto.setCategory(cateDto);
        }

        // ---- productToppingGroups (IngredientCategory) ----
        List<ProductDetailResponse.ProductToppingGroupResponse> ptgDtos =
                f.getIngredientCategories().stream()
                        .map(ic -> toProductToppingGroupResponse(ic, f))
                        .toList();

        dto.setProductToppingGroups(ptgDtos);

        return dto;
    }

    @Override
    public Category createCategory(AddCategoryRequest request, Long id) {
        User user = userRepository.findById(id).orElseThrow();
        Restaurant restaurant = restaurantRepository.findByOwner(user).orElseThrow();

        Category category = new Category();
        category.setName(request.getName());
        category.setRestaurant(restaurant);

        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public Food createFood(AddFoodRequest request, MultipartFile image, Long id) {
        User user = userRepository.findById(id).orElseThrow();

        Category category = categoryRepository.findById(request.getFoodCategoryId())
                .orElseThrow();
        Restaurant restaurant = restaurantRepository.findByOwner(user)
                .orElseThrow();

        Food food = new Food();
        food.setName(request.getName());
        food.setPrice(request.getPrice());
        food.setDescription(request.getDescription());
        food.setFoodCategory(category);

        // BACKEND TỰ UPLOAD ẢNH & SET URL
        if (image != null && !image.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(image, "foods");
            food.setImage(imageUrl);
        }

        food.setAvailable(request.isAvailable());
        food.setCreationDate(request.getCreationDate());

        //mỗi food có một list ingredient category
        List<IngredientCategory> ingredientCategories = new ArrayList<>();
        for (IngredientCategoryDTO icDTO : request.getIngredientCategoryDTOs()) {
            IngredientCategory ic = new IngredientCategory();
            ic.setName(icDTO.getName());
            ic.setFood(food);

            List<IngredientsItem> ingredientsItems = new ArrayList<>();
            for (IngredientItemDTO itDTO : icDTO.getIngredients()) {
                IngredientsItem it = new IngredientsItem();
                it.setName(itDTO.getName());
                it.setInStoke(itDTO.isInStoke());
                it.setPrice(itDTO.getPrice());
                it.setCategory(ic);
                ingredientsItems.add(it);
            }

            ic.setIngredients(ingredientsItems);
            ingredientCategories.add(ic);
        }

        food.setIngredientCategories(ingredientCategories);

        return foodRepository.save(food);
    }

    @Override
    public Page<FoodResponse> getAllFood (Long merchantId,
                                          Long categoryId,
                                          String name,
                                          int page,
                                          int limit,
                                          Boolean available)
    {
        if (page < 1) {
            page = 1;
        }
        if (limit <= 0) {
            limit = 10;
        }

        PageRequest pageable = PageRequest.of(page - 1, limit);

        String keyword = (name == null || name.isBlank()) ? null : name.trim();

        // Giữ phương thức repo searchFoods nhưng nếu bạn chưa có tham số available ở repo,
        // ta filter đơn giản ở service (demo). Nếu repo hỗ trợ available, call repo with it.
        Page<Food> foods = foodRepository.searchFoods(merchantId, categoryId, keyword, pageable);

        if (available == null) {
            return foods.map(FoodMapper::toFoodResponse);
        } else {
            // filter page content by available (demo): convert content then wrap PageImpl
            List<Food> filtered = foods.getContent().stream()
                    .filter(f -> Objects.equals(f.isAvailable(), available))
                    .toList();
            Page<Food> pageFiltered = new org.springframework.data.domain.PageImpl<>(filtered, pageable, filtered.size());
            return pageFiltered.map(FoodMapper::toFoodResponse);
        }
    }


    @Override
    public ProductDetailResponse findOneProductById(Long id) {
        Food food = foodRepository.findByIdAndAvailableTrue(id)
                .orElseThrow(() -> new RuntimeException("Product not found or inactive"));

        return mapToProductDetail(food);
    }

    @Override
    public List<Category> getCategoriesOfCurrentMerchant(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("User không tồn tại")
        );

        Restaurant restaurant = restaurantRepository.findByOwner(user)
                .orElseThrow(() -> new RuntimeException("Restaurant không tồn tại cho user này"));

        return categoryRepository.findByRestaurantId(restaurant.getId());
    }

    @Override
    @Transactional
    public ProductDetailResponse updateFood(Long foodId, UpdateFoodRequest request, MultipartFile image, Long userId) {
        // lấy user và restaurant của merchant (owner)
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User không tồn tại"));
        Restaurant restaurant = restaurantRepository.findByOwner(user).orElseThrow(() -> new RuntimeException("Restaurant không tồn tại cho user"));

        // tìm food hiện tại (managed entity)
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food không tồn tại"));

        // kiểm tra quyền: food phải thuộc restaurant của user (qua category -> restaurant)
        Category currentCategory = food.getFoodCategory();

        // nếu request thay đổi category, load category mới và kiểm tra quyền
        if (request.getFoodCategoryId() != null) {
            Long newCateId = request.getFoodCategoryId();
            Long currentCateId = (currentCategory != null) ? currentCategory.getId() : null;
            if (!newCateId.equals(currentCateId)) {
                Category newCategory = categoryRepository.findById(newCateId)
                        .orElseThrow(() -> new RuntimeException("Category mới không tồn tại"));
                Long newCateRestaurantId = (newCategory.getRestaurant() != null) ? newCategory.getRestaurant().getId() : null;
                if (newCateRestaurantId == null || !newCateRestaurantId.equals(restaurant.getId())) {
                    throw new RuntimeException("Category mới không thuộc restaurant của bạn");
                }
                food.setFoodCategory(newCategory);
            }
        }

        // cập nhật các field cơ bản (chỉ cập nhật nếu request chứa giá trị)
        if (request.getName() != null) food.setName(request.getName());
        if (request.getPrice() != null) food.setPrice(request.getPrice());
        if (request.getDescription() != null) food.setDescription(request.getDescription());
        // available: chỉ set khi request không null
        if (request.getAvailable() != null) food.setAvailable(request.getAvailable());

        // xử lý image: nếu có file mới -> upload và set url
        if (image != null && !image.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(image, "foods");
            food.setImage(imageUrl);
        }

        // --- xử lý ingredient categories & items ---
        // đảm bảo collection hiện tại tồn tại (managed collection)
        if (food.getIngredientCategories() == null) {
            food.setIngredientCategories(new ArrayList<>());
        }

        // clear existing — với orphanRemoval=true các bản con sẽ bị delete khi flush
        food.getIngredientCategories().clear();

        // nếu request cung cấp danh sách mới, tạo và add từng phần tử vào collection hiện tại
        if (request.getIngredientCategoryDTOs() != null) {
            for (UpdateFoodRequest.IngredientCategoryDTO icDTO : request.getIngredientCategoryDTOs()) {
                IngredientCategory ic = new IngredientCategory();
                ic.setName(icDTO.getName());
                ic.setFood(food); // thiết lập quan hệ 2 chiều (food là parent)

                // build ingredients item list
                List<IngredientsItem> items = new ArrayList<>();
                if (icDTO.getIngredients() != null) {
                    for (UpdateFoodRequest.IngredientItemDTO itDTO : icDTO.getIngredients()) {
                        IngredientsItem it = new IngredientsItem();
                        it.setName(itDTO.getName());
                        it.setPrice(itDTO.getPrice());
                        // nếu DTO không cung cấp inStoke, mặc định true
                        if (itDTO.getInStoke() != null) {
                            it.setInStoke(itDTO.getInStoke());
                        } else {
                            it.setInStoke(true);
                        }
                        it.setCategory(ic); // thiết lập owner bên child
                        items.add(it);
                    }
                }

                ic.setIngredients(items);

                // add vào collection managed (KHÔNG gán 1 list mới cho food)
                food.getIngredientCategories().add(ic);
            }
        }
        // Nếu request.getIngredientCategoryDTOs() == null => đã clear và không add gì, nghĩa là remove toàn bộ nhóm

        // lưu và trả về DTO
        Food saved = foodRepository.save(food);

        return mapToProductDetail(saved);
    }


    @Override
    public List<Category> searchCategories(Long userId, String name) {
        User user = userRepository.findById(userId).orElseThrow();
        Restaurant r = restaurantRepository.findByOwner(user).orElseThrow();

        if (name == null || name.isBlank()) {
            return categoryRepository.findByRestaurantId(r.getId());
        } else {
            return categoryRepository.findByRestaurantIdAndNameContainingIgnoreCase(r.getId(), name.trim());
        }
    }

    @Override
    @Transactional
    public Category updateCategory(Long userId, Long categoryId, String newName) {
        if (newName == null || newName.isBlank()) {
            throw new RuntimeException("Tên category không được rỗng");
        }
        User user = userRepository.findById(userId).orElseThrow();
        Restaurant r = restaurantRepository.findByOwner(user).orElseThrow();

        Category c = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Category không tồn tại"));

        if (c.getRestaurant() == null || !c.getRestaurant().getId().equals(r.getId())) {
            throw new RuntimeException("Không có quyền sửa category này");
        }

        c.setName(newName.trim());
        return categoryRepository.save(c);
    }

    @Override
    @Transactional
    public void deleteCategory(Long userId, Long categoryId) {
        User user = userRepository.findById(userId).orElseThrow();
        Restaurant r = restaurantRepository.findByOwner(user).orElseThrow();

        Category c = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Category không tồn tại"));

        if (c.getRestaurant() == null || !c.getRestaurant().getId().equals(r.getId())) {
            throw new RuntimeException("Không có quyền xóa category này");
        }

        long cnt = foodRepository.countByFoodCategoryId(categoryId);
        if (cnt > 0) {
            throw new RuntimeException("Category còn món, không thể xóa");
        }

        categoryRepository.delete(c);
    }

    @Override
    @Transactional
    public void patchAvailable(Long foodId, Long userId, Boolean available) {
        Food f = foodRepository.findById(foodId).orElseThrow(() -> new RuntimeException("Food không tồn tại"));

        // đơn giản: chỉ kiểm tra food thuộc merchant của user qua category -> restaurant
        User user = userRepository.findById(userId).orElseThrow();
        Restaurant r = restaurantRepository.findByOwner(user).orElseThrow();

        Category cat = f.getFoodCategory();
        if (cat == null || cat.getRestaurant() == null || !cat.getRestaurant().getId().equals(r.getId())) {
            throw new RuntimeException("Không có quyền cập nhật món này");
        }

        if (available != null) {
            f.setAvailable(available);
            foodRepository.save(f);
        }
    }

    @Override
    @Transactional
    public void deleteFood(Long foodId, Long userId) {
        Food f = foodRepository.findById(foodId).orElseThrow(() -> new RuntimeException("Food không tồn tại"));

        // ownership simple check
        User user = userRepository.findById(userId).orElseThrow();
        Restaurant r = restaurantRepository.findByOwner(user).orElseThrow();

        Category cat = f.getFoodCategory();
        if (cat == null || cat.getRestaurant() == null || !cat.getRestaurant().getId().equals(r.getId())) {
            throw new RuntimeException("Không có quyền xóa món này");
        }

        long cntOrderItems = 0;
        if (orderItemRepository != null) {
            cntOrderItems = orderItemRepository.countByFoodId(foodId);
        }

        if (cntOrderItems > 0) {
            throw new RuntimeException("Món đã có order, không thể xóa");
        }

        foodRepository.delete(f);
    }


}
